/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-participacion.js — Destacado cíclico automático (§5b)
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-10 del bloque §5b embebido en index.html
   (líneas 1078-1097 del original).

   QUÉ HACE
   ────────
   En la sección Participación (`.participa`), las tres vías (`.via`)
   se resaltan secuencialmente por sí solas, sin necesidad de hover:
   cada 2.2 segundos, la clase `.is-auto` salta de una tarjeta a la
   siguiente en bucle infinito.

   El objetivo es dar vida a la sección cuando el usuario aún no ha
   interactuado — una respiración lenta que sugiere que las tres vías
   están vivas, esperando.

   PRIORIDAD DE LA INTERACCIÓN HUMANA
   ──────────────────────────────────
   Cuando el usuario pasa el cursor sobre la lista (`pointerenter`),
   el ciclo automático se pausa y se limpia el destacado. Al retirar
   el cursor (`pointerleave`), el ciclo se reanuda.

   Esto evita el "conflicto de dos manos" (ciclo automático y hover
   compitiendo por la misma clase visual). El principio: la mano de la
   máquina desaparece cuando aparece la del humano.

   RITMO
   ─────
   2.2 s por tarjeta. Ritmo contemplativo — deliberadamente lento
   para acompañar la lectura, no dirigirla. Coherente con el "sistema
   respira" (Fase 0.1): las cadencias del sitio son lentas y
   proporcionales al gesto humano.

   DEPENDENCIAS
   ────────────
   Ninguna. Vanilla JS.

   REDUCED-MOTION
   ──────────────
   Si el usuario tiene `prefers-reduced-motion: reduce`, el ciclo
   automático NO se activa — las tarjetas quedan en su estado base
   sin animación cíclica. El hover manual sigue funcionando por CSS.

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <section class="participa">
     <div class="vias">
       <article class="via">…</article>
       <article class="via">…</article>
       <article class="via">…</article>
     </div>
   </section>

   CSS ASOCIADO
   ────────────
   Regla `.via.is-auto` en el CSS de la sección — típicamente el mismo
   efecto visual que `.via:hover`, para que ciclo y hover produzcan la
   misma lectura destacada.
   ═══════════════════════════════════════════════════════════════════════════ */

(function initParticipaAuto() {
  const list = document.querySelector('.participa .vias');
  if (!list) return;

  const vias = [...list.querySelectorAll('.via')];
  if (!vias.length) return;

  // Reduced-motion: no ciclar
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let i = 0;
  let paused = false;

  const clear = () => vias.forEach(v => v.classList.remove('is-auto'));

  const tick = () => {
    if (paused) return;
    clear();
    vias[i].classList.add('is-auto');
    i = (i + 1) % vias.length;
  };

  // El hover del usuario tiene prioridad: pausa el ciclo y limpia el destacado.
  list.addEventListener('pointerenter', () => { paused = true; clear(); });
  list.addEventListener('pointerleave', () => { paused = false; });

  tick();
  setInterval(tick, 2200); // ~2.2 s por tarjeta → ritmo contemplativo
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-participacion.js
   ═══════════════════════════════════════════════════════════════════════════ */
