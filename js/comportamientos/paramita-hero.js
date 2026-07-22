/* ═══════════════════════════════════════════════════════════════════════════
   PARAMITA · FUNDACIÓN SAKYA
   paramita-hero.js — Hero: rotador de palabras + vídeo de fondo + audio
   ───────────────────────────────────────────────────────────────────────────
   Extraído en Fase 4 · Paso JS-5 del bloque §2 embebido en index.html
   (líneas 556-627 del original).

   QUÉ HACE
   ────────
   Tres comportamientos coordinados dentro del hero:

   1 · ROTADOR DE PALABRAS
       Cicla entre las palabras marcadas con `.rotator__word`, alternando
       la clase `.is-active` cada 3.6 segundos. El crossfade lo hace el
       CSS (transición de opacidad). Sin CLS (Cumulative Layout Shift)
       porque todas las palabras ocupan el mismo espacio superpuestas.

   2 · VÍDEO DE FONDO RESPONSIVE
       Elige la fuente `.mp4` según el ancho de pantalla (móvil vs
       escritorio) y la inyecta como `<source>` dentro del `<video>`.
       Arranca en mute con autoplay y gestiona pausa/reanudación según
       visibilidad de pestaña y preferencia de reduced-motion.

   3 · TOGGLE DE AUDIO CON FADE
       Botón que activa/desactiva el sonido del vídeo con una transición
       de volumen suave (600 ms) usando requestAnimationFrame. Necesita
       un gesto del usuario (política de autoplay de los navegadores).

   POR QUÉ 3.6 s POR PALABRA
   ─────────────────────────
   Es el ritmo contemplativo de "respiración Paramita" — deliberadamente
   lento para que el ojo lea la palabra completa antes de cambiar. Un
   ritmo más rápido (2 s) genera fatiga; uno más lento (5 s+) pierde el
   efecto de rotación.

   POR QUÉ ELEGIR EL SRC DEL VÍDEO CON JS Y NO CON <source media>
   ──────────────────────────────────────────────────────────────
   La sintaxis nativa `<source media="(max-width: 768px)" src="…">` es
   ambigua en varios navegadores para elementos `<video>`. Elegirlo con
   JS al cargar (matchMedia una vez) es más fiable y evita descargar
   ambos vídeos.

   NOTA: esto se decide UNA vez al cargar. Si el usuario cambia el
   tamaño de la ventana atravesando el breakpoint, no se recarga el
   vídeo — es aceptable porque cambiar de móvil a escritorio (o
   viceversa) sin recargar es un caso extremo.

   FALLBACKS Y RESILIENCIA
   ───────────────────────
   · Si el vídeo falla al cargar (`error` event) → se oculta el
     elemento y el hero muestra su fallback estático (poster CSS).
   · Si el navegador bloquea el autoplay → se atrapa la promesa
     silenciosamente. El vídeo queda pausado y el usuario puede
     activarlo con un gesto.
   · Reduced-motion → el vídeo se pausa y el rotador no se activa.
   · Pestaña oculta (visibilitychange) → pausa el vídeo para ahorrar
     batería y CPU.

   FADE DE VOLUMEN
   ───────────────
   El cambio de audio es una interacción sensible — un cambio brusco
   de 0 a 0.3 asusta al usuario. El fade de 600 ms lo suaviza con
   interpolación lineal frame a frame vía requestAnimationFrame.

   ACCESIBILIDAD DEL TOGGLE
   ────────────────────────
   El botón actualiza dinámicamente `aria-pressed`, `aria-label` y
   `title` según su estado, para que lectores de pantalla y tooltips
   reflejen siempre la acción disponible ("Activar" vs "Silenciar").

   DEPENDENCIAS
   ────────────
   Ninguna. Vanilla JS.

   MARCADO ESPERADO EN HTML
   ────────────────────────
   <section class="hero">
     <div class="rotator">
       <span class="rotator__word is-active">meditación</span>
       <span class="rotator__word">sabiduría</span>
       <span class="rotator__word">compasión</span>
     </div>
     <video id="hero-bg-video" autoplay muted loop playsinline></video>
     <button id="hero-sound-toggle" type="button" aria-pressed="false">…</button>
   </section>

   ASSETS
   ──────
   · assets/img/banner-home-home-2026.mp4   (escritorio ≥769px)
   · assets/img/banner-movil-home-2026.mp4  (móvil ≤768px)
   ═══════════════════════════════════════════════════════════════════════════ */

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1 · Rotador de palabras (crossfade contemplativo, sin CLS) ── */
  const rotator = document.querySelector('.rotator');
  if (rotator && !reduce) {
    const words = [...rotator.querySelectorAll('.rotator__word')];
    if (words.length > 1) {
      let i = 0;
      setInterval(() => {
        words[i].classList.remove('is-active');
        i = (i + 1) % words.length;
        words[i].classList.add('is-active');
      }, 3600); // 3.6 s por palabra · respiración Paramita
    }
  }

  /* ── 2 · Vídeo de fondo responsive ── */
  const v = document.getElementById('hero-bg-video');
  if (!v) return;

  const isMobile = matchMedia('(max-width: 768px)').matches;
  const src = isMobile
    ? 'assets/img/banner-movil-home-2026.mp4'
    : 'assets/img/banner-home-home-2026.mp4';

  const source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';
  v.appendChild(source);

  v.muted = true;
  v.volume = 0.3;
  v.load();

  const tryPlay = () => v.play().catch(() => { /* autoplay bloqueado, silencio */ });
  tryPlay();

  // Fallo de carga → ocultar el vídeo
  v.addEventListener('error', () => { v.style.display = 'none'; }, { once: true });

  // Reduced-motion: pausar / reanudar dinámicamente
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => {
    e.matches ? v.pause() : tryPlay();
  });

  // Pestaña oculta: pausar para ahorrar batería y CPU
  document.addEventListener('visibilitychange', () => {
    document.hidden ? v.pause() : tryPlay();
  }, { passive: true });

  /* ── 3 · Toggle de audio (requiere gesto del usuario) ── */
  const soundBtn = document.getElementById('hero-sound-toggle');
  if (!soundBtn) return;

  const TARGET_VOL = 0.3;
  const FADE_MS = 600;

  const fadeVolume = (to) => {
    const from = v.volume;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      v.volume = from + (to - from) * t;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  soundBtn.addEventListener('click', () => {
    const turningOn = v.muted;
    if (turningOn) {
      v.volume = 0;
      v.muted = false;
      v.play().catch(() => {});
      fadeVolume(TARGET_VOL);
      soundBtn.classList.add('is-on');
      soundBtn.setAttribute('aria-pressed', 'true');
      soundBtn.setAttribute('aria-label', 'Silenciar sonido del fondo');
      soundBtn.title = 'Silenciar';
    } else {
      fadeVolume(0);
      setTimeout(() => { v.muted = true; }, FADE_MS);
      soundBtn.classList.remove('is-on');
      soundBtn.setAttribute('aria-pressed', 'false');
      soundBtn.setAttribute('aria-label', 'Activar sonido del fondo');
      soundBtn.title = 'Activar sonido';
    }
  });
})();

/* ═══════════════════════════════════════════════════════════════════════════
   FIN de paramita-hero.js
   ═══════════════════════════════════════════════════════════════════════════ */
