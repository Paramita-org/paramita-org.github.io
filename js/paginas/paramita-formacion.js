/* ═══════════════════════════════════════════════════════════════════════
   paramita-formacion.js
   Interacciones específicas de la página /formacion/

   Contiene:
   · Frase-intención con popovers (slots editables + selección de facetas)
   · Filtrado con FLIP animation + luz al seleccionar + focal blur
   · Interacción del mapa de niveles (click en nodo pre-filtra)
   · Puertas del hero (rangos de niveles)

   ── Fase 6.1 · Unificación de estado (jul 2026) ──────────────────────────
   Las tres vías de entrada al catálogo (puertas del hero, mapa de niveles y
   frase-intención) escriben ahora sobre UN ÚNICO objeto `filtros`. Antes las
   puertas hacían show/hide manual al margen del estado, lo que dejaba la
   frase-intención desincronizada, saltaba el FLIP y no persistía. Ahora:
     · `filtros.nivel` admite string ('2') o array (['2','3']) para rangos.
     · Puertas y mapa reflejan su selección en la frase-intención.
     · `sincronizarMapa()` mantiene el nodo activo coherente en las tres vías.
   No hay cambios de HTML ni CSS: el rango se pinta con las clases existentes.
   ═══════════════════════════════════════════════════════════════════════ */

