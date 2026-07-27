/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-testimonios.js — Carrusel horizontal infinito de testimonios
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-12 del bloque §6 embebido en index.html
   (líneas 1154-1223 del original).

   QUÉ HACE
   ────────
   Convierte la lista `#ttrack` de testimonios en un carrusel horizontal
   con las siguientes propiedades:

   · Auto-avance continuo hacia la derecha (0.55 px por frame).
   · Bucle infinito sin costura (clonando el set una vez y saltando al
     inicio cuando se llega al final del set original).
   · Pausa al pasar el cursor sobre una tarjeta, con esa tarjeta
     resaltada visualmente (clase `.is-active`).
   · Soporte táctil: mantener el dedo pausa y destaca; soltar reanuda
     tras 600 ms.
   · Scroll manual lateral con rueda del ratón, trackpad horizontal o
     Shift+rueda.
   · Swipe táctil nativo (por `overflow-x: auto` en el CSS).
   · Pausa cuando la pestaña está oculta (ahorro de CPU).

   CÓMO FUNCIONA EL BUCLE INFINITO
   ───────────────────────────────
   Truco clásico:

   1. Al montar, clonamos todas las tarjetas originales y las añadimos
      al final del track. Ahora hay dos sets idénticos consecutivos.
   2. En cada frame, incrementamos `scrollLeft` en `SPEED` px.
   3. Cuando `scrollLeft` iguala o supera la mitad del ancho total del
      track (= ancho de un set), lo restamos. El usuario NO percibe el
      salto porque el segundo set es visualmente idéntico al primero.

   Esto también funciona hacia atrás: si el scroll manual lleva a
   valores negativos, sumamos la mitad para reentrar por la derecha.

   ACCESIBILIDAD DE LOS CLONES
   ───────────────────────────
   Los clones llevan `aria-hidden="true"` para que los lectores de
   pantalla no repitan el contenido. Solo se anuncian las tarjetas
   originales.

   VELOCIDAD
   ─────────
   0.55 px/frame ≈ 33 px/segundo (a 60 fps). Es un ritmo contemplativo,
   apenas perceptible como movimiento, coherente con la respiración
   del sistema.

   DEPENDENCIAS
   ────────────
   Ninguna. Vanilla scroll + requestAnimationFrame.

   REDUCED-MOTION
   ──────────────
   Si el usuario tiene `prefers-reduced-motion: reduce`, el
   auto-avance NO se activa. El carrusel sigue siendo navegable
   manualmente (rueda, teclado si el CSS lo permite, swipe táctil),
   pero no se mueve solo.

   FIX MÓVIL · Fase 6.1 (jul 2026)
   ───────────────────────────────
   Bug persistente en móvil: el auto-avance seguía sin fluir tras el
   intento previo (filtrar pointerType === 'mouse'). Causa raíz más
   profunda: iOS Safari emite eventos pointer con `pointerType` a veces
   vacío o 'touch' incluso en fase inicial, y algunos taps táctiles
   disparaban pointerover sin pointerout correspondiente.

   Solución estructural · media query de capacidad del dispositivo:
     · matchMedia('(hover: hover) and (pointer: fine)') detecta si el
       dispositivo tiene un puntero de precisión (ratón/trackpad).
     · Los listeners de pausa por hover SOLO se registran si esa
       condición es true. En dispositivos táctiles puros no existen.
     · La pausa táctil sigue vía touchstart/touchend, que es fiable.

   Esta técnica es la recomendada por MDN y Kilian Valkhof para
   distinguir hover-capable de touch-only. Es más robusta que filtrar
   por pointerType porque no depende del comportamiento por vendor.

   VELOCIDAD · Fase 6.1
   ────────────────────
   Subida de 0.55 px/frame → 1.0 px/frame (aprox. 60 px/s a 60fps).
   Sigue siendo contemplativo pero se percibe movimiento. Feedback
   del uso real: a 0.55 se leía como "casi estático", con la
   sensación de que "no se mueve".

   NOTA SOBRE EL RECÁLCULO
   ───────────────────────
   La función `half()` recalcula `scrollWidth / 2` cada vez que se
   llama, no es un valor cacheado. Esto es intencional: si en el
   futuro se añaden testimonios dinámicamente o cambia el layout
   responsive, el cálculo se ajusta solo.

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <div id="tcarousel">
     <div id="ttrack">
       <article class="tcard">…</article>
       <article class="tcard">…</article>
       …
     </div>
   </div>
   ═══════════════════════════════════════════════════════════════════════════ */

