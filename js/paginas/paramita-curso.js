/* ═══════════════════════════════════════════════════════════════════════
   paramita-curso.js
   Lógica específica de la plantilla de PÁGINA DE CURSO.
   Convención del sistema: IIFE + 'use strict' + salida temprana si no hay DOM.
   Carga con defer. No contamina window.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 1 · Toggle de vista previa de estado (herramienta de desarrollo) ──
     En producción se elimina: el estado real lo fija el backend en <body data-estado>. */
  (function estadoToggle() {
    var tg = document.querySelector('.estado-toggle');
    if (!tg) return;
    tg.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-set]');
      if (!b) return;
      document.body.dataset.estado = b.dataset.set;
      tg.querySelectorAll('button').forEach(function (x) {
        x.classList.toggle('is-active', x === b);
      });
    });
  })();

  /* ── 2 · CTA sticky · aparece tras el hero, se oculta al llegar a inscripción ── */
  (function ctaSticky() {
    var sticky = document.getElementById('ctaSticky');
    var hero = document.getElementById('hero');
    var insc = document.getElementById('inscripcion');
    if (!sticky || !hero || !insc || !('IntersectionObserver' in window)) return;

    var heroFuera = false, inscDentro = false;
    function upd() {
      var show = heroFuera && !inscDentro;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
    }
    new IntersectionObserver(function (es) { heroFuera = !es[0].isIntersecting; upd(); },
      { rootMargin: '-45% 0px 0px 0px' }).observe(hero);
    new IntersectionObserver(function (es) { inscDentro = es[0].isIntersecting; upd(); },
      { threshold: 0.15 }).observe(insc);
  })();

  /* ── 3 · FAQ · acordeón accesible (una abierta a la vez opcional; aquí, independientes) ── */
  (function faq() {
    var qs = document.querySelectorAll('.faq__q');
    if (!qs.length) return;
    qs.forEach(function (q) {
      q.addEventListener('click', function () {
        var abierto = q.getAttribute('aria-expanded') === 'true';
        q.setAttribute('aria-expanded', abierto ? 'false' : 'true');
      });
    });
  })();

  /* ── 4 · Facades de vídeo · cargan el iframe de YouTube solo al interactuar ── */
  (function videoFacades() {
    var facades = document.querySelectorAll('.video-facade[data-yt]');
    if (!facades.length) return;
    function cargar(el) {
      if (el.dataset.cargado) return;
      el.dataset.cargado = '1';
      var id = el.getAttribute('data-yt');
      var ifr = document.createElement('iframe');
      ifr.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
      ifr.title = 'Vídeo de Paramita';
      ifr.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      ifr.allowFullscreen = true;
      el.appendChild(ifr);
    }
    facades.forEach(function (el) {
      el.addEventListener('click', function () { cargar(el); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cargar(el); }
      });
    });
  })();

  /* ── 5 · Newsletter · feedback local (sin backend en la maqueta) ── */
  (function newsletter() {
    var form = document.getElementById('newsForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.classList.add('is-enviado');
      form.querySelector('button[type="submit"]').disabled = true;
    });
  })();

  /* ── 6 · FAQ · buscador por palabra (filtra .faq__item en vivo) ── */
  (function faqBuscador() {
    var input = document.getElementById('faqBuscar');
    var lista = document.querySelector('.faq__lista');
    var vacio = document.getElementById('faqVacio');
    if (!input || !lista) return;
    var items = [].slice.call(lista.querySelectorAll('.faq__item'));

    // Comparación sin acentos ni mayúsculas.
    function norm(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }

    input.addEventListener('input', function () {
      var q = norm(input.value.trim());
      var visibles = 0;
      items.forEach(function (it) {
        var match = !q || norm(it.textContent).indexOf(q) > -1;
        it.hidden = !match;
        if (match) visibles++;
      });
      if (vacio) vacio.hidden = visibles > 0;
    });
  })();

})();
