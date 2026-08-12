# Traspaso · Cómo enlazar navbar, footer y tema en páginas nuevas

> Paramita · Fundación Sakya · guía operativa para crear páginas que faltan
> (empezando por `/meditacion/`) y dejarlas integradas como el resto del sitio.

---

## 0 · La duda resuelta primero

**¿El navbar funcionará cuando ponga la página nueva en su carpeta?** Sí.
Los enlaces del navbar y del footer son **rutas absolutas** (`/meditacion/meditacion.html`,
`/sobre/la-fundacion/la-fundacion.html`, etc.). Hoy dan 404 solo porque el archivo
todavía no existe. **En cuanto crees el archivo en su ruta, el enlace resuelve solo** —
no hay que tocar el navbar ni el footer para "conectar" la página nueva.

Lo único que hay que hacer en cada página nueva es **darle a ELLA** su navbar + footer +
tema, con el script `sync.py`. Eso es lo que explica este documento.

---

## 1 · Estado del proyecto (de dónde venimos)

Existe un sistema de **partials + un script de propagación** que evita copiar el
navbar/footer a mano en cada página:

- `partials/navbar-publico.html` — navbar de páginas públicas (fuente única).
- `partials/navbar-practicante.html` — navbar de páginas logueadas (usa el componente `.cuenta`).
- `partials/footer.html` — footer (fuente única).
- `partials/prefooter.html` — bloque "Practiquemos juntos" (opcional por página).
- `partials/sync.py` — **el propagador**: mete navbar + footer + (opcional) tema + pictogramas
  dentro de una página, detectando la profundidad sola.
- `css/componentes/paramita-tema.css` — modo penumbra/luz (dark mode).
- `js/componentes/paramita-tema.js` — listener del toggle del sol.

Páginas YA integradas (navbar + footer + tema, verificadas): `index.html`,
`formacion/formacion-publica.html`, `formacion/emi-1-calma-y-lucidez/…`,
`actividades/actividades.html`, `contribuir/contribuir.html`,
`blog/blog.html`, `blog/maqueta-blog-entrada.html`,
`home-logueado/home-logueado.html`, `formacion-logueado/formacion-logueado.html`.

**Páginas por hacer** (el navbar ya las enlaza; dan 404 hasta que existan):
`/meditacion/meditacion.html`, `/unete/unete.html`, y las cinco de `/sobre/`:
`maestros/`, `khenpo/`, `sangha-monastica/`, `la-fundacion/`, `preguntas-frecuentes/`.

---

## 2 · Convención de rutas (IMPORTANTE)

- **Estructura de carpeta = archivo con el mismo nombre**:
  `/meditacion/meditacion.html`, `/sobre/khenpo/khenpo.html`, etc.
  (No es `/meditacion/index.html`.)
- **Enlaces internos del navbar/footer: absolutos** (`/…`). Funcionan servidos desde
  la **raíz del dominio** (la user page `janams-paramita.github.io` o el dominio propio).
- **Assets de la página (CSS/JS/img): relativos por profundidad**. A un nivel
  (`/meditacion/…`) → `../css/…`, `../js/…`. A dos niveles (`/sobre/khenpo/…`) →
  `../../css/…`. El `sync.py` **detecta el prefijo solo** leyendo un `<link>` existente,
  así que las piezas del tema quedan a la profundidad correcta sin que hagas nada.
- Servir SIEMPRE por `http://` (Live Server / `python3 -m http.server`), **nunca `file://`**
  (con `file://` el logo enmascarado y las rutas absolutas fallan).

---

## 3 · El `<head>` estándar de una página pública nueva

