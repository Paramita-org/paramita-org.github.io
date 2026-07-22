/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-gsap-refresh.js — Refresco global de ScrollTrigger
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-9 del bloque §4 embebido en index.html
   (líneas 759-762 del original).

   QUÉ HACE
   ────────
   Llama a `ScrollTrigger.refresh()` en dos momentos:

   1. Cuando la ventana termina de cargar TODO (evento `load`): fuentes,
      imágenes, iframes, vídeos… en ese momento la altura del
      documento suele haber cambiado respecto al `DOMContentLoaded`
      inicial, y los ScrollTriggers pueden estar calibrados sobre una
      altura obsoleta.

   2. Cuando las fuentes tipográficas terminan de cargar
      (`document.fonts.ready`): las fuentes web tardan más que el HTML
      en aterrizar y su ancho de línea altera drásticamente la altura
      de párrafos largos y titulares.

   POR QUÉ ESTO ES CRÍTICO
   ───────────────────────
   Sin este refresco, los usuarios experimentan un bug característico:
   los efectos scroll-driven (zoom de la Frase, zoom del CTA) parecen
   "solo activarse al refrescar la página". Esto pasa porque
   ScrollTrigger calcula sus posiciones al montarse, y esas posiciones
   quedan desfasadas cuando el contenido reflowea al cargar fuentes,
   imágenes o los clones del carrusel infinito de testimonios.

   POR QUÉ ES UN ARCHIVO INDEPENDIENTE
   ───────────────────────────────────
   Este refresco no pertenece a ningún efecto concreto — es
   infraestructura compartida por TODOS los ScrollTriggers del sitio:
   frase-zoom, cta-zoom, trazo-divisor, y cualquier futuro efecto que
   se añada. Por eso vive en /primitivos/ como utilidad transversal.

   DEPENDENCIAS
   ────────────
   · GSAP core
   · GSAP ScrollTrigger

   Si GSAP no está disponible, el script no hace nada (safe fallback).

   ORDEN DE CARGA
   ──────────────
   Este archivo puede cargarse en cualquier orden dentro del <head>
   respecto a los otros JS que usan ScrollTrigger, porque solo se
   engancha a eventos futuros (`load` y `fonts.ready`) que ocurren
   DESPUÉS de que todos los efectos hayan registrado sus triggers.
   ═══════════════════════════════════════════════════════════════════════════ */

(() => {
  const hasGSAP = typeof window.gsap !== 'undefined';
  if (!hasGSAP || !window.ScrollTrigger) return;

  // Refresco al terminar de cargar TODO (fuentes, imágenes, iframes, vídeos)
  window.addEventListener('load', () => ScrollTrigger.refresh());

  // Refresco específico cuando las fuentes web están listas
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-gsap-refresh.js
   ═══════════════════════════════════════════════════════════════════════════ */
