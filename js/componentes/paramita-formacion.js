/* ═══════════════════════════════════════════════════════════════════════
   paramita-formacion.js
   Interacciones específicas de la página /formacion/
   
   Contiene:
   · Frase-intención con popovers (slots editables + selección de facetas)
   · Filtrado con FLIP animation + luz al seleccionar + focal blur
   · Interacción del mapa de niveles (click en nodo pre-filtra)
   · Puertas del hero (rangos de niveles)
   ═══════════════════════════════════════════════════════════════════════ */

(function() {
'use strict';

/* ─── Referencias DOM ──────────────────────────────────────────────── */
const cuadricula = document.getElementById('cuadricula');
if (!cuadricula) return; // Página sin catálogo, salimos

const cursos    = Array.from(cuadricula.querySelectorAll('.curso'));
const slots     = Array.from(document.querySelectorAll('.slot'));
const limpiar   = document.getElementById('limpiar');
const contador  = document.getElementById('contador');
const nodos     = document.querySelectorAll('.nodo');
const puertas   = document.querySelectorAll('.puerta');

/* ─── Estado ───────────────────────────────────────────────────────── */
const filtros = {
  nivel: null,
  formato: null,
  modalidad: null,
  aportacion: null,
};

const slotDefault = {
  nivel:      'de cualquier nivel',
  formato:    'de cualquier duración',
  modalidad:  'en cualquier modalidad',
  aportacion: 'con cualquier aportación',
};

const slotLabels = {
  nivel: {
    '1': 'de nivel I',
    '2': 'de nivel II',
    '3': 'de nivel III',
    '4': 'de nivel IV',
    '5': 'de nivel V',
  },
  formato: {
    'corto':     'corto',
    'largo':     'largo',
    'intensivo': 'intensivo',
  },
  modalidad: {
    'vivo':       'online en vivo',
    'auto':       'autodirigido',
    'presencial': 'presencial',
  },
  aportacion: {
    'gratuito': 'gratuito',
    'pago':     'de pago',
  },
};

/* ─── Filtrado con secuencia visual (blur → FLIP → luz) ────────────── */
function aplicarFiltros() {
  const posBefore = new Map();
  cursos.forEach(c => {
    if (!c.classList.contains('is-oculto')) {
      posBefore.set(c, c.getBoundingClientRect());
    }
  });

  const pasan = new Set();
  cursos.forEach(c => {
    const ok =
      (!filtros.nivel      || filtros.nivel      === c.dataset.nivel) &&
      (!filtros.formato    || filtros.formato    === c.dataset.formato) &&
      (!filtros.modalidad  || filtros.modalidad  === c.dataset.modalidad) &&
      (!filtros.aportacion || filtros.aportacion === c.dataset.aportacion);
    if (ok) pasan.add(c);
  });

  const salientes = cursos.filter(c =>
    !pasan.has(c) && !c.classList.contains('is-oculto')
  );
  salientes.forEach(c => c.classList.add('is-saliendo'));

  const hayCambio = salientes.length > 0 ||
                    Array.from(pasan).some(c => c.classList.contains('is-oculto'));

  setTimeout(() => {
    cursos.forEach(c => {
      if (pasan.has(c)) c.classList.remove('is-oculto');
      else              c.classList.add('is-oculto');
      c.classList.remove('is-saliendo');
    });

    if (contador) contador.textContent = pasan.size;

    // FLIP: reorganización física
    cursos.forEach(c => {
      if (c.classList.contains('is-oculto')) return;
      const before = posBefore.get(c);
      if (!before) return;
      const after = c.getBoundingClientRect();
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (dx || dy) {
        c.style.transition = 'none';
        c.style.transform = `translate(${dx}px, ${dy}px)`;
        requestAnimationFrame(() => {
          c.style.transition = 'transform 520ms cubic-bezier(0.28, 0.68, 0.28, 1)';
          c.style.transform = '';
        });
      }
    });

    // Luz al seleccionar
    if (hayCambio) {
      setTimeout(() => {
        pasan.forEach(c => {
          c.classList.add('is-iluminando');
          setTimeout(() => c.classList.remove('is-iluminando'), 640);
        });
      }, 60);
    }
  }, salientes.length > 0 ? 180 : 0);

  const hayFiltros = Object.values(filtros).some(v => v);
  if (limpiar) limpiar.classList.toggle('is-visible', hayFiltros);
}

/* ─── Actualizar el texto y estado visual del slot ─────────────────── */
function actualizarSlot(slot, valor) {
  const faceta = slot.dataset.faceta;
  const textoEl = slot.querySelector('.slot__texto');
  const popover = slot.querySelector('.popover');

  if (textoEl) {
    textoEl.textContent = valor
      ? slotLabels[faceta][valor]
      : slotDefault[faceta];
  }

  slot.classList.toggle('is-empty', !valor);
  slot.classList.toggle('is-filled', !!valor);

  if (popover) {
    popover.querySelectorAll('.popover__opcion').forEach(op => {
      op.classList.toggle('is-selected', op.dataset.valor === valor);
    });
  }
}

/* ─── Abrir / cerrar popovers ──────────────────────────────────────── */
function cerrarTodos() {
  slots.forEach(s => s.classList.remove('is-open'));
}

slots.forEach(slot => {
  slot.addEventListener('click', (e) => {
    // Click en la X → quitar filtro
    if (e.target.classList.contains('slot__x') && slot.classList.contains('is-filled')) {
      e.stopPropagation();
      const faceta = slot.dataset.faceta;
      filtros[faceta] = null;
      actualizarSlot(slot, null);
      aplicarFiltros();
      return;
    }
    // Click en opción del popover (o en cualquier hijo suyo)
    const opcion = e.target.closest('.popover__opcion');
    if (opcion && slot.contains(opcion)) {
      e.stopPropagation();
      const faceta = slot.dataset.faceta;
      const valor = opcion.dataset.valor;
      filtros[faceta] = valor;
      actualizarSlot(slot, valor);
      slot.classList.add('is-pulsando');
      setTimeout(() => slot.classList.remove('is-pulsando'), 700);
      aplicarFiltros();
      cerrarTodos();
      return;
    }
    // Toggle popover
    const yaAbierto = slot.classList.contains('is-open');
    cerrarTodos();
    if (!yaAbierto) slot.classList.add('is-open');
  });

  slot.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      slot.click();
    }
  });
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.slot')) cerrarTodos();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarTodos();
});