(function() {
'use strict';

/* ─── Referencias DOM ──────────────────────────────────────────────── */
const cuadricula = document.getElementById('cuadricula');
if (!cuadricula) return; // Página sin catálogo, salimos

const cursos    = Array.from(cuadricula.querySelectorAll('.curso'));
const slots     = Array.from(document.querySelectorAll('.slot'));
const limpiar   = document.getElementById('limpiar');
const contador  = document.getElementById('contador');
const nodos     = document.querySelectorAll('.nodo');
const puertas   = document.querySelectorAll('.puerta');

/* #5 · contador en vivo + estado vacío */
const total           = cursos.length;
const contadorLinea   = document.getElementById('contadorLinea');
const contadorDeTotal = document.getElementById('contadorDeTotal');
const catalogoVacio   = document.getElementById('catalogoVacio');

/* #7 · pill de acceso al filtro */
const filtroPill   = document.getElementById('filtroPill');
const pillBadge    = filtroPill ? filtroPill.querySelector('.filtro-pill__badge') : null;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─── Estado ───────────────────────────────────────────────────────── */
/* nivel: null | '2' (string) | ['2','3'] (array/rango).
   El resto de facetas son siempre null | string. */
const filtros = {
  nivel: null,
  formato: null,
  modalidad: null,
  aportacion: null,
};

const slotDefault = {
  nivel:      'de cualquier nivel',
  formato:    'de cualquier duración',
  modalidad:  'en cualquier modalidad',
  aportacion: 'con cualquier aportación',
};

const slotLabels = {
  nivel: {
    '1': 'de nivel I',
    '2': 'de nivel II',
    '3': 'de nivel III',
    '4': 'de nivel IV',
    '5': 'de nivel V',
  },
  formato: {
    'corto':     'corto',
    'largo':     'largo',
    'intensivo': 'intensivo',
  },
  modalidad: {
    'vivo':       'online en vivo',
    'auto':       'autodirigido',
    'presencial': 'presencial',
  },
  aportacion: {
    'gratuito': 'gratuito',
    'pago':     'de pago',
  },
};

/* Números romanos para etiquetar rangos de nivel en la frase-intención. */
const romanos = { '1': 'I', '2': 'II', '3': 'III', '4': 'IV', '5': 'V' };

/* ─── Utilidades de estado ─────────────────────────────────────────── */
/* ¿El valor de una faceta representa una selección real? Un array vacío
   cuenta como "sin selección" (aunque nunca almacenamos [] en la práctica). */
function hayValor(v) {
  return Array.isArray(v) ? v.length > 0 : !!v;
}

/* Etiqueta de la faceta nivel, admitiendo string o array (rango). */
function etiquetaNivel(valor) {
  if (Array.isArray(valor)) {
    if (valor.length === 1) return 'de nivel ' + romanos[valor[0]];
    return 'de niveles ' + valor.map(v => romanos[v]).join(' · ');
  }
  return slotLabels.nivel[valor];
}

/* ¿Una card pasa el filtro de nivel? (soporta string y array/rango) */
function pasaNivel(card) {
  if (!hayValor(filtros.nivel)) return true;
  return Array.isArray(filtros.nivel)
    ? filtros.nivel.includes(card.dataset.nivel)
    : filtros.nivel === card.dataset.nivel;
}

/* Sincroniza el nodo activo del mapa con el estado de nivel.
   · string  → se ilumina ese nodo
   · array   → rango: ningún nodo individual coincide, todos apagados
   · null    → todos apagados
   Fuente única para puertas, mapa y frase-intención. */
function sincronizarMapa(valorNivel) {
  const unico = !Array.isArray(valorNivel) && valorNivel;
  nodos.forEach(n => n.classList.toggle('is-active', !!unico && n.dataset.nivel === unico));
}

/* ─── #5 · Contador en vivo + estado vacío ─────────────────────────── */
/* Muestra "N de TOTAL" al filtrar y solo "N" cuando se ven todos. Con 0
   resultados oculta el contador y despliega la salida (nunca un "0" seco). */
function actualizarContador(visibles) {
  const vacio = visibles === 0;
  if (contadorLinea) contadorLinea.hidden = vacio;
  if (catalogoVacio) catalogoVacio.hidden = !vacio;
  if (vacio) return;
  if (contador)        contador.textContent = visibles;
  if (contadorDeTotal) contadorDeTotal.textContent = (visibles < total) ? ` de ${total}` : '';
}

/* #7 · Badge del pill con el nº de filtros activos. */
function actualizarPillBadge() {
  if (!pillBadge) return;
  const n = Object.values(filtros).filter(hayValor).length;
  pillBadge.textContent = n;
  pillBadge.hidden = n === 0;
}

/* Reset de filtros · compartido por "Empezar de nuevo" y el estado vacío. */
function resetearFiltros() {
  Object.keys(filtros).forEach(k => filtros[k] = null);
  slots.forEach(s => actualizarSlot(s, null));
  sincronizarMapa(null);
  aplicarFiltros();
}

/* ─── Filtrado con secuencia visual (blur → FLIP → luz) ────────────── */
function aplicarFiltros() {
  const posBefore = new Map();
  cursos.forEach(c => {
    if (!c.classList.contains('is-oculto')) {
      posBefore.set(c, c.getBoundingClientRect());
    }
  });

  const pasan = new Set();
  cursos.forEach(c => {
    const ok =
      pasaNivel(c) &&
      (!filtros.formato    || filtros.formato    === c.dataset.formato) &&
      (!filtros.modalidad  || filtros.modalidad  === c.dataset.modalidad) &&
      (!filtros.aportacion || filtros.aportacion === c.dataset.aportacion);
    if (ok) pasan.add(c);
  });

  const salientes = cursos.filter(c =>
    !pasan.has(c) && !c.classList.contains('is-oculto')
  );
  salientes.forEach(c => c.classList.add('is-saliendo'));

  const hayCambio = salientes.length > 0 ||
                    Array.from(pasan).some(c => c.classList.contains('is-oculto'));

  setTimeout(() => {
    cursos.forEach(c => {
      if (pasan.has(c)) c.classList.remove('is-oculto');
      else              c.classList.add('is-oculto');
      c.classList.remove('is-saliendo');
    });

    actualizarContador(pasan.size);

    // FLIP: reorganización física
    cursos.forEach(c => {
      if (c.classList.contains('is-oculto')) return;
      const before = posBefore.get(c);
      if (!before) return;
      const after = c.getBoundingClientRect();
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (dx || dy) {
        c.style.transition = 'none';
        c.style.transform = `translate(${dx}px, ${dy}px)`;
        requestAnimationFrame(() => {
          c.style.transition = 'transform 520ms cubic-bezier(0.28, 0.68, 0.28, 1)';
          c.style.transform = '';
        });
      }
    });

    // Luz al seleccionar
    if (hayCambio) {
      setTimeout(() => {
        pasan.forEach(c => {
          c.classList.add('is-iluminando');
          setTimeout(() => c.classList.remove('is-iluminando'), 640);
        });
      }, 60);
    }
  }, salientes.length > 0 ? 180 : 0);

  const hayFiltros = Object.values(filtros).some(hayValor);
  if (limpiar) limpiar.classList.toggle('is-visible', hayFiltros);
  actualizarPillBadge();
}

/* ─── Actualizar el texto y estado visual del slot ─────────────────── */
function actualizarSlot(slot, valor) {
  const faceta = slot.dataset.faceta;
  const textoEl = slot.querySelector('.slot__texto');
  const popover = slot.querySelector('.popover');
  const relleno = hayValor(valor);

  if (textoEl) {
    if (!relleno) {
      textoEl.textContent = slotDefault[faceta];
    } else if (faceta === 'nivel') {
      textoEl.textContent = etiquetaNivel(valor);
    } else {
      textoEl.textContent = slotLabels[faceta][valor];
    }
  }

  slot.classList.toggle('is-empty', !relleno);
  slot.classList.toggle('is-filled', relleno);

  if (popover) {
    popover.querySelectorAll('.popover__opcion').forEach(op => {
      const sel = Array.isArray(valor)
        ? valor.includes(op.dataset.valor)
        : op.dataset.valor === valor;
      op.classList.toggle('is-selected', relleno && sel);
    });
  }
}

/* ─── Abrir / cerrar popovers ──────────────────────────────────────── */
function cerrarTodos() {
  slots.forEach(s => s.classList.remove('is-open'));
}

slots.forEach(slot => {
  slot.addEventListener('click', (e) => {
    // Click en la X → quitar filtro
    if (e.target.classList.contains('slot__x') && slot.classList.contains('is-filled')) {
      e.stopPropagation();
      const faceta = slot.dataset.faceta;
      filtros[faceta] = null;
      actualizarSlot(slot, null);
      if (faceta === 'nivel') sincronizarMapa(null);
      aplicarFiltros();
      return;
    }
    // Click en opción del popover (o en cualquier hijo suyo)
    const opcion = e.target.closest('.popover__opcion');
    if (opcion && slot.contains(opcion)) {
      e.stopPropagation();
      const faceta = slot.dataset.faceta;
      const valor = opcion.dataset.valor;
      filtros[faceta] = valor;
      actualizarSlot(slot, valor);
      if (faceta === 'nivel') sincronizarMapa(valor); // elegir un nivel concreto ilumina su nodo
      slot.classList.add('is-pulsando');
      setTimeout(() => slot.classList.remove('is-pulsando'), 700);
      aplicarFiltros();
      cerrarTodos();
      return;
    }
    // Toggle popover
    const yaAbierto = slot.classList.contains('is-open');
    cerrarTodos();
    if (!yaAbierto) slot.classList.add('is-open');
  });

  slot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      slot.click();
    }
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.slot')) cerrarTodos();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarTodos();
});

if (limpiar) {
  limpiar.addEventListener('click', resetearFiltros);
}

/* #5 · Estado vacío · botones de salida (quitar filtros / abrir chat) */
const vacioReset = document.getElementById('vacioReset');
const vacioChat  = document.getElementById('vacioChat');
if (vacioReset) vacioReset.addEventListener('click', resetearFiltros);
if (vacioChat)  vacioChat.addEventListener('click', () => {
  const toggle = document.getElementById('chatToggle');
  if (toggle) toggle.click();   // abre el chat de orientación existente
});

/* #5 · Sincroniza el contador al cargar (robusto si cambia el nº de cursos). */
actualizarContador(cursos.length);

/* ─── #7 · Acceso al filtro persistente en scroll largo (pill flotante) ── */
/* Aparece solo cuando la frase-intención ya no se ve Y el catálogo sigue en
   pantalla. Al pulsarlo, scroll suave de vuelta al filtro real (no lo clona).
   El badge refleja cuántos filtros hay activos. */
if (filtroPill) {
  const facetas     = document.getElementById('facetas');
  const catalogoSec = document.getElementById('catalogo');
  const bar         = document.querySelector('.bar');

  if (facetas && catalogoSec && 'IntersectionObserver' in window) {
    let filtroVisible = true, catalogoVisible = false;
    const refrescar = () =>
      filtroPill.classList.toggle('is-visible', !filtroVisible && catalogoVisible);
    const barH = bar ? bar.offsetHeight : 64;
    // Filtro "fuera" cuando su parte baja pasa bajo el navbar (rootMargin superior).
    new IntersectionObserver(([e]) => { filtroVisible = e.isIntersecting; refrescar(); },
      { rootMargin: `-${barH}px 0px 0px 0px` }).observe(facetas);
    // Solo mientras el catálogo siga en pantalla (no en .como/.cierre/footer).
    new IntersectionObserver(([e]) => { catalogoVisible = e.isIntersecting; refrescar(); })
      .observe(catalogoSec);
  }

  filtroPill.addEventListener('click', () => {
    if (!facetas) return;
    const barH = bar ? bar.offsetHeight : 64;
    const y = facetas.getBoundingClientRect().top + window.scrollY - barH - 16;
    if (slots[0]) slots[0].focus({ preventScroll: true }); // a11y: el foco viaja al filtro
    window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

actualizarPillBadge();

/* ─── Mapa: click en nodo pre-filtra por ese nivel ─────────────────── */
nodos.forEach(nodo => {
  nodo.addEventListener('click', () => {
    const nivel = nodo.dataset.nivel;

    filtros.formato    = null;
    filtros.modalidad  = null;
    filtros.aportacion = null;
    filtros.nivel      = nivel;

    sincronizarMapa(nivel);

    slots.forEach(s => {
      if (s.dataset.faceta === 'nivel') actualizarSlot(s, nivel);
      else                              actualizarSlot(s, null);
    });

    aplicarFiltros();
    const catalogo = document.getElementById('catalogo');
    if (catalogo) catalogo.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─── Puertas del hero: rangos de niveles ──────────────────────────── */
/* Ahora pasan por el MISMO estado que mapa y frase-intención. Un rango de un
   solo nivel se guarda como string (idéntico a mapa/slot); varios niveles,
   como array. Así la selección es visible en la frase, persiste y anima. */
puertas.forEach(puerta => {
  puerta.addEventListener('click', (e) => {
    e.preventDefault();
    const target = puerta.getAttribute('href');
    const map = {
      '#nivel-1': ['1'],
      '#nivel-2': ['2', '3'],
      '#nivel-4': ['4', '5'],
    };
    const rango = map[target];
    const catalogo = document.getElementById('catalogo');

    // Puerta sin rango mapeado → solo desplazamos al catálogo.
    if (!rango) {
      if (catalogo) catalogo.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const valorNivel = rango.length === 1 ? rango[0] : rango.slice();

    filtros.formato    = null;
    filtros.modalidad  = null;
    filtros.aportacion = null;
    filtros.nivel      = valorNivel;

    sincronizarMapa(valorNivel);

    slots.forEach(s => {
      if (s.dataset.faceta === 'nivel') actualizarSlot(s, valorNivel);
      else                              actualizarSlot(s, null);
    });

    aplicarFiltros();
    if (catalogo) catalogo.scrollIntoView({ behavior: 'smooth' });
  });
});

})();


/* ═══════════════════════════════════════════════════════════════════════
   TRAMO 1.5 · Tira "Empieza aquí" · scroll horizontal con flechas
   ───────────────────────────────────────────────────────────────────────
   Mejora progresiva e independiente del catálogo: si este JS no corre, el
   rail sigue siendo scrolleable de forma nativa (barra + snap + hint). Las
   flechas nacen [hidden] en el HTML y solo se muestran si el contenido
   desborda y el puntero no es táctil (eso lo decide el CSS).
   ═══════════════════════════════════════════════════════════════════════ */
(function() {
  'use strict';
  const rail = document.getElementById('empiezaRail');
  if (!rail) return;

  const zona = rail.closest('.empieza__zona');
  const prev = zona ? zona.querySelector('.empieza__flecha--prev') : null;
  const next = zona ? zona.querySelector('.empieza__flecha--next') : null;
  const hint = document.querySelector('.empieza__hint');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Un "paso" = ancho de una card + gap (cae con elegancia si algo falta).
  function paso() {
    const card = rail.querySelector('.curso');
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 20;
    return card ? card.getBoundingClientRect().width + gap : rail.clientWidth * 0.8;
  }

  function actualizar() {
    const max = rail.scrollWidth - rail.clientWidth;
    const desborda = max > 2;

    if (prev) prev.hidden = !desborda;
    if (next) next.hidden = !desborda;
    if (prev) prev.disabled = rail.scrollLeft <= 2;
    if (next) next.disabled = rail.scrollLeft >= max - 2;

    if (hint && (!desborda || rail.scrollLeft > 8)) hint.classList.add('is-oculto');
  }

  if (prev) prev.addEventListener('click', () => {
    rail.scrollBy({ left: -paso(), behavior: reduce ? 'auto' : 'smooth' });
  });
  if (next) next.addEventListener('click', () => {
    rail.scrollBy({ left: paso(), behavior: reduce ? 'auto' : 'smooth' });
  });

  rail.addEventListener('scroll', actualizar, { passive: true });
  window.addEventListener('resize', actualizar);
  actualizar();
})();
