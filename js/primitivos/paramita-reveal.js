/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-reveal.js — Revelado de entrada bidireccional
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-1 del bloque §3 embebido en index.html
   (líneas 631-649 del original).

   QUÉ HACE
   ────────
   Observa cualquier elemento marcado con el atributo `data-reveal` y le
   añade la clase `.is-in` cuando entra al viewport, quitándosela cuando
   sale. Esa clase es la que dispara la animación de fade-in-up definida
   en el CSS (paramita-base.css / paramita-sections.css).

   Se aplica sobre pretítulos y títulos de cada sección, y sobre cualquier
   otro elemento que quiera esta entrada suave.

   BIDIRECCIONAL POR DECISIÓN
   ──────────────────────────
   Otras implementaciones típicas del patrón hacen `unobserve()` tras la
   primera aparición — la animación se ejecuta una única vez. Aquí NO:
   usamos `classList.toggle('is-in', e.isIntersecting)` sin unobserve, de
   modo que la animación se reproduce cada vez que el elemento entra o
   sale del viewport (bajando y subiendo). Esto refuerza la lectura del
   umbral — "el cruce como acto" — cada vez que se atraviesa.

   PARÁMETROS DEL OBSERVER
   ───────────────────────
   · threshold: 0.2         → dispara al 20% de visibilidad del elemento
   · rootMargin: '0px 0px -8% 0px'
                            → activa un poco antes del borde inferior, para
                              que la entrada empiece cuando el elemento
                              está claramente dentro de la escena.

   DEPENDENCIAS
   ────────────
   Ninguna externa. Vanilla IntersectionObserver.
   Independiente de GSAP (por diseño: es una utilidad transversal que
   no debe caer si el CDN de GSAP falla).

   REDUCED-MOTION
   ──────────────
   Si el usuario tiene `prefers-reduced-motion: reduce`, el observer no
   se crea: se añade `.is-in` a todos los elementos de golpe para que
   queden en su estado final visible sin animación.

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <h2 data-reveal>Título de sección</h2>
   <p data-reveal>Cualquier pretítulo o bloque a revelar</p>

   ANIMACIÓN CSS ASOCIADA (recordatorio)
   ─────────────────────────────────────
   [data-reveal] {
     opacity: 0;
     transform: translateY(1rem);
     transition: opacity var(--dur-*), transform var(--dur-*);
   }
   [data-reveal].is-in {
     opacity: 1;
     transform: translateY(0);
   }
   ═══════════════════════════════════════════════════════════════════════════ */

(function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  // Reduced-motion: estado final directo, sin observer.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(el => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      // Bidireccional: añade .is-in al entrar y la quita al salir.
      // La animación se reproduce tanto al bajar como al subir (no solo una vez).
      // No se hace unobserve por diseño.
      e.target.classList.toggle('is-in', e.isIntersecting);
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px'
  });

  items.forEach(el => io.observe(el));
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-reveal.js
   ═══════════════════════════════════════════════════════════════════════════ */