(function initCarrusel() {
  const car = document.getElementById('tcarousel');
  const track = document.getElementById('ttrack');
  if (!car || !track) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Duplicar las tarjetas una vez para un bucle continuo.
  const originales = [...track.children];
  originales.forEach(card => {
    const clon = card.cloneNode(true);
    clon.setAttribute('aria-hidden', 'true');
    track.appendChild(clon);
  });

  const half = () => track.scrollWidth / 2; // ancho de un set

  let paused = false;
  const SPEED = 1.0; // Fase 6.1: 0.55 → 1.0 (60 px/s, contemplativo pero perceptible)

  // Fase 6.1 · detección estructural de dispositivo hover-capable
  // ─────────────────────────────────────────────────────────────
  // (hover: hover) → el puntero primario puede hacer hover
  // (pointer: fine) → el puntero primario es preciso (ratón/trackpad)
  // La combinación descarta táctil puro. En dispositivos táctiles esta
  // condición es false → los listeners de pausa por hover NO se registran.
  const hoverCapable = matchMedia('(hover: hover) and (pointer: fine)').matches;

  function normaliza() {
    const h = half();
    if (car.scrollLeft >= h) car.scrollLeft -= h;
    else if (car.scrollLeft < 0) car.scrollLeft += h;
  }

  // Auto-avance vía requestAnimationFrame
  if (!reduce) {
    (function tick() {
      if (!paused) {
        car.scrollLeft += SPEED;
        normaliza();
      }
      requestAnimationFrame(tick);
    })();

    // Pausa cuando la pestaña está oculta (nota: solo activa la pausa,
    // no la retira automáticamente — así respeta el estado hover/touch).
    document.addEventListener('visibilitychange', () => {
      paused = document.hidden ? true : paused;
    }, { passive: true });
  }

  const cards = () => [...track.children];

  // Cursor (solo dispositivos hover-capable): pausa + destacado
  // ────────────────────────────────────────────────────────────
  // Fase 6.1 · Los listeners de pausa por hover se registran ÚNICAMENTE
  // si el dispositivo tiene hover verdadero (ratón/trackpad). En táctil
  // puro nunca se registran, evitando los pointerover fantasma de iOS
  // Safari que dejaban el carrusel pausado indefinidamente.
  if (hoverCapable) {
    car.addEventListener('pointerover', e => {
      const card = e.target.closest('.tcard');
      if (card) {
        paused = true;
        card.classList.add('is-active');
      }
    });

    car.addEventListener('pointerout', e => {
      const card = e.target.closest('.tcard');
      if (card) card.classList.remove('is-active');
      if (!car.matches(':hover')) paused = false;
    });
  }

  // Táctil: mantener pausa y destaca; soltar reanuda tras 600 ms
  car.addEventListener('touchstart', e => {
    paused = true;
    const card = e.target.closest('.tcard');
    if (card) card.classList.add('is-active');
  }, { passive: true });

  car.addEventListener('touchend', () => {
    cards().forEach(c => c.classList.remove('is-active'));
    setTimeout(() => { paused = false; }, 600);
  }, { passive: true });

  // Rueda / trackpad horizontal / Shift+rueda: scroll lateral acelerado
  car.addEventListener('wheel', e => {
    const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (horizontal || e.shiftKey) {
      car.scrollLeft += (e.deltaX || e.deltaY);
      normaliza();
      e.preventDefault(); // evita robar el scroll vertical de la página
    }
  }, { passive: false });

  // Swipe táctil nativo (overflow-x en CSS) — solo mantenemos el bucle al soltar
  car.addEventListener('scroll', normaliza, { passive: true });
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-testimonios.js
   ═══════════════════════════════════════════════════════════════════════════ */
