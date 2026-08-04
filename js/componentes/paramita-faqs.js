/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-faqs.js — Lógica del componente de preguntas frecuentes
   ───────────────────────────────────────────────────────────────────────────
   Un solo archivo para todas las instancias de .faqs de la página.

   QUÉ HACE
   ────────
   1 · Acordeón accesible (patrón WAI-ARIA APG):
       · <button aria-expanded> alterna el panel asociado por aria-controls.
       · Enter / Espacio nativos del <button>.
       · Flechas ↑ ↓, Inicio y Fin navegan entre preguntas (foco).
       · El panel cerrado queda `inert` (fuera de foco y del árbol a11y).
       · Por defecto pueden abrirse varias a la vez. Con `data-solo` en el
         contenedor .faqs, abrir una cierra las demás de ESE contenedor.

   2 · Schema FAQPage (SEO + citación por IA):
       Genera un único <script type="application/ld+json"> con todas las
       preguntas de la página, leído directamente del DOM. Así el contenido
       vive en un solo sitio (el HTML) y el schema nunca se desincroniza.
       Un contenedor con `data-schema="false"` queda excluido del schema.

   DEPENDENCIAS
   ────────────
   Ninguna externa. Vanilla. Independiente de GSAP por diseño (igual que
   reveal.js y trazo-divisor.js): si el CDN falla, la FAQ sigue funcionando.

   MARCADO ESPERADO
   ────────────────
   <section class="faqs" data-solo>            ← data-solo opcional
     <div class="faqs__head"> … </div>
     <ol class="faqs__lista">
       <li class="faq">
         <h3 class="faq__q">
           <button class="faq__disparador" type="button"
                   id="faq-b-1" aria-expanded="false" aria-controls="faq-r-1">
             <span class="faq__nodo" aria-hidden="true"></span>
             <span class="faq__texto">¿Pregunta?</span>
             <span class="faq__signo" aria-hidden="true"></span>
           </button>
         </h3>
         <div class="faq__r" id="faq-r-1">
           <div class="faq__r-inner"><p>Respuesta…</p></div>
         </div>
       </li>
       …
     </ol>
   </section>

   Los id (faq-b-N / faq-r-N) pueden venir del HTML; si faltan, el JS los
   genera para garantizar la relación aria-controls / aria-expanded.
   ═══════════════════════════════════════════════════════════════════════════ */

(function initFaqs() {
  'use strict';

  const contenedores = document.querySelectorAll('.faqs');
  if (!contenedores.length) return;

  let uid = 0;

  contenedores.forEach((contenedor) => {
    const items = [...contenedor.querySelectorAll('.faq')];
    if (!items.length) return;

    const soloUno = contenedor.hasAttribute('data-solo');
    const disparadores = [];

    items.forEach((item) => {
      const boton = item.querySelector('.faq__disparador');
      const panel = item.querySelector('.faq__r');
      if (!boton || !panel) return;

      // Garantizar type=button (no envía formularios) y la relación aria.
      boton.setAttribute('type', 'button');
      if (!boton.id)  boton.id  = `faq-b-${++uid}`;
      if (!panel.id)  panel.id  = `faq-r-${uid || ++uid}`;
      boton.setAttribute('aria-controls', panel.id);

      // Estado inicial: cerrado + panel inerte.
      const abiertoInicial = item.classList.contains('is-abierto');
      boton.setAttribute('aria-expanded', String(abiertoInicial));
      setInerte(panel, !abiertoInicial);

      boton.addEventListener('click', () => alternar(item));
      disparadores.push(boton);
    });

    // Navegación por teclado entre preguntas (APG accordion).
    contenedor.addEventListener('keydown', (e) => {
      const i = disparadores.indexOf(document.activeElement);
      if (i === -1) return;

      let destino = null;
      switch (e.key) {
        case 'ArrowDown': destino = disparadores[i + 1] || disparadores[0]; break;
        case 'ArrowUp':   destino = disparadores[i - 1] || disparadores[disparadores.length - 1]; break;
        case 'Home':      destino = disparadores[0]; break;
        case 'End':       destino = disparadores[disparadores.length - 1]; break;
        default: return;
      }
      e.preventDefault();
      destino.focus();
    });

    /* ─── Alternar apertura de un ítem ──────────────────────────────── */
    function alternar(item) {
      const boton = item.querySelector('.faq__disparador');
      const panel = item.querySelector('.faq__r');
      const abrir = boton.getAttribute('aria-expanded') !== 'true';

      // Modo «solo uno»: cerrar el resto de este contenedor antes de abrir.
      if (abrir && soloUno) {
        items.forEach((otro) => {
          if (otro !== item && otro.classList.contains('is-abierto')) {
            cerrar(otro);
          }
        });
      }

      abrir ? abrirItem(item, boton, panel) : cerrar(item);
    }

    function abrirItem(item, boton, panel) {
      item.classList.add('is-abierto');
      boton.setAttribute('aria-expanded', 'true');
      setInerte(panel, false);   // vuelve al foco / árbol a11y al abrir
    }

    function cerrar(item) {
      const boton = item.querySelector('.faq__disparador');
      const panel = item.querySelector('.faq__r');
      item.classList.remove('is-abierto');
      boton.setAttribute('aria-expanded', 'false');
      setInerte(panel, true);    // sale del foco / árbol a11y al cerrar
    }
  });

  /* ─── Marcar/desmarcar un panel como inerte ───────────────────────── */
  function setInerte(panel, inerte) {
    if ('inert' in HTMLElement.prototype) {
      panel.inert = inerte;
    } else {
      // Fallback muy conservador para navegadores sin `inert`.
      panel.setAttribute('aria-hidden', String(inerte));
    }
  }

  /* ─── Schema FAQPage · un único bloque JSON-LD para toda la página ── */
  construirSchema();

  function construirSchema() {
    if (document.getElementById('faqs-schema')) return;

    const entidades = [];
    document.querySelectorAll('.faqs:not([data-schema="false"]) .faq').forEach((item) => {
      const q = item.querySelector('.faq__texto');
      const a = item.querySelector('.faq__r-inner');
      if (!q || !a) return;

      const pregunta  = q.textContent.replace(/\s+/g, ' ').trim();
      const respuesta = a.textContent.replace(/\s+/g, ' ').trim();
      if (!pregunta || !respuesta) return;

      entidades.push({
        '@type': 'Question',
        name: pregunta,
        acceptedAnswer: { '@type': 'Answer', text: respuesta }
      });
    });

    if (!entidades.length) return;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faqs-schema';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: entidades
    });
    document.head.appendChild(script);
  }

})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-faqs.js
   ═══════════════════════════════════════════════════════════════════════════ */
