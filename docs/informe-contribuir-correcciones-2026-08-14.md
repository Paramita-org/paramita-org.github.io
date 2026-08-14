# Informe · Correcciones de `contribuir.html`

**Fecha:** 14 de agosto de 2026
**Página:** `/contribuir/contribuir.html`
**Archivos tocados:** `contribuir.html` · `paramita-contribuir.css` · `paramita-contribuir.js` · `partials/pictogramas/becas.svg` · `partials/pictogramas/encuentros.svg`
**Método:** una decisión cada vez, archivos completos (no diffs), validación en navegador entre pasos, contraste con los informes/doctrina del proyecto.

Se abordaron seis puntos. Todos cerrados salvo el 6, que queda aparcado para una revisión más a fondo de esas tarjetas.

---

## Resumen de estado

| # | Punto | Estado | Archivos |
|---|-------|--------|----------|
| 1 | Hero en móvil centrado | ✅ Hecho | `paramita-contribuir.css` |
| 2 | Trazo de luz en la card destacada | ✅ Hecho (reversible) | `contribuir.html`, `.css`, `.js` |
| 3 | Ofrenda puntual sin preselección | ✅ Hecho | `contribuir.html`, `.js` |
| 4 | Pictogramas de Transparencia (Becas, Encuentros) | ✅ Hecho | `contribuir.html`, 2× `.svg` |
| 5 | Testimonios al componente canónico | ✅ Hecho | `contribuir.html`, `.css`, `.js` |
| 6 | Alineación picto/título en «Otras formas» | ⚠️ Aparcado | `paramita-contribuir.css` |
| 7 | Fondo del cierre «Camina cerca», distinto del anterior | ✅ Hecho | `paramita-contribuir.css` |

---

## 1 · Hero en móvil — imagen centrada

**Causa.** El override móvil del sistema (`object-position:center center`) vive en `paramita-hero.css` y solo apunta a `.hero__bg-video`. El hero de contribuir es `.hero--foto` con `.hero__bg-img` (fondo por `background-image`, fijado a `background-position:center right`) y **no tenía regla móvil**, así que recortaba a la derecha.

**Solución.** En `paramita-contribuir.css`, mismo breakpoint que el sistema (768px):

```css
@media(max-width:768px){
  .hero--foto .hero__bg-img{background-position:center center}
}
```

Sin conflicto doctrinal. Validado.

---

## 2 · Card destacada — luz que recorre el contorno

**Qué es.** Una luz dorada difusa, situada **detrás** de la card, que recorre su contorno en bucle (la card opaca tapa el centro y solo asoma el resplandor por el canto). Distingue a la cuota de 30 €/mes de las otras dos.

**Recorrido de diseño (iteración con Jana).** Se probaron y descartaron: (a) trazo al hover (no visible en reposo, y sin hover en móvil); (b) borde-degradado grueso (poco elegante, «trazo sobre trazo»); (c) bola nítida sobre el borde (dura). La versión final: destello dorado *pequeño y luminoso* (no naranja, no blanco), por debajo de la card, con borde dorado de la card recuperado.

**Técnica.**
- Envoltorio **aditivo** `.cuota-halo` alrededor de `.cuota--destacada` (la card **no se modifica por dentro**).
- `.cuota-halo__amb` = resplandor ambiental de reposo (dorado tenue, todo el canto).
- `.cuota-halo__luz` = luz que recorre el contorno vía `offset-path`, con núcleo cálido que funde al `--dorado` del sistema.
- El `offset-path` se genera en JS a partir del **tamaño real** de la card (rejilla fluida) y se reescribe con `ResizeObserver`. Fallback: si no hay soporte de `offset-path`, se oculta la luz y queda el resplandor ambiental.

**Valores actuales (afinables sin tocar código):** `--halo-vel: 7s` (velocidad) y `--halo-tam: 64px` (tamaño) sobre `.cuota-halo__luz`.

