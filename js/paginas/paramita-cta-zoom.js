/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-cta-zoom.js — Zoom-stage del CTA principal
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-8 del bloque §4d embebido en index.html
   (líneas 745-756 del original).

   QUÉ HACE
   ────────
   Anima el elemento `.zoom-word` dentro de la sección `#amigo`
   ("Hazte amigo") acompañando al scroll: arranca a escala 0.62 con
   opacidad 0.35, y crece hasta escala 1 con opacidad completa cuando
   el centro de la sección alcanza el centro del viewport.

   Es una variante más sutil del zoom de la Frase — misma familia
   gestual, ritmo distinto. Refuerza el momento de conversión del CTA
   sin gritar.

   Nota: este era el bloque §4d del script inline original. El §4c
   (ornamentos SVG laterales atados a ScrollTrigger) se retiró en la
   Fase 5.4: no ligaba con la metáfora identitaria y en móvil solapaba
   con este zoom-word. Fue sustituido por un halo radial dorado CSS
   puro, sin JS asociado.

   PARÁMETROS DEL SCROLLTRIGGER
   ────────────────────────────
   · trigger: #amigo           → sección "Hazte amigo"
   · start:   'top bottom'
   · end:     'center center'
   · scrub:   1                → atado al scroll con inercia de 1s

   La diferencia con la Frase (`scrub: true`) es que aquí `scrub: 1`
   añade una ligera inercia — la animación se queda 1s "por detrás"
   del scroll, dando una sensación más suave y menos mecánica.

   DEPENDENCIAS
   ────────────
   · GSAP core
   · GSAP ScrollTrigger

   FALLBACK
   ────────
   Sin GSAP o con reduced-motion, el elemento queda en su estado final
   (escala 1, opacidad 1) por CSS.

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <section id="amigo">
     <h2>Hazte <span class="zoom-word">amigo</span></h2>
   </section>
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const word = document.querySelector('.zoom-word');
  if (!word) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  if (!hasGSAP || reduce) return;

  gsap.registerPlugin(ScrollTrigger);

  gsap.fromTo('.zoom-word',
    { scale: 0.62, autoAlpha: 0.35 },
    {
      scale: 1,
      autoAlpha: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#amigo',
        start: 'top bottom',
        end: 'center center',
        scrub: 1
      }
    }
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-cta-zoom.js
   ═══════════════════════════════════════════════════════════════════════════ */
