/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   js/componentes/paramita-video.js — Facade de vídeo reutilizable (YouTube)
   ─────────────────────────────────────────────────────────────────────────────
   Componente único para todas las landings. Unifica las dos implementaciones
   previas (paramita-curso.js · videoFacades y el handler de paramita-contribuir.js).

   QUÉ HACE
   ────────
   1 · Pinta la MINIATURA REAL de YouTube en cada .video-facade[data-yt]
       (i.ytimg.com/vi/ID/hqdefault.jpg · override con data-thumb).
   2 · Al click / Enter / Espacio inyecta el embed estándar de YouTube
       (youtube-nocookie.com/embed/ID?autoplay=1&rel=0) → CONTROLES NATIVOS,
       así el usuario puede pausar/continuar. Idempotente (data-cargado) y lazy
       (el iframe solo se crea al interactuar).
   3 · Los .video-facade con data-yt="" (sin ID todavía, p.ej. el institucional)
       se quedan en su gradiente de marca y NO se enganchan.

   Marca window._paramitaVideo = true para que las páginas puedan desactivar su
   handler antiguo (patrón del gate de paramita-reveal.js).

   Carga con defer. IIFE + 'use strict'. Sin dependencias.
   ═══════════════════════════════════════════════════════════════════════════ */

(function initVideoFacades() {
  'use strict';

  var facades = [].slice.call(document.querySelectorAll('.video-facade[data-yt]'));
  if (!facades.length) return;

  function ponerMiniatura(el, id) {
    // <img> real (más fiable que background). sddefault (640×480) con reserva a
    // hqdefault (siempre existe). Override con data-thumb si se quiere una propia.
    var img = document.createElement('img');
    img.className = 'video-facade__thumb';
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    var custom = el.getAttribute('data-thumb');
    img.src = custom || ('https://i.ytimg.com/vi/' + id + '/sddefault.jpg');
    if (!custom) {
      img.onerror = function () { img.onerror = null; img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg'; };
    }
    el.insertBefore(img, el.firstChild);
  }

  function reproducir(el) {
    var id = el.getAttribute('data-yt');
    if (!id || el.dataset.cargado) return;
    el.dataset.cargado = '1';
    el.classList.add('is-playing');

    var ifr = document.createElement('iframe');
    ifr.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&playsinline=1';
    ifr.title = el.getAttribute('aria-label') || 'Vídeo de Paramita';
    ifr.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    ifr.allowFullscreen = true;
    ifr.loading = 'lazy';
    el.appendChild(ifr);
  }

  facades.forEach(function (el) {
    var id = el.getAttribute('data-yt');
    if (!id) return; // sin ID: se queda el gradiente placeholder, sin listeners

    ponerMiniatura(el, id);

    el.addEventListener('click', function () { reproducir(el); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reproducir(el); }
    });
  });

  window._paramitaVideo = true; // señal para gatear handlers antiguos por página
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-video.js
   ═══════════════════════════════════════════════════════════════════════════ */
