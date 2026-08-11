/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   js/paginas/paramita-contribuir.js — Interacción de la página /contribuir/
   ───────────────────────────────────────────────────────────────────────────
   Solo la donación única: selección de importe (con estado LUZ) y el gesto
   "procesando → acuse". El revelado al scroll lo gestiona el componente del
   sistema paramita-reveal.js ([data-reveal] → clase is-in); aquí no se toca.

   PENDIENTE (Alberto): sustituir el setTimeout de demo por la llamada real a
   la pasarela de pago, y las líneas de impacto por cifras reales de la
   fundación (los textos de data-txt son provisionales).
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  const unica = document.getElementById("form-unica");
  if (!unica) return; // la página puede cargar sin el bloque de donación única

  const imps    = Array.from(document.querySelectorAll(".importe"));
  const libre   = document.getElementById("libre");
  const impacto = document.getElementById("impacto");
  const donar   = document.getElementById("donar");
  const donarTxt = document.querySelector(".donar-txt");
  const spin    = donar ? donar.querySelector(".spin") : null;
  const acuse   = document.getElementById("acuse");

  let actual = { val: "50", txt: "ayudan a mantener las clases en directo un mes" };

  function pinta() {
    const v = actual.val;
    if (impacto) {
      impacto.innerHTML = actual.txt
        ? ("<b>" + v + " €</b> " + actual.txt + ".")
        : "Cada cantidad tiene un destino concreto. Gracias por tu generosidad.";
    }
    if (donarTxt) donarTxt.textContent = v ? ("Donar " + v + " €") : "Donar";
  }

  imps.forEach(function (b) {
    b.addEventListener("click", function () {
      imps.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      if (b.dataset.imp === "otra") {
        if (libre) { libre.style.display = "block"; libre.focus(); }
        actual = { val: (libre && libre.value) || "", txt: "" };
      } else {
        if (libre) libre.style.display = "none";
        actual = { val: b.dataset.imp, txt: b.dataset.txt };
      }
      pinta();
    });
  });

  if (libre) {
    libre.addEventListener("input", function () {
      actual = { val: libre.value, txt: "" };
      pinta();
    });
  }

  if (donar) {
    donar.addEventListener("click", function () {
      if (!actual.val) { if (libre) libre.focus(); return; }
      donar.classList.add("is-procesando");
      if (spin) spin.style.display = "inline-block";
      if (donarTxt) donarTxt.textContent = "Procesando…";
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // DEMO · sustituir por la respuesta real de la pasarela (Alberto)
      setTimeout(function () {
        unica.style.display = "none";
        if (acuse) acuse.style.display = "block";
      }, reduce ? 200 : 1200);
    });
  }

  pinta();
})();
