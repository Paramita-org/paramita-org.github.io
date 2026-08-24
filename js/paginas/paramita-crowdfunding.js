/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   js/paginas/paramita-crowdfunding.js — Interacción de /contribuir/crowdfunding/
   ───────────────────────────────────────────────────────────────────────────
   Tres piezas, todas progresivas (la página funciona sin JS):
     1 · Frecuencia (una vez / cada mes) + selección de importe → línea de
         impacto y texto del CTA. Mismo patrón que /contribuir/ (.importe,
         aria-pressed, #libre, #impacto, #donar, .donar-txt).
     2 · Barra de progreso · se llena al entrar en viewport (una sola vez).
         Respeta prefers-reduced-motion (aparece llena, sin animar).
     3 · Envío de demo (procesando → acuse). PENDIENTE (Alberto): sustituir el
         setTimeout por la llamada real a la pasarela; los data-txt de impacto
         y las cifras de la barra son provisionales.

   El revelado al scroll lo gestiona el componente del sistema
   paramita-reveal.js ([data-reveal] → clase is-in); aquí no se toca.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ── 1 · Frecuencia + importe ──────────────────────────────────────── */
  var form = document.getElementById("form-crowd");
  if (form) {
    var freqBtns = Array.prototype.slice.call(document.querySelectorAll(".cf-freq__b"));
    var imps     = Array.prototype.slice.call(document.querySelectorAll(".cf-montos .importe"));
    var libre    = document.getElementById("libre");
    var otro     = document.getElementById("cf-otro");
    var impacto  = document.getElementById("impacto");
    var donarTxt = document.querySelector(".donar-txt");
    var acuse    = document.getElementById("acuse");

    // Preselección: 50 € "el más elegido" (coherente con la muestra).
    var estado = { freq: "una", val: "50", txt: "sostiene una semana de silencio" };

    function sufijoFreq() { return estado.freq === "mes" ? " · cada mes" : " · una vez"; }

    function pinta() {
      if (impacto) {
        impacto.innerHTML = (estado.val && estado.txt)
          ? ("<b>" + estado.val + " €</b> " + estado.txt + ".")
          : "Cada cantidad tiene un destino concreto. Gracias por tu generosidad.";
      }
      if (donarTxt) {
        donarTxt.textContent = estado.val
          ? ("Donar " + estado.val + " €" + sufijoFreq())
          : "Elige una cantidad";
      }
    }

    freqBtns.forEach(function (b) {
      b.addEventListener("click", function () {
        freqBtns.forEach(function (x) { x.setAttribute("aria-selected", "false"); });
        b.setAttribute("aria-selected", "true");
        estado.freq = b.dataset.freq;
        pinta();
      });
    });

    imps.forEach(function (b) {
      b.addEventListener("click", function () {
        imps.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        if (b.dataset.imp === "otra") {
          if (otro) { otro.hidden = false; }
          if (libre) { libre.focus(); }
          estado.val = (libre && libre.value) || "";
          estado.txt = "";
        } else {
          if (otro) { otro.hidden = true; }
          estado.val = b.dataset.imp;
          estado.txt = b.dataset.txt || "";
        }
        pinta();
      });
    });

    if (libre) {
      libre.addEventListener("input", function (e) {
        estado.val = e.target.value;
        estado.txt = "";
        pinta();
      });
    }

    // Envío · demo local (Alberto: reemplazar por la pasarela real)
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!estado.val) { if (libre && !otro.hidden) libre.focus(); return; }
      form.classList.add("is-loading");
      window.setTimeout(function () {
        form.classList.remove("is-loading");
        if (acuse) { acuse.hidden = false; }
      }, 1100);
    });

    pinta();
  }

  /* ── 2 · Tilt 3D en hover (cards pequeñas) ─────────────────────────────
     User-invoked (puntero). Se desactiva con prefers-reduced-motion. Las
     celdas anchas del bento y la de marca quedan fuera (solo se elevan). */
  (function () {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return; // nada de tilt en táctil
    var cards = document.querySelectorAll(
      ".cf-nota, .cf-bento .cf-celda:not(.cf-celda--ancha):not(.cf-celda--marca)"
    );
    var MAX = 6; // grados
    cards.forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateX(" + (-py * MAX) + "deg) rotateY(" +
          (px * MAX) + "deg) translateY(-4px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }());

  /* ── 3 · Barra de progreso ─────────────────────────────────────────── */
  (function () {
    var fill = document.querySelector(".cf-prog__fill[data-fill]");
    if (!fill) return;
    var pct = Math.max(0, Math.min(100, parseFloat(fill.getAttribute("data-fill")) || 0)) + "%";
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      fill.style.transition = "none";
      fill.style.width = pct;
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { fill.style.width = pct; io.disconnect(); }
      });
    }, { threshold: 0.4 });
    io.observe(fill);
  }());

}());
