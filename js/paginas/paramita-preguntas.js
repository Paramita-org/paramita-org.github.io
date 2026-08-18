/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-preguntas.js — Página · Preguntas frecuentes
   ───────────────────────────────────────────────────────────────────────────
   Comportamientos propios de la landing:
     1 · Buscador MULTI-CATEGORÍA · aplana la vista mientras se escribe (oculta
         «Lo más preguntado» y las cabeceras, deja una lista plana de
         coincidencias). Sin acentos ni mayúsculas.
     2 · Chips ancla · selección VISIBLE al hacer clic (feedback inmediato) y un
         scroll-spy fiable que marca la categoría en vista, también las cortas.

   El ACORDEÓN lo gobierna el componente paramita-faq.js (togglea todos los
   .faq__q). Por eso el buscador de esta página usa id propio (#preguntasBuscar)
   y NO #faqBuscar: así el buscador de una sola lista del componente queda
   inactivo y no compite con este. No-op si falta el contenedor.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var root = document.getElementById("preguntasRoot");
  if (!root) return;

  var input = document.getElementById("preguntasBuscar");
  var vacio = document.getElementById("preguntasVacio");
  var pop   = document.getElementById("preguntasPop");
  var cats  = [].slice.call(root.querySelectorAll(".preg-cat"));
  var heads = [].slice.call(root.querySelectorAll(".preg-cat__head"));

  // Comparación sin acentos ni mayúsculas.
  function norm(s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

  /* 1 · Buscador multi-categoría --------------------------------------------- */
  if (input) {
    input.addEventListener("input", function () {
      var q = norm(input.value.trim());

      if (!q) {
        // Restaura la vista por categorías.
        if (pop) pop.hidden = false;
        heads.forEach(function (h) { h.hidden = false; });
        cats.forEach(function (c) {
          c.hidden = false;
          c.querySelectorAll(".faq__item").forEach(function (it) { it.hidden = false; });
        });
        if (vacio) vacio.hidden = true;
        return;
      }

      // Modo búsqueda: sin popular ni cabeceras; lista plana de coincidencias.
      if (pop) pop.hidden = true;
      heads.forEach(function (h) { h.hidden = true; });

      var total = 0;
      cats.forEach(function (cat) {
        var visibles = 0;
        cat.querySelectorAll(".faq__item").forEach(function (it) {
          var match = norm(it.textContent).indexOf(q) > -1;
          it.hidden = !match;
          if (match) { visibles++; total++; }
        });
        cat.hidden = visibles === 0;
      });
      if (vacio) vacio.hidden = total > 0;
    });
  }

  /* 2 · Chips ancla · selección al clic + scroll-spy ------------------------- */
  var chips = [].slice.call(document.querySelectorAll(".preg-chip"));

  function setActive(href) {
    chips.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === href); });
  }

  // Clic → feedback inmediato; bloqueo breve para que el spy no lo pise durante
  // el desplazamiento suave hasta la sección.
  var lockUntil = 0;
  chips.forEach(function (a) {
    a.addEventListener("click", function () {
      setActive(a.getAttribute("href"));
      lockUntil = Date.now() + 800;
    });
  });

  // Marca la categoría cuyo inicio queda justo bajo la barra de utilidad.
  // Funciona con secciones cortas (a diferencia de un observador de banda central).
  function spy() {
    if (Date.now() < lockUntil) return;
    var linea = window.scrollY + 150;
    var actual = null;
    cats.forEach(function (c) {
      if (c.hidden) return;
      var top = c.getBoundingClientRect().top + window.scrollY;
      if (top <= linea) actual = c;
    });
    setActive(actual ? "#" + actual.id : "");
  }

  window.addEventListener("scroll", spy, { passive: true });
  window.addEventListener("resize", spy);
  spy();

})();
