/* ═══════════════════════════════════════════════════════════════════════
   paramita-chat.js
   Widget de chat global · árbol de decisión para orientar al usuario
   
   Contenido:
   · 3 preguntas predefinidas con respuestas rápidas (quick replies)
   · Mapa de combinaciones → recomendación de 1-2 cursos
   · Invitación automática tras 4 segundos (una vez por sesión)
   · Puede ser lanzado externamente pulsando el elemento con id="ctaAbrirChat"
   
   Las recomendaciones son datos hardcodeados en esta muestra.
   En producción deberían provenir del CMS o de una API de cursos.
   ═══════════════════════════════════════════════════════════════════════ */

(function() {
'use strict';

const widget           = document.getElementById('chatWidget');
const toggle           = document.getElementById('chatToggle');
const ventana          = document.getElementById('chatVentana');
const mensajesEl       = document.getElementById('chatMensajes');
const reiniciar        = document.getElementById('chatReiniciar');
const invitacion       = document.getElementById('chatInvitacion');
const invitacionCerrar = document.getElementById('chatInvitacionCerrar');
const ctaAbrirChat     = document.getElementById('ctaAbrirChat');

if (!widget || !toggle) return;

/* ─── Árbol de decisión ────────────────────────────────────────────── */
const preguntas = [
  {
    bot: '¡Hola! Bienvenido al sendero de Paramita. Para ayudarte a encontrar el curso adecuado, ¿cómo describirías tu experiencia con la meditación?',
    opciones: [
      { texto: 'Estoy empezando desde cero',       valor: 'inicio' },
      { texto: 'Practico de forma regular',        valor: 'medio' },
      { texto: 'Tengo formación budista previa',   valor: 'avanzado' },
    ],
    clave: 'experiencia'
  },
  {
    bot: 'Bien. ¿Qué tipo de camino te llama más ahora mismo?',
    opciones: [
      { texto: 'Aprender lo esencial sin compromiso',  valor: 'ligero' },
      { texto: 'Un estudio profundo y guiado',         valor: 'profundo' },
      { texto: 'Retirarme unos días de forma intensa', valor: 'retiro' },
    ],
    clave: 'intensidad'
  },
  {
    bot: 'Última pregunta. ¿Cómo prefieres estudiar?',
    opciones: [
      { texto: 'A mi ritmo, cuando pueda',           valor: 'auto' },
      { texto: 'Clases en vivo, con acompañamiento', valor: 'vivo' },
      { texto: 'Presencial, en Alicante',            valor: 'presencial' },
    ],
    clave: 'modalidad'
  },
];

/* ─── Recomendaciones · combinación experiencia-intensidad-modalidad ── */
const recomendaciones = {
  _default: [
    { nivel:'I', titulo:'Introducción a la <em>meditación</em>', meta:'4 lecciones · autodirigido', aportacion:'GRATUITO' },
    { nivel:'I', titulo:'Las <em>Cuatro Nobles</em> Verdades',   meta:'3 lecciones · autodirigido', aportacion:'GRATUITO' },
  ],
  'inicio-ligero-auto': [
    { nivel:'I', titulo:'Introducción a la <em>meditación</em>', meta:'4 lecciones · autodirigido', aportacion:'GRATUITO' },
    { nivel:'I', titulo:'La vida del <em>Buddha</em>',           meta:'6 lecciones · autodirigido', aportacion:'GRATUITO' },
  ],
  'inicio-ligero-vivo': [
    { nivel:'I', titulo:'Perlas de <em>sabiduría</em> · parte 5', meta:'2 mayo 2026 · online en vivo', aportacion:'GRATUITO' },
    { nivel:'I', titulo:'Introducción al <em>Lojong</em>',        meta:'15 abr 2026 · online en vivo', aportacion:'GRATUITO' },
  ],
  'inicio-profundo-vivo': [
    { nivel:'I', titulo:'EMI 1 · <em>Calma</em> y lucidez',       meta:'3 meses · online en vivo', aportacion:'120 €' },
    { nivel:'I', titulo:'EMI 2 · <em>Compasión</em> en acción',   meta:'3 meses · online en vivo', aportacion:'120 €' },
  ],
  'inicio-profundo-auto': [
    { nivel:'I', titulo:'Las <em>Cuatro Nobles</em> Verdades',    meta:'3 lecciones · autodirigido', aportacion:'GRATUITO' },
    { nivel:'I', titulo:'EMI 1 · <em>Calma</em> y lucidez',       meta:'3 meses · online en vivo',   aportacion:'120 €' },
  ],
  'inicio-retiro-presencial': [
    { nivel:'I', titulo:'Retiro de <em>iniciación</em> a la práctica', meta:'9–12 oct 2026 · Alicante', aportacion:'280 €' },
  ],
  'medio-ligero-auto': [
    { nivel:'II', titulo:'Las <em>37 prácticas</em> del bodhisattva', meta:'8 lecciones · autodirigido', aportacion:'GRATUITO' },
    { nivel:'II', titulo:'La Rueda de las <em>Armas</em> Afiladas',   meta:'27 jun 2026 · online en vivo', aportacion:'GRATUITO' },
  ],
  'medio-ligero-vivo': [
    { nivel:'II', titulo:'La Rueda de las <em>Armas</em> Afiladas',   meta:'27 jun 2026 · online en vivo', aportacion:'GRATUITO' },
    { nivel:'II', titulo:'El <em>Sutra</em> del Corazón',             meta:'6 lecciones · online en vivo', aportacion:'180 €' },
  ],
  'medio-profundo-vivo': [
    { nivel:'II', titulo:'El Camino del <em>Bodhisattva</em> · parte 1', meta:'6 meses · online en vivo', aportacion:'240 €' },
    { nivel:'II', titulo:'Entrenamiento mental en <em>7 puntos</em>',    meta:'4 meses · online en vivo', aportacion:'200 €' },
  ],
  'medio-profundo-auto': [
    { nivel:'II', titulo:'Las <em>37 prácticas</em> del bodhisattva',    meta:'8 lecciones · autodirigido', aportacion:'GRATUITO' },
    { nivel:'II', titulo:'El Camino del <em>Bodhisattva</em> · parte 1', meta:'6 meses · online en vivo',   aportacion:'240 €' },
  ],
  'medio-retiro-presencial': [
    { nivel:'II', titulo:'Retiro sobre las <em>paramitas</em>',       meta:'18–22 nov 2026 · Alicante', aportacion:'320 €' },
  ],
  'avanzado-ligero-auto': [
    { nivel:'III', titulo:'Introducción al <em>Abhidharma</em>',      meta:'5 lecciones · autodirigido', aportacion:'GRATUITO' },
    { nivel:'III', titulo:'Los siete puntos <em>vajra</em>',          meta:'8 sesiones · online en vivo', aportacion:'220 €' },
  ],
  'avanzado-profundo-vivo': [
    { nivel:'III', titulo:'Programa <em>Dharma Chakra</em>',          meta:'5 años · online en vivo', aportacion:'1.200 €/año' },
    { nivel:'III', titulo:'Las <em>Tres Visiones</em>',                meta:'8 meses · online en vivo', aportacion:'380 €' },
  ],
  'avanzado-profundo-auto': [
    { nivel:'III', titulo:'Introducción al <em>Madhyamaka</em>',      meta:'10 meses · online en vivo', aportacion:'420 €' },
    { nivel:'III', titulo:'Los <em>tres códigos</em> · ética budista',meta:'7 meses · online en vivo',  aportacion:'380 €' },
  ],
  'avanzado-retiro-presencial': [
    { nivel:'IV', titulo:'Retiro de <em>Chenrezig</em>',              meta:'7 días · Alicante', aportacion:'450 €' },
    { nivel:'V', titulo:'Retiro de <em>Vajrayogini</em>',             meta:'10 días · Alicante', aportacion:'720 €' },
  ],
  'avanzado-retiro-vivo': [
    { nivel:'IV', titulo:'Introducción al <em>Vajrayana</em>',        meta:'1 año · híbrido', aportacion:'680 €' },
  ],
};

/* ─── Estado ───────────────────────────────────────────────────────── */
const respuestas = {};
let pasoActual = 0;

function scrollDown() {
  requestAnimationFrame(() => {
    if (mensajesEl) mensajesEl.scrollTop = mensajesEl.scrollHeight;
  });
}

function anadirMensajeBot(texto, delay = 400) {
  return new Promise(resolve => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'chat-msg chat-msg--bot';
      el.innerHTML = `<div class="chat-msg__burbuja">${texto}</div>`;
      mensajesEl.appendChild(el);
      scrollDown();
      resolve();
    }, delay);
  });
}

