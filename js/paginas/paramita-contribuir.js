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

  // Sin preselección · nada anclado en carga (coherente con informe 16: sin
  // anclaje). pinta() dejará la línea de impacto neutra y el botón como "Donar".
  let actual = { val: "", txt: "" };

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
      if (!actual.val) {
        // Sin importe elegido: guiamos suavemente. Si "Otra" está activa (campo
        // visible), al campo; si no hay nada elegido, al primer importe.
        if (libre && libre.style.display !== "none") libre.focus();
        else if (imps[0]) imps[0].focus();
        return;
      }
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

/* El facade de vídeo (miniatura real de YouTube + reproducción con controles
   nativos) lo gestiona el componente canónico paramita-video.js, que unifica el
   antiguo handler de esta página. Se carga desde contribuir.html. */

/* ── Card destacada · halo de luz que recorre el contorno ──────────────────
   ADITIVO Y REVERSIBLE (anotado para el informe final · "halo destacada").
   Genera el offset-path del glow a partir del tamaño REAL de la card (el grid
   es fluido) y lo reescribe al redimensionar. El freno global --identidad-estado
   y prefers-reduced-motion los gobierna el CSS (ocultan la luz). Si el navegador
   no soporta offset-path, la luz se oculta y queda el resplandor ambiental. */
(function () {
  "use strict";
  var halos = document.querySelectorAll(".cuota-halo");
  if (!halos.length) return;
  var soporta = window.CSS && CSS.supports && CSS.supports("offset-path", 'path("M0 0")');
  halos.forEach(function (halo) {
    var card = halo.querySelector(".cuota--destacada");
    var luz  = halo.querySelector(".cuota-halo__luz");
    if (!card || !luz) return;
    if (!soporta) { luz.style.display = "none"; return; }
    var r = 18; // = border-radius de .cuota
    function trazar() {
      var w = Math.round(card.offsetWidth), h = Math.round(card.offsetHeight);
      if (!w || !h) return;
      var p = "path('M" + r + " 1 H" + (w - r) +
        " A" + (r - 1) + " " + (r - 1) + " 0 0 1 " + (w - 1) + " " + r +
        " V" + (h - r) +
        " A" + (r - 1) + " " + (r - 1) + " 0 0 1 " + (w - r) + " " + (h - 1) +
        " H" + r +
        " A" + (r - 1) + " " + (r - 1) + " 0 0 1 1 " + (h - r) +
        " V" + r +
        " A" + (r - 1) + " " + (r - 1) + " 0 0 1 " + r + " 1 Z')";
      luz.style.offsetPath = p;
      luz.style.webkitOffsetPath = p;
    }
    trazar();
    if ("ResizeObserver" in window) { new ResizeObserver(trazar).observe(card); }
    else { window.addEventListener("resize", trazar); }
  });
})();
