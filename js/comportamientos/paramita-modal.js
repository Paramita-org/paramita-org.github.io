/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-modal.js — Modal de vídeo de bienvenida
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-4 del bloque §1 embebido en index.html
   (líneas 536-552 del original).

   QUÉ HACE
   ────────
   Gestiona la apertura y cierre del modal de vídeo que se dispara desde
   el vídeo cinematográfico de la sección Bienvenidos. Al hacer clic (o
   pulsar Enter/Espacio) sobre el elemento `#missionVideo`, se inyecta
   dentro del modal un `<video>` con el contenido completo y se muestra
   con animación (clase `.open`).

   INYECCIÓN DIFERIDA DEL <VIDEO>
   ──────────────────────────────
   El `<video>` NO existe en el HTML: se crea con `innerHTML` en el
   momento de abrir el modal, y se destruye al cerrarlo (`innerHTML=''`).
   Esto tiene dos ventajas:

   1. Rendimiento: el vídeo no se descarga hasta que el usuario lo pide.
   2. Recursos: al cerrar, el navegador libera memoria y detiene el
      buffer — evita que un vídeo siga cargando en segundo plano.

   CIERRE POR TRES VÍAS
   ────────────────────
   El modal se puede cerrar de tres formas, todas convencionales para
   preservar la accesibilidad:

   · Clic en el botón de cierre (#vclose)
   · Clic en el fondo del modal (fuera del contenido)
   · Tecla Escape

   ACCESIBILIDAD
   ─────────────
   · Se soporta activación por teclado (Enter y Espacio) sobre el
     disparador, no solo clic.
   · Al abrir, el foco se mueve al botón de cierre (para que Tab siga
     una lectura lógica).
   · Al cerrar, el foco vuelve al disparador (patrón de restauración de
     foco esperado por lectores de pantalla y usuarios de teclado).

   DEPENDENCIAS
   ────────────
   Ninguna. Vanilla JS.

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <!-- Disparador -->
   <button id="missionVideo" type="button">…</button>

   <!-- Modal (oculto por defecto vía CSS) -->
   <div id="vmodal" role="dialog" aria-modal="true">
     <button id="vclose" type="button" aria-label="Cerrar">×</button>
     <div id="vframe"><!-- <video> inyectado aquí --></div>
   </div>

   CSS ASOCIADO
   ────────────
   Ver paramita-modal.css — reglas `#vmodal` y `#vmodal.open`.

   NOTA SOBRE LOS ASSETS
   ─────────────────────
   Las rutas del vídeo y del poster están hardcodeadas:
     · assets/img/bienvenida-paramita.jpg  (poster)
     · assets/img/bienvenida-paramita.mp4  (fuente)
   Si estas rutas cambian, editar aquí — no en el HTML.
   ═══════════════════════════════════════════════════════════════════════════ */

(() => {
  const trigger = document.getElementById('missionVideo');
  const vmodal  = document.getElementById('vmodal');
  const vframe  = document.getElementById('vframe');
  const vclose  = document.getElementById('vclose');

  if (!trigger || !vmodal || !vframe || !vclose) return;

  const openV = () => {
    vframe.innerHTML = `
      <video controls autoplay playsinline poster="assets/img/bienvenida-paramita.jpg">
        <source src="assets/img/bienvenida-paramita.mp4" type="video/mp4">
      </video>`;
    vmodal.classList.add('open');
    vclose.focus();
  };

  const closeV = () => {
    vmodal.classList.remove('open');
    vframe.innerHTML = ''; // libera el vídeo y detiene la descarga
    trigger.focus();
  };

  // Apertura: clic o teclado (Enter / Espacio)
  trigger.addEventListener('click', openV);
  trigger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openV();
    }
  });

  // Cierre: botón, fondo, tecla Escape
  vclose.addEventListener('click', closeV);
  vmodal.addEventListener('click', e => {
    if (e.target === vmodal) closeV();
  });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && vmodal.classList.contains('open')) closeV();
  });
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-modal.js
   ═══════════════════════════════════════════════════════════════════════════ */