if (limpiar) {
  limpiar.addEventListener('click', () => {
    Object.keys(filtros).forEach(k => filtros[k] = null);
    slots.forEach(s => actualizarSlot(s, null));
    aplicarFiltros();
  });
}

/* ─── Mapa: click en nodo pre-filtra por ese nivel ─────────────────── */
nodos.forEach(nodo => {
  nodo.addEventListener('click', () => {
    const nivel = nodo.dataset.nivel;
    nodos.forEach(n => n.classList.remove('is-active'));
    nodo.classList.add('is-active');

    filtros.formato = null;
    filtros.modalidad = null;
    filtros.aportacion = null;
    filtros.nivel = nivel;

    slots.forEach(s => {
      if (s.dataset.faceta === 'nivel') actualizarSlot(s, nivel);
      else                              actualizarSlot(s, null);
    });

    aplicarFiltros();
    const catalogo = document.getElementById('catalogo');
    if (catalogo) catalogo.scrollIntoView({ behavior: 'smooth' });
  });
});

/* ─── Puertas del hero: rangos de niveles ──────────────────────────── */
puertas.forEach(puerta => {
  puerta.addEventListener('click', (e) => {
    e.preventDefault();
    const target = puerta.getAttribute('href');
    const map = {
      '#nivel-1': ['1'],
      '#nivel-2': ['2', '3'],
      '#nivel-4': ['4', '5'],
    };
    const nivelesPermitidos = map[target] || null;

    Object.keys(filtros).forEach(k => filtros[k] = null);
    slots.forEach(s => actualizarSlot(s, null));

    if (nivelesPermitidos) {
      cursos.forEach(c => {
        if (nivelesPermitidos.includes(c.dataset.nivel)) {
          c.classList.remove('is-oculto');
        } else {
          c.classList.add('is-oculto');
        }
      });
      const visibles = cursos.filter(c => !c.classList.contains('is-oculto')).length;
      if (contador) contador.textContent = visibles;
      if (limpiar)  limpiar.classList.add('is-visible');
    }

    const catalogo = document.getElementById('catalogo');
    if (catalogo) catalogo.scrollIntoView({ behavior: 'smooth' });
  });
});

})();
