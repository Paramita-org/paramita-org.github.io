/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   js/paginas/paramita-solicitud.js — Validación de las dos puertas
   ───────────────────────────────────────────────────────────────────────────
   Validación en cliente al salir del campo (on blur) + al enviar. Errores
   accesibles: aria-invalid + aria-describedby + resumen con foco; acuse
   anunciado por live region y con foco movido a su encabezado (WCAG 3.3.1 /
   3.3.3 / 4.1.3). Respeta prefers-reduced-motion.

   SIN ENDPOINT · el envío es un mock visual (como paramita-suscripcion.js):
   valida, muestra el acuse y no envía a ningún sitio. Cuando el backend
   (Alberto) conecte el servicio, sustituir mostrarAcuse() por el POST real
   (dos endpoints: residencial y ligera) manteniendo el mismo acuse.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════
   VALIDACIÓN · cliente, al salir del campo (on blur) + al enviar.
   Errores accesibles: aria-invalid + aria-describedby + resumen con foco
   + acuse anunciado por live region (WCAG 3.3.1 / 3.3.3 / 4.1.3).
   Sin endpoint: envío simulado (mock), como el patrón de suscripción.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var reTel = /^[+\d][\d\s().-]{5,}$/;

  function campoDe(el) { return el.closest('.vf__campo'); }
  function errBox(campo) { return campo.querySelector('.vf__error'); }
  function control(campo) { return campo.querySelector('input, textarea, select'); }
  function label(campo) {
    var l = campo.querySelector('.vf__label')
         || campo.querySelector('.vf__ctexto')
         || campo.querySelector('.vf__consent span');
    if (!l) return 'Este campo';
    /* consentimiento: frase completa (el enlace es parte de ella).
       compromiso (.vf__ctexto): solo la primera frase, sin la ayuda anidada. */
    var t = l.classList.contains('vf__ctexto')
      ? ((l.childNodes[0] && l.childNodes[0].nodeValue) || l.textContent)
      : l.textContent;
    return t.replace(/\(opcional\)/i, '').trim().replace(/\s+/g, ' ');
  }

  /* Un campo es válido si: no es requerido, o cumple su regla según tipo */
  function validarCampo(campo) {
    var req = campo.hasAttribute('data-req');
    var grupo = campo.getAttribute('data-grupo');
    var ok = true;

    if (grupo === 'radio' || grupo === 'check') {
      var marcados = campo.querySelectorAll('input:checked');
      ok = !req || marcados.length > 0;
    } else if (grupo === 'uno') {
      var uno = campo.querySelector('input[type=checkbox]');
      ok = !req || (uno && uno.checked);
    } else {
      var c = control(campo);
      if (!c) return true;
      var v = (c.value || '').trim();
      if (req && !v) ok = false;
      else if (v && c.type === 'email') ok = reEmail.test(v);
      else if (v && c.type === 'tel') ok = reTel.test(v);
    }

    campo.classList.toggle('is-invalid', !ok);
    var c2 = control(campo);
    if (c2) {
      c2.setAttribute('aria-invalid', ok ? 'false' : 'true');
      var eb = errBox(campo);
      if (eb && eb.id) {
        var descrito = (c2.getAttribute('aria-describedby') || '')
          .split(/\s+/).filter(function (x) { return x && x !== eb.id; });
        if (!ok) descrito.push(eb.id);
        c2.setAttribute('aria-describedby', descrito.join(' ').trim());
      }
    }
    return ok;
  }

  function anclaDe(campo) {
    var c = control(campo);
    return c && c.id ? c.id : null;
  }

  function initForm(form, resumen, acuse) {
    var campos = Array.prototype.slice.call(form.querySelectorAll('.vf__campo'));

    /* Validación al salir del campo · solo si ya se tocó algo */
    campos.forEach(function (campo) {
      campo.addEventListener('blur', function (e) {
        if (e.target.matches('input, textarea, select')) validarCampo(campo);
      }, true);
      /* limpiar el error en cuanto el usuario corrige */
      campo.addEventListener('input', function () {
        if (campo.classList.contains('is-invalid')) validarCampo(campo);
      });
      campo.addEventListener('change', function () {
        if (campo.classList.contains('is-invalid')) validarCampo(campo);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Honeypot: si el bot rellenó el cebo, simulamos éxito sin hacer nada */
      var hp = form.querySelector('.vf__hp input');
      if (hp && hp.value) { mostrarAcuse(form, acuse); return; }

      var fallidos = campos.filter(function (c) { return !validarCampo(c); });

      if (fallidos.length) {
        /* Construir resumen con enlaces a cada campo */
        var ul = resumen.querySelector('ul');
        ul.innerHTML = '';
        fallidos.forEach(function (campo) {
          var li = document.createElement('li');
          var ancla = anclaDe(campo);
          var txt = label(campo);
          if (ancla) {
            var a = document.createElement('a');
            a.href = '#' + ancla;
            a.textContent = txt;
            a.addEventListener('click', function (ev) {
              ev.preventDefault();
              var dest = document.getElementById(ancla);
              if (dest) { dest.focus(); dest.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }
            });
            li.appendChild(a);
          } else {
            li.textContent = txt;
          }
          ul.appendChild(li);
        });
        resumen.classList.add('is-visible');
        resumen.focus();
        return;
      }

      resumen.classList.remove('is-visible');
      mostrarAcuse(form, acuse);
    });
  }

  function mostrarAcuse(form, acuse) {
    form.style.display = 'none';
    acuse.classList.add('is-visible');
    /* WCAG 4.1.3: mover el foco al encabezado del acuse */
    acuse.focus();
    acuse.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  }

  initForm(document.getElementById('formA'), document.getElementById('resumenA'), document.getElementById('acuseA'));
  initForm(document.getElementById('formB'), document.getElementById('resumenB'), document.getElementById('acuseB'));
})();
