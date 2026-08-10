/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-antesala.js — Camino luminoso de la Antesala del Sendero (home §5)
   ───────────────────────────────────────────────────────────────────────────
   Fase 7 · Fuente única de geometría del camino.

   QUÉ HACE
   ────────
   Gobierna dos cosas del bloque "Antesala del sendero" que ANTES se
   resolvían por separado y se desincronizaban:

     1. La PARADA de cada card — la fracción de arco del path donde éste
        cruza el centro horizontal REAL de cada puerta. Se mide con
        getPointAtLength() contra los rects reales, no con los valores
        22/50/78 calibrados a mano (que ni caían bajo la card ni sobre-
        vivían a cambios de ancho o de fuente).

     2. La BOLA (spotlight) — un <circle> posicionado por JS SOBRE el
        propio path. Al vivir dentro del mismo <svg>, comparte la matriz
        de transformación del trazo (incluido el preserveAspectRatio),
        así que siempre pisa la línea. Deja de usar `offset-path`, que
        resolvía en un espacio distinto y provocaba el desfase.

   POR QUÉ ESTO ARREGLA LOS DOS SÍNTOMAS
   ─────────────────────────────────────
   · "La punta no se detiene donde debe": la parada ya no se adivina; se
     mide el arco cuya x coincide con el centro de la card (búsqueda
     binaria sobre un path monótono en x). Es exacto e independiente del
     ancho de viewport y del padding del .wrap.

   · "La bola no se sincroniza con la zona más marcada": punta y bola
     leen la MISMA fracción y usan el MISMO path. Coinciden por
     construcción, no por casualidad de calibración.

   REPARTO DE RESPONSABILIDADES (CSS vs JS)
   ────────────────────────────────────────
   · JS = geometría: mide las paradas y las publica como --parada-1/2/3
     en .antesala__mapa, y posiciona la bola (cx/cy) frame a frame.
   · CSS = aspecto: el dibujado del tramo (dashoffset con transición
     eased), el atenuado de hermanas, y el look de la bola (r, blur,
     color). El :has() de CSS sigue mapeando el hover al tramo, ahora
     leyendo las paradas medidas (con fallback 22/50/78 si el JS no
     carga → degradación elegante).

   FAMILIAS DE MOVIMIENTO
   ──────────────────────
   · Ambiente-identitario: la bola recorre el camino en bucle (20s).
     Se pausa con --identidad-estado: reposo y con reduced-motion.
   · Invocado por usuario: al hover/focus de una card, la bola se fija
     como PIN nítido en la parada. Esto se respeta incluso en reduced-
     motion / reposo, porque no es motion ambiental sino respuesta al
     gesto (un indicador estático alineado con la punta).

   RENDIMIENTO
   ───────────
   · El bucle rAF sólo corre cuando el mapa está en vista (Intersection
     Observer) — igual criterio que paramita-trazo-divisor.js.
   · Recalcula paradas ante resize y ante cambios de tamaño del mapa
     (ResizeObserver → cubre el reflow por carga de fuentes), con
     scheduling en un único rAF.

   DEPENDENCIAS
   ────────────
   Ninguna. Vanilla SVG + rAF + IntersectionObserver + ResizeObserver.
   No usa GSAP (independencia: si el CDN falla, el camino sigue vivo).

   MARCADO ESPERADO
   ────────────────
   .antesala__mapa
     .antesala__puertas > .antesala__puerta ×3
     .antesala__camino > svg[viewBox] >
        path.cap-4 (path base para medir · todos comparten el mismo `d`)
        circle.spotlight
   ═══════════════════════════════════════════════════════════════════════════ */

