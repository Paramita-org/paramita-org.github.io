# Paramita · Sitio web

Rediseño completo del sitio de la **Fundació Sakya Paramita**, tradición budista tibetana (escuela Sakya) con sede en Pedreguer (Monte Sella), Alicante, y comunidades por España y Latinoamérica.

Sitio estático (HTML/CSS/JS *vanilla*) servido en **GitHub Pages** desde el repositorio de organización `Paramita-org/paramita-org.github.io` (patrón de *organization site*: se sirve en la raíz del dominio). Audiencia hispanohablante. Estado actual: **Fase 8** (cierre y refinamiento, agosto 2026).

> `www.paramita.org` es el sitio vivo actual de la fundación, gestionado por Alberto. No se toca desde este repositorio.

---

## Índice

1. [Stack](#stack)
2. [Estructura del repositorio](#estructura-del-repositorio)
3. [Sistema de diseño](#sistema-de-diseño-reglas-no-negociables)
4. [Arquitectura CSS y JS](#arquitectura-css-y-js)
5. [Partials y `sync.py`](#partials-y-syncpy)
6. [GitHub Action](#github-action)
7. [Flujo de despliegue](#flujo-de-despliegue)
8. [Estado de las páginas](#estado-de-las-páginas)
9. [Pendientes y decisiones abiertas](#pendientes-y-decisiones-abiertas)
10. [Reparto de responsabilidades](#reparto-de-responsabilidades)
11. [Método de trabajo](#método-de-trabajo)
12. [Documentación](#documentación)

---

## Stack

- **HTML/CSS/JS vanilla** — sin framework ni *build step* en producción.
- **GitHub Pages** — hosting; se sirve en la raíz del dominio.
- **GSAP + ScrollTrigger** — animación de scroll y revelados.
- **WebGL (canvas)** — efecto de fluido con el ratón.
- **Fuentes variables autoalojadas** — Fraunces (display/italic, ejes `SOFT` y `WONK`) + Hanken Grotesk (texto), subseteadas a woff2 con cobertura IAST. JetBrains Mono para código/informes.
- **Playwright** — render y validación *headless* antes de entregar.
- **Python 3** — `sync.py`, el propagador de partials.

Migración futura a **Eleventy (11ty)** contemplada pero **deferida** (pendiente de aprobación de arquitectura).

---

## Estructura del repositorio

Rutas absolutas desde la raíz del dominio. Cada página vive en su carpeta y sirve una URL limpia.

```
/                                index.html                       Home pública
/meditacion/                     meditacion.html
/formacion/                      formacion-publica.html           Catálogo de cursos
/formacion/emi-1-calma-y-lucidez/
    emi-1-calma-y-lucidez.html   Ficha de curso (prototipo canónico)
    inscripcion.html             Alta en el curso
/formacion-logueado/             formacion-logueado.html          Área de formación (logueado)
/actividades/                    actividades.html                 Catálogo (10 tarjetas + calendario)
/actividades/retiros/            retiro.html                      Plantilla · retiro
/actividades/eventos/            evento.html                      Plantilla · evento
/actividades/giras/              gira.html                        Plantilla · gira (índice de ciudades)
                                 gira-madrid.html                 Plantilla · gira (página de ciudad)
/actividades/celebraciones/      celebracion.html                 Plantilla · celebración
/blog/                           blog.html
/sobre/khenpo/                   khenpo.html
/sobre/maestros/                 maestros.html
/sobre/la-fundacion/             la-fundacion.html
/sobre/sangha-monastica/         sangha-monastica.html
/sobre/preguntas-frecuentes/     preguntas-frecuentes.html
/unete/grupos/                   grupos.html                      Buscador de círculos + mapa
/unete/voluntariado/             voluntariado.html
/contribuir/                     contribuir.html                  Landing de dāna (Amigos)
/crowdfunding/                   crowdfunding.html                Campaña «Centro de Retiros»
/home-logueado/                  home-logueado.html               Espacio del practicante
/cuenta/                         cuenta.html                      Ajustes de cuenta
/politica-de-privacidad/         index.html

/partials/
    navbar-publico.html          navbar-practicante.html
    footer.html                  prefooter.html
    pictogramas/*.svg            Canon de pictogramas (SVG inline)
    sync.py                      Propagador de partials

/css/
    paramita-color.css           Tokens OKLCH
    paramita-tipografia.css      paramita-fuentes.css
    paramita-movimiento.css      paramita-cta.css
    paramita-hero.css            paramita-sections.css   …
    paginas/                     CSS específico por página (@layer paginas)

/js/
    primitivos/                  paramita-reveal.js, paramita-tema.js, …
    componentes/                 faq, testimonios, video, suscripción, menú, …
    paginas/                     Un archivo por página

/assets/
    img/                         fonts/

/docs/                           00-indice.md … 17-landing-grupos.md
favicon.svg  favicon-32x32.png  favicon-16x16.png  apple-touch-icon.png
```

Notas de rutas:

- Los **assets** siempre con ruta absoluta (`/assets/…`). Requieren servir por HTTP (Live Server desde la raíz del proyecto o GitHub Pages), **nunca** `file://`.
- Las páginas de subcarpeta enlazan CSS/JS con `../`; las de dos niveles (p. ej. `formacion/emi-1-…/`) con `../../`.
- La **política de privacidad** real es `politica-de-privacidad/index.html`. El archivo `index-politica-de-privacidad.html` es solo un alias de trabajo para no confundirlo con el index de la home.

---

## Sistema de diseño (reglas no negociables)

**Color.** Exclusivamente tokens **OKLCH** de `paramita-color.css` y `color-mix(in oklch, …)`. Nunca hex, rgb ni valores inventados. Regla 70/30 en el degradado de marca (nunca dorado dominante). Al mezclar azul con tonos cálidos, la interpolación pasa por verde en valores intermedios: mezclar el azul con `transparent`, no con un token cálido, para preservar el tono.

**Tipografía.** Fraunces (display) × Hanken Grotesk (texto). Eje `SOFT` animado en scroll como movimiento de firma; `WONK` fijo en 0. Pesos nombrados por intención (`--wght-contemplativo` como *default*). **La italic dorada de Fraunces se reserva exclusivamente para `<em>` de acento dentro de títulos.**

**Regla de heroes (sin excepciones).** El *lede*/subtítulo de todo hero va siempre en Hanken Grotesk (`var(--body)`), estilo y peso normales (`--wght-presencia`). Nunca Fraunces, nunca italic, nunca negrita. Los *eyebrows* usan `--texto-tenue`, nunca dorado. **`data-reveal` nunca en el `<h1>` ni en el eyebrow del hero** (dependen del LCP, no deben esperar al JS).

**CTAs.** Nomenclatura unificada (Fase 6, jul 2026):

| Rol | Clase actual | Nombre antiguo (obsoleto) |
|---|---|---|
| Primario | `.btn-primario` | `.btn-amigo` |
| Secundario | `.btn-secundario` | `.btn-umbral` |
| Terciario editorial | `.t-link` / `.t-link--primario` | — |

Cualquier referencia a `.btn-amigo` o `.btn-umbral` es código heredado por migrar.

**Motion.** Dos familias: *ambiente/identitaria* (gradientes lentos, siempre activos, interruptor global `--identidad-estado`) y *user-invoked* (scroll, hover, focus, click). Sin animaciones infinitas fuera de la familia identitaria. Carruseles auto-avanzados son antipatrón. `prefers-reduced-motion` siempre respetado.

**Pictogramas.** Canon SVG: `viewBox 0 0 24 24`, `stroke-width 1.5`, `fill none`, `stroke currentColor`, caps/joins redondeados, un único acento dorado vía `class="acc"` (no atributo `stroke` inline, por compatibilidad con Safari). Regla «nunca desnudo»: siempre con etiqueta. El canon debe existir en `partials/pictogramas/` **antes** de cualquier referencia `data-pico` (si falta un SVG, `sync.py` aborta la página entera).

**Modo penumbra (dark).** Opt-in del usuario, persistido en `localStorage` bajo la clave `paramita-tema`. Nunca como dirección primaria de identidad.

---

## Arquitectura CSS y JS

**CSS por capas** (`@layer`), en este orden:

```
tokens → base → bar → menu → cta → hero → sections → paginas → footer → responsive → tema
```

El CSS específico de página vive en `@layer paginas` (archivos en `css/paginas/`). **No se redefinen tokens dentro de archivos de página.**

**JS modular** (Fase 6), organizado en tres niveles:

- `js/primitivos/` — comportamientos base (revelado, tema, refresh de GSAP).
- `js/componentes/` — piezas reutilizables (FAQ, testimonios, vídeo, suscripción, menú, modal…).
- `js/paginas/` — un archivo por página, con su lógica propia.

Para blindar páginas frente a desajustes entre archivos de sistema, la lógica muy específica de una página (p. ej. el vídeo Vimeo y la `.semblanza` de grupos) vive en el JS/CSS de esa página, no en los componentes compartidos.

---

## Partials y `sync.py`

Las piezas comunes (**navbar, footer, prefooter, pictogramas** y, opcional, las piezas del **tema** penumbra/luz) se mantienen en `partials/` y se propagan a cada página con `sync.py`.

**Cómo marca cada página lo que necesita.** Un comentario de autodeclaración, normalmente tras `<body>` o en el `<head>`:

```html
<!-- sync: navbar=publico current="Cursos" -->
<!-- sync: navbar=practicante current="Mi formación" -->
<!-- sync: navbar=skip -->        navbar bespoke: no se toca
<!-- sync: no-tema -->            no inyectar el tema en esta página
<!-- sync: ignore -->             excluir la página del sync
```

Campos (todos opcionales): `navbar=publico|practicante|skip` · `current="Texto del enlace"` · `prefooter` · `no-tema` · `ignore`.

**Flags de línea de comandos** (ganan sobre el marcador; el marcador gana sobre el *default*):

```bash
python3 partials/sync.py <landing.html>
python3 partials/sync.py <landing.html> --aria-current="Cursos"
python3 partials/sync.py <landing.html> --with-prefooter
python3 partials/sync.py <landing.html> --tema
python3 partials/sync.py <landing.html> --practicante
python3 partials/sync.py <landing.html> --skip-navbar
python3 partials/sync.py <landing.html> --only-pictos
python3 partials/sync.py --all           # recorre el repo y sincroniza cada página
python3 partials/sync.py --all --only-pictos
```

**Comportamiento clave a recordar:**

- `sync.py` usa `replace_block`: **reemplaza** el navbar/footer/prefooter existente, **no lo inserta desde cero**. Cada página debe nacer con los partials inline verbatim.
- `--all` procesa toda página con un navbar del sistema, excluyendo `partials/`, `css/`, `js/`, `assets/`, `.git/`, y todo lo que empiece por `informe-`, `maqueta-`, `plantilla-` o lleve `sync: ignore`. Informes y maquetas quedan fuera por diseño.
- `apply_aria_current` solo marca elementos `<a>`; el valor de `current=""` debe coincidir con el **texto real del enlace del submenú**, no con el botón que lo despliega.
- **`sync.py` no toca el `<head>`.** El bloque de favicon y cualquier `<link>`/`<meta>` del head se añaden a mano en páginas nuevas (o se extiende `sync.py` con un partial de head).
- Ejecutar **siempre desde la raíz del proyecto** (donde se resuelve `partials/sync.py`), nunca desde una subcarpeta.

---

## GitHub Action

`sync.yml` se dispara en cada push a `main` que toque `partials/**`, ejecuta `sync.py --all` y hace commit con `[skip ci]`.

> Como la Action commitea de forma autónoma, **siempre `git pull --rebase origin main` antes de cada push** para no divergir de sus commits.

---

## Flujo de despliegue

Orden estable, sin saltarse pasos:

1. **SVG primero** — cualquier pictograma nuevo a `partials/pictogramas/` antes que nada (`sync.py` aborta si falta un `data-pico`).
2. **Imágenes** — a `/assets/img/` con `width`/`height` para reservar espacio (CLS). El LCP del hero, con `fetchpriority="high"` y sin lazy.
3. **HTML / CSS / JS** — página, `css/paginas/…`, `js/paginas/…`.
4. **`git pull --rebase origin main`**.
5. **`python3 partials/sync.py --all`**.
6. **Comprobación visual** con recarga forzada (`Cmd+Shift+R`) — la caché del navegador es el primer sospechoso ante cualquier discrepancia visual en GitHub Pages.

---

## Estado de las páginas

**Construidas y estables**

`index` (home pública) · `meditacion` · `formacion-publica` · `formacion-logueado` · `emi-1-calma-y-lucidez` (ficha) · `inscripcion` · `khenpo` · `maestros` · `sangha-monastica` · `la-fundacion` · `blog` · `preguntas-frecuentes` · `grupos` · `voluntariado` · `contribuir` · `crowdfunding` · `politica-de-privacidad`.

**Familia de actividades — construida, revisión no cerrada al 100%**

El carril de actividades es un **catálogo + cuatro plantillas** ordenadas por compromiso descendente (retiro → evento → gira → celebración), todas sobre el sistema de diseño y compartiendo el vocabulario de landing de `paramita-curso.css`; cada una añade en su hoja propia solo lo específico. La gira tiene dos variantes (índice de ciudades y página de ciudad). El catálogo `actividades.html` (10 tarjetas + 11 entradas de calendario) enlaza a la plantilla de muestra de cada tipo con enlace estirado inline. Cada plantilla tiene su estudio de estructura y conversión como respaldo.

| Plantilla | URL en vivo | Bloque distintivo | CSS |
|---|---|---|---|
| Catálogo | [actividades.html](https://paramita-org.github.io/actividades/actividades.html) | 10 tarjetas + calendario | `paramita-actividades.css` |
| Retiro | [retiros/retiro.html](https://paramita-org.github.io/actividades/retiros/retiro.html) | Inmersión residencial: recorrido de práctica, ritmo del día, idoneidad sí/no, planes | `paramita-retiro.css` |
| Evento | [eventos/evento.html](https://paramita-org.github.io/actividades/eventos/evento.html) | Doble carril presencial/online: logística en dos ramas, valor del «en vivo», becas | `paramita-evento.css` |
| Gira · índice | [giras/gira.html](https://paramita-org.github.io/actividades/giras/gira.html) | Catálogo de sedes como lista (no mapa), estado por ciudad, aviso de apertura | `paramita-gira.css` |
| Gira · ciudad | [giras/gira-madrid.html](https://paramita-org.github.io/actividades/giras/gira-madrid.html) | Conversión local: logística, organización local, precio en moneda local, dāna | `paramita-gira-ciudad.css` |
| Celebración | [celebraciones/celebracion.html](https://paramita-org.github.io/actividades/celebraciones/celebracion.html) | Invitación (no venta): significado + mérito, la práctica/puya, participación híbrida con horario internacional | `paramita-celebracion.css` |

> **Estas landings no están revisadas al 100%.** Están construidas y desplegadas, pero les falta el pase final: copy aún provisional, imágenes y enlaces por conectar, y QA visual (desktop/móvil, modo penumbra) sin cerrar. Trátense como muestra funcional, no como versión definitiva.

**En curso / dependientes de backend**

- `home-logueado` — espacio del practicante; bloqueado en las decisiones de LMS/sesión.
- `cuenta` — la carpeta existe; el nombre final del archivo (`index.html` para URL limpia, o `cuenta.html` con redirect) lo cierra la capa de sesión.
- `solicitud` (voluntariado) y `solicitud-grupo` / `nuevos` (crear un círculo) — formularios de alta con copy provisional; a la espera de los endpoints de backend.

**Recursos de referencia (no son páginas del sitio)**

`maqueta-blog-entrada` (plantilla de entrada de blog) · `emi-1` como prototipo canónico de aplicación de tokens · `paramita-design-system.html` · informes HTML de estudio.

---

## Pendientes y decisiones abiertas

**Por construir / resolver**

- **Revisión final de la familia de actividades** — las cinco plantillas y el catálogo están construidos pero sin revisión cerrada: cierre del copy, imágenes y enlaces definitivos, y QA visual (desktop/móvil, penumbra) en cada uno.
- **Hub de «Únete»** — la sección tiene ya su primer *spoke* (grupos) y voluntariado; falta consolidar el hub (`/unete/`): decidir si existe página índice, rutas y copy.
- **Área logueada** en conjunto (`home-logueado`, navbar de practicante, resolución de `/cuenta`, `/logout`, `/mi-progreso`): bloqueada en las decisiones de LMS/sesión.
- **Enlaces a páginas que aún no existen** (construir o retirar el enlace): `/contacto/` (desde `actividades`), `/mi-progreso` (navbar practicante, home y formación logueadas), y el índice `/unete/`.

**Backend (flujos transaccionales)**

Tres raíles separados, sin carrito de la compra (checkout de un solo ítem):

- **dāna** — donación / Amigos de Paramita (`contribuir`, `crowdfunding`).
- **formación** — inscripción a cursos: el pago ocurre en paramita.org y la matrícula se aprovisiona por API a LearnWorlds en `cursos.paramita.org` (URL provisional).
- **actividades** — reserva de eventos.

En `crowdfunding`, el `submit`, la barra de progreso (`data-fill`), los métodos de pago y el toggle de recurrencia son demo hasta conectar la pasarela real.

**Coherencia / limpieza**

- **Fuentes del área logueada** — `home-logueado`, `formacion-logueado` y `cuenta` cargan Fraunces/Hanken desde Google Fonts en lugar de las woff2 autoalojadas del sitio público. Divergencia de rendimiento y de render a unificar.
- **Preload de fuentes con rutas inconsistentes** — el `<link rel="preload">` de las fuentes usa hasta cuatro rutas distintas según la página (`assets/…`, `../assets/…`, `../../assets/…` y la correcta `/assets/fonts/`). Las relativas dan 404 en subcarpetas y provocan el warning «preloaded but not used». Unificar todas a `/assets/fonts/` (regla de rutas absolutas).
- **Cyan heredado** — `#00C7E5` hardcodeado en el shader del fluido WebGL, por migrar al token `--azul-sutil`.
- **Favicon en páginas nuevas** — como `sync.py` no toca el `<head>`, cada página futura necesita el bloque de favicon a mano.
- **Aliases legacy** — de motion (`--t-fast`/`--t-med`/`--t-slow`) y de CTA (`.btn-amigo`/`.btn-umbral`), migrados página a página al tocarlas.

**Decisiones abiertas (copy / rutas)**

- Orden del título de la home (marca delante como excepción, o uniformar a «… · Paramita»).
- Uniformidad de las cláusulas descriptivas en los `<title>` (todas con descripción o todas sin).
- Ubicación de `inscripcion`: hoy cableada como hermana de `emi-1` a dos niveles, pero su `canonical` apunta a una URL limpia de tres niveles. Elegir una y cuadrar `canonical`, rutas CSS y el enlace de entrada.

**Deferido**

Migración a Eleventy · variante logueada del navbar (`navbar-practicante`) · GDPR/cookies + selector de idioma · modal `<dialog>` nativo con focus trap · refactor a `card-base` común · subsistema gráfico de YouTube · retirada eventual de `lamarinchen.org` con redirects 301 a `paramita.org`.

---

## Reparto de responsabilidades

- **Jana** — diseño y frontend (sistema de diseño, maquetación, motion, partials).
- **Khenpo Rinchen Gyaltsen** — dirección espiritual; doctrina e identidad.
- **Ale** — contenido y copy.
- **Alberto** — backend, pagos y arquitectura LMS (`cursos.paramita.org`, LearnWorlds); pasarela, endpoints de formularios y decisiones de sesión/redirect.
- **Gerard** — arquitectura y efectos WebGL.

El copy de todo el sitio es provisional; la doctrina/identidad, otro tanto.

---

## Método de trabajo

- **Archivo primero** — leer los archivos reales del proyecto antes de escribir una sola clase, token o valor. Nunca inventar valores.
- **Una decisión a la vez** — proponer antes de ejecutar; esperar aprobación explícita.
- **Archivos completos, no diffs** — se entrega el archivo de reemplazo entero. ZIP con estructura de carpetas solo para proyectos nuevos.
- **Validación visual iterativa** — revisión en navegador entre pasos (`Cmd+Shift+R`), y solo entonces el siguiente paso.
- **Verificación antes de entregar** — Playwright para render, y chequeo de balance de llaves CSS y sintaxis JS.
- **Sin patrones de presión** — sin urgencia, gamificación, métricas de vanidad, cuentas atrás ni carruseles auto-avanzados. Testimonios como *transmisión*, atribuidos y con rostro, nunca anónimos ni auto-rotatorios.

---

## Documentación

El detalle de cada decisión vive en `docs/`, numerado `00`–`17`, con estructura común (contexto → decisión → alternativas descartadas → implicaciones → referencias en el código). `00-indice.md` es el punto de entrada. Los estudios profundos viven además como informes HTML, que un documento numerado consolida al cerrarse la decisión.
