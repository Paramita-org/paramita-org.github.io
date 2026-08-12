/* ═══════════════════════════════════════════════════════════════════════
   paramita-faq.js — Comportamiento del bloque FAQ reutilizable
   ───────────────────────────────────────────────────────────────────────
   1 · Acordeón accesible · alterna aria-expanded en cada .faq__q
       (independientes: puede haber varias abiertas a la vez).
   2 · Buscador en vivo · filtra .faq__item por palabra, sin acentos ni
       mayúsculas; muestra #faqVacio cuando no hay coincidencias.

   Marcado esperado: ver paramita-faq.css. No-op si no hay .faq__q.
   Extraído de paramita-curso.js para reutilizar en cualquier página.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  /* 1 · Acordeón ----------------------------------------------------------- */
  (function faqAcordeon() {
    var qs = document.querySelectorAll(".faq__q");
    if (!qs.length) return;
    qs.forEach(function (q) {
      q.addEventListener("click", function () {
        var abierto = q.getAttribute("aria-expanded") === "true";
        q.setAttribute("aria-expanded", abierto ? "false" : "true");
      });
    });
  })();

  /* 2 · Buscador en vivo --------------------------------------------------- */
  (function faqBuscador() {
    var input = document.getElementById("faqBuscar");
    var lista = document.querySelector(".faq__lista");
    var vacio = document.getElementById("faqVacio");
    if (!input || !lista) return;

    var items = [].slice.call(lista.querySelectorAll(".faq__item"));

    // Comparación sin acentos ni mayúsculas.
    function norm(s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }

    input.addEventListener("input", function () {
      var q = norm(input.value.trim());
      var visibles = 0;
      items.forEach(function (it) {
        var match = !q || norm(it.textContent).indexOf(q) > -1;
        it.hidden = !match;
        if (match) visibles++;
      });
      if (vacio) vacio.hidden = visibles > 0;
    });
  })();

})();
