/* ═══════════════════════════════════════════════════════════════════════
   paramita-meditacion.js
   Comportamiento específico de /meditacion/meditacion.html
   ───────────────────────────────────────────────────────────────────────
   1 · Revela la primera práctica al pulsar el primario del hero.
       (La CSS la oculta SOLO si <html class="js">; sin JS se ve entera.)
   2 · Sincroniza la etiqueta de respiración con el orbe (inhala/sostén/exhala).
   Respeta prefers-reduced-motion en ambos.
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* 1 · Revelar la práctica ------------------------------------------------ */
  var cta = document.getElementById("cta-practica");
  var practica = document.getElementById("practica");

  if (cta && practica) {
    cta.addEventListener("click", function () {
      practica.classList.add("is-open");
      practica.scrollIntoView({
        behavior: reduce.matches ? "auto" : "smooth",
        block: "start"
      });
      // Foco al título de la práctica para lectores de pantalla
      var titulo = document.getElementById("practica-titulo");
      if (titulo) {
        titulo.setAttribute("tabindex", "-1");
        titulo.focus({ preventScroll: true });
      }
    });
  }

  /* 2 · Etiqueta de respiración · SINCRONIZADA con el orbe -----------------
     El orbe es el guía visual y su animación CSS (med-respira, 11s) es el
     reloj maestro. Antes la etiqueta corría con su propio setTimeout desde la
     carga de la página, mientras el orbe solo arranca al revelar la práctica
     → empezaban desfasados y las palabras no cuadraban con el tamaño. Ahora la
     etiqueta se engancha a los eventos de la animación: arranca con
     animationstart y se re-sincroniza en cada animationiteration, así nunca
     deriva. Fases casadas con el keyframe: Inhala 0% · Sostén 36% (~3.96s) ·
     Exhala 54% (~5.94s). */
  var label = document.getElementById("respira-label");
  var orbe  = document.querySelector(".orbe");

  if (label) {
    if (reduce.matches) {
      label.textContent = "Inhala 4 · sostén 2 · exhala 5";
    } else if (orbe) {
      var tSosten, tExhala;
      var ciclo = function (e) {
        if (e && e.animationName && e.animationName !== "med-respira") return;
        window.clearTimeout(tSosten);
        window.clearTimeout(tExhala);
        label.textContent = "Inhala…";
        tSosten = window.setTimeout(function () { label.textContent = "Sostén";  }, 3960); // 36% de 11s
        tExhala = window.setTimeout(function () { label.textContent = "Exhala…"; }, 5940); // 54% de 11s
      };
      orbe.addEventListener("animationstart", ciclo);
      orbe.addEventListener("animationiteration", ciclo);
    } else {
      label.textContent = "Respira con el círculo";
    }
  }

  /* 3 · Horarios internacionales -------------------------------------------
     La hora canónica de cada sesión vive en el HTML (data-hora + data-tz =
     Europe/Madrid). Aquí calculamos en vivo la equivalencia en la zona del
     visitante y en varias zonas de Latinoamérica con Intl, para que el DST
     sea SIEMPRE correcto (España cambia de hora; casi toda LatAm ya no, y
     Chile lo hace en sentido contrario). Sin Intl, se queda la hora de
     España que ya está escrita en el HTML. */
  var sesiones = document.querySelectorAll(".sesion[data-tz]");

  if (sesiones.length && typeof Intl !== "undefined" && Intl.DateTimeFormat) {

    var ZONAS = [
      { label: "México",        tz: "America/Mexico_City" },
      { label: "Bogotá · Lima", tz: "America/Bogota" },
      { label: "Santiago",      tz: "America/Santiago" },
      { label: "Buenos Aires",  tz: "America/Argentina/Buenos_Aires" }
    ];

    var localTz = null;
    try { localTz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}

    /* Desfase (ms) de una zona respecto a UTC en un instante dado */
    var offsetMs = function (tz, date) {
      var dtf = new Intl.DateTimeFormat("en-US", {
        timeZone: tz, hour12: false,
        year: "numeric", month: "numeric", day: "numeric",
        hour: "numeric", minute: "numeric", second: "numeric"
      });
      var p = {};
      dtf.formatToParts(date).forEach(function (x) { if (x.type !== "literal") p[x.type] = x.value; });
      var hh = p.hour === "24" ? "0" : p.hour;
      var asUTC = Date.UTC(+p.year, p.month - 1, +p.day, +hh, +p.minute, +p.second);
      return asUTC - date.getTime();
    };

    /* Formatea un instante como HH:MM en una zona */
    var horaEn = function (instant, tz) {
      return new Intl.DateTimeFormat("es-ES", {
        timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false
      }).format(instant);
    };

    /* Instante UTC correspondiente a HH:MM de HOY en la zona de origen */
    var instanteDesde = function (horaStr, tzOrigen) {
      var t = horaStr.split(":");
      var partesHoy = new Intl.DateTimeFormat("en-US", {
        timeZone: tzOrigen, year: "numeric", month: "numeric", day: "numeric"
      }).formatToParts(new Date());
      var f = {};
      partesHoy.forEach(function (x) { if (x.type !== "literal") f[x.type] = x.value; });
      var guess = Date.UTC(+f.year, f.month - 1, +f.day, +t[0], +t[1], 0);
      return new Date(guess - offsetMs(tzOrigen, new Date(guess)));
    };

    Array.prototype.forEach.call(sesiones, function (sesion) {
      var horaStr  = sesion.getAttribute("data-hora");
      var tzOrigen = sesion.getAttribute("data-tz") || "Europe/Madrid";
      var esIntl   = sesion.getAttribute("data-intl") === "1";
      var instant;
      try { instant = instanteDesde(horaStr, tzOrigen); } catch (e) { return; }

      var horaEspana = horaEn(instant, tzOrigen);

      /* "En tu zona" · solo si difiere de la hora de España */
      var localEl = sesion.querySelector("[data-local]");
      if (localEl && localTz) {
        try {
          var horaLocal = horaEn(instant, localTz);
          if (horaLocal !== horaEspana) {
            localEl.innerHTML = '<span class="lbl">En tu zona</span><span class="val">' + horaLocal + " h</span>";
            localEl.hidden = false;
          }
        } catch (e) {}
      }

      /* Fila de husos internacionales · solo en sesiones marcadas */
      if (esIntl) {
        var husosEl = sesion.querySelector("[data-husos]");
        if (husosEl) {
          var html = "";
          ZONAS.forEach(function (z) {
            try {
              html += '<li class="huso"><span class="huso__lbl">' + z.label +
                      '</span><span class="huso__val">' + horaEn(instant, z.tz) + "</span></li>";
            } catch (e) {}
          });
          if (html) {
            husosEl.innerHTML = html;
            var wrap = sesion.querySelector(".sesion__intl");
            if (wrap) wrap.hidden = false;   // desvela el bloque "En el mundo"
          }
        }
      }
    });
  }
})();