function anadirMensajeUser(texto) {
  const el = document.createElement('div');
  el.className = 'chat-msg chat-msg--user';
  el.innerHTML = `<div class="chat-msg__burbuja">${texto}</div>`;
  mensajesEl.appendChild(el);
  scrollDown();
}

function anadirOpciones(opciones, onSelect) {
  const el = document.createElement('div');
  el.className = 'chat-opciones';
  opciones.forEach(op => {
    const btn = document.createElement('button');
    btn.className = 'chat-opcion';
    btn.textContent = op.texto;
    btn.addEventListener('click', () => {
      anadirMensajeUser(op.texto);
      el.remove();
      onSelect(op.valor);
    });
    el.appendChild(btn);
  });
  mensajesEl.appendChild(el);
  scrollDown();
}

function anadirRecomendaciones(cursos) {
  cursos.forEach((curso, i) => {
    setTimeout(() => {
      const el = document.createElement('a');
      el.className = 'chat-recomendacion';
      el.href = '#catalogo';
      el.innerHTML = `
        <div class="chat-recomendacion__eyebrow">
          Nivel ${curso.nivel} · <span class="aportacion">${curso.aportacion}</span>
        </div>
        <div class="chat-recomendacion__titulo">${curso.titulo}</div>
        <div class="chat-recomendacion__meta">${curso.meta}</div>
      `;
      el.addEventListener('click', () => {
        setTimeout(() => cerrarChat(), 400);
      });
      mensajesEl.appendChild(el);
      scrollDown();
    }, 400 + i * 300);
  });
}

