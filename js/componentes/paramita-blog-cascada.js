/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-blog-cascada.js — Entrada escalonada de tarjetas del blog
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-3 del bloque §1 embebido en index.html
   (líneas 520-533 del original).

   QUÉ HACE
   ────────
   Observa las tarjetas del blog (`.efx-card`) y les añade la clase
   `.efx-in` cuando entran al viewport, pero con un retardo escalonado
   (stagger) de 110 ms por índice. El resultado visual: las tarjetas no
   aparecen todas a la vez, sino en cascada suave — la primera, luego la
   segunda, luego la tercera — reforzando la lectura secuencial del
   contenido.

   DIFERENCIA CON paramita-reveal.js
   ─────────────────────────────────
   El sistema tiene dos patrones de entrada distintos por diseño:

   · paramita-reveal.js  → bidireccional, sin retardo, para pretítulos y
                           títulos. Cada elemento entra y sale al cruzar
                           el umbral.

   · paramita-blog-cascada.js → una sola vez (unobserve al entrar), con
                                stagger. Optimizado para grupos de
                                elementos que se leen como unidad.

   Son dos gestos conceptuales distintos: el revelado del título es un
   cruce identitario que se repite; la cascada del blog es una
   presentación única de un conjunto.

   PARÁMETROS
   ──────────
   · threshold: 0.18         → dispara cuando el 18% de la tarjeta es visible
   · stagger: 110 ms × índice → separación temporal entre tarjetas

   OPTIMIZACIÓN
   ────────────
   Se hace `io.unobserve(en.target)` tras la primera activación: una vez
   que la tarjeta ha entrado, ya no necesitamos seguir observándola.
   Esto libera al navegador de trabajo innecesario.

   DEPENDENCIAS
   ────────────
   Ninguna. Vanilla IntersectionObserver.

   REDUCED-MOTION
   ──────────────
   Si el usuario tiene `prefers-reduced-motion: reduce`, se añade
   `.efx-in` a todas las tarjetas de golpe (estado final visible sin
   animación ni cascada).

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <article class="efx-card">…</article>
   <article class="efx-card">…</article>
   <article class="efx-card">…</article>

   CSS ASOCIADO
   ────────────
   Ver paramita-sections.css / paramita-cursos.css — reglas `.efx-card`
   y `.efx-card.efx-in` con la transición de opacidad/translate.
   ═══════════════════════════════════════════════════════════════════════════ */

(() => {
  const cards = [...document.querySelectorAll('.efx-card')];
  if (!cards.length) return;

  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced-motion: estado final directo, sin cascada.
  if (calm) {
    cards.forEach(c => c.classList.add('efx-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const i = Math.max(0, cards.indexOf(en.target));
        setTimeout(() => en.target.classList.add('efx-in'), i * 110);
        io.unobserve(en.target); // una sola vez
      }
    });
  }, { threshold: 0.18 });

  cards.forEach(c => io.observe(c));
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-blog-cascada.js
   ═══════════════════════════════════════════════════════════════════════════ */
