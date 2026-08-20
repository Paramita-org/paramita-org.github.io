/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   js/paginas/paramita-inscripcion.js — Checkout de una página (matrícula)
   ───────────────────────────────────────────────────────────────────────────
   IIFE. Sin dependencias. Diseño del FLUJO; el pago real y el alta de cuenta
   los conecta el backend (Alberto) en los puntos marcados con TODO.

   Qué hace:
     · Lee ?plan=interactivo|autoestudio (por defecto: interactivo).
     · Pinta el resumen del ítem (nombre, modalidad, qué incluye, precio).
     · «Cambiar modalidad» alterna entre las dos sin salir de la página.
     · «Soy Amigo/a» aplica el descuento (hasta 50%) SIN traer el dāna a la caja.
     · Al enviar: validación mínima → estado .is-done (confirmación + alta de clave).

   NO hay carrito, ni estado global, ni acumulación de ítems. Un ítem, una decisión.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var page = document.querySelector('.co-page');
  if (!page) return;

  /* Datos del curso · en producción vienen del backend/CMS por slug.
     Aquí, EMI 1 con sus dos modalidades reales (72 € / 120 €). */
  var CURSO = {
    slug: 'emi-1-calma-y-lucidez',
    titulo: 'EMI 1 · Calma y Lucidez',
    volver: '/formacion/emi-1-calma-y-lucidez/',
    planes: {
      interactivo: {
        nombre: 'Interactivo con tutor',
        tag: 'plazas limitadas',
        precio: 120,
        incluye: [
          'Dos encuentros en directo con Ven. Khenpo Rinchen',
          'Ritmo semanal con el grupo · 8 sesiones de tutoría',
          'Acceso completo al material, para siempre'
        ]
      },
      autoestudio: {
        nombre: 'Autoestudio autónomo',
        tag: 'a tu ritmo',
        precio: 72,
        incluye: [
          'Una lección nueva cada semana, cuando quieras',
          'Vídeos, audios, transcripciones y cuadernos',
          'Acceso completo al material, para siempre'
        ]
      }
    }
  };

  var DESC_AMIGO = 0.5; /* hasta 50% · el tramo real lo fija la membresía */

  var eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

  /* Estado local mínimo */
  var state = {
    plan: leerPlan(),
    amigo: false
  };

  function leerPlan() {
    var p = new URLSearchParams(location.search).get('plan');
    return (p === 'autoestudio') ? 'autoestudio' : 'interactivo';
  }

  /* Nodos */
  var $ = function (s) { return page.querySelector(s); };
  var elVolver   = $('[data-volver]');
  var elCurso    = $('[data-curso]');
  var elModNom   = $('[data-mod-nombre]');
  var elModTag   = $('[data-mod-tag]');
  var elIncluye  = $('[data-incluye]');
  var elBase     = $('[data-linea-base]');
  var elDescRow  = $('[data-linea-desc]');
  var elDescNum  = $('[data-desc-num]');
  var elTotal    = $('[data-total]');
  var elAmigo    = $('#coAmigo');
  var form       = $('#coForm');

  if (elVolver) elVolver.setAttribute('href', CURSO.volver);
  if (elCurso)  elCurso.textContent = CURSO.titulo;

  function plan() { return CURSO.planes[state.plan]; }

  function pintarResumen() {
    var p = plan();
    if (elModNom) elModNom.textContent = p.nombre;
    if (elModTag) elModTag.textContent = p.tag;

    if (elIncluye) {
      elIncluye.innerHTML = '';
      p.incluye.forEach(function (t) {
        var li = document.createElement('li');
        li.textContent = t;
        elIncluye.appendChild(li);
      });
    }
    calcular();
  }

  function calcular() {
    var base = plan().precio;
    var desc = state.amigo ? base * DESC_AMIGO : 0;
    var total = base - desc;

    if (elBase) elBase.textContent = eur.format(base);
    if (elDescRow) {
      if (desc > 0) {
        elDescRow.hidden = false;
        if (elDescNum) elDescNum.textContent = '−' + eur.format(desc);
      } else {
        elDescRow.hidden = true;
      }
    }
    if (elTotal) elTotal.innerHTML = eur.format(total);
  }

  /* Cambiar modalidad · alterna sin salir de la página (ya decidió; esto es un ajuste) */
  var elCambiar = $('[data-cambiar]');
  if (elCambiar) {
    elCambiar.addEventListener('click', function () {
      state.plan = (state.plan === 'interactivo') ? 'autoestudio' : 'interactivo';
      pintarResumen();
    });
  }

  /* Amigo/a · recalcula */
  if (elAmigo) {
    elAmigo.addEventListener('change', function () {
      state.amigo = elAmigo.checked;
      calcular();
    });
  }

  /* Envío · aquí el backend cobraría y crearía la matrícula. En el diseño del
     flujo, pasamos al estado de confirmación donde nace la cuenta (la llave del aula). */
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      /* TODO(Alberto): cobrar con el proveedor real (Redsys/Stripe), crear la
         matrícula, y solo entonces revelar la confirmación. Emitir factura de
         servicio (NO recibo de donativo: son carriles distintos). */
      page.classList.add('is-done');
      var okMail = page.querySelector('[data-ok-mail]');
      var mail = form.querySelector('#coEmail');
      if (okMail && mail) okMail.textContent = mail.value || 'tu correo';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var h = page.querySelector('.co-ok h1');
      if (h) h.setAttribute('tabindex', '-1'), h.focus({ preventScroll: true });
    });
  }

  /* Alta de clave en la confirmación · destino real: el aula */
  var passForm = $('#coPassForm');
  if (passForm) {
    passForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!passForm.reportValidity()) return;
      /* TODO(Alberto): crear la cuenta con email + clave y redirigir al aula
         (mismo dominio o SSO a cursos.paramita.org, según decisión de arquitectura). */
      location.href = CURSO.volver; /* provisional: vuelve al curso */
    });
  }

  pintarResumen();
})();
