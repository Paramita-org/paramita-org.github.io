/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-frase-zoom.js — Zoom-out de la Frase (efecto-02)
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-6 del bloque §4a embebido en index.html
   (líneas 664-685 del original).

   QUÉ HACE
   ────────
   Anima el titular `#fraseZoom` acompañando al scroll: arranca gigante
   (scale 2.8), desenfocado (blur 10px) y transparente (opacity 0), y
   se asienta a su tamaño real, nítido y visible cuando el bloque
   `#frase` llega al centro del viewport.

   El movimiento está atado al scroll con `scrub: true` — la animación
   sigue al usuario en ambos sentidos (bajar y subir), reproduciéndose
   fluidamente como una manifestación gestual del cruce.

   Además, el antetítulo (`.zen-frase__eyebrow`) hace un fade-in con
   translate desde 14px, reversible al entrar y salir del bloque
   (`toggleActions: 'play reverse play reverse'`).

   VÍNCULO CONCEPTUAL
   ──────────────────
   Este efecto es una de las manifestaciones canónicas de la metáfora
   "el cruce como acto": el titular literalmente atraviesa el espacio
   (de gigante a real) mientras el usuario lo cruza con la mirada.

   PARÁMETROS DEL SCROLLTRIGGER
   ────────────────────────────
   · trigger: #frase           → sección que dispara la animación
   · start:   'top bottom'     → arranca cuando la sección entra por abajo
   · end:     'center center'  → termina cuando su centro llega al centro
                                  del viewport
   · scrub:   true             → atado 1:1 al scroll, bidireccional

   Para el antetítulo:
   · start:         'top 70%'
   · toggleActions: 'play reverse play reverse'
                    → play al entrar, reverse al salir por arriba,
                      play al volver a entrar, reverse al salir por abajo.

   DEPENDENCIAS
   ────────────
   · GSAP core
   · GSAP ScrollTrigger

   Ambos cargados como `<script defer>` en el <head> de index.html.
   Este archivo se ejecuta en DOMContentLoaded → GSAP y sus plugins
   ya están disponibles.

   FALLBACK
   ────────
   Si GSAP no está disponible (CDN bloqueado, error de red) o el
   usuario tiene `prefers-reduced-motion: reduce`, la función retorna
   silenciosamente y el titular queda en su estado FINAL (visible,
   escala 1, sin blur) gracias al CSS. Nunca se ve un estado roto.

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <section id="frase">
     <span class="zen-frase__eyebrow">Antetítulo</span>
     <h2 id="fraseZoom">La frase que se revela</h2>
   </section>
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const titulo = document.getElementById('fraseZoom');
  if (!titulo) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';

  // Sin GSAP o con reduced-motion: dejar el título en su estado final (ya visible por CSS).
  if (!hasGSAP || reduce) return;

  gsap.registerPlugin(ScrollTrigger);

  // Titular: zoom-out desde gigante, atado al scroll (scrub bidireccional).
  gsap.fromTo('#fraseZoom',
    { scale: 2.8, opacity: 0, filter: 'blur(10px)' },
    {
      scale: 1,
      opacity: 1,
      filter: 'blur(0px)',
      ease: 'none',
      scrollTrigger: {
        trigger: '#frase',
        start: 'top bottom',
        end: 'center center',
        scrub: true
      }
    }
  );

  // Antetítulo: fade-in reversible al entrar/salir del bloque.
  gsap.fromTo('.zen-frase__eyebrow',
    { opacity: 0, y: 14 },
    {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#frase',
        start: 'top 70%',
        toggleActions: 'play reverse play reverse'
      }
    }
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-frase-zoom.js
   ═══════════════════════════════════════════════════════════════════════════ */