**Gateo / accesibilidad.**
- Freno global: `:root[style*="--identidad-estado: reposo"] .cuota-halo__luz{display:none}` → se congela con el resto del sitio.
- `prefers-reduced-motion: reduce` → la luz se oculta; queda la card en su estado dorado de reposo.

**Nota de coherencia (registrada, no bloqueante).** Es una luz perpetua: corre también en móvil y es un foco continuo sobre «la más elegida», justo lo que el `informe 16` tendía a evitar. Se mantiene fina, lenta y sin estela por decisión de diseño de Jana.

**➤ Reversibilidad — nota «halo destacada» para el informe de cierre.**
Es 100 % aditivo. Para volver al estado anterior:
1. Desenvolver la card: quitar `.cuota-halo` y sus dos `<span>`, dejando `<div class="cuota cuota--destacada">` como hijo directo de `.cuotas`.
2. Borrar en `paramita-contribuir.css` el bloque «Card destacada · HALO» y, en el reduced-motion, la línea `.cuota-halo__luz{display:none}`.
3. Borrar en `paramita-contribuir.js` el IIFE «Card destacada · halo de luz».

`.cuota--destacada` (borde dorado + `box-shadow`) queda exactamente como estaba. Sin borrar nada, poner el sitio en `--identidad-estado: reposo` detiene la luz en todas partes.

---

## 3 · Ofrenda puntual — sin preselección

**Decisión.** Ningún chip preseleccionado (ni 50 € ni «Otra»). Es lo más coherente con el `informe 16 §1`, que rechaza explícitamente el **«anclaje inflado»** y la casilla premarcada, con el objetivo de que «quien da quede contento antes, durante y después». Preseleccionar 50 € era un ancla.

**Cambios.**
- `contribuir.html`: los cuatro chips arrancan `aria-pressed="false"`; la línea de impacto arranca neutra («Cada cantidad tiene un destino concreto. Gracias por tu generosidad.»); el botón arranca como «Donar» (sin cifra). El campo libre sigue oculto hasta pulsar «Otra».
- `paramita-contribuir.js`: estado inicial neutro (`actual = { val: "", txt: "" }`). Si se pulsa «Donar» sin elegir, el foco va al campo libre si «Otra» está activa, o al primer importe si no hay nada elegido (guía suave, no bloquea).

**Peaje asumido.** Un formulario sin defecto convierte un pelín peor, pero el `informe 16` prioriza la ética y la calma sobre exprimir conversión. Si en navegador se ve demasiado desnudo, pasar a «Otra por defecto» es un cambio mínimo.

---

## 4 · Pictogramas de Transparencia — Becas y Encuentros

**Mecánica clave (evita perder el trabajo).** `sync.py` **regenera el SVG interno de cada `<span data-pico="…">` desde `partials/pictogramas/{nombre}.svg` en cada pasada**, y la GitHub Action corre en todo push que toque `partials/**`. Por tanto, el arreglo durable va en el archivo canónico del partial, no en el inline del HTML.

**Deriva evitada.** «Encuentros semanales en directo» reutilizaba `data-pico="acompanado"`, que es un **pictograma de modalidad compartido**. Se creó un pictograma **dedicado** `encuentros` y se dejó `acompanado` intacto.

**Rediseños entregados** (canon: `viewBox 0 0 24 24`, `fill none`, `stroke currentColor`, `stroke-width 1.5`, caps redondeados, un único `.acc` dorado):
- **`becas.svg`** — corazón acogido en la mano abierta (antes no se leía ni la mano ni el corazón).
- **`encuentros.svg`** — figura central con ondas de presencia «en directo» (antes: una sola persona; distinta del picto de *crowdfunding*).

**HTML.** En `contribuir.html`, el bloque «Encuentros» pasa de `data-pico="acompanado"` a `data-pico="encuentros"`, y ambos SVG inline (becas y encuentros) se dejaron ya idénticos a los de `partials/pictogramas/`, así que al correr `sync.py` no habrá cambios ni errores en estos dos (solo los confirma).

