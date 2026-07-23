/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-trazo-divisor.js — Dibujo del stroke SVG por scroll (§5c)
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-11 del bloque §5c embebido en index.html
   (líneas 1108-1146 del original).

   QUÉ HACE
   ────────
   Anima el "dibujado" de trazos SVG (`.trazo-divisor__path`) atados al
   scroll: el trazo empieza invisible (dashoffset = longitud total) y
   se va dibujando progresivamente conforme el divisor asciende por el
   viewport. Es bidireccional — al scrollear hacia arriba, el trazo se
   desdibuja.

   La técnica es el clásico truco de SVG con `stroke-dasharray` y
   `stroke-dashoffset`, ambos igualados a la longitud total del path
   (`getTotalLength()`), animando el offset entre 0 y esa longitud.

   POR QUÉ VANILLA Y NO GSAP
   ─────────────────────────
   Este efecto NO usa ScrollTrigger. Se implementó con IntersectionObserver
   + requestAnimationFrame por dos razones:

   1. Independencia: si GSAP falla al cargar (CDN bloqueado), los
      divisores siguen animándose. Son una expresión canónica de la
      metáfora del cruce; no deben depender de una biblioteca externa.

   2. Rendimiento: el listener de scroll se acopla SOLO cuando algún
      divisor está en vista, y se desacopla cuando ninguno lo está.
      Con rAF garantizamos un único cálculo por frame. Sin librería,
      sin jank.

   RANGO DE PROGRESO
   ─────────────────
   El progreso 0→1 se mide como `(vh - r.top) / (vh * 0.85)` acotado.

   · Cuando el borde superior del divisor está a nivel del borde
     inferior del viewport: progreso ≈ 0 (trazo invisible).
   · Cuando el borde superior ha subido un 85% de la altura del
     viewport: progreso = 1 (trazo dibujado del todo).

   El 85% (no 100%) hace que el trazo termine de dibujarse un poco
   ANTES de que salga por arriba — para que el usuario vea el trazo
   completo antes de perderlo de vista.

   DEPENDENCIAS
   ────────────
   Ninguna. Vanilla SVG + IntersectionObserver + rAF.

   REDUCED-MOTION
   ──────────────
   Si el usuario tiene `prefers-reduced-motion: reduce`, el trazo se
   dibuja instantáneamente en su estado final (offset = 0) y no se
   engancha ningún listener. Cero animación, cero cómputo.

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <div class="trazo-divisor">
     <svg viewBox="…">
       <path class="trazo-divisor__path" d="…" />
     </svg>
   </div>

   El `<path>` debe tener `stroke` y `fill: none` en CSS. El JS se
   encarga del `stroke-dasharray` y del `stroke-dashoffset` inline.
   ═══════════════════════════════════════════════════════════════════════════ */

(function initTrazoDivisor() {
  const paths = [...document.querySelectorAll('.trazo-divisor__path')];
  if (!paths.length) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Preparar dasharray/dashoffset iniciales
  paths.forEach(p => {
    const L = p.getTotalLength();
    p.dataset.len = L;
    p.style.strokeDasharray = L;
    p.style.strokeDashoffset = reduce ? 0 : L; // arranca sin dibujar
  });

  if (reduce) return; // estado final directo, sin listeners

  const active = new Set();
  let ticking = false;

  function update() {
    ticking = false;
    const vh = innerHeight;
    active.forEach(p => {
      const r = p.closest('.trazo-divisor').getBoundingClientRect();
      // Progreso 0→1 conforme el divisor asciende por el viewport (bidireccional).
      const prog = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.85)));
      p.style.strokeDashoffset = parseFloat(p.dataset.len) * (1 - prog);
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  // Solo escuchamos scroll cuando algún divisor está en vista.
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const p = e.target.querySelector('.trazo-divisor__path');
      e.isIntersecting ? active.add(p) : active.delete(p);
    });

    if (active.size) {
      addEventListener('scroll', onScroll, { passive: true });
      update();
    } else {
      removeEventListener('scroll', onScroll);
    }
  }, {
    threshold: 0,
    rootMargin: '12% 0px 12% 0px'
  });

  document.querySelectorAll('.trazo-divisor').forEach(d => io.observe(d));
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-trazo-divisor.js
   ═══════════════════════════════════════════════════════════════════════════ */
