/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · paramita-suscripcion.js
   Cierre de umbral · gestión del formulario de suscripción.
   ───────────────────────────────────────────────────────────────────────────
   CAMBIO · Fase 8 · bind POR CLASE, no por id único
   ─────────────────────────────────────────────────
   Antes el script enganchaba un solo formulario por id (`#suscribeForm`), así
   que cualquier `.suscribe` con otro id —o inyectado por sync en el prefooter—
   quedaba sin gestionar: al pulsar «Suscribirme» recargaba la página. Ahora
   engancha TODOS los `form.suscribe` presentes, sea cual sea su id, y es
   idempotente (no vuelve a enganchar un formulario ya inicializado). Esto es
   requisito para la banda única de suscripción del prefooter.

   MOCK · el formulario aún no tiene endpoint. Cuando el backend (Alberto)
   conecte el servicio de email, el bloque marcado abajo se sustituye por el
   fetch/submit real. Hasta entonces: valida en cliente y muestra el acuse.

   COMPORTAMIENTO
   ──────────────
   · preventDefault + validación nativa (checkValidity / reportValidity).
     Cubre email válido y consentimiento marcado, tenga el formulario uno o
     dos campos (email, o nombre + email).
   · Al validar: añade `.is-sent` (revela `.suscribe__ok` vía CSS), desactiva
     el botón de envío con texto «Suscrito» y pone los campos de texto en
     solo-lectura. Las casillas (checkbox/radio) no se tocan.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var forms = document.querySelectorAll('form.suscribe');
  if (!forms.length) return;

  Array.prototype.forEach.call(forms, function (form) {
    // Idempotencia · si sync o un doble include lo reprocesan, no re-enganchar
    if (form.dataset.suscribeInit) return;
    form.dataset.suscribeInit = '1';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validación nativa (email válido + consentimiento marcado + nombre si lo hay)
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

      var btn = form.querySelector('.suscribe__btn')
             || form.querySelector('button[type="submit"], button:not([type])');
      if (btn) { btn.disabled = true; btn.textContent = 'Suscrito'; }

      Array.prototype.forEach.call(form.querySelectorAll('input'), function (input) {
        if (input.type === 'checkbox' || input.type === 'radio') return;
        input.readOnly = true;
      });
    });
  });
})();