async function siguientePaso() {
  if (pasoActual >= preguntas.length) {
    const clave = `${respuestas.experiencia}-${respuestas.intensidad}-${respuestas.modalidad}`;
    const cursos = recomendaciones[clave] || recomendaciones._default;

    await anadirMensajeBot(
      cursos.length === 1
        ? 'Basándome en lo que me cuentas, este curso puede ser un buen comienzo:'
        : 'Basándome en lo que me cuentas, te propongo estas opciones:',
      600
    );
    anadirRecomendaciones(cursos);

    setTimeout(() => {
      if (reiniciar) reiniciar.style.display = 'inline-block';
    }, 400 + cursos.length * 300 + 200);
    return;
  }

  const p = preguntas[pasoActual];
  await anadirMensajeBot(p.bot);

  setTimeout(() => {
    anadirOpciones(p.opciones, (valor) => {
      respuestas[p.clave] = valor;
      pasoActual++;
      siguientePaso();
    });
  }, 500);
}

function iniciarConversacion() {
  if (!mensajesEl) return;
  mensajesEl.innerHTML = '';
  Object.keys(respuestas).forEach(k => delete respuestas[k]);
  pasoActual = 0;
  if (reiniciar) reiniciar.style.display = 'none';
  siguientePaso();
}

function abrirChat() {
  widget.classList.add('is-abierto');
  if (invitacion) invitacion.classList.remove('is-visible');
  if (mensajesEl && !mensajesEl.querySelector('.chat-msg')) {
    iniciarConversacion();
  }
}
function cerrarChat() {
  widget.classList.remove('is-abierto');
}

/* ─── Listeners ────────────────────────────────────────────────────── */
toggle.addEventListener('click', () => {
  if (widget.classList.contains('is-abierto')) cerrarChat();
  else abrirChat();
});

if (invitacion) {
  invitacion.addEventListener('click', (e) => {
    if (e.target !== invitacionCerrar) abrirChat();
  });
  invitacion.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrirChat();
    }
  });
}
if (invitacionCerrar) {
  invitacionCerrar.addEventListener('click', (e) => {
    e.stopPropagation();
    if (invitacion) invitacion.classList.remove('is-visible');
  });
}
if (reiniciar) {
  reiniciar.addEventListener('click', iniciarConversacion);
}
if (ctaAbrirChat) {
  ctaAbrirChat.addEventListener('click', abrirChat);
}

// Invitación tras 4 segundos (una sola vez por sesión)
if (!sessionStorage.getItem('paramita-invitacion-vista')) {
  setTimeout(() => {
    if (!widget.classList.contains('is-abierto') && invitacion) {
      invitacion.classList.add('is-visible');
      sessionStorage.setItem('paramita-invitacion-vista', '1');
    }
  }, 4000);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && widget.classList.contains('is-abierto')) {
    cerrarChat();
  }
});

})();
