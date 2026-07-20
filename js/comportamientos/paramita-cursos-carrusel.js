/* ═══════════════════════════════════════════════════════════════════════
   PARAMITA · CURSOS · CARRUSEL v2 · comportamiento
   ═══════════════════════════════════════════════════════════════════════
   Comportamiento del bloque .cursos-proximos:
   · Dibujado del trazo al entrar en viewport (IntersectionObserver)
   · Posicionamiento de nodos SVG bajo cada tarjeta (recalcula en resize)
   · "Curso activo" = el más centrado cuando el scroll se detiene
     · Se usa scrollend cuando existe (Chrome/Edge/Firefox reciente)
     · Fallback con debounce 180ms para Safari
   · Flechas ← → · avance asistido con snap
   · Teclado ← → cuando hay focus en el carrusel
   · Click/tap en una tarjeta · la centra
   · prefers-reduced-motion → sin scroll suave

   Sin dependencias externas · vanilla JS · degrada elegantemente si no
   se ejecuta (el CSS ya deja el bloque legible en estado final).
   ═══════════════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  const raiz = document.querySelector('.curso-carrusel');
  if (!raiz) return;

  const track = raiz.querySelector('.curso-carrusel__track');
  const items = [...raiz.querySelectorAll('.curso-carrusel__item')];
  const svg = raiz.querySelector('.curso-carrusel__trazo svg');
  const hilo = svg?.querySelector('.curso-carrusel__hilo');
  const punta = svg?.querySelector('.curso-carrusel__punta');
  const btnPrev = raiz.querySelector('.curso-carrusel__flecha--prev');
  const btnNext = raiz.querySelector('.curso-carrusel__flecha--next');

  if (!track || !items.length || !svg || !hilo || !punta) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activoIdx = 0;
  let nodos = [];        // referencias a los <circle> de nodo generados


  /* ─────────────────────────────────────────────────────────────────────
     1 · DIBUJO DINÁMICO DEL PATH del hilo
     ─────────────────────────────────────────────────────────────────────
     El hilo va de un extremo al otro del SVG (viewBox 0 0 1000 40).
     Casi recto, con una comba muy sutil en el centro para dar carácter.
     La comba real (extra en el activo) se aplica al recalcular activo.
     ───────────────────────────────────────────────────────────────────── */

  const VB_W = 1000;
  const VB_H = 40;
  const Y_BASE = 20;                 // línea a media altura del viewBox

  function generarPath(idxActivo = -1) {
    // Path base · casi recto, con inflexión sutil sobre el nodo activo
    // Si no hay activo, línea recta perfecta.
    if (idxActivo < 0 || idxActivo >= nodos.length) {
      return `M 0 ${Y_BASE} L ${VB_W} ${Y_BASE}`;
    }
    // Sacamos posición X del nodo activo · combamos 3px arriba en ese punto
    const cx = parseFloat(nodos[idxActivo].getAttribute('cx'));
    const combaY = Y_BASE - 3;
    // Bezier suave: entrada → combado → salida
    return `M 0 ${Y_BASE} `
         + `Q ${cx - 60} ${Y_BASE} ${cx} ${combaY} `
         + `T ${VB_W} ${Y_BASE}`;
  }


  /* ─────────────────────────────────────────────────────────────────────
     2 · POSICIONAMIENTO DE NODOS
     ─────────────────────────────────────────────────────────────────────
     Cada tarjeta tiene un nodo bajo su centro. Se calcula qué X (en
     coordenadas de viewBox) corresponde al centro de cada tarjeta
     respecto al ancho total del track.
     ───────────────────────────────────────────────────────────────────── */

  function calcularPosicionesNodos() {
    // Ancho total útil (desde el inicio de la primera tarjeta hasta el
    // final de la última) · usamos el rectángulo del track
    const trackRect = track.getBoundingClientRect();
    const trackScrollWidth = track.scrollWidth;

    // Limpiamos nodos anteriores (si los hubiera)
    nodos.forEach(n => n.remove());
    nodos = [];

    items.forEach((item, i) => {
      const itemRect = item.getBoundingClientRect();
      // Posición del centro de la tarjeta relativa al scroll total del track
      const centroX = (item.offsetLeft + itemRect.width / 2);
      // Normalizamos a coordenadas de viewBox (0-1000)
      const cx = (centroX / trackScrollWidth) * VB_W;

      const nodo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      nodo.setAttribute('class', 'curso-carrusel__nodo');
      nodo.setAttribute('cx', cx.toFixed(2));
      nodo.setAttribute('cy', Y_BASE);
      nodo.dataset.idx = i;
      // Insertamos antes de la punta para que la punta quede encima
      svg.insertBefore(nodo, punta);
      nodos.push(nodo);
    });

    // Posicionamos la punta en el nodo activo actual
    if (nodos[activoIdx]) {
      const cxActivo = nodos[activoIdx].getAttribute('cx');
      punta.setAttribute('cx', cxActivo);
      punta.setAttribute('cy', Y_BASE);
    }
  }


  /* ─────────────────────────────────────────────────────────────────────
     3 · ESTABLECER CURSO ACTIVO
     ─────────────────────────────────────────────────────────────────────
     Actualiza:
     · Clase .is-active en la tarjeta (halo dorado)
     · Clase .is-active en el nodo (dorado en el hilo)
     · Posición cx de la punta dorada
     · Path del hilo con la comba nueva en el punto activo
     · aria-current="true" en la tarjeta activa
     ───────────────────────────────────────────────────────────────────── */

  function establecerActivo(nuevoIdx) {
    if (nuevoIdx === activoIdx) return;
    if (nuevoIdx < 0 || nuevoIdx >= items.length) return;

    // Desmarcar anterior
    items[activoIdx]?.classList.remove('is-active');
    items[activoIdx]?.removeAttribute('aria-current');
    nodos[activoIdx]?.classList.remove('is-active');

    // Marcar nuevo
    activoIdx = nuevoIdx;
    items[activoIdx].classList.add('is-active');
    items[activoIdx].setAttribute('aria-current', 'true');
    nodos[activoIdx]?.classList.add('is-active');

    // Mover punta al nuevo nodo (CSS transition lo suaviza)
    if (nodos[activoIdx]) {
      const cx = nodos[activoIdx].getAttribute('cx');
      punta.setAttribute('cx', cx);
    }

    // Redibujar path con la comba en el nuevo punto
    if (!reduce) {
      hilo.setAttribute('d', generarPath(activoIdx));
    }

    // Actualizar estado de flechas (habilita/deshabilita en extremos)
    actualizarFlechas();
  }


  /* ─────────────────────────────────────────────────────────────────────
     4 · DETECCIÓN DEL CURSO MÁS CENTRADO
     ─────────────────────────────────────────────────────────────────────
     Cuando el scroll se detiene, buscamos qué tarjeta tiene su centro
     más próximo al centro del viewport del track.
     ───────────────────────────────────────────────────────────────────── */

  function calcularMasCentrado() {
    const trackRect = track.getBoundingClientRect();
    const centroViewport = trackRect.left + trackRect.width / 2;

    let mejorIdx = 0;
    let mejorDist = Infinity;

    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const centroItem = rect.left + rect.width / 2;
      const dist = Math.abs(centroItem - centroViewport);
      if (dist < mejorDist) {
        mejorDist = dist;
        mejorIdx = i;
      }
    });

    return mejorIdx;
  }


  /* ─────────────────────────────────────────────────────────────────────
     5 · SCROLL LISTENER · espera al reposo (200ms) o al scrollend
     ─────────────────────────────────────────────────────────────────────
     Estrategia dual:
     · scrollend (Chrome/Edge/Firefox nuevos) → nativo, perfecto
     · fallback debounce 180ms sobre scroll → Safari y navegadores
       que aún no lo soportan
     ───────────────────────────────────────────────────────────────────── */

  const soportaScrollend = 'onscrollend' in window;
  let debounceTimer = null;

  function alDetenerse() {
    const idx = calcularMasCentrado();
    establecerActivo(idx);
  }

  if (soportaScrollend) {
    track.addEventListener('scrollend', alDetenerse);
  } else {
    track.addEventListener('scroll', () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(alDetenerse, 180);
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────────────────────────────
     6 · FLECHAS · avance asistido de una tarjeta
     ─────────────────────────────────────────────────────────────────────
     Cada flecha centra la tarjeta anterior o siguiente. El navegador
     hace snap automático al terminar el scroll suave.
     ───────────────────────────────────────────────────────────────────── */

  function irA(idx) {
    if (idx < 0) idx = 0;
    if (idx >= items.length) idx = items.length - 1;
    const item = items[idx];
    // scrollIntoView con snap centra la tarjeta correctamente
    item.scrollIntoView({
      behavior: reduce ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function actualizarFlechas() {
    if (btnPrev) btnPrev.disabled = activoIdx === 0;
    if (btnNext) btnNext.disabled = activoIdx === items.length - 1;
  }

  btnPrev?.addEventListener('click', () => irA(activoIdx - 1));
  btnNext?.addEventListener('click', () => irA(activoIdx + 1));


  /* ─────────────────────────────────────────────────────────────────────
     7 · CLICK EN TARJETA · si no es la activa, la centra
     ─────────────────────────────────────────────────────────────────────
     Preserva el enlace (el <a href> sigue funcionando cuando la tarjeta
     ya es la activa). Si es una tarjeta lejana, primero la centra y
     bloquea la navegación (el usuario da un segundo clic para entrar).
     ───────────────────────────────────────────────────────────────────── */

  items.forEach((item, i) => {
    item.addEventListener('click', (e) => {
      if (i !== activoIdx) {
        e.preventDefault();
        irA(i);
      }
      // Si es la activa, dejamos que el navegador siga el href normalmente
    });
  });


  /* ─────────────────────────────────────────────────────────────────────
     8 · TECLADO · flechas ← → cuando hay focus dentro del carrusel
     ─────────────────────────────────────────────────────────────────────
     Solo actúa cuando el foco está en una de las tarjetas · así no
     interfiere con la navegación general de la página.
     ───────────────────────────────────────────────────────────────────── */

  track.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('curso-carrusel__item')) {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        irA(activoIdx + 1);
        items[Math.min(activoIdx + 1, items.length - 1)]?.focus();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        irA(activoIdx - 1);
        items[Math.max(activoIdx - 1, 0)]?.focus();
      }
    }
  });


  /* ─────────────────────────────────────────────────────────────────────
     9 · INICIALIZACIÓN · esperar a fuentes/imágenes + IO para dibujado
     ─────────────────────────────────────────────────────────────────────
     Calculamos nodos cuando ya conocemos el ancho real de las tarjetas.
     El dibujado del trazo arranca cuando la sección entra en viewport.
     ───────────────────────────────────────────────────────────────────── */

  function inicializar() {
    calcularPosicionesNodos();
    // Path inicial · línea recta (aún sin activo destacado)
    hilo.setAttribute('d', `M 0 ${Y_BASE} L ${VB_W} ${Y_BASE}`);

    // Marcamos el primero como activo inicial (queda visible al arrancar)
    items[0].classList.add('is-active');
    items[0].setAttribute('aria-current', 'true');
    nodos[0]?.classList.add('is-active');
    if (nodos[0]) {
      punta.setAttribute('cx', nodos[0].getAttribute('cx'));
      punta.setAttribute('cy', Y_BASE);
    }
    if (!reduce) {
      hilo.setAttribute('d', generarPath(0));
    }
    actualizarFlechas();
  }

  // Recalcular en resize (con debounce)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      calcularPosicionesNodos();
      // Reaplicamos activo tras recalcular
      const cxActivo = nodos[activoIdx]?.getAttribute('cx');
      if (cxActivo) punta.setAttribute('cx', cxActivo);
      if (!reduce) hilo.setAttribute('d', generarPath(activoIdx));
    }, 150);
  }, { passive: true });

  // Observer · arranca el dibujado cuando la sección entra en viewport
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        raiz.classList.add('is-drawn');
        // La punta se enciende cuando el trazo termina de dibujarse (1.8s)
        // En reduce-motion la mostramos inmediatamente.
        setTimeout(() => {
          raiz.classList.add('is-lit');
        }, reduce ? 0 : 1800);
        io.unobserve(raiz);
      }
    });
  }, { threshold: 0.25 });

  // Esperamos a que las imágenes/fuentes estén listas para medir bien
  if (document.readyState === 'complete') {
    inicializar();
    io.observe(raiz);
  } else {
    window.addEventListener('load', () => {
      inicializar();
      io.observe(raiz);
    });
  }
})();
