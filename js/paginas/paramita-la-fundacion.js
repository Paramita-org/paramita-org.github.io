/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · paramita-la-fundacion.js
   Único comportamiento propio de la página: retirar el indicio de scroll del
   hero en cuanto el usuario empieza a bajar. El revelado de entrada lo gestiona
   el primitivo del sistema (paramita-reveal.js vía [data-reveal]).
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var cue = document.querySelector(".lf-cue");
  if (!cue) return;
  var hide = function () {
    if (window.scrollY > 40) {
      cue.classList.add("is-gone");
      window.removeEventListener("scroll", hide);
    }
  };
  window.addEventListener("scroll", hide, { passive: true });
})();