**Secuencia de despliegue (importante).**
1. Colocar los `.svg` en `partials/pictogramas/` (ya hecho por Jana: `becas.svg` sobrescrito, `encuentros.svg` nuevo).
2. Aplicar el `contribuir.html` con el `data-pico` cambiado.
3. `git pull` (por las commits de la Action) → refrescar con `python3 partials/sync.py contribuir/contribuir.html --only-pictos` (o dejar que la Action lo haga al hacer push tocando `partials/**`).
4. Validar con caché limpia (Cmd+Shift+R).

> Regla: **el `.svg` debe existir en la carpeta antes** de que `sync.py` vea el `data-pico`, o corta con «No existe el pictograma …».

---

## 5 · Testimonios — al componente canónico

**Causa raíz.** El bloque usaba marcado antiguo `.testimonios > .testi`, estilado a mano en `paramita-contribuir.css`, y la página **no cargaba** `paramita-testimonios.css/js` ni `paramita-video.css/js`. Además, `paramita-contribuir.js` tenía su **propio handler de vídeo antiguo que no pintaba miniatura** (por eso los facades eran solo el degradado). En `emi-1` se ve bien porque sí usa el componente canónico.

**Migración (misma receta que emi-1).**
- `contribuir.html`: `<link>` a `paramita-video.css` + `paramita-testimonios.css`; `<script defer>` `paramita-video.js` → `paramita-testimonios.js`; bloque reescrito a `.bloque-voces > .voces > figure.voz.voz--video` con los datos reales (Amparo/Gabriel/César y sus IDs; lugar → `.voz__meta`). Sin `data-reveal` en el contenedor (el revelado lo gestiona `paramita-testimonios.js` con `.in`).
- `paramita-contribuir.js`: eliminado el handler de vídeo antiguo (lo asume el canónico `paramita-video.js`, que pinta la miniatura real y reproduce inline con controles nativos).
- `paramita-contribuir.css`: retiradas las reglas `.testimonios/.testi/.video-facade…`; conservados `.cita-maestro` y `.video-zona`. El vídeo institucional (`data-yt=""`) queda como placeholder correcto, sin listeners.

**Nota de coherencia.** Esta migración **sustituye** el plan anterior de «poster images + `.vmodal`» para los previews de vídeo: ya existe el componente canónico (miniatura real + reproducción inline) y es lo que usa `emi-1`, así que adoptarlo respeta el principio de «una sola fuente canónica».

**Copy pendiente (no bloqueante).** El bloque va sin cabecera propia. Si Ale/Khenpo quieren, se le puede añadir un `head` tipo «Voces del sendero» — es solo copy.

---

## 6 · «Otras formas de acompañar» — alineación picto/título ⚠️ APARCADO

**Causa.** En `.otra-card` (flex, `align-items:flex-start`) el picto mide 34 px y el `h4` local baja a 1.08 rem; el centro óptico del icono cae ~8 px por debajo de la línea del título. Además, como `.pico` es ítem flex, su `min-height:auto` se resolvía al tamaño del SVG e ignoraba cualquier `height` reducido.

**Intento aplicado** (en el archivo, funcional pero no convence del todo a Jana):

```css
.ap .otra-card .pico{width:auto;height:calc(1.08rem * var(--leading-h4));min-height:0;align-items:center;margin-top:0;flex:none}
```

**Decisión.** Se deja así de momento; **se retomará a fondo** el diseño de estas tarjetas más adelante (revisión mayor, no solo alineación). Plan B disponible si se retoma: reordenar `.otra-card` a grid (icono + título en la misma fila centrada, texto debajo), que alinea por construcción.

---

## 7 · Fondo del cierre «Camina cerca» — halo radial dorado

