/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · paramita-suscripcion.js
   Cierre de umbral · gestión del formulario de suscripción.
   ───────────────────────────────────────────────────────────────────────────
   MOCK · el formulario aún no tiene endpoint. Cuando el backend (Alberto)
   conecte el servicio de email, el bloque marcado abajo se sustituye por el
   fetch/submit real. Hasta entonces: valida en cliente y muestra el acuse.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var form = document.getElementById('suscribeForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validación nativa (email válido + consentimiento marcado)
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // ─── MOCK ───────────────────────────────────────────────────────────────
    // Sustituir por el envío real cuando el servicio de email esté conectado:
    //   const datos = new FormData(form);
    //   fetch(ENDPOINT, { method: 'POST', body: datos }) ...
    // ─────────────────────────────────────────────────────────────────────────
    form.classList.add('is-sent');

    var btn = form.querySelector('.suscribe__btn');
    var input = form.querySelector('.suscribe__input');
    if (btn) { btn.disabled = true; btn.textContent = 'Suscrito'; }
    if (input) { input.readOnly = true; }
  });
})();
