/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-fluido.js — Fluido WebGL global (efecto 11 / §5)
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-14 del bloque §5 embebido en index.html
   (líneas 778-1069 del original).

   QUÉ HACE
   ────────
   Renderiza en el canvas `#fluido` (fondo global del sitio, `z-index: 0`)
   una simulación de fluido en WebGL con dos rasgos característicos:

   1. El cursor/dedo inyecta SOLO vectores de velocidad, no color. El
      fluido es transparente por sí mismo; lo que vemos son deformaciones
      de refracción sobre el color de fondo.

   2. El agua se manifiesta como una veladura translúcida de luz sobre
      el lino base (#FAF6F0). La opacidad máxima está limitada a 0.18
      para no tapar textos ni fondo — es "seda de color", no capa opaca.

   ARQUITECTURA DE LA SIMULACIÓN
   ─────────────────────────────
   Es una simulación clásica de campo de velocidad en textura, con
   ping-pong de framebuffers (dos texturas A y B alternándose):

   · PASO 1 · SIMULACIÓN (shader FS_SIM, off-screen, resolución 256×256):
     - Advección: cada texel busca su valor "atrás" según su velocidad.
     - Disipación: multiplica por 0.95 → evaporación rápida (viscosidad
       alta = el efecto no se acumula, se aclara solo).
     - Splat: se añade el vector de velocidad del cursor en un radio
       gaussiano muy pequeño (SIGMA=0.0009, "hilo milimétrico").
     - Se guarda como color (x,y del vector → r,g del pixel) codificado
       en el rango 0-1 con base 0.5, para funcionar en byte y en float.

   · PASO 2 · VISUALIZACIÓN (shader FS_DISP, a pantalla completa):
     - Genera un fondo "vivo" mezclando el lino base con dos ambientes
       cálidos y fríos que respiran suavemente (basados en time).
     - Toma el vector de velocidad del texel actual y distorsiona las
       coordenadas de muestreo (efecto lente cristalina).
     - Mezcla el color del fluido (azul → dorado según velocidad) con el
       fondo, con alpha limitado a 0.18.
     - Añade un "relieve" (gradiente de magnitud) para sugerir volumen.

   PARÁMETROS CLAVE (documentados en el código como constantes)
   ─────────────────────────────────────────────────────────────
   · SIM         = 256      → resolución de la textura de simulación
   · DISSIP      = 0.95     → factor de disipación por frame
   · SPLAT_SIGMA = 0.0009   → radio del cursor (muy fino)
   · VEL_SCALE   = 7.0      → intensidad del vector inyectado
   · ADVECT      = 3.4      → arrastre del fluido sobre sí mismo
   · DISTORT     = 0.010    → magnitud de la distorsión óptica
   · LINO        = [0.980, 0.965, 0.941]  → #FAF6F0 base

   FALLBACK ROBUSTO DE TEXTURAS
   ────────────────────────────
   WebGL tiene tres tipos de textura para el campo de velocidad, en
   orden de preferencia:

   1. FLOAT (OES_texture_float) → precisión máxima
   2. HALF_FLOAT (OES_texture_half_float) → precisión media
   3. UNSIGNED_BYTE → siempre disponible, precisión mínima

   El código prueba los tres en orden, verificando que el framebuffer
   se completa correctamente. Si un móvil de gama baja no soporta
   float, cae automáticamente a byte y sigue funcionando.

   NOTA · PALETA DEL SHADER
   ────────────────────────
   La veladura del fluido es ahora monocromática cálida, alineada con
   los tokens oficiales de paramita-color.css:
   · --calido-zen (#EBDEC4) en reposo / velocidades bajas
   · --dorado     (#ECAC55) en los picos de aceleración

   Se retiró el cruce azul→dorado anterior (cyan #00C7E5, ya eliminado
   del sistema en Fase 1a, + dorado saturado #FFB400) por decisión de
   diseño: la home pedía una luz cálida mediterránea sin frío digital.
   Los valores vec3 del shader se derivan directamente del HEX de cada
   token, no son colores inventados.

   RENDIMIENTO
   ───────────
   · devicePixelRatio acotado a 2 (evita canvas 3x/4x en móviles).
   · Simulación a 256×256 (resolución fija, independiente del viewport).
   · Ping-pong sin allocations por frame (los dos targets son estáticos).
   · Bucle pausado cuando la pestaña no es visible.

   ACCESIBILIDAD Y DEGRADACIÓN
   ───────────────────────────
   · `prefers-reduced-motion: reduce` en carga → canvas oculto, no
     arranca la simulación.
   · Cambio en caliente a reduce-motion → detiene el bucle y oculta.
   · Sin WebGL → canvas oculto, queda el `background` del `<body>`.

   DEPENDENCIAS
   ────────────
   Ninguna. Vanilla WebGL 1.0.

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <canvas id="fluido"></canvas>

   CSS ASOCIADO
   ────────────
   Ver paramita-fluido.css — solo POSICIONA el canvas (fixed, inset:0,
   z-index:0, pointer-events:none). El efecto visual completo vive aquí.
   ═══════════════════════════════════════════════════════════════════════════ */

(function initFluido() {
  'use strict';

  const canvas = document.getElementById('fluido');
  if (!canvas) return;

  // Accesibilidad: si el usuario desactiva animaciones, NO arrancamos.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  const gl = canvas.getContext('webgl', { premultipliedAlpha: false, alpha: true })
          || canvas.getContext('experimental-webgl');

  // Resiliencia: sin WebGL, ocultamos el lienzo y queda el fondo base del body.
  if (!gl) { canvas.style.display = 'none'; return; }

  const extFloat  = gl.getExtension('OES_texture_float');
  const extHalf   = gl.getExtension('OES_texture_half_float');
  const extLinF   = gl.getExtension('OES_texture_float_linear');
  const extLinHF  = gl.getExtension('OES_texture_half_float_linear');

  // ── Parámetros de la simulación ──
  const SIM         = 256;     // resolución de simulación
  const DISSIP      = 0.95;    // evaporación rápida del fluido
  const SPLAT_SIGMA = 0.0009;  // radio del cursor (hilo milimétrico)
  const VEL_SCALE   = 7.0;     // intensidad del vector inyectado
  const ADVECT      = 3.4;     // arrastre del fluido sobre sí mismo
  const DISTORT     = 0.010;   // distorsión óptica de refracción
  const LINO        = [0.980, 0.965, 0.941]; // #FAF6F0

  let W, H, dpr;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width  = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── Utilidades de compilación de shaders ────────────────────── */
  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(sh));
    }
    return sh;
  }

  function program(vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(p));
    }
    return p;
  }

  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1,-1, 1,-1, -1,1, 1,-1, 1,1, -1,1]),
    gl.STATIC_DRAW
  );

  /* ── Vertex shader (compartido por ambos programas) ──────────── */
  const VS = `
    attribute vec2 a_pos;
    varying vec2 vUv;
    void main(){ vUv = a_pos*0.5+0.5; gl_Position = vec4(a_pos,0.0,1.0); }
  `;

  /* ── Fragment shader de SIMULACIÓN ────────────────────────────
     Campo de velocidad codificado en 0.5 (sirve en byte y en float). */
  const FS_SIM = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D u_field;
    uniform vec2  u_texel;
    uniform vec2  u_mouse;
    uniform vec2  u_mouseVel;
    uniform float u_force;
    uniform float u_aspect;
    uniform float u_dissip;
    uniform float u_sigma;
    uniform float u_advect;

    void main() {
      vec2 v = (texture2D(u_field, vUv).xy - 0.5) * 2.0;
      vec2 back = vUv - v * u_texel * u_advect;
      vec2 vb = (texture2D(u_field, back).xy - 0.5) * 2.0;
      vb *= u_dissip;
      vec2 d = vUv - u_mouse; d.x *= u_aspect;
      float g = exp(-dot(d,d) / u_sigma);
      vb += u_mouseVel * g * u_force;
      vb = clamp(vb, -1.0, 1.0);
      gl_FragColor = vec4(vb * 0.5 + 0.5, 0.0, 1.0);
    }
  `;

  /* ── Fragment shader de VISUALIZACIÓN ─────────────────────────
     Fondo lino vivo + veladura cromática translúcida.
     Cálido-zen en velocidades bajas → dorado en picos de aceleración.
     Opacidad máxima 0.18 (seda de color que no tapa textos ni fondo). */
  const FS_DISP = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D u_field;
    uniform vec2  u_texel;
    uniform vec3  u_bg;
    uniform float u_time;
    uniform float u_aspect;

    vec3 fondo(vec2 uv) {
      vec3 col = u_bg;
      vec2 a = vec2(uv.x * u_aspect, uv.y);
      float warm = exp(-distance(a, vec2(0.32*u_aspect + sin(u_time*0.05)*0.04, 0.30)) * 2.2);
      col += vec3(0.030, 0.020, -0.004) * warm;
      float cool = exp(-distance(a, vec2(0.74*u_aspect + cos(u_time*0.04)*0.05, 0.74)) * 2.4);
      col += vec3(-0.010, 0.008, 0.028) * cool;
      float vig = smoothstep(1.15, 0.2, distance(uv, vec2(0.5)));
      col *= 0.985 + vig * 0.03;
      return col;
    }

    void main() {
      vec2 fluidData = (texture2D(u_field, vUv).xy - 0.5) * 2.0;
      float speed = length(fluidData);

      // Distorsión de lente cristalina ultra-fina
      vec2 distortedUv = vUv + fluidData * ${DISTORT};
      vec3 base = fondo(distortedUv);

      // Paleta cálida monocromática · derivada de tokens oficiales
      // Reposo → --calido-zen (#EBDEC4) · Pico → --dorado (#ECAC55)
      vec3 colorReposo = vec3(0.922, 0.871, 0.769);  // --calido-zen
      vec3 colorDorado = vec3(0.925, 0.675, 0.333);  // --dorado

      float colorMixFactor = smoothstep(0.10, 0.60, speed);
      vec3 fluidColor = mix(colorReposo, colorDorado, colorMixFactor);

      float sx = length((texture2D(u_field, vUv + vec2(u_texel.x,0.0)).xy-0.5)*2.0)
               - length((texture2D(u_field, vUv - vec2(u_texel.x,0.0)).xy-0.5)*2.0);
      float sy = length((texture2D(u_field, vUv + vec2(0.0,u_texel.y)).xy-0.5)*2.0)
               - length((texture2D(u_field, vUv - vec2(0.0,u_texel.y)).xy-0.5)*2.0);
      float relieve = (abs(sx)+abs(sy));

      // Alpha proporcional a la densidad física, opacidad máxima 0.18
      float alpha = smoothstep(0.005, 0.5, speed) * 0.14 + relieve * 0.9;
      alpha = clamp(alpha, 0.0, 0.18);

      vec3 finalColor = mix(base, fluidColor, alpha);
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const progSim  = program(VS, FS_SIM);
  const progDisp = program(VS, FS_DISP);

  function bindQuad(p) {
    const loc = gl.getAttribLocation(p, 'a_pos');
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  /* ── Fallback robusto de tipos de textura (FLOAT → HALF → BYTE) ── */
  function tryType(type, lin) {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const f = lin ? gl.LINEAR : gl.NEAREST;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIM, SIM, 0, gl.RGBA, type, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    return { tex, fbo, ok };
  }

  let TIPO, FILTRO_LIN;
  (function elegir() {
    const cands = [];
    if (extFloat) cands.push([gl.FLOAT, !!extLinF]);
    if (extHalf)  cands.push([extHalf.HALF_FLOAT_OES, !!extLinHF]);
    cands.push([gl.UNSIGNED_BYTE, true]);

    for (const [t, l] of cands) {
      const r = tryType(t, l);
      gl.deleteTexture(r.tex);
      gl.deleteFramebuffer(r.fbo);
      if (r.ok) { TIPO = t; FILTRO_LIN = l; return; }
    }
    TIPO = gl.UNSIGNED_BYTE;
    FILTRO_LIN = true;
  })();

  function createTarget() {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    const f = FILTRO_LIN ? gl.LINEAR : gl.NEAREST;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, f);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIM, SIM, 0, gl.RGBA, TIPO, null);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fbo };
  }

  let A = createTarget();
  let B = createTarget();

  // Inicializar ambos targets al valor "neutral" 0.5 (velocidad cero codificada)
  [A, B].forEach(t => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, t.fbo);
    gl.viewport(0, 0, SIM, SIM);
    gl.clearColor(0.5, 0.5, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  });

  /* ── Estado del ratón / dedo ─────────────────────────────────── */
  let mx = 0.5, my = 0.5, pmx = 0.5, pmy = 0.5;
  let active = false, force = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX / W;
    my = 1.0 - e.clientY / H;
    active = true;
  }, { passive: true });

  window.addEventListener('mouseleave', () => { active = false; });

  // Soporte táctil
  window.addEventListener('touchmove', e => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    mx = t.clientX / W;
    my = 1.0 - t.clientY / H;
    active = true;
  }, { passive: true });

  window.addEventListener('touchend', () => { active = false; }, { passive: true });

  /* ── Uniforms cacheados ──────────────────────────────────────── */
  const texel = [1/SIM, 1/SIM];

  const uS = ['u_field','u_texel','u_mouse','u_mouseVel','u_force','u_aspect','u_dissip','u_sigma','u_advect']
    .reduce((o, k) => (o[k] = gl.getUniformLocation(progSim, k), o), {});

  const uD = ['u_field','u_texel','u_bg','u_time','u_aspect']
    .reduce((o, k) => (o[k] = gl.getUniformLocation(progDisp, k), o), {});

  /* ── Bucle principal ─────────────────────────────────────────── */
  const t0 = performance.now();
  let running = true;

  function loop() {
    if (!running) return;

    // Calcular vector de velocidad del cursor (delta desde el frame anterior)
    const vx = (mx - pmx) * VEL_SCALE;
    const vy = (my - pmy) * VEL_SCALE;
    pmx = mx; pmy = my;

    // Suavizar la fuerza (evita saltos bruscos al entrar/salir el cursor)
    force += ((active ? 1 : 0) - force) * 0.15;

    // ── PASO 1 · SIMULACIÓN (off-screen a target B) ──
    gl.bindFramebuffer(gl.FRAMEBUFFER, B.fbo);
    gl.viewport(0, 0, SIM, SIM);
    gl.disable(gl.BLEND);
    gl.useProgram(progSim);
    bindQuad(progSim);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, A.tex);
    gl.uniform1i(uS.u_field, 0);
    gl.uniform2f(uS.u_texel, texel[0], texel[1]);
    gl.uniform2f(uS.u_mouse, mx, my);
    gl.uniform2f(uS.u_mouseVel, vx, vy);
    gl.uniform1f(uS.u_force, force);
    gl.uniform1f(uS.u_aspect, W / H);
    gl.uniform1f(uS.u_dissip, DISSIP);
    gl.uniform1f(uS.u_sigma, SPLAT_SIGMA);
    gl.uniform1f(uS.u_advect, ADVECT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Swap ping-pong
    const tmp = A; A = B; B = tmp;

    // ── PASO 2 · VISUALIZACIÓN (a pantalla completa) ──
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.disable(gl.BLEND);
    gl.useProgram(progDisp);
    bindQuad(progDisp);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, A.tex);
    gl.uniform1i(uD.u_field, 0);
    gl.uniform2f(uD.u_texel, texel[0], texel[1]);
    gl.uniform3f(uD.u_bg, LINO[0], LINO[1], LINO[2]);
    gl.uniform1f(uD.u_time, (performance.now() - t0) / 1000);
    gl.uniform1f(uD.u_aspect, W / H);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* ── Optimizaciones de ciclo de vida ─────────────────────────── */

  // Pausar cuando la pestaña no es visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  }, { passive: true });

  // Reduced-motion activado en caliente: detener y ocultar
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
    if (e.matches) {
      running = false;
      canvas.style.display = 'none';
    }
  });
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-fluido.js
   ═══════════════════════════════════════════════════════════════════════════ */