Copiar este `<head>` (ejemplo para profundidad de UN nivel, `/meditacion/` → `../`).
Ajusta el set de componentes a lo que la página use (quita lo que no necesite):

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Meditación · Paramita</title>
  <meta name="description" content="…">

  <!-- Fuentes (self-hosted o Google, según el resto del sitio) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..500&family=Hanken+Grotesk:wght@300;400;500;600&display=swap" rel="stylesheet">

  <!-- marca JS activo cuanto antes (gate de los revelados) -->
  <script>document.documentElement.classList.add('js')</script>

  <!-- TOKENS -->
  <link rel="stylesheet" href="../css/tokens/paramita-color.css">
  <link rel="stylesheet" href="../css/tokens/paramita-tipografia.css">
  <link rel="stylesheet" href="../css/tokens/paramita-layout.css">
  <link rel="stylesheet" href="../css/tokens/paramita-movimiento.css">
  <!-- BASE -->
  <link rel="stylesheet" href="../css/base/paramita-reset.css">
  <link rel="stylesheet" href="../css/base/paramita-base.css">
  <!-- COMPONENTES (deja los que uses) -->
  <link rel="stylesheet" href="../css/componentes/paramita-bar.css">
  <link rel="stylesheet" href="../css/componentes/paramita-menu.css">
  <link rel="stylesheet" href="../css/componentes/paramita-cta.css">
  <link rel="stylesheet" href="../css/componentes/paramita-sections.css">
  <link rel="stylesheet" href="../css/componentes/paramita-hero.css">
  <link rel="stylesheet" href="../css/componentes/paramita-extras.css">
  <link rel="stylesheet" href="../css/componentes/paramita-footer.css">
  <link rel="stylesheet" href="../css/componentes/paramita-chat.css">
  <!-- PÁGINA (si esta página tiene CSS propio, va aquí) -->
  <!-- <link rel="stylesheet" href="../css/paginas/paramita-meditacion.css"> -->
  <!-- Responsive común (al final) -->
  <link rel="stylesheet" href="../css/base/paramita-responsive.css">
</head>
<body>

  <!-- El navbar y el footer los pone el sync (ver §5). Para que el sync los
       encuentre y los sustituya, deja en el body ESTOS DOS marcadores mínimos: -->

  <header class="bar"></header>

  <main>
    <!-- … tu contenido de la página … -->
  </main>

  <footer class="foot"></footer>

  <!-- scripts propios de la página, si los hay -->
  <!-- <script src="../js/paginas/paramita-meditacion.js" defer></script> -->
</body>
</html>
```

> Nota clave: NO escribas el navbar ni el footer a mano. Deja los contenedores vacíos
> `<header class="bar"></header>` y `<footer class="foot"></footer>` y deja que el
> `sync.py` los rellene. El `<head>` con los `<link>` y el `<script defer>` del tema los
> puede añadir el propio sync con el flag `--tema` (ver §5) — no hace falta escribirlos
> a mano si no quieres.

---

## 4 · Cómo funciona `sync.py` (resumen)

Localiza los bloques por su etiqueta y clase, no por marcadores:
- `<header class="bar">…</header>` → lo reemplaza por el partial de navbar.
- `<footer class="foot">…</footer>` → lo reemplaza por `footer.html`.
- (opcional) `<section class="foot__hero">…</section>` → prefooter.
- Rellena los `<span data-pico="nombre">` con el SVG de `partials/pictogramas/nombre.svg`.
- (opcional) inyecta las 3 piezas del tema: anti-FOUC en el `<head>`, `<link>` a
  `paramita-tema.css` (el último, para ganar la cascada) y `<script>` a `paramita-tema.js`.
  **Detecta la profundidad sola** y pone `../` o `../../` según la página.

Flags:
- `--tema` → inyecta/actualiza las 3 piezas del tema (idempotente).
- `--aria-current="Texto"` → marca ese navlink como página actual (p. ej. `"Meditación"`).
- `--with-prefooter` → conserva/inserta el bloque "Practiquemos juntos".
- `--practicante` → usa el navbar logueado en vez del público.
- `--skip-navbar` → no toca el navbar (rara vez necesario ya).
- `--only-pictos` → solo refresca pictogramas.

Es **idempotente**: puedes correrlo mil veces sin duplicar nada.

---

## 5 · Receta para CADA página nueva

Desde la RAÍZ del repo (donde están `/partials`, `/css`, `/js`, `/assets`):

```bash
# Meditación (público · primera entrada del navbar):
python3 partials/sync.py meditacion/meditacion.html --tema --aria-current="Meditación"

