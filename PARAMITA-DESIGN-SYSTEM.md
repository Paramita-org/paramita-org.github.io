# Paramita · Design System & Technical Report

> Reverse-engineering, abstracción y documentación del sistema de diseño latente en `paramita-index-v3.html`, junto con el informe técnico del estado actual de la interfaz.

**Archivo fuente analizado:** `paramita-index-v3.html`
**Metodología:** Atomic Design + componentización moderna
**Estándares de referencia:** WCAG 2.x, ARIA, CSS Working Draft (`@layer`, `color-mix`, `animation-timeline`, `corner-shape`)

---

## Tabla de contenidos

- [Parte I · Sistema de Diseño](#parte-i--sistema-de-diseño)
  - [1.1 Design Tokens](#11-design-tokens)
  - [1.2 Componentes modulares](#12-componentes-modulares)
    - [1.2.1 Navbar](#121-navbar--barra-sticky-glass)
    - [1.2.2 Button System](#122-button--sistema-de-botones)
    - [1.2.3 Hero](#123-hero--portada-con-vídeo-de-fondo-y-rotator)
    - [1.2.4 FlipGrid](#124-flipgrid--rejilla-de-cursos)
    - [1.2.5 BlogCard](#125-blogcard--tarjeta-de-artículo-en-capas)
    - [1.2.6 Band](#126-band--banner-crowdfunding)
    - [1.2.7 Carousel](#127-carousel--testimonios-infinitos)
    - [1.2.8 VideoFrame](#128-videoframe--reproductor-con-clip-path-scroll-driven)
    - [1.2.9 Modal](#129-modal--video-lightbox)
    - [1.2.10 Footer](#1210-footer--hero-físico--info)
- [Parte II · Informe Técnico](#parte-ii--informe-técnico)
  - [2.1 Consistencia y jerarquía](#21-análisis-de-consistencia-y-jerarquía)
  - [2.2 Accesibilidad y semántica](#22-diagnóstico-de-accesibilidad-wcag-y-semántica)
  - [2.3 Refactorización y escalabilidad](#23-recomendaciones-de-refactorización-y-escalabilidad)
  - [Resumen ejecutivo de deuda técnica](#resumen-ejecutivo-de-deuda-técnica)

---

# Parte I · Sistema de Diseño

## 1.1 Design Tokens

```json
{
  "$schema": "https://design-tokens.github.io/community-group/format/",
  "meta": {
    "name": "Paramita Design System",
    "version": "3.0.0",
    "language": "es-ES",
    "themeMode": "light-warm"
  },
  "color": {
    "brand": {
      "primary":   { "value": "#105EA9", "alias": "--azul-oscuro",  "role": "Acción principal, enlaces, hover de marca" },
      "accent":    { "value": "#00C7E5", "alias": "--azul-sutil",   "role": "Acento luminoso, filtros sobre imagen, paso de degradado" },
      "highlight": { "value": "#FFB400", "alias": "--dorado",       "role": "Eyebrows, énfasis, micro-acentos cálidos" }
    },
    "surface": {
      "base":      { "value": "#FAF6F0", "alias": "--base-bg",      "role": "Fondo global de body (lino vivo)" },
      "lino":      { "value": "#FBF7EF", "alias": "--lino",         "role": "Hueso cálido, textos sobre oscuro" },
      "arena":     { "value": "#F6EEE0", "alias": "--arena",        "role": "Glass de la barra sticky" },
      "arcilla":   { "value": "#EFE4D2", "alias": "--arcilla",      "role": "Submenu hover, banda de misión" },
      "calidoZen": { "value": "#F1E6D2", "alias": "--calido-zen",   "role": "Hover de cursos/eventos, radial del hero" },
      "card":      { "value": "#FFFDF8", "alias": "--card",         "role": "Cards (blog, testimonios) – blanco cálido, no #FFF puro" }
    },
    "text": {
      "primary":   { "value": "#211E1A", "alias": "--antracita",    "role": "Tinta cálida (no negro puro)" },
      "secondary": { "value": "#5A554E", "alias": "--texto-suave",  "role": "Lede, captions, descripciones" },
      "onDark":    { "value": "#FBF7EF", "alias": "--lino",         "role": "Texto sobre fondo oscuro (footer)" }
    },
    "border": {
      "hair":      { "value": "rgba(40,33,26,0.10)", "alias": "--hair", "role": "Hairline 1px sobre claro" },
      "onDark":    { "value": "rgba(250,246,240,0.12)", "role": "Hairline sobre footer oscuro" }
    },
    "gradient": {
      "brandFlow": {
        "value": "linear-gradient(100deg, #105EA9, #00C7E5, #FFB400, #00C7E5, #105EA9)",
        "size": "200% 100%",
        "animation": "flow 11s linear infinite",
        "role": "Logo, t-link hover, btn-amigo, band overlay, zen-frase title, footer ornaments"
      }
    }
  },
  "typography": {
    "family": {
      "display": { "value": "\"Fraunces\", Georgia, serif", "alias": "--display", "features": "optical-sizing:auto, ital + opsz axes" },
      "body":    { "value": "\"Hanken Grotesk\", system-ui, sans-serif", "alias": "--body" }
    },
    "weight": {
      "light":    300,
      "regular":  400,
      "medium":   500,
      "semibold": 600,
      "bold":     700
    },
    "scale": {
      "eyebrow":     { "size": "0.74rem", "weight": 600, "letter-spacing": "0.32em", "transform": "uppercase" },
      "caption":     { "size": "0.86rem", "line-height": 1.45 },
      "body-sm":     { "size": "0.92rem", "line-height": 1.5 },
      "body":        { "size": "1.00rem", "line-height": 1.7 },
      "body-lg":     { "size": "1.05rem", "line-height": 1.6 },
      "lede":        { "size": "clamp(1.05rem, 2vw, 1.22rem)" },
      "h3":          { "size": "clamp(1.3rem, 2.6vw, 1.8rem)", "weight": 400, "line-height": 1.12, "letter-spacing": "-0.015em" },
      "h2":          { "size": "clamp(2rem, 4.5vw, 3.3rem)",   "weight": 300, "line-height": 1.06, "letter-spacing": "-0.02em" },
      "h2-band":     { "size": "clamp(1.9rem, 4.4vw, 3.2rem)", "weight": 300 },
      "h1":          { "size": "clamp(2.7rem, 7.4vw, 6rem)",   "weight": 300, "line-height": 1.06 },
      "display-xl":  { "size": "clamp(2.6rem, 9vw, 6.5rem)",   "weight": 300, "line-height": 1.0, "role": "CTA final zoom-stage" },
      "footer-h":    { "size": "clamp(2.4rem, 8vw, 5.5rem)" }
    },
    "smoothing": "-webkit-font-smoothing:antialiased"
  },
  "spacing": {
    "scale-rem":    { "0": "0", "1": "0.2rem", "2": "0.4rem", "3": "0.6rem", "4": "0.8rem", "5": "1rem", "6": "1.2rem", "7": "1.4rem", "8": "1.6rem", "10": "2rem", "12": "2.4rem", "14": "2.8rem", "16": "3.2rem", "20": "4rem" },
    "section-y":    { "value": "clamp(4.5rem, 11vh, 8rem)" },
    "section-y-sm": { "value": "clamp(3.5rem, 9vh, 6.5rem)" },
    "section-y-xs": { "value": "clamp(2rem, 5vh, 4rem)" },
    "container":    { "value": "min(1240px, 90vw)", "alias": ".wrap" },
    "measure":      { "value": "62ch", "alias": ".measure" },
    "bar-height":   { "value": "80px (62px scrolled)", "alias": "--bar-h" }
  },
  "breakpoints": {
    "xs":  "560px",
    "sm":  "640px",
    "md":  "680px",
    "lg":  "720px",
    "xl":  "768px",
    "2xl": "860px",
    "3xl": "980px",
    "desktop-only": "min-width:900px"
  },
  "radius": {
    "xs":   "4px",
    "sm":   "8px",
    "md":   "11px",
    "lg":   "14px",
    "xl":   "16px",
    "2xl":  "20px",
    "3xl":  "24px",
    "4xl":  "28px",
    "pill": "99px",
    "superellipse": {
      "btn":   "corner-shape:superellipse(2.4); radius:20-22px",
      "card":  "corner-shape:superellipse(2.6); radius:26px",
      "block": "corner-shape:superellipse(3);   radius:30-40px"
    }
  },
  "shadow": {
    "bar-scrolled":   "0 12px 44px -30px rgba(40,33,26,0.45)",
    "submenu":        "0 28px 64px -34px rgba(40,33,26,0.5)",
    "btn-primary":    "0 12px 28px -14px var(--azul-oscuro), inset 0 1px 0 rgba(255,255,255,0.28)",
    "btn-primary-hv": "0 18px 36px -14px var(--azul-oscuro), inset 0 1px 0 rgba(255,255,255,0.4)",
    "btn-claro":      "0 16px 40px -18px rgba(0,0,0,0.5)",
    "card-hover":     "0 30px 60px -34px rgba(33,33,33,0.4)",
    "video-frame":    "0 40px 80px -40px rgba(40,33,26,0.5)",
    "tcard-active":   "0 30px 60px -34px rgba(40,33,26,0.45)"
  },
  "motion": {
    "easing": {
      "out-quart": { "value": "cubic-bezier(0.22, 1, 0.36, 1)", "alias": "--ease" }
    },
    "duration": {
      "fast": { "value": "0.26s", "alias": "--t-fast" },
      "med":  { "value": "0.55s", "alias": "--t-med"  },
      "slow": { "value": "0.95s", "alias": "--t-slow" }
    },
    "animations": {
      "flow":     { "duration": "11s",  "timing": "linear infinite", "use": "Degradado de marca palindrómico" },
      "beat":     { "duration": "2.6s", "timing": "ease infinite",   "use": "Pulse dot del hero" },
      "hintBob":  { "duration": "2s",   "timing": "ease infinite",   "use": "Indicador de scroll" }
    },
    "scroll-driven": {
      "supports": "@supports (animation-timeline: scroll())",
      "uses": ["bar condense", "logo shrink", "mission video clip-path"]
    }
  },
  "z-index": {
    "fluido":  0,
    "content": 2,
    "bar":     100,
    "modal":   200
  },
  "effects": {
    "backdrop-filter": "saturate(150%) blur(14px)",
    "blend-modes":     ["multiply (band overlay)", "multiply (flip-celda azul filter)"],
    "selection":       { "background": "var(--azul-oscuro)", "color": "#fff" },
    "focus-ring":      { "outline": "2px solid var(--azul-oscuro)", "offset": "4px", "radius": "4px" }
  }
}
```

---

## 1.2 Componentes modulares

### 1.2.1 `Navbar` · Barra sticky glass

**Estructura HTML**

```html
<header class="bar" role="banner">
  <div class="bar-inner wrap">
    <a class="logo" href="/" aria-label="Marca · inicio">
      <span class="logo-wave" role="img" aria-label="Marca"></span>
    </a>

    <input class="nt" id="nt" type="checkbox" hidden>
    <label class="burger" for="nt" aria-label="Abrir y cerrar menú">
      <span></span><span></span><span></span>
    </label>

    <nav class="menu" aria-label="Principal">
      <ul class="links">
        <li><a class="navlink" href="#">Item</a></li>
        <li class="has-sub">
          <a class="navlink" href="#" aria-haspopup="true">
            Item con submenu <i class="caret" aria-hidden="true"></i>
          </a>
          <ul class="sub" role="menu" aria-label="…">
            <li role="none">
              <a role="menuitem" href="#">
                <strong>Título</strong><span>Descripción</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
      <span class="div" aria-hidden="true"></span>
      <div class="ctas">
        <a class="btn-contacto" href="#">Contacto</a>
        <a class="btn-amigo"    href="#">CTA principal</a>
      </div>
    </nav>
  </div>
</header>
```

**Estilos CSS**

```css
.bar {
  position: sticky; top: 0; z-index: 100;
  background: color-mix(in oklch, var(--arena) 70%, transparent);
  backdrop-filter: saturate(150%) blur(14px);
  border-bottom: 1px solid transparent;
  transition: border-color var(--t-med), background var(--t-med), box-shadow var(--t-med);
}
.bar.scrolled {
  background: color-mix(in oklch, var(--arena) 90%, transparent);
  border-color: var(--hair);
  box-shadow: 0 12px 44px -30px rgba(40,33,26,.45);
}
.bar-inner { display: flex; align-items: center; gap: 1.5rem; height: var(--bar-h); }

.navlink {
  --w: 400;
  font-family: var(--body); font-size: .96rem; font-weight: var(--w);
  color: var(--antracita); padding: .55rem; border-radius: 8px;
  position: relative; display: inline-flex; gap: .4rem;
  transition: font-weight var(--t-fast), color var(--t-med), opacity var(--t-med);
}
.navlink::after {
  content: ""; position: absolute; left: 50%; right: 50%; bottom: .28rem;
  height: 1.6px; border-radius: 2px;
  background: linear-gradient(90deg, var(--azul-oscuro), var(--azul-sutil), var(--dorado));
  transition: left var(--t-med), right var(--t-med);
}
.navlink:hover { --w: 600; color: var(--azul-oscuro); }
.navlink:hover::after { left: .55rem; right: .55rem; }
.bar:has(.navlink:hover) .navlink:not(:hover) { opacity: .4; }

.sub {
  position: absolute; top: calc(100% + 2px); left: 50%;
  translate: -50% 10px; min-width: 236px; padding: .45rem;
  background: color-mix(in oklch, var(--card) 88%, transparent);
  backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid var(--hair); border-radius: 16px;
  box-shadow: 0 28px 64px -34px rgba(40,33,26,.5);
  opacity: 0; pointer-events: none;
  transition: opacity var(--t-med), translate var(--t-med);
}
.has-sub:hover .sub,
.has-sub:focus-within .sub { opacity: 1; pointer-events: auto; translate: -50% 0; }
```

---

### 1.2.2 `Button` · Sistema de botones

Tres variantes formales (`ghost`, `primary`, `invert`) más un patrón de enlace tipográfico (`text-link`) con relleno de degradado animado en hover.

**Estructura HTML**

```html
<!-- Variante ghost (texto sobre claro) -->
<a class="btn-contacto" href="#">Ghost</a>

<!-- Variante primary (degradado de marca animado + shimmer) -->
<a class="btn-amigo" href="#">Primary</a>

<!-- Variante invert (claro sobre fondo oscuro/foto) -->
<a class="btn-claro" href="#">Invert <span aria-hidden="true">→</span></a>

<!-- Text-link con underline animado y gradient-fill -->
<a class="t-link" href="#">
  <span class="txt">Text link</span>
  <span class="arw" aria-hidden="true">→</span>
</a>
```

**Estilos CSS**

```css
/* Ghost */
.btn-contacto {
  font-size: .95rem; font-weight: 500; color: var(--texto-suave);
  padding: .55rem 1.05rem; border-radius: 99px;
  border: 1px solid var(--hair);
  transition: color var(--t-med), border-color var(--t-med), background var(--t-med);
}
.btn-contacto:hover {
  color: var(--azul-oscuro);
  border-color: color-mix(in oklch, var(--azul-oscuro) 45%, transparent);
  background: color-mix(in oklch, var(--azul-sutil) 14%, transparent);
}

/* Primary con shimmer */
.btn-amigo {
  position: relative; isolation: isolate; overflow: hidden;
  color: #fff; font-weight: 600; padding: .66rem 1.45rem; border-radius: 99px;
  box-shadow: 0 12px 28px -14px var(--azul-oscuro), inset 0 1px 0 rgba(255,255,255,.28);
  transition: transform var(--t-med), box-shadow var(--t-med), letter-spacing var(--t-med);
}
.btn-amigo::before {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(100deg, var(--azul-oscuro), var(--azul-sutil),
              var(--dorado), var(--azul-sutil), var(--azul-oscuro));
  background-size: 200% 100%; animation: flow 8s linear infinite;
}
.btn-amigo::after {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(105deg, transparent 32%,
              rgba(255,255,255,.55) 50%, transparent 68%);
  translate: -130% 0; transition: translate var(--t-slow);
}
.btn-amigo:hover { transform: translateY(-2px); letter-spacing: .02em; }
.btn-amigo:hover::after { translate: 130% 0; }

/* Text-link con gradient-fill en hover */
.t-link { position: relative; display: inline-flex; gap: .5em; font-weight: 600; }
.t-link .txt {
  background-image: linear-gradient(100deg, var(--azul-oscuro),
                    var(--azul-sutil) 45%, var(--dorado));
  background-size: 0% 100%; background-repeat: no-repeat;
  -webkit-background-clip: text; background-clip: text;
  transition: background-size var(--t-slow);
}
.t-link:hover .txt {
  background-size: 100% 100%;
  -webkit-text-fill-color: transparent; color: transparent;
}
```

---

### 1.2.3 `Hero` · Portada con vídeo de fondo y rotator

**Estructura HTML**

```html
<section class="hero" id="hero">
  <div class="hero__bg" aria-hidden="true">
    <div class="hero__bg-fallback"></div>
    <video class="hero__bg-video" autoplay loop muted playsinline preload="metadata"></video>
  </div>

  <div class="wrap hero__inner">
    <p class="eyebrow" data-reveal="1">Pretítulo</p>
    <h1 data-reveal="2">
      Título estático
      <span class="rotator" role="text" aria-label="…">
        <em class="rotator__word is-active">palabra 1.</em>
        <em class="rotator__word">palabra 2.</em>
        <em class="rotator__word">palabra 3.</em>
      </span>
    </h1>
    <p class="lede">Subtítulo descriptivo…</p>
    <div class="actions">
      <a class="t-link" href="#">CTA</a>
      <span class="meta"><span class="pulse" aria-hidden="true"></span>Meta info</span>
    </div>
  </div>

  <button class="hero__sound" type="button" aria-pressed="false" aria-label="Audio">…</button>
</section>
```

**Estilos CSS**

```css
.hero {
  position: relative; z-index: 2; min-height: calc(100svh - var(--bar-h));
  display: grid; align-content: center;
  padding-block: clamp(3rem, 9vh, 7rem);
  isolation: isolate; overflow: hidden;
  background: radial-gradient(120% 85% at 80% -12%, var(--calido-zen), transparent 62%);
}
.hero > * { position: relative; z-index: 2; }
.hero__bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.hero__bg-video {
  width: 100%; height: 100%; object-fit: cover;
  object-position: center right; opacity: .62; mix-blend-mode: multiply;
}
.hero::after {
  content: ""; position: absolute; inset: 0; z-index: 1;
  background:
    linear-gradient(100deg, var(--arena) 0%,
      color-mix(in oklch, var(--arena) 80%, transparent) 32%, transparent 62%),
    linear-gradient(180deg, transparent 55%,
      color-mix(in oklch, var(--arena) 70%, transparent) 100%);
}

/* Rotator crossfade sin CLS */
.rotator { display: inline-grid; }
.rotator__word {
  grid-area: 1 / 1; opacity: 0; transform: translateY(.12em);
  transition: opacity 1.1s var(--ease), transform 1.1s var(--ease);
  font-style: italic; color: var(--azul-oscuro);
}
.rotator__word.is-active { opacity: 1; transform: none; }
```

---

### 1.2.4 `FlipGrid` · Rejilla de cursos

Grid 4×4 (responsive a 3, 2 y 1 columna) donde la celda activa se expande a 2×2 y las demás se reorganizan con la API Flip de GSAP.

**Estructura HTML**

```html
<div class="flip-grid" role="list">
  <a class="flip-celda" href="#" role="listitem">
    <div class="flip-celda__pic" style="background-image:url('…')"></div>
    <span class="flip-celda__num">01</span>
    <div class="flip-celda__overlay">
      <span class="flip-celda__cat">Fecha · Categoría</span>
      <h3 class="flip-celda__titulo">Título del curso</h3>
      <p class="flip-celda__desc">Descripción extendida (solo expandida).</p>
      <div class="tags">
        <span class="tag free">Gratuito</span>
        <span class="tag">Online</span>
      </div>
    </div>
  </a>
</div>
```

**Estilos CSS**

```css
.flip-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 1fr;
  gap: 14px;
}
.flip-celda {
  position: relative; aspect-ratio: 1 / 1;
  border-radius: 16px; overflow: hidden; isolation: isolate;
  background: var(--card); border: 1px solid var(--hair);
}
.flip-celda__pic {
  position: absolute; inset: 0;
  background-size: cover; background-position: center 38%;
  background-color: var(--azul-sutil); background-blend-mode: multiply;
  filter: brightness(1.12) saturate(1.02);
  transform: scale(1.06); transition: transform var(--t-slow);
}
.flip-celda:hover .flip-celda__pic { transform: scale(1); }
.flip-celda.is-expanded { grid-column: span 2; grid-row: span 2; z-index: 5; }

@media (max-width: 980px) { .flip-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 720px) { .flip-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { .flip-grid { grid-template-columns: 1fr; } }
```

---

### 1.2.5 `BlogCard` · Tarjeta de artículo en capas

Barra-imagen que crece en hover (82 → 208 px) + glifo display (`.ghost`) que asoma por detrás como capa tipográfica decorativa.

**Estructura HTML**

```html
<article class="efx-card">
  <div class="bar-img">
    <div class="pic" style="background-image:url('…')"></div>
  </div>
  <span class="ghost" aria-hidden="true">慧</span>
  <span class="num">01</span>
  <div class="body">
    <span class="kicker">Categoría</span>
    <h3>Título del artículo</h3>
    <p>Resumen breve…</p>
    <a class="efx-card__more" href="#">Leer más <span aria-hidden="true">→</span></a>
  </div>
</article>
```

**Estilos CSS**

```css
.efx-card {
  position: relative; display: block; background: var(--card);
  border: 1px solid var(--hair); border-radius: 20px; overflow: hidden;
  transition: opacity .7s var(--ease), transform .7s var(--ease),
              background var(--t-slow), box-shadow var(--t-slow);
}
.efx-card .bar-img {
  position: relative; height: 82px; overflow: hidden;
  border-bottom: 1px solid var(--hair);
  transition: height var(--t-slow);
}
.efx-card:hover .bar-img { height: 208px; }
.efx-card .pic { position: absolute; inset: 0; background-size: cover; transform: scale(1.12); }
.efx-card:hover .pic { transform: scale(1); }
.efx-card .ghost {
  position: absolute; top: 54px; left: 1.2rem; z-index: 0;
  font-family: var(--display); font-style: italic; font-size: 2.6rem;
  color: var(--azul-oscuro); opacity: .14; pointer-events: none;
}
.efx-card .body { position: relative; z-index: 1; padding: 1.3rem 1.3rem 1.5rem; }
```

---

### 1.2.6 `Band` · Banner crowdfunding

Bloque con foto de fondo + overlay del degradado de marca animado en `mix-blend-mode: multiply`.

**Estructura HTML**

```html
<section class="band" aria-labelledby="band-title">
  <p class="eyebrow">Pretítulo</p>
  <h2 id="band-title">Título con <em>énfasis</em>.</h2>
  <p>Cuerpo de texto…</p>
  <a class="btn-claro" href="#">CTA <span aria-hidden="true">→</span></a>
</section>
```

**Estilos CSS**

```css
.band {
  position: relative; isolation: isolate; overflow: hidden;
  color: #fff; border-radius: 28px;
  padding: clamp(2.6rem, 6vw, 5rem); min-height: 54vh;
  display: grid; align-content: center;
  background:
    url("…") center/cover no-repeat,
    linear-gradient(120deg, var(--arcilla), var(--calido-zen));
}
.band::before {
  content: ""; position: absolute; inset: 0; z-index: -1;
  mix-blend-mode: multiply; opacity: .8;
  background: linear-gradient(100deg, var(--azul-oscuro), var(--azul-sutil),
              var(--dorado), var(--azul-sutil), var(--azul-oscuro));
  background-size: 200% 100%; animation: flow 8s linear infinite;
}
.band h2 {
  font-family: var(--display); font-weight: 300;
  font-size: clamp(1.9rem, 4.4vw, 3.2rem);
  text-shadow: 0 2px 28px rgba(0,0,0,.55), 0 1px 4px rgba(0,0,0,.4);
}
```

---

### 1.2.7 `Carousel` · Testimonios infinitos

Carrusel horizontal con bucle por clonado, auto-avance vía `requestAnimationFrame`, pausa al hover/touch y degradados laterales como indicadores visuales.

**Estructura HTML**

```html
<div class="tcarousel-wrap">
  <div class="tcarousel" tabindex="0" role="region" aria-label="Citas">
    <div class="ttrack">
      <figure class="tcard">
        <blockquote>Cita…</blockquote>
        <figcaption><b>Nombre</b>Meta</figcaption>
      </figure>
      <!-- … -->
    </div>
  </div>
</div>
```

**Estilos CSS**

```css
.tcarousel {
  overflow-x: auto; overflow-y: hidden;
  scrollbar-width: none; -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain; cursor: grab;
}
.tcarousel::-webkit-scrollbar { display: none; }
.ttrack {
  display: flex; gap: 1.4rem; width: max-content;
  padding: 4rem clamp(1rem, 5vw, 3rem); align-items: stretch;
}
.tcard {
  flex: 0 0 clamp(290px, 40vw, 500px);
  background: var(--card); border: 1px solid var(--hair);
  border-radius: 20px; padding: 1.9rem 2rem; opacity: .72;
  transition: opacity var(--t-med), transform var(--t-med),
              box-shadow var(--t-med), border-color var(--t-med);
}
.tcard:hover, .tcard.is-active {
  opacity: 1; transform: scale(1.035);
  border-color: color-mix(in oklch, var(--azul-oscuro) 24%, transparent);
  box-shadow: 0 30px 60px -34px rgba(40,33,26,.45);
}
.tcarousel-wrap::before,
.tcarousel-wrap::after {
  content: ""; position: absolute; top: 0; bottom: 0;
  width: clamp(2rem, 6vw, 5rem); z-index: 2; pointer-events: none;
}
.tcarousel-wrap::before { left: 0;  background: linear-gradient(90deg,  var(--base-bg), transparent); }
.tcarousel-wrap::after  { right: 0; background: linear-gradient(270deg, var(--base-bg), transparent); }
```

---

### 1.2.8 `VideoFrame` · Reproductor con clip-path scroll-driven

`clip-path: ellipse()` animado por `animation-timeline: view()` para una apertura cinemática conforme el bloque entra en viewport.

**Estructura HTML**

```html
<div class="mission__video" role="button" tabindex="0" aria-label="Reproducir vídeo">
  <div class="mission__media" aria-hidden="true"></div>
  <div class="mission__overlay">
    <div class="mission__play" aria-hidden="true"></div>
    <p class="mission__caption">Caption</p>
  </div>
</div>
```

**Estilos CSS**

```css
.mission__video {
  position: relative; aspect-ratio: 16 / 9; overflow: hidden;
  border-radius: 18px; isolation: isolate; background: #0c0a08;
  clip-path: ellipse(78% 115% at 50% 50%);
  box-shadow: 0 40px 80px -40px rgba(40,33,26,.5);
  will-change: clip-path, transform;
}
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .mission__video {
      animation: maskGrow linear both;
      animation-timeline: view();
      animation-range: entry 8% cover 42%;
    }
    @keyframes maskGrow {
      from { clip-path: ellipse(34% 46% at 50% 50%); }
      to   { clip-path: ellipse(78% 115% at 50% 50%); }
    }
  }
}
```

---

### 1.2.9 `Modal` · Video lightbox

**Estructura HTML**

```html
<div class="vmodal" role="dialog" aria-modal="true" aria-label="Vídeo">
  <button class="x" aria-label="Cerrar">✕</button>
  <div class="frame"></div>
</div>
```

**Estilos CSS**

```css
.vmodal {
  position: fixed; inset: 0; z-index: 200;
  display: grid; place-items: center; padding: 5vw;
  background: rgba(28,18,10,.62);
  backdrop-filter: blur(8px);
  opacity: 0; pointer-events: none;
  transition: opacity var(--t-med);
}
.vmodal.open { opacity: 1; pointer-events: auto; }
.vmodal .frame {
  width: min(960px, 100%); aspect-ratio: 16 / 9;
  border-radius: 18px; overflow: hidden; background: #000;
  transform: scale(.94); transition: transform var(--t-slow);
}
.vmodal.open .frame { transform: scale(1); }
```

---

### 1.2.10 `Footer` · Hero físico + info

Pie con doble zona: una superior con canvas 2D de figuras físicas interactivas y otra inferior con información tipográfica clásica sobre fondo oscuro.

**Estructura HTML**

```html
<footer class="foot">
  <div class="foot__hero">
    <canvas class="foot__canvas" aria-hidden="true"></canvas>
    <div>
      <h2 class="foot__h">Título <em>destacado</em>.</h2>
      <p class="foot__hint">Indicación de interacción.</p>
    </div>
  </div>

  <div class="foot__info">
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <span class="logo-wave" role="img" aria-label="Marca"></span>
          <p class="tagline">Tagline…</p>
          <div class="social">
            <a href="#" aria-label="Red social"><svg class="ico">…</svg>Texto</a>
          </div>
        </div>
        <div>
          <h4>Navegar</h4>
          <a class="fl" href="#">Enlace</a>
        </div>
        <div>
          <h4>Contacto</h4>
          <address>…</address>
        </div>
      </div>
      <div class="foot-base">
        <span>© Año</span><span>Localización</span>
      </div>
    </div>
  </div>
</footer>
```

---

# Parte II · Informe Técnico

## 2.1 Análisis de consistencia y jerarquía

### Fortalezas

**Sistema de tokens cohesionado.** Toda la paleta cromática, tipografía, timings y easing están centralizados como CSS custom properties en `:root`. No existe ni un solo valor de color hexadecimal duplicado en estilos in-line; cada uso pasa por su variable semántica. Esto es excepcional para un fichero monolítico.

**Sistema tipográfico binario y disciplinado.** Únicamente dos familias (Fraunces display / Hanken Grotesk body) con cinco pesos. La jerarquía aplica `clamp()` en todas las cabeceras, lo que garantiza fluidez tipográfica sin breakpoints intermedios. Las cabeceras siguen una progresión coherente: H1 hero `clamp(2.7,7.4vw,6rem)` → H2 sección `clamp(2,4.5vw,3.3rem)` → H3 card `clamp(1.3,2.6vw,1.8rem)`.

**Sistema de motion homogéneo.** Tres duraciones (`--t-fast`, `--t-med`, `--t-slow`) y un único easing (`--ease: cubic-bezier(0.22,1,0.36,1)`) aplicados consistentemente. El degradado de marca (`flow` keyframe) se reutiliza idénticamente en logo, `.btn-amigo`, `.band::before` y `.zen-frase__titulo`, creando un lenguaje visual reconocible.

**Uso semántico del color.** La paleta cálida (lino → arena → arcilla → cálido-zen) construye una microescala de superficies sin necesidad de grises fríos. Los colores fríos (`--azul-oscuro`, `--azul-sutil`) se reservan estrictamente para acción/marca.

### Debilidades detectadas

**Inconsistencia en `border-radius`.** Existen al menos 11 valores distintos (4, 8, 10, 11, 14, 16, 18, 20, 22, 24, 26, 28, 30, 34, 40 px, 99px). No hay una escala discreta: cada componente elige un radio ad-hoc. Adicionalmente, la duplicación `border-radius` + `@supports (corner-shape)` con valores diferentes (ej. 20px → 22px en `.btn-amigo`) crea un drift visual sutil entre navegadores.

**Sombras sin escala.** Cada componente define su propia sombra con offsets y valores únicos (`0 12px 28px -14px`, `0 16px 40px -18px`, `0 22px 50px -18px`, `0 28px 64px -34px`, `0 30px 60px -34px`, `0 40px 80px -40px`). No hay una escala de elevación (z1–z6) reusable.

**Magic numbers en spacing.** Pese a usar `clamp()` para padding vertical de secciones, las distancias internas mezclan rem hardcodeados (`1.2rem`, `1.3rem`, `1.4rem`, `1.6rem`, `1.7rem`, `1.9rem`, `2rem`, `2.4rem`, `2.6rem`) sin obedecer a una escala 4/8/16 ni a un múltiplo coherente.

**Repetición lógica del logo.** El bloque SVG completo del logotipo (~140 líneas) aparece duplicado: una vez como fallback en el header (`.logo-fallback`) y una vez en el footer. En producción esto debe ser un sprite SVG o componente reutilizable.

**`.eyebrow` con dos definiciones de tamaño.** Definida globalmente como `0.74rem` y redefinida localmente en `.zen-frase__eyebrow` como `0.78rem`. Aunque la diferencia es mínima, rompe el contrato del token.

---

## 2.2 Diagnóstico de accesibilidad (WCAG) y semántica

### Estructura semántica

| Elemento | Estado | Notas |
|---|---|---|
| `<header class="bar">` | ✅ Correcto | Falta `role="banner"` explícito (opcional, implícito por `<header>` raíz) |
| `<main>` | ✅ Correcto | Único, envuelve todo el contenido principal |
| `<section>` con `aria-labelledby` | ✅ Buen patrón | Aplicado en `#sobre-nosotros`, `#cursos`, `#participa`, `#blog`, `#amigo` |
| `<nav aria-label="Principal">` | ✅ Correcto | Etiqueta explícita |
| `<footer id="contacto">` | ⚠️ Mixto | Bien estructurado; `id="contacto"` en el footer es semánticamente confuso (sugiere que es el destino de "Contacto") |
| `<article class="efx-card">` | ✅ Correcto | Uso apropiado para items de blog |
| Jerarquía de encabezados | ⚠️ Revisar | Un único `<h1>` en hero ✅. Pero existen H2 huérfanos sin H1 contextual previo y algunos `<h2>` siguen a otros `<h2>` sin H3 intermedio en bloques anidados |

### Problemas concretos detectados

**1. Texto sobre vídeo sin contraste garantizado.** El hero usa overlay con `opacity: .62` y `mix-blend-mode: multiply` sobre vídeo. El velo `::after` ayuda, pero no hay test de contraste programático que garantice WCAG AA (4.5:1) en frames brillantes del vídeo. La banda de crowdfunding aplica `text-shadow` agresivo (`0 2px 28px rgba(0,0,0,.55)`) como compensación — patrón frágil.

**2. Modal incompleto.** `.vmodal` declara `role="dialog"` y `aria-modal="true"`, pero:
- No implementa focus trap (Tab puede escapar al fondo).
- No oculta el contenido detrás con `inert` o `aria-hidden`.
- El foco vuelve al trigger correctamente, ✅.

**3. Burger menu hack con checkbox.** El patrón `<input class="nt" type="checkbox" hidden>` + `<label class="burger">` es CSS-only pero rompe accesibilidad:
- El `<label>` no expone estado `aria-expanded` al menú.
- No hay anuncio a screen reader del cambio de estado.
- Falta `aria-controls` apuntando al `<nav>`.

**4. `role="button"` sin teclado completo.** El `.mission__video` tiene `role="button" tabindex="0"` y handler de `Enter`/`Space` ✅. Pero `.flip-celda` (que se expande en focus) es un `<a>` real, lo cual es correcto, aunque el `aria-expanded` debería anunciarse cuando el grid expande la tarjeta activa.

**5. Atributos `alt` ausentes.** No hay imágenes `<img>` con `alt` porque todas se cargan via `background-image`. Esto las hace inaccesibles para lectores de pantalla y para indexación. Imágenes con valor semántico (poster del vídeo, fotos de cursos) deberían ser `<img>` con `alt` o, si decorativas, marcadas con `aria-hidden="true"` en su contenedor.

**6. Canvas decorativos sin alternativa.** `#fluido` y `#physics` están bien marcados `aria-hidden="true"` ✅. Respetan `prefers-reduced-motion` ✅.

**7. Indicador de scroll sin texto accesible.** `.zen-intro_scroll-hint` contiene solo "Desciende" como texto plano; correcto, pero la animación visual no tiene equivalente para usuarios con motor de pantalla.

**8. Tarjetas de testimonios cíclicas sin pausa accesible.** El carrusel se auto-reproduce. No hay botón de play/pausa visible (solo se pausa al hover), violando WCAG 2.2.2 (contenido en movimiento debe ser pausable por el usuario explícitamente).

**9. Focus visible bien gestionado.** `:focus-visible` global con `outline: 2px solid var(--azul-oscuro); outline-offset: 4px` ✅.

**10. `prefers-reduced-motion` ampliamente respetado** ✅. Cobertura: rotator, fluido WebGL, físicas del footer, ScrollTrigger, hero video, fallback hero, partícula `beat`. Excelente.

### Validación de orden lógico de encabezados

```
H1 (hero) → "Despierta tu sabiduría interior."
├── H2 (bienvenidos) → "Un puente entre la sabiduría…"
├── H2 (frase) → "El Camino hacia la Orilla…"
├── H2 (cursos) → "La sabiduría más profunda…"
│   └── H3 × 6 (.flip-celda__titulo)
├── H2 (participa) → "Hay muchas formas de caminar juntos."
│   └── H3 × 3 (.via)
├── H2 (band crowdfunding) → "Construyamos juntos…"
├── H2 (testimonios) → "Voces de quienes ya caminan."
├── H2 (blog) → "Artículos destacados"
│   └── H3 × 4 (.efx-card)
├── H2 (CTA final) → "Respira. Observa. Suelta."
└── H2 (footer hero) → "Practiquemos juntos."
    └── H4 × 2 (Navegar, Contacto)
```

El árbol es válido y profundo. No hay saltos H2 → H4 ni encabezados perdidos.

---

## 2.3 Recomendaciones de refactorización y escalabilidad

### Prioridad ALTA

**1. Fragmentar el monolito en módulos.** El archivo HTML/CSS/JS único excede 1700 líneas. Refactorización a una arquitectura por componentes:

```
src/
├── tokens/
│   ├── color.css         # @layer tokens
│   ├── typography.css
│   ├── spacing.css
│   ├── motion.css
│   └── index.css
├── components/
│   ├── Navbar/
│   ├── Button/
│   ├── Hero/
│   ├── FlipGrid/
│   ├── BlogCard/
│   ├── Carousel/
│   ├── VideoFrame/
│   ├── Modal/
│   └── Footer/
├── effects/
│   ├── fluidWebGL.js
│   ├── physicsCanvas.js
│   └── rotator.js
└── pages/
    └── home.html
```

**2. Tokenizar radios y sombras en escala discreta.**

```css
@layer tokens {
  :root {
    /* Radius scale */
    --r-xs:   4px;
    --r-sm:   8px;
    --r-md:  12px;
    --r-lg:  16px;
    --r-xl:  20px;
    --r-2xl: 24px;
    --r-3xl: 32px;
    --r-pill: 99px;

    /* Elevation scale */
    --shadow-1: 0 1px 2px rgba(40,33,26,.06);
    --shadow-2: 0 4px 12px -2px rgba(40,33,26,.10);
    --shadow-3: 0 12px 28px -8px rgba(40,33,26,.18);
    --shadow-4: 0 24px 50px -16px rgba(40,33,26,.28);
    --shadow-5: 0 40px 80px -30px rgba(40,33,26,.45);

    /* Spacing scale (4px base) */
    --s-1:  .25rem; --s-2:  .5rem;  --s-3:  .75rem; --s-4: 1rem;
    --s-5: 1.25rem; --s-6: 1.5rem;  --s-8:  2rem;
    --s-10: 2.5rem; --s-12: 3rem;   --s-16: 4rem;   --s-20: 5rem;
  }
}
```

**3. Migrar imágenes decorativas críticas a `<picture>` con `srcset`.** Las cargas via `background-image` impiden lazy-loading nativo, `loading="lazy"`, `fetchpriority="low"` y entrega responsive (AVIF/WebP). En particular: posters de cursos (`flip-celda__pic`), banner `.band`, posters de blog.

**4. Implementar focus trap real en el modal.** Sustituir el lightbox actual por `<dialog>` nativo de HTML5:

```html
<dialog id="vmodal" aria-label="Vídeo institucional">
  <button autofocus aria-label="Cerrar">✕</button>
  <video controls></video>
</dialog>
```

```js
trigger.addEventListener('click', () => vmodal.showModal());
```

El elemento `<dialog>` proporciona focus trap, scroll lock, ESC handler e `inert` del fondo de forma nativa.

**5. Carrusel WCAG-compliant.** Añadir controles explícitos play/pause y `aria-live="polite"`:

```html
<div class="tcarousel-wrap" role="region" aria-label="Testimonios" aria-roledescription="carousel">
  <button class="tcarousel-toggle" aria-pressed="false">Pausar</button>
  <div class="tcarousel" aria-live="polite">…</div>
</div>
```

### Prioridad MEDIA

**6. Adoptar Utility-First selectivamente.** El proyecto NO debería migrarse íntegramente a Tailwind (perdería la expresividad de las animaciones custom y los degradados de marca), pero un híbrido es óptimo:

- CSS Modules / `@layer components` para componentes estructurales (`.hero`, `.flip-celda`, `.efx-card`).
- Utility classes para layout primitivo (`flex`, `grid`, `gap`, `p-*`).
- CSS custom properties para tokens (universales).

**7. Extraer el WebGL fluid a un módulo standalone.** Las ~350 líneas del shader contaminan el archivo. Aislar como ESM:

```js
// effects/fluidBackground.js
export function mountFluidBackground(canvas, options = {}) { … }
```

Con tree-shaking y `import()` dinámico bajo `IntersectionObserver`, se difiere su carga hasta que el usuario haya hidratado la página.

**8. Sustituir GSAP por CSS scroll-driven animations cuando sea posible.** Tres de los cuatro efectos GSAP (zoom-out frase, ornamentos CTA, zoom-stage CTA) son scrub-based y replicables con `animation-timeline: view()` nativo, eliminando ~50KB de dependencia para esos tres bloques. Solo el grid FLIP justifica el peso de GSAP+Flip plugin.

**9. Tipar el JS con TypeScript / JSDoc.** Funciones como `initFluido`, `initCarrusel`, `initFooterFisicas` no tienen contratos. Migrar a TS o, mínimo, añadir JSDoc para validar inputs.

**10. Sistema de naming consistente.** El proyecto mezcla BEM (`.efx-card__more`, `.flip-celda__titulo`), kebab-case plano (`.bar-inner`, `.idx-foot`) y atajos (`.t-link`, `.nt`, `.idx`). Estandarizar BEM estricto o adoptar CSS Modules con scope automático.

### Prioridad BAJA

**11. Considerar Container Queries** en lugar de media queries globales para `.flip-grid`, `.foot-grid`, `.mission-grid` — permitiría que estos componentes sean reutilizables en sidebars sin reescribir breakpoints.

```css
.flip-grid { container-type: inline-size; }
@container (max-width: 720px) { .flip-grid { grid-template-columns: repeat(2, 1fr); } }
```

**12. Logo como Web Component.** Encapsular `<paramita-logo size="…" animated="…">` para evitar la duplicación SVG entre header/footer y poder controlar `prefers-reduced-motion` desde un único punto.

**13. Implementar Content Security Policy.** El uso de `cdnjs.cloudflare.com` para GSAP requerirá una CSP explícita en producción (`script-src 'self' cdnjs.cloudflare.com`) o auto-hostear GSAP.

**14. Tests de regresión visual.** Storybook + Chromatic o Playwright para snapshots de cada componente en hover/focus/expanded states.

**15. Performance budget.** El hero carga vídeo `.mp4` sin variante WebM/AV1, sin poster `loading="eager"` explícito, y sin `Content-Length`. Añadir `<source type="video/webm">` antes del MP4 y un `<picture>` poster como `object-fit` cover hasta que el vídeo esté `canplay`.

---

## Resumen ejecutivo de deuda técnica

| Categoría | Severidad | Esfuerzo estimado |
|---|---|---|
| Fragmentación del monolito | Alta | 5–8 días |
| Tokens de radius/shadow/spacing | Alta | 1–2 días |
| Modal nativo `<dialog>` + focus trap | Alta | 0.5 día |
| Carrusel WCAG controls | Alta | 1 día |
| Migración a `<picture>` responsive | Media | 2–3 días |
| Extracción WebGL a módulo | Media | 1 día |
| Sustitución GSAP → scroll-timeline CSS | Media | 2 días |
| BEM estricto / CSS Modules | Media | 3 días |
| Container queries | Baja | 1 día |
| Web Component del logo | Baja | 0.5 día |

---

## Veredicto técnico

El archivo demuestra un dominio sólido de CSS moderno (`@layer`, `color-mix()`, `oklch`, `@supports`, `animation-timeline`, `corner-shape`, `:has()`), un sistema visual coherente y una excelente cobertura de `prefers-reduced-motion`. Su mayor debilidad es estructural (monolito, falta de tokenización de geometrías) y de accesibilidad en patrones interactivos complejos (modal, carrusel auto-play, burger).

Es una base **excepcionalmente buena para refactorizar** hacia un design system productivo, no para mantener en producción tal cual.

---

<sub>Documento generado a partir del análisis estático de `paramita-index-v3.html` · Metodología Atomic Design · Estándares WCAG 2.x</sub>
