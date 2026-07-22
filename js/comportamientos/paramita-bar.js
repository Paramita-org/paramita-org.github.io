/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-bar.js — Barra de navegación sticky con estado glass
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-2 del bloque §1 embebido en index.html
   (líneas 513-517 del original).

   QUÉ HACE
   ────────
   Añade la clase `.scrolled` a la barra de navegación (`.bar`) cuando la
   página se ha desplazado más de 8px desde el borde superior. Esa clase
   es la que dispara en el CSS (paramita-bar.css) el cambio de estado:
   fondo translúcido con blur, sombra sutil, contraste reforzado.

   Al volver arriba del todo, la clase se retira y la barra regresa a su
   estado transparente inicial.

   POR QUÉ 8px Y NO 0
   ──────────────────
   Un umbral mínimo evita que la barra parpadee (toggle continuo) cuando
   el scroll está a 1-2 px por micro-gestos del trackpad o desajustes de
   restauración de scroll del navegador.

   OPTIMIZACIÓN CON requestAnimationFrame
   ──────────────────────────────────────
   El evento `scroll` dispara MUY frecuentemente (potencialmente decenas
   de veces por segundo). Sin control, cada disparo haría un
   `classList.toggle` que fuerza un repaint. Con rAF nos aseguramos de
   que solo se pinte una vez por frame de vídeo del navegador.

   El flag `sraf` evita encolar múltiples callbacks: si ya hay uno
   pendiente, los siguientes eventos scroll son ignorados hasta que ese
   se ejecute.

   DEPENDENCIAS
   ────────────
   Ninguna. Vanilla JS.

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <header class="bar">
     <!-- contenido de la navegación -->
   </header>

   CSS ASOCIADO
   ────────────
   Ver paramita-bar.css — regla `.bar.scrolled { ... }`.
   ═══════════════════════════════════════════════════════════════════════════ */

(() => {
  const bar = document.querySelector('.bar');
  if (!bar) return;

  let sraf = 0;
  const onScroll = () => {
    if (sraf) return;
    sraf = requestAnimationFrame(() => {
      bar.classList.toggle('scrolled', window.scrollY > 8);
      sraf = 0;
    });
  };

  addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Estado inicial (por si la página carga ya scrolleada)
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-bar.js
   ═══════════════════════════════════════════════════════════════════════════ */
