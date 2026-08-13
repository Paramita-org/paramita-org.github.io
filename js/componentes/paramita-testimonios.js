/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   js/componentes/paramita-testimonios.js — Entrada del bloque de testimonios
   ─────────────────────────────────────────────────────────────────────────────
   Añade .in a la cabecera (.testimonios__head) y, de forma ESCALONADA, a cada
   tarjeta (.voz) de cada rejilla (.voces) → dispara el "revelado por enfoque"
   definido en paramita-testimonios.css. Una sola vez (unobserve al entrar).

   El facade de vídeo (miniatura + play) lo gestiona paramita-video.js aparte.

   Autosuficiente: vanilla IntersectionObserver. Respeta prefers-reduced-motion
   (estado final directo). Carga con defer. IIFE + 'use strict'.
   ═══════════════════════════════════════════════════════════════════════════ */

(function initTestimonios() {
  'use strict';

  var bloques = document.querySelectorAll('.testimonios');
  if (!bloques.length) return;

  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window);

  if (calm) {
    document.querySelectorAll('.testimonios__head, .testimonios .voz').forEach(function (el) {
      el.classList.add('in');
    });
    return;
  }

  // Cabecera · reveal simple
  var ioHead = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); ioHead.unobserve(e.target); }
    });
  }, { threshold: 0.25 });
  document.querySelectorAll('.testimonios__head').forEach(function (el) { ioHead.observe(el); });

  // Tarjetas · cascada escalonada por rejilla (110 ms · gesto del blog)
  document.querySelectorAll('.testimonios .voces').forEach(function (grid) {
    var cards = [].slice.call(grid.querySelectorAll('.voz'));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var i = Math.max(0, cards.indexOf(e.target));
          setTimeout(function () { e.target.classList.add('in'); }, i * 110);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18 });
    cards.forEach(function (c) { io.observe(c); });
  });
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-testimonios.js
   ═══════════════════════════════════════════════════════════════════════════ */
