/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-footer-lotos.js — Flores de loto físicas del footer (§7)
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-13 del bloque §7 embebido en index.html
   (líneas 1251-1377 del original).

   QUÉ HACE
   ────────
   Anima flores de loto (SVG del imagotipo de Paramita) flotando en el
   pre-footer sobre un `<canvas id="physics">`. Cada loto tiene:

   · Velocidad inicial aleatoria (movimiento suave y contemplativo).
   · Rebote elástico contra los bordes del canvas.
   · Repulsión del cursor cuando este se acerca.
   · Impulso al hacer clic/tap (empuje radial desde el punto tocado).
   · Perturbación sinusoidal lenta para evitar trayectorias rectas.
   · Orientación VERTICAL fija (no rotan) — el símbolo pierde lectura
     si se ve boca abajo.

   RIMA VISUAL IDENTITARIA (Fase 5.4)
   ──────────────────────────────────
   La flor de loto ya aparece como divisor entre las secciones de
   cursos y participación (paramita-sections.css `.trazo-divisor`).
   Aquí reaparece flotando en el pre-footer — la despedida rimando
   con la transición interna. Mismo símbolo, misma familia cromática.

   TÉCNICA DE TINTADO
   ──────────────────
   El SVG del loto se carga UNA vez. Cuando está listo, se rasteriza
   en cuatro canvas offscreen (uno por color del sistema) usando
   composición `source-in` para reemplazar todos los píxeles opacos
   por el color destino.

   Por qué canvas offscreen y no `filter: hue-rotate` en CSS:
   · Es más rápido en cada frame (solo `drawImage`, sin recomponer).
   · No depende de que el SVG use `currentColor`.
   · Los cuatro colores del sistema no se pueden lograr con un solo
     hue-rotate desde un color base.

   PALETA
   ──────
   · #1F4E8F  azul-oscuro
   · #ECAC55  dorado
   · #4A9DD1  azul-sutil
   · #EBDEC4  cálido-zen

   FÍSICA
   ──────
   · Velocidad inicial: ±0.6 px/frame por eje
   · Fricción (amortiguación): vx *= 0.99, vy *= 0.99
   · Velocidad mínima: 0.3 (no se paran del todo)
   · Velocidad máxima: 5.0 (no se disparan)
   · Rebote: vx/vy *= -0.8 (pérdida de energía en cada choque)
   · Radio de repulsión del cursor: 140 px
   · Radio de impulso al clic: 170 px con fuerza 7

   CANTIDADES
   ──────────
   · Móvil (≤640px):  10 lotos
   · Escritorio:      16 lotos
   · Radio:           28-54 px  (diámetro 56-108 px)

   Estas cantidades y tamaños se ajustaron en Fase 5.6 respecto a las
   originales (bolas circulares, N=28/16, r=16-42) para compensar la
   mayor ocupación visual del loto y evitar saturación en el footer
   más bajo del nuevo diseño.

   DEGRADACIÓN GRÁCIL
   ──────────────────
   Si el SVG no carga (404, CSP, red bloqueada), `sprites` queda como
   `null` y el `frame()` dibuja círculos de color como fallback
   visual coherente. La página no rompe.

   OPTIMIZACIÓN CON INTERSECTIONOBSERVER
   ─────────────────────────────────────
   El bucle `requestAnimationFrame` SOLO corre cuando el footer está
   en vista. Cuando el usuario está lejos del pie de página, la
   simulación se detiene y libera CPU/GPU. Al volver, se reanuda.

   REDUCED-MOTION
   ──────────────
   Si el usuario tiene `prefers-reduced-motion: reduce`, se dibuja UN
   solo frame estático con los lotos en sus posiciones iniciales
   aleatorias, y no arranca ninguna animación. Sigue siendo bonito y
   coherente, sin movimiento.

   NITIDEZ EN RETINA
   ─────────────────
   Los sprites offscreen se rasterizan a `SPRITE * DPR` px (con DPR
   acotado a 2 para evitar consumo excesivo en pantallas 3x/4x). El
   `ctx.scale(DPR, DPR)` mantiene las coordenadas lógicas en el
   sistema CSS mientras la resolución interna es mayor.

   DEPENDENCIAS
   ────────────
   Ninguna. Vanilla Canvas 2D + requestAnimationFrame + IntersectionObserver.

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <div class="prefooter-zona">
     <canvas id="physics"></canvas>
     <!-- resto del contenido del prefooter -->
   </div>

   ASSETS
   ──────
   · assets/img/flor-loto.svg
   ═══════════════════════════════════════════════════════════════════════════ */