**Causa.** «Otras formas de acompañar» (`.sec-arena`) y el cierre «Camina cerca» (`.cierre`) eran **las dos arena** y consecutivas → se fundían en un solo bloque sin separación.

**Decisión.** Se diferencia el cierre con el tratamiento de la sección «Da el primer paso» del index (`.cta-final`): base **lino** + un **halo radial dorado ambiental** («atmósfera, no efecto»). Rompe la fusión (arena→lino) y da coherencia de sitio, ya que ambos cierres son secciones de newsletter. Se descartó la opción B (zona de luz difusa de meditación) por contrastar menos con la arena de encima y pertenecer más al lenguaje de meditación que al de un cierre-CTA.

**Implementación** (aditiva, en `paramita-contribuir.css`, sin tocar el contenido):

```css
.cierre{position:relative;isolation:isolate;overflow:hidden;background:var(--lino);text-align:center}
.cierre::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;
  background:radial-gradient(ellipse 70% 60% at 50% 55%,
    color-mix(in oklch,var(--dorado) 14%,transparent) 0%,
    color-mix(in oklch,var(--dorado) 6%,transparent) 42%,
    transparent 75%)}
```

El eyebrow sigue gris (nunca dorado) y el oro solo aparece como atmósfera y en el `<em>` del título. Cadencia inferior recompuesta: Transparencia (lino) → Tradición viva (arena) → (lino) → Otras formas (arena) → **Cierre (lino + halo)** → prefooter.

---

## Archivos entregados en esta sesión

- `contribuir.html` — acumula puntos 2, 3, 4 (HTML) y 5.
- `paramita-contribuir.css` — puntos 1, 2, 5 (+ intento del 6).
- `paramita-contribuir.js` — puntos 2, 3, 5.
- `partials/pictogramas/becas.svg` — rediseño (punto 4).
- `partials/pictogramas/encuentros.svg` — nuevo (punto 4).

**Orden de aplicación sugerido:** sustituir los tres archivos de página + confirmar los dos `.svg` en `partials/pictogramas/` → `git pull` → `sync.py` (o push tocando `partials/**`) → validar con Cmd+Shift+R.

---

## Doctrina contrastada (registro)

- **`informe 16`** — rechazo del anclaje inflado y de la casilla premarcada → respalda el punto 3 (sin preselección). También la cautela sobre focos de presión permanentes → nota del punto 2.
- **`doc 04` (motion)** — los bucles `infinite` se reservan a la familia identitaria o UX funcional documentada; «hover intensifica lo que ya vive». El halo del punto 2 se engancha al freno global `--identidad-estado` y respeta `prefers-reduced-motion`.
- **Canon de pictogramas** — respetado en los dos rediseños; `acompanado` no se pisa (nombre dedicado `encuentros`).
- **`sync.py`** — los pictogramas se regeneran desde `partials/pictogramas/`; el arreglo durable va ahí, no en el inline.

---

## Pendientes / en el horizonte

- **Punto 6:** rediseño a fondo de las tarjetas de «Otras formas» (alineación incluida).
- **Alberto:** pasarela de pago real para los CTA de donación (hoy `setTimeout` de demo); endpoints reales de formularios/reservas; los textos `data-txt` de impacto son provisionales.
- **Ale / Khenpo:** validación de copy (incluida la posible cabecera «Voces del sendero» del bloque de testimonios) y doctrina.
- **Vídeo:** ID real para el vídeo institucional (hoy placeholder). Los testimonios ya usan sus IDs reales.
- **Informe de cierre:** al terminar, recoger en el `informe-*.html` editorial la nota **«halo destacada»** (reversibilidad del punto 2) junto al resto.

---

## Recordatorios operativos

- Servir siempre desde la raíz del repo (`python3 -m http.server 8000`); las rutas absolutas fallan bajo `file://`.
- `git pull` antes de empezar y antes de cada push (la Action `sync.yml` deja commits automáticos).
- Validar en navegador con recarga forzada (Cmd+Shift+R) por caché.