(function initAntesala() {
  const mapa = document.querySelector('.antesala__mapa');
  if (!mapa) return;

  const puertas = mapa.querySelector('.antesala__puertas');
  const camino  = mapa.querySelector('.antesala__camino');
  const svg     = camino && camino.querySelector('svg');
  // Cualquiera de las capas base sirve para medir: todas comparten el `d`.
  const path    = camino && camino.querySelector('.cap-4');
  const ball    = camino && camino.querySelector('.spotlight');
  const cards   = puertas ? [...puertas.querySelectorAll('.antesala__puerta')] : [];

  if (!svg || !path || !ball || cards.length !== 3) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Estado geométrico (se rellena en measure) ───────────────────────────
  let len = 0;                 // longitud total de arco (user units)
  let paradas = [0, 0, 0];     // fracción 0..1 por card

  // ── Duración del viaje ambiental (lee --dur-spotlight, "20s") ───────────
  function durMs() {
    const raw = getComputedStyle(mapa).getPropertyValue('--dur-spotlight').trim();
    const s = parseFloat(raw);
    if (!s) return 20000;
    return raw.endsWith('ms') ? s : s * 1000;
  }

  // ── ¿El camino está renderizado? (en móvil ≤860px está display:none) ────
  function caminoVisible() {
    return getComputedStyle(camino).display !== 'none' && svg.getClientRects().length > 0;
  }

  // ── Arco cuya x coincide con targetX (path monótono en x → binaria) ─────
  function arcAtX(targetX) {
    let lo = 0, hi = len;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      (path.getPointAtLength(mid).x < targetX) ? (lo = mid) : (hi = mid);
    }
    return (lo + hi) / 2;
  }

  // ── Medir paradas: fracción de arco bajo el centro real de cada card ────
  function measure() {
    if (!caminoVisible()) { ball.style.opacity = '0'; return; }

    len = path.getTotalLength();
    const svgRect = svg.getBoundingClientRect();
    const vbW = (svg.viewBox && svg.viewBox.baseVal.width) || 1440;

    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect();
      const centreX = r.left + r.width / 2;
      // Screen-x → x en unidades de usuario (preserveAspectRatio="none": lineal en x)
      const userX = (centreX - svgRect.left) / svgRect.width * vbW;
      const f = arcAtX(userX) / len;
      paradas[i] = f;
      mapa.style.setProperty(`--parada-${i + 1}`, (f * 100).toFixed(3));
    });

    // Re-fija la bola si estaba parada en una card, o reposiciona el viaje.
    if (pinnedIndex > -1) placeBall(paradas[pinnedIndex]);
  }

  // ── Colocar la bola en una fracción del path (misma geometría que trazo) ─
  function placeBall(f) {
    const p = path.getPointAtLength(len * f);
    ball.setAttribute('cx', p.x);
    ball.setAttribute('cy', p.y);
  }

  // ── Opacidad ambiental (réplica del antiguo spotlight-fade) ─────────────
  function ambientOpacity(f) {
    if (f < 0.05) return 0;
    if (f < 0.10) return ((f - 0.05) / 0.05) * 0.55;
    if (f < 0.90) return 0.55;
    if (f < 0.95) return (1 - (f - 0.90) / 0.05) * 0.55;
    return 0;
  }

  // ═══ Viaje ambiental ═══════════════════════════════════════════════════
  let rafId = null;
  let startTs = 0;
  let inView = false;
  let pinnedIndex = -1;

  function reposo() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--identidad-estado').trim() === 'reposo';
  }
  function ambientAllowed() {
    return !reduce && !reposo() && inView && pinnedIndex === -1;
  }

  function frame(ts) {
    if (!ambientAllowed()) { rafId = null; return; }
    if (!startTs) startTs = ts;
    const f = ((ts - startTs) / durMs()) % 1;
    placeBall(f);
    ball.style.opacity = String(ambientOpacity(f));
    rafId = requestAnimationFrame(frame);
  }

  function startAmbient() {
    if (rafId || !ambientAllowed()) return;
    startTs = 0;
    ball.classList.remove('is-pinned');
    rafId = requestAnimationFrame(frame);
  }
  function stopAmbient() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  // ═══ Hover / focus → PIN en la parada (respuesta al gesto) ═════════════
  function pin(i) {
    pinnedIndex = i;
    stopAmbient();
    ball.classList.add('is-pinned');
    placeBall(paradas[i]);
    ball.style.opacity = '1';
  }
  function unpin() {
    if (pinnedIndex === -1) return;
    pinnedIndex = -1;
    ball.classList.remove('is-pinned');
    if (ambientAllowed()) startAmbient();
    else ball.style.opacity = '0';
  }

  cards.forEach((card, i) => {
    card.addEventListener('pointerenter', () => pin(i));
    card.addEventListener('pointerleave', unpin);
    card.addEventListener('focus', () => pin(i));
    card.addEventListener('blur', unpin);
  });

  // ═══ Scheduling de medición (resize / reflow por fuentes) ══════════════
  let measureScheduled = false;
  function scheduleMeasure() {
    if (measureScheduled) return;
    measureScheduled = true;
    requestAnimationFrame(() => {
      measureScheduled = false;
      measure();
    });
  }

  // ═══ Gate por visibilidad (perf) ═══════════════════════════════════════
  const io = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    if (inView) startAmbient();
    else { stopAmbient(); ball.style.opacity = '0'; }
  }, { threshold: 0, rootMargin: '15% 0px 15% 0px' });
  io.observe(mapa);

  // Recalcular cuando cambie el tamaño del mapa (incluye swap de fuentes).
  if ('ResizeObserver' in window) {
    new ResizeObserver(scheduleMeasure).observe(mapa);
  }
  addEventListener('resize', scheduleMeasure, { passive: true });

  // Reaccionar al toggle de identidad (--identidad-estado en :root).
  new MutationObserver(() => {
    if (ambientAllowed()) startAmbient();
    else { stopAmbient(); if (pinnedIndex === -1) ball.style.opacity = '0'; }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

  // ── Arranque: medir cuando las fuentes estén listas (posiciones firmes) ─
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }
  measure();
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-antesala.js
   ═══════════════════════════════════════════════════════════════════════════ */
