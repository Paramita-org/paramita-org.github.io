/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   js/componentes/paramita-tema.js — Listener del toggle penumbra/luz
   ───────────────────────────────────────────────────────────────────────────
   Extraído del <script> inline de index.html para que la penumbra sea una
   preferencia GLOBAL: el mismo listener sirve a cualquier página que incluya
   el botón #temaToggle del navbar-publico.html.

   PIEZAS QUE NECESITA CADA PÁGINA (además de este archivo):
     1 · <head> · script anti-FOUC · aplica data-tema ANTES de pintar:
           <script>
             try { if (localStorage.getItem('paramita-tema') === 'oscuro')
               document.documentElement.setAttribute('data-tema','oscuro'); } catch(e){}
           </script>
     2 · <head> · el <link> a paramita-tema.css, cargado EL ÚLTIMO para ganar.
     3 · <body> · el botón #temaToggle (viene ya en partials/navbar-publico.html).
     4 · este archivo, cargado con defer:
           <script src="js/componentes/paramita-tema.js" defer></script>

   NOTA · opt-in puro: sin preferencia guardada, la página arranca en luz.
   La clase .tema-anim se añade SOLO tras el primer clic, para que la
   transición no dispare en la carga inicial (evita el "flash" de animación).
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  var root = document.documentElement;
  var btn  = document.getElementById('temaToggle');
  if (!btn) return;

  function sync() {
    var oscuro = root.getAttribute('data-tema') === 'oscuro';
    btn.setAttribute('aria-pressed', oscuro ? 'true' : 'false');
    btn.setAttribute('title', oscuro ? 'Luz' : 'Penumbra');
  }

  btn.addEventListener('click', function () {
    root.classList.add('tema-anim'); // activa la transición solo tras interacción
    var oscuro = root.getAttribute('data-tema') === 'oscuro';
    if (oscuro) { root.removeAttribute('data-tema'); try { localStorage.setItem('paramita-tema', 'claro'); } catch (e) {} }
    else        { root.setAttribute('data-tema', 'oscuro'); try { localStorage.setItem('paramita-tema', 'oscuro'); } catch (e) {} }
    sync();
  });

  sync();
})();
