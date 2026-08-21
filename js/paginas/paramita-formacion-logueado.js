/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-formacion-logueado.js — Página /formacion-logueado/
   ─────────────────────────────────────────────────────────────────────────────
   QUÉ HACE
   ────────
   Único comportamiento propio de esta página: el toggle del bloque «Explorar»
   entre las vistas «Mis cursos» y «Explorar todo». Todo lo demás (barra sticky,
   footer, chat) lo aportan los componentes del sistema ya enlazados.

   NO se enlaza paramita-formacion.js aquí: la maquinaria de filtrado del
   catálogo público (frase-intención, puertas, pill, estado vacío) no aplica a
   esta página. El catálogo completo con filtros vive en /formacion/.

   MARCADO ESPERADO
   ────────────────
   <div class="vista-toggle">
     <button data-vista="mis"   aria-pressed="true"  aria-controls="vista-mis">…</button>
     <button data-vista="todos" aria-pressed="false" aria-controls="vista-todos">…</button>
   </div>
   <div class="vista-panel is-active" id="vista-mis">…</div>
   <div class="vista-panel"           id="vista-todos" hidden>…</div>

   DEPENDENCIAS · ninguna. Vanilla JS.
   ═══════════════════════════════════════════════════════════════════════════ */

(() => {
  const toggle = document.querySelector('.vista-toggle');
  if (!toggle) return;

  const botones = [...toggle.querySelectorAll('button[data-vista]')];
  const paneles = {
    mis:   document.getElementById('vista-mis'),
    todos: document.getElementById('vista-todos'),
  };
  if (!paneles.mis || !paneles.todos) return;

  const activar = (vista) => {
    botones.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vista === vista)));
    Object.entries(paneles).forEach(([clave, panel]) => {
      const activo = clave === vista;
      panel.classList.toggle('is-active', activo);
      panel.toggleAttribute('hidden', !activo);
    });
  };

  botones.forEach((b) => {
    b.addEventListener('click', () => activar(b.dataset.vista));
  });
})();

/* ─────────────────────────────────────────────────────────────────────────
   RAIL «Para ti» · afordancia de scroll horizontal
   Flechas prev/next (puntero fino) + estado de bordes para la máscara.
   No secuestra el scroll: solo mueve el rail cuando el usuario pulsa.
   ───────────────────────────────────────────────────────────────────────── */
(() => {
  const wrap = document.querySelector('.recomendados__rail');
  if (!wrap) return;
  const rail = wrap.querySelector('.empieza__rail');
  if (!rail) return;
  const prev = wrap.querySelector('.rail-flecha--prev');
  const next = wrap.querySelector('.rail-flecha--next');

  const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Un «paso» = ancho de una carta + gap. Fallback: 80% del viewport del rail.
  const paso = () => {
    const carta = rail.querySelector('.curso');
    const estilos = getComputedStyle(rail);
    const gap = parseFloat(estilos.columnGap || estilos.gap) || 24;
    return carta ? carta.getBoundingClientRect().width + gap : rail.clientWidth * 0.8;
  };

  const desplazar = (dir) => {
    rail.scrollBy({ left: dir * paso(), behavior: sinMovimiento ? 'auto' : 'smooth' });
  };

  const actualizarBordes = () => {
    const max = rail.scrollWidth - rail.clientWidth;
    if (max <= 1) { wrap.dataset.borde = 'none'; return; }
    const x = rail.scrollLeft;
    wrap.dataset.borde = x <= 1 ? 'inicio' : (x >= max - 1 ? 'fin' : 'medio');
  };

  prev && prev.addEventListener('click', () => desplazar(-1));
  next && next.addEventListener('click', () => desplazar(1));
  rail.addEventListener('scroll', actualizarBordes, { passive: true });
  window.addEventListener('resize', actualizarBordes);
  actualizarBordes();
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-formacion-logueado.js
   ═══════════════════════════════════════════════════════════════════════════ */
