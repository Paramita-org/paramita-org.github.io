/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-maestros.js — Comportamientos específicos de /sobre/maestros/
   ───────────────────────────────────────────────────────────────────────────
   QUÉ HACE
   ────────
   1 · RAIL DEL LINAJE
       El trazo vertical (#railFill) se dibuja según el progreso de scroll al
       atravesar el bloque de "Maestros del linaje", y cada nodo enciende su
       punto (.nodo.on) cuando cruza el frente del rail. Encarna el descenso
       de la transmisión (el cruce como acto).

   2 · COUNT-UP DE CIFRAS
       Las cifras de arraigo (.stat .num[data-to]) cuentan desde 0 hasta su
       valor al entrar en vista. Respeta data-prefix y data-suffix.

   El REVELADO de entrada NO se gestiona aquí: lo aporta el primitivo
   transversal paramita-reveal.js (atributo data-reveal).

   DEPENDENCIAS · ninguna externa. Vanilla. Independiente de GSAP.
   REDUCED-MOTION · el count-up salta al valor final; el rail no anima el fill.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────────────────────────────
     1 · RAIL DEL LINAJE
     ───────────────────────────────────────────────────────────────────── */
  (function initRail() {
    var spine = document.getElementById('spine');
    var fill  = document.getElementById('railFill');
    if (!spine || !fill) return;

    var nodos = Array.prototype.slice.call(spine.querySelectorAll('.nodo'));

    function update() {
      var r = spine.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var start = vh * 0.72;              // frente del rail (punto de "encendido")
      var total = r.height;
      var passed = Math.min(Math.max(start - r.top, 0), total);
      fill.style.height = (total > 0 ? (passed / total) * 100 : 0) + '%';

      for (var i = 0; i < nodos.length; i++) {
        var nr = nodos[i].getBoundingClientRect();
        var y = nr.top + nr.height / 2;
        nodos[i].classList.toggle('on', y < start && y > 0);
      }
    }

    document.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ─────────────────────────────────────────────────────────────────────
     2 · COUNT-UP DE CIFRAS
     ───────────────────────────────────────────────────────────────────── */
  (function initCountUp() {
    var stats = document.getElementById('stats');
    if (!stats) return;

    var nums = Array.prototype.slice.call(stats.querySelectorAll('.num[data-to]'));
    if (!nums.length) return;

    function paint(el, value) {
      var pre = el.getAttribute('data-prefix') || '';
      var suf = el.getAttribute('data-suffix') || '';
      el.textContent = pre + value + suf;
    }

    function run() {
      nums.forEach(function (el) {
        var to = parseInt(el.getAttribute('data-to'), 10);
        if (isNaN(to)) return;
        if (reduce) { paint(el, to); return; }
        var t0 = null, dur = 1100;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / dur, 1);
          paint(el, Math.round(p * to));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { run(); io.disconnect(); }
        });
      }, { threshold: 0.4 });
      io.observe(stats);
    } else {
      run();
    }
  })();

})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-maestros.js
   ═══════════════════════════════════════════════════════════════════════════ */
