/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · paramita-home-logueado.js — Página /home-logueado/
   ─────────────────────────────────────────────────────────────────────────────
   Carga del vídeo de fondo del HERO VELADO. Es el mismo vídeo que el hero de la
   home pública (hilo conductor visual), pero esta página vive en /home-logueado/,
   así que las rutas RELATIVAS de paramita-hero.js (assets/img/…) no resolverían
   bien: aquí usamos rutas ABSOLUTAS (/assets/img/…), coherentes con el resto de
   páginas logueadas.

   · Escritorio (≥769px) → /assets/img/banner-home-home-2026.mp4
   · Móvil (≤768px)      → /assets/img/banner-movil-home-2026.mp4

   Elegir el src con JS (matchMedia una vez) es más fiable que <source media>
   para <video>, y evita descargar el archivo que no toca. Respeta
   prefers-reduced-motion: si el usuario lo pide, no se carga vídeo y queda el
   fallback animado (.hero__bg-fallback).
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  var v = document.getElementById('hero-bg-video');
  if (!v) return;

  // Movimiento reducido · no cargamos vídeo; se queda el fallback de gradiente.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var isMobile = window.matchMedia('(max-width: 768px)').matches;
  var src = isMobile
    ? '/assets/img/banner-movil-home-2026.mp4'
    : '/assets/img/banner-home-home-2026.mp4';

  var source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';
  v.appendChild(source);
  v.load();
})();
