/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-menu.js — Acordeón de submenús del navbar en móvil
   ───────────────────────────────────────────────────────────────────────────
   QUÉ HACE
   ────────
   En móvil (≤980px) los submenús «Sobre» y «Únete» arrancan COLAPSADOS
   (ver paramita-responsive.css). Este módulo conmuta el atributo
   `aria-expanded` del <button> padre al tocarlo, que es lo que dispara en
   CSS la apertura del `.sub` y la rotación del caret.

     · Táctil: el tap sobre el padre abre/cierra su submenú.
     · Acordeón: al abrir uno se cierra el otro (el menú no se dispara a lo
       alto y Contribuir + el clúster derecho siguen a la vista).
     · Al cerrar el hamburguesa, todo vuelve a colapsado (reabrir empieza
       limpio, no con «Sobre» ya desplegado).
     · En escritorio NO interviene: ahí manda el :hover/:focus-within de
       paramita-menu.css. Al ensanchar desde móvil se resetea aria-expanded
       para no dejar carets encallados.

   POR QUÉ CON JS Y NO CSS PURO
   ────────────────────────────
   El padre es un <button> (no puede sostener :checked) y :focus-within no
   es fiable en táctil para botones. `aria-expanded` conmutado por click es
   el mecanismo robusto y además correcto para lectores de pantalla — es la
   «deuda menor» que anticipaba el doc 06-navbar.

   DEPENDENCIAS
   ────────────
   Ninguna. Vanilla JS. Cargar con defer (los nodos ya existen al ejecutar).

   MARCADO ESPERADO (navbar-publico / navbar-practicante)
   ──────────────────────────────────────────────────────
   <li class="has-sub end">
     <button class="navlink" aria-haspopup="true" aria-expanded="false">…</button>
     <ul class="sub">…</ul>
   </li>
   <input class="nt" id="nt" type="checkbox" hidden>   ← toggle del hamburguesa
   ═══════════════════════════════════════════════════════════════════════════ */

(() => {
  const mq = matchMedia('(max-width: 980px)');

  // Solo los padres de submenú del menú principal.
  // `.navlink` excluye el .cuenta__btn del navbar practicante, que tiene su
  // propio panel y no debe verse afectado por este acordeón.
  const padres = Array.from(
    document.querySelectorAll('.has-sub > .navlink[aria-haspopup="true"]')
  );
  if (!padres.length) return;

  // Conmuta el estado de UN submenú: aria-expanded en el botón (para el
  // caret + accesibilidad) Y la clase .is-open en el propio .sub (lo que
  // realmente lo abre en CSS — mecanismo validado en WebKit/iOS: clase
  // directa en el elemento, no combinador hermano ni selector de atributo).
  const abrir = (btn, on) => {
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    const sub = btn.nextElementSibling;          // el <ul class="sub"> hermano
    if (sub) sub.classList.toggle('is-open', on);
  };
  const cerrarTodos = (excepto) => padres.forEach(b => { if (b !== excepto) abrir(b, false); });

  padres.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (!mq.matches) return;            // en escritorio manda el hover; no tocar
      e.preventDefault();                 // el <button> no navega
      const estaba = btn.getAttribute('aria-expanded') === 'true';
      cerrarTodos(btn);                   // acordeón: uno abierto a la vez
      abrir(btn, !estaba);
    });
  });

  // Al cerrar el hamburguesa, colapsa los submenús (reabrir empieza limpio).
  const nt = document.getElementById('nt');
  if (nt) nt.addEventListener('change', () => { if (!nt.checked) cerrarTodos(null); });

  // Al pasar de móvil a escritorio, resetea para no dejar carets rotados.
  mq.addEventListener('change', () => { if (!mq.matches) cerrarTodos(null); });
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-menu.js
   ═══════════════════════════════════════════════════════════════════════════ */
