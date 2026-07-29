# Traspaso · Migración de las fuentes a autoalojado (self-hosting)

**Para:** el chat que gestiona el HTML de *formación* y el que gestiona el HTML de *cursos*.
**Contexto:** en la home ya se han sustituido las fuentes de Google Fonts por versiones **autoalojadas, variables y subseteadas**, por rendimiento (mejora del LCP: se elimina la dependencia de `fonts.googleapis` + `fonts.gstatic` y se precarga el archivo exacto desde nuestro propio origen). Hay que aplicar el mismo cambio en esta página para no tener las dos vías de carga conviviendo.

Esta página **no** genera archivos de fuente nuevos: los archivos ya existen y se comparten. Aquí solo hay que **editar el `<head>` del HTML de esta página**.

---

## Archivos que ya existen en el proyecto (los aporta Jana, no hay que crearlos)

- `assets/fonts/fraunces-latin.woff2`
- `assets/fonts/fraunces-italic-latin.woff2`
- `assets/fonts/hanken-latin.woff2`
- `assets/fonts/hanken-italic-latin.woff2`
- `css/tokens/paramita-fuentes.css` — contiene las cuatro reglas `@font-face`.

Las fuentes son **woff2 variables**, subseteadas a latin + latin-ext + latin extended additional (IAST: ā ī ū ṃ ḥ ṭ ḍ ṇ ś ṣ ṛ… para transliteración sánscrita/tibetana) + puntuación tipográfica. Fraunces **conserva sus cuatro ejes** (`opsz`, `wght`, `SOFT`, `WONK`); no están instanciados.

---

## Qué hacer en el `<head>` de esta página · tres cambios

### 1 · Quitar el bloque de Google Fonts

Eliminar las tres líneas (o equivalentes) que cargan las fuentes desde Google:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:...&family=Hanken+Grotesk:...&display=swap" rel="stylesheet">
```

### 2 · Añadir el preload de las dos fuentes críticas (las normales)

Cerca del inicio del `<head>`, **antes** de los `<link rel="stylesheet">`:

```html
<link rel="preload" href="assets/fonts/fraunces-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/hanken-latin.woff2" as="font" type="font/woff2" crossorigin>
```

Solo se precargan las **normales** (son las que entran en el primer render). Las italic se cargan bajo demanda vía `@font-face` cuando aparece texto en cursiva; no se precargan.

### 3 · Enlazar `paramita-fuentes.css` antes de `paramita-tipografia.css`

```html
<link rel="stylesheet" href="css/tokens/paramita-fuentes.css">
<link rel="stylesheet" href="css/tokens/paramita-tipografia.css">
```

El orden importa: `paramita-tipografia.css` consume las familias (`--display`, `--body`), así que las `@font-face` deben declararse antes.

---

## Detalles críticos (no saltárselos)

- **`crossorigin` es obligatorio en el preload de fuentes**, incluso siendo mismo origen. Sin él, el navegador descarga el archivo dos veces (una por el preload, otra por el `@font-face`).

- **Rutas relativas · ajustar según la profundidad de la página.** Los ejemplos de arriba asumen que el HTML está en la raíz (como la home). Si esta página vive en una subcarpeta (p. ej. `formacion/index.html`), el `href` del preload sube un nivel: `../assets/fonts/...`. El `@font-face` de `paramita-fuentes.css` usa `../../assets/fonts/` porque el CSS vive en `css/tokens/` — eso no cambia entre páginas. Si dudas de la profundidad, usa **rutas absolutas desde la raíz** (`/assets/fonts/...`, `/css/tokens/...`), que funcionan igual a cualquier profundidad siempre que el sitio se sirva desde la raíz del dominio.

- **No tocar ni instanciar los ejes.** El eje `SOFT` de Fraunces (el del cruce, animado por scroll con `@property`) sigue vivo en el archivo variable. El `@font-face` solo mapea peso y estilo; los `font-variation-settings` de `paramita-tipografia.css` siguen controlando `opsz` y `SOFT` sin cambios.

- **`font-display: swap`** ya está en cada `@font-face`; no hay que añadirlo en el HTML.

---

## Verificación en browser (con caché desactivada)

1. En la pestaña **Network**, los `.woff2` cargan desde nuestro propio dominio, **no** desde `fonts.gstatic.com`, y con prioridad alta por el preload.
2. El eje **`SOFT` sigue animando** al hacer scroll en los títulos Fraunces.
3. Las **cursivas doradas** (Fraunces italic, los `<em>`) se ven correctas — es un archivo aparte.
4. Cualquier **término sánscrito/IAST** (ā, ṃ, ś, ṭ, ḍ, ṇ…) presente en la página **no** cae a fuente de sistema. Si alguno cae, avisar para ampliar el subconjunto de glifos (`unicode-range`).

---

*Este cambio es puramente de carga de fuentes: no altera tokens, tamaños, pesos ni la identidad tipográfica. Si algo se ve distinto más allá de un posible micro-reflow al primer pintado, revisar el orden de los `<link>` (paso 3) antes que nada.*