# Únete (público · su entrada es un CTA, NO un navlink → sin --aria-current):
python3 partials/sync.py unete/unete.html --tema

# Sobre · La Fundación (dos niveles · el ../../ lo detecta solo · sin aria-current,
# porque "Sobre" es un <button> no-navegable, no un navlink):
python3 partials/sync.py sobre/la-fundacion/la-fundacion.html --tema

# (igual para maestros, khenpo, sangha-monastica, preguntas-frecuentes)
python3 partials/sync.py sobre/khenpo/khenpo.html --tema
```

Añade `--with-prefooter` si quieres el bloque "Practiquemos juntos" al final.

Después: **ábrela con Live Server por `http://`** y comprueba:
1. El navbar sale completo y navega (Sobre con sus 5, incluida Khenpo).
2. El footer nuevo abajo (Sobre → La Fundación, redes reales).
3. El **sol** alterna penumbra y la recuerda al recargar.

---

## 6 · Reglas del sistema que la página nueva DEBE respetar

- **Nomenclatura CTA (Fase 6):** `.btn-primario` (gradiente lleno), `.btn-secundario`
  (gradiente en borde), `.t-link` / `.t-link--primario` (terciario editorial).
  NADA de `.btn-amigo` / `.btn-umbral` (nomenclatura vieja).
- **Lede/subtítulo de hero:** SIEMPRE Hanken Grotesk (`var(--body)`), estilo normal, peso
  normal (`--wght-presencia`). Nunca Fraunces, nunca cursiva/negrita. La cursiva Fraunces
  se reserva para los `<em>` dorados dentro de los títulos.
- **Sin `data-reveal` en el `<h1>` ni en el eyebrow del hero** (doctrina LCP).
- **Sin colores fuera de los tokens**; derivaciones solo con `color-mix(in oklch, …)`.
  Sin hex sueltos ni espaciados a mano (usar tokens `--espacio-*`).
- **Pictogramas:** `<span class="pico" data-pico="nombre"></span>` vacío; el sync lo
  rellena. viewBox 0 0 24 24, stroke 1.5, currentColor.
- **Tokens de tipografía:** display = Fraunces (`var(--display)`), cuerpo = Hanken
  (`var(--body)`); pesos `--wght-contemplativo` (300), `--wght-presencia` (400),
  `--wght-firmeza` (500).

---

## 7 · Aprobaciones de contenido (no saltarse)

El TEXTO real de estas páginas lo aprueban:
- **Khenpo** → identidad y doctrina (sobre todo Khenpo, Sangha, Maestros, La Fundación).
- **Ale** → estrategia y contenido.

Al maquetar, usar **copy provisional marcado como tal**. La página de **Khenpo** es la
pieza editorial central de `/sobre/` y estaba señalada para validación con Ale/Khenpo
antes de fijar el layout.

---

## 8 · Pendientes menores ya conocidos (no bloquean)

- `formacion/formacion-publica.html` y `emi-1` tienen pictogramas vacíos (`duracion`,
  `a-tu-ritmo`, `idioma`) → rellenar en el repo con `--only-pictos`.
- CTAs de pago de `contribuir.html` ("Hazte amigo/a", "Compartir") en `href="#"` →
  pendientes de la pasarela de pago (Alberto).
- Unificación futura del navbar logueado (`.cuenta`) — ya resuelta en su versión actual;
  documentada por si se retoma en Fase 8.

---

## 9 · Checklist rápido al crear una página

- [ ] Carpeta y archivo con el mismo nombre (`/x/x.html`).
- [ ] `<head>` con el set de `<link>` del sistema (§3), profundidad `../` correcta.
- [ ] `<header class="bar"></header>` y `<footer class="foot"></footer>` vacíos en el body.
- [ ] Contenido con clases y tokens del sistema (§6).
- [ ] Correr `sync.py … --tema [--aria-current=…] [--with-prefooter]`.
- [ ] Probar con Live Server por `http://`: navbar navega, footer nuevo, sol funciona.
- [ ] Copy marcado como provisional (validación Ale/Khenpo).
