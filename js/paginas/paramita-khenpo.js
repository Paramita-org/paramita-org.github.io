/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   js/paginas/paramita-khenpo.js — comportamientos propios de /sobre/khenpo/
   ───────────────────────────────────────────────────────────────────────────
   El revelado de títulos lo da el sistema (paramita-reveal.js). El linaje es
   CSS puro (no necesita JS). Aquí solo:
     1 · entrada de la cita (bidireccional) y de la imagen de semblanza (una vez)
     2 · conteo de cifras de "La misión"
     3 · acuse del formulario de suscripción (mock)
     4 · "La mirada": scroll horizontal fijado (GSAP · con fallback nativo)
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1 · entrada de cita (bidireccional) e imagen de semblanza (una vez) */
  (function () {
    const cita = document.querySelector('.pagina-khenpo .cita');
    const figs = [...document.querySelectorAll('.pagina-khenpo .media-grow')];
    if (reduce) { if (cita) cita.classList.add('is-in'); figs.forEach(f => f.classList.add('is-in')); return; }
    if (cita) {
      const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('is-in', e.isIntersecting)),
        { threshold: 0.25, rootMargin: '0px 0px -8% 0px' });
      io.observe(cita);
    }
    if (figs.length) {
      const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io2.unobserve(e.target); } }),
        { threshold: 0.25 });
      figs.forEach(f => io2.observe(f));
    }
  })();

  /* 2 · conteo de cifras (una vez al entrar) */
  (function () {
    const nums = [...document.querySelectorAll('.pagina-khenpo .num[data-to]')];
    if (!nums.length) return;
    const fmt = n => Math.round(n).toLocaleString('es-ES');
    const paint = (el, v) => el.textContent = (el.dataset.prefix || '') + fmt(v) + (el.dataset.suffix || '');
    if (reduce) { nums.forEach(el => paint(el, +el.dataset.to)); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, to = +el.dataset.to, t0 = performance.now(), dur = 1200;
      (function step(t) { const p = Math.min(1, (t - t0) / dur); paint(el, to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t0);
      io.unobserve(el);
    }), { threshold: 0.5 });
    nums.forEach(el => io.observe(el));
  })();

  /* 3 · acuse del formulario (mock · endpoint real pendiente de Alberto) */
  (function () {
    const f = document.getElementById('formSuscribir'), acuse = document.getElementById('acuse');
    if (!f) return;
    f.addEventListener('submit', ev => { ev.preventDefault(); acuse.textContent = 'Gracias. Te hemos anadido a la lista. (demo)'; f.reset(); });
  })();

  /* 4 · "La mirada" · scroll horizontal fijado (GSAP · fallback: scroll nativo) */
  (function () {
    if (reduce || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);
    const mirada = document.querySelector('.pagina-khenpo .mirada');
    const galeria = document.getElementById('galeria');
    if (mirada && galeria && matchMedia('(min-width:769px)').matches) {
      mirada.classList.add('pinned');
      const dist = () => Math.max(0, galeria.scrollWidth - galeria.clientWidth);
      gsap.to(galeria, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: mirada, start: 'top top', end: () => '+=' + (dist() + 80), pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true }
      });
    }
  })();
})();