(function initFooterLotos() {
  const cv = document.getElementById('physics');
  if (!cv) return;

  const ctx = cv.getContext('2d');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const zona = cv.parentElement;

  let W, H;
  let lotos = [];
  let mouse = { x: -999, y: -999 };
  let visible = true;
  let raf = 0;

  // Paleta del sistema
  const COL = ['#1F4E8F', '#ECAC55', '#4A9DD1', '#EBDEC4'];

  const resize = () => {
    W = cv.width = zona.clientWidth;
    H = cv.height = zona.clientHeight;
  };
  resize();
  addEventListener('resize', resize, { passive: true });

  // Cantidad y tamaño (ver cabecera para el histórico de ajustes)
  const N = matchMedia('(max-width: 640px)').matches ? 10 : 16;
  for (let i = 0; i < N; i++) {
    lotos.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      r: 28 + Math.random() * 26,   // diámetro 56-108 px
      c: COL[i % COL.length],
      ph: Math.random() * Math.PI * 2
    });
  }

  /* ── Preparación del sprite del loto ──
     Cargamos assets/img/flor-loto.svg una sola vez. Al terminar,
     rasterizamos a un canvas offscreen por cada color. */
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const SPRITE = 96;
  let sprites = null;

  const img = new Image();
  img.decoding = 'async';

  img.onload = () => {
    sprites = Object.create(null);
    COL.forEach(color => {
      const s = document.createElement('canvas');
      s.width  = SPRITE * DPR;
      s.height = SPRITE * DPR;
      const sctx = s.getContext('2d');
      sctx.scale(DPR, DPR);
      sctx.drawImage(img, 0, 0, SPRITE, SPRITE);
      sctx.globalCompositeOperation = 'source-in';
      sctx.fillStyle = color;
      sctx.fillRect(0, 0, SPRITE, SPRITE);
      sprites[color] = s;
    });
  };
  img.onerror = () => { sprites = null; }; // fallback a círculos
  img.src = 'assets/img/flor-loto.svg';

  // Posición del ratón relativa al canvas
  const pos = e => {
    const r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  cv.addEventListener('pointermove', e => {
    const p = pos(e);
    mouse.x = p.x;
    mouse.y = p.y;
  }, { passive: true });

  cv.addEventListener('pointerleave', () => {
    mouse.x = mouse.y = -999;
  });

  // Clic/tap: impulso radial desde el punto tocado
  cv.addEventListener('pointerdown', e => {
    const p = pos(e);
    lotos.forEach(b => {
      const dx = b.x - p.x;
      const dy = b.y - p.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d < 170) {
        b.vx += dx / d * 7;
        b.vy += dy / d * 7;
      }
    });
  });

  // Un frame de dibujado — reutilizable para el modo reduced-motion
  function dibujarLotos() {
    ctx.clearRect(0, 0, W, H);
    lotos.forEach(b => {
      if (sprites && sprites[b.c]) {
        const size = b.r * 2;
        ctx.globalAlpha = 0.85;
        ctx.drawImage(sprites[b.c], b.x - b.r, b.y - b.r, size, size);
        ctx.globalAlpha = 1;
      } else {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.c;
        ctx.globalAlpha = 0.82;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    });
  }

  function frame() {
    const t = performance.now() / 1000;

    lotos.forEach(b => {
      // Perturbación sinusoidal lenta (evita trayectorias rectas)
      const ang = t * 0.22 + b.ph;
      b.vx += Math.cos(ang) * 0.02;
      b.vy += Math.sin(ang * 1.3) * 0.02;

      // Repulsión del cursor
      const dx = b.x - mouse.x;
      const dy = b.y - mouse.y;
      const d = Math.hypot(dx, dy) || 1;
      if (d < 140) {
        b.vx += dx / d * 0.5;
        b.vy += dy / d * 0.5;
      }

      // Fricción y límites de velocidad
      b.vx *= 0.99;
      b.vy *= 0.99;
      const sp = Math.hypot(b.vx, b.vy) || 1e-4;
      const MIN = 0.3, MAX = 5;
      if (sp < MIN) { b.vx = b.vx / sp * MIN; b.vy = b.vy / sp * MIN; }
      else if (sp > MAX) { b.vx = b.vx / sp * MAX; b.vy = b.vy / sp * MAX; }

      // Integración de posición
      b.x += b.vx;
      b.y += b.vy;

      // Rebote elástico con paredes (con pérdida de energía)
      if (b.x < b.r)     { b.x = b.r;     b.vx *= -0.8; }
      if (b.x > W - b.r) { b.x = W - b.r; b.vx *= -0.8; }
      if (b.y < b.r)     { b.y = b.r;     b.vy *= -0.8; }
      if (b.y > H - b.r) { b.y = H - b.r; b.vy *= -0.8; }
    });

    dibujarLotos();

    if (visible) raf = requestAnimationFrame(frame);
  }

  // Solo animar cuando el footer está en vista
  const io = new IntersectionObserver(ents => {
    ents.forEach(en => {
      visible = en.isIntersecting && !calm;
      if (visible && !raf) frame();
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
  }, { threshold: 0.05 });
  io.observe(zona);

  // Reduced-motion: un solo frame estático, sin animación
  if (calm) {
    const paintOnce = () => dibujarLotos();
    if (sprites) paintOnce();
    else {
      img.addEventListener('load', paintOnce, { once: true });
      img.addEventListener('error', paintOnce, { once: true });
    }
  }
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-footer-lotos.js
   ═══════════════════════════════════════════════════════════════════════════ */
