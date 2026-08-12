/* ═══════════════════════════════════════════════════════════════════════
   paramita-meditacion.js
   Comportamiento específico de /meditacion/meditacion.html
   ───────────────────────────────────────────────────────────────────────
   1 · Revela la primera práctica al pulsar el primario del hero.
       (La CSS la oculta SOLO si <html class="js">; sin JS se ve entera.)
   2 · Sincroniza la etiqueta de respiración con el orbe (inhala/sostén/exhala).
   Respeta prefers-reduced-motion en ambos.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* 1 · Revelar la práctica ------------------------------------------------ */
  var cta = document.getElementById("cta-practica");
  var practica = document.getElementById("practica");

  if (cta && practica) {
    cta.addEventListener("click", function () {
      practica.classList.add("is-open");
      practica.scrollIntoView({
        behavior: reduce.matches ? "auto" : "smooth",
        block: "start"
      });
      // Foco al título de la práctica para lectores de pantalla
      var titulo = document.getElementById("practica-titulo");
      if (titulo) {
        titulo.setAttribute("tabindex", "-1");
        titulo.focus({ preventScroll: true });
      }
    });
  }

  /* 2 · Etiqueta de respiración -------------------------------------------- */
  var label = document.getElementById("respira-label");

  if (label) {
    if (reduce.matches) {
      label.textContent = "Inhala 4 · sostén 2 · exhala 5";
    } else {
      var fases = [
        { t: "Inhala…", ms: 4000 },
        { t: "Sostén",  ms: 2000 },
        { t: "Exhala…", ms: 5000 }
      ];
      var i = 0;
      (function paso() {
        label.textContent = fases[i].t;
        var ms = fases[i].ms;
        i = (i + 1) % fases.length;
        window.setTimeout(paso, ms);
      })();
    }
  }
})();
