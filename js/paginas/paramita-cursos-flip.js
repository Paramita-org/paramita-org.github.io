/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-cursos-flip.js — Rejilla de Cursos con FLIP animado
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-7 del bloque §4b embebido en index.html
   (líneas 687-735 del original).

   QUÉ HACE
   ────────
   La rejilla `#cursosGrid` es un CSS grid con auto-placement. Cada
   celda `.flip-celda` ocupa 1×1 por defecto. Al hacer hover o foco
   sobre una celda, esta expande a 2×2 (vía CSS `.is-expanded`), lo que
   hace que las celdas vecinas se reubiquen automáticamente para
   acomodar el nuevo tamaño.

   La API FLIP de GSAP mide las posiciones ANTES y DESPUÉS del cambio
   y anima el reflujo suavemente, en lugar de que las celdas salten
   de golpe. Se llama FLIP por "First, Last, Invert, Play" — el patrón
   canónico de animación de layout.

   Solo hay UNA celda expandida a la vez: al hacer hover en otra, la
   anterior colapsa y la nueva se expande.

   COMPORTAMIENTO DIFERENCIADO ESCRITORIO / MÓVIL
   ──────────────────────────────────────────────
   · ESCRITORIO (hover disponible):
     - mouseenter/focus → expande esa celda
     - mouseleave del grid → colapsa

   · MÓVIL / TÁCTIL (matchMedia '(hover:none)'):
     - Primer toque → expande (previene navegación con preventDefault)
     - Segundo toque sobre la celda ya expandida → navega al enlace
     Este patrón "peek then commit" es convención en interfaces
     táctiles y permite explorar antes de comprometerse.

   RESILIENCIA
   ───────────
   Si GSAP no está disponible, si Flip no cargó, o si el usuario tiene
   reduced-motion → la variable `canFlip` queda en false. Las celdas
   siguen expandiendo/colapsando (por CSS), pero SIN la animación FLIP
   de reflujo. Funcional en cualquier caso.

   DETALLE TÉCNICO SOBRE Flip.getState
   ───────────────────────────────────
   Se captura el estado con `{ props: 'borderRadius' }` para que la
   animación de reflujo también interpole el border-radius (que puede
   cambiar entre estado normal y expandido). Sin esto, el radio
   saltaría de golpe mientras la posición se anima suave.

   DEPENDENCIAS
   ────────────
   · GSAP core
   · GSAP Flip plugin

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <div id="cursosGrid">
     <a href="…" class="flip-celda">…</a>
     <a href="…" class="flip-celda">…</a>
     <a href="…" class="flip-celda">…</a>
     …
   </div>

   CSS ASOCIADO
   ────────────
   Ver paramita-cursos.css — reglas `.flip-celda` y `.flip-celda.is-expanded`.
   ═══════════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('cursosGrid');
  if (!grid) return;

  const celdas = [...grid.querySelectorAll('.flip-celda')];
  if (!celdas.length) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof window.gsap !== 'undefined';
  const touch = matchMedia('(hover:none)').matches;

  // FLIP disponible si hay GSAP, sin reduced-motion y el plugin cargó
  const canFlip = hasGSAP && !reduce && typeof window.Flip !== 'undefined';
  if (canFlip) gsap.registerPlugin(Flip);

  let activa = null;

  function expandir(celda) {
    if (celda === activa) return;
    const estado = canFlip ? Flip.getState(celdas, { props: 'borderRadius' }) : null;

    if (activa) activa.classList.remove('is-expanded');
    celda.classList.add('is-expanded');
    activa = celda;

    if (canFlip) {
      Flip.from(estado, {
        duration: 0.65,
        ease: 'power3.inOut',
        stagger: 0.012,
        absolute: false,
        onEnter: el => gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      });
    }
  }

  function colapsar() {
    if (!activa) return;
    const estado = canFlip ? Flip.getState(celdas, { props: 'borderRadius' }) : null;

    activa.classList.remove('is-expanded');
    activa = null;

    if (canFlip) {
      Flip.from(estado, {
        duration: 0.55,
        ease: 'power3.inOut',
        stagger: 0.01
      });
    }
  }

  if (touch) {
    // MÓVIL: el primer toque EXPANDE (sin navegar); el segundo toque (ya expandida) navega.
    celdas.forEach(celda => {
      celda.addEventListener('click', e => {
        if (activa !== celda) {
          e.preventDefault();
          expandir(celda);
        }
      });
    });
  } else {
    // DESKTOP: hover/foco expande; al salir de la rejilla, colapsa.
    celdas.forEach(celda => {
      celda.addEventListener('mouseenter', () => expandir(celda));
      celda.addEventListener('focus', () => expandir(celda));
    });
    grid.addEventListener('mouseleave', colapsar);
  }
});

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-cursos-flip.js
   ═══════════════════════════════════════════════════════════════════════════ */
