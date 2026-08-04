# Paramita · Sitio web

Fundación Sakya · Alicante. Diseño y desarrollo del sitio institucional.

## Estado del sitio

Resumen rápido de qué está construido y qué falta:

| Área | Estado |
|---|---|
| Home pública (`index.html`) | ✅ Cerrada (Fase 7) |
| Home del practicante (`home-logueado/`) | 🟡 A medias |
| Catálogo público de cursos (`formacion/`) | ✅ Terminado |
| Catálogo del practicante (`formacion-logueado/`) | 🟡 Diseño por concretar |
| Plantilla de curso individual (`formacion/emi-1-calma-y-lucidez/`) | 🟡 Hecha · pendiente de repaso |
| Navbar público + navbar practicante | ✅ Ambos existen |
| Footer | 🟡 Solo genérico · footer privado por decidir |
| Resto de landings | ⬜ Pendientes |

## Flujo de trabajo

**Columna vertebral: chat + código, con handoff a Claude Code para implementar.**
Es el flujo que sostiene el proyecto y donde vive el contexto acumulado.

**Claude Design no es el entorno principal.** Se evaluó y se decidió no migrar
(ver `docs/14-claude-design-alcance.md`): el lienzo solo renderiza HTML/CSS y no
reproduce la capa de firma del sitio (WebGL del fluido, GSAP/ScrollTrigger,
filtros SVG, animación de ejes variables de Fraunces), que es justo lo que
distingue a Paramita de una "wellness app". Además, importar tokens no importa
las decisiones: re-generar una página ya cerrada arriesga deshacer trabajo bueno.

**Claude Design sí, pero acotado** a exploración *greenfield*: arrancar una página
nueva sin estructura decidida, comparar 2–3 variaciones, o un mockup navegable
para que Ale/Gerard/Khenpo comenten sin tocar código. Nunca sobre lo ya cerrado.

## Estructura de landings

Cada landing vive en su propia carpeta con un `index.html` dentro. GitHub Pages
sirve `carpeta/index.html` como `carpeta/`, así que las URLs quedan limpias
(`paramita.org/formacion/` en vez de `paramita.org/index-formacion.html`).

```
/
├── index.html                              ← home pública (paramita.org/) · ✅ cerrada
├── home-logueado/index.html                ← home del practicante · 🟡 a medias
│
├── formacion/
│   ├── index.html                          ← catálogo público · ✅ terminado
│   └── emi-1-calma-y-lucidez/index.html    ← plantilla de curso individual · 🟡 hecha, a repasar
├── formacion-logueado/index.html           ← catálogo del practicante · 🟡 diseño por concretar
│
├── meditacion/index.html                   ← pendiente
├── actividades/index.html                  ← pendiente
├── blog/index.html                         ← pendiente
├── crowdfunding/index.html                 ← pendiente
├── unete/index.html                        ← pendiente (destino CTA "Únete")
├── contribuir/index.html                   ← pendiente (destino CTA "Contribuir")
├── comunidad/index.html                    ← pendiente (teaser "tradición viva" de la home apunta aquí)
└── sobre/
    ├── index.html                          ← La Fundación · pendiente
    ├── maestros/index.html                 ← pendiente
    ├── monasticos/index.html               ← pendiente
    └── faq/index.html                      ← pendiente
```

La plantilla de curso individual usa `emi-1-calma-y-lucidez/` como referencia:
funciona con tres estados vía `body[data-estado="anonimo|logueado|inscrito"]`
y sus archivos de producción son `index.html`, `paramita-curso.css` y
`paramita-curso.js`.

Las carpetas vacías tienen un `.gitkeep` para que Git preserve la estructura
hasta que se cree el `index.html` correspondiente.

## Estructura de assets

```
/
├── css/
│   ├── tokens/           ← color, tipografía, fuentes, layout, movimiento
│   ├── base/             ← reset, base, responsive
│   ├── componentes/      ← bar, menu, cta, cursos, footer, modal, suscripción, tradición…
│   └── paginas/          ← estilos específicos por landing
├── js/
│   ├── primitivos/       ← utilidades reutilizables
│   ├── componentes/      ← comportamientos de componentes
│   └── paginas/          ← comportamientos específicos por landing
├── assets/
│   ├── fonts/            ← fuentes variables autoalojadas (.woff2)
│   └── img/              ← imágenes del sitio
├── partials/             ← fragmentos HTML canónicos (navbar, footer)
└── docs/                 ← registro de decisiones (00-indice.md → 14)
```

## Partials

El navbar y el footer viven en `partials/` como **fuente única de verdad**.
Cuando cambian, se editan ahí primero y luego se sincronizan a todas las
landings (a mano o con `partials/sync.py`).

```
partials/
├── navbar-publico.html       ← navbar del sitio anónimo
├── navbar-practicante.html   ← navbar del practicante autenticado
├── footer.html               ← footer genérico (público y privado por ahora)
└── prefooter.html            ← bloque previo al footer
```

`sync.py` admite las flags `--aria-current` (marca la página activa en el
navbar) y `--with-prefooter` (incluye el prefooter al sincronizar).

**Footer privado — decisión abierta.** Hoy existe un único footer genérico que
sirve tanto al sitio público como al del practicante. Está pendiente decidir si
el área logueada necesita su propio `footer-practicante.html` (más sobrio, sin
llamadas de conversión, con enlaces relevantes para quien ya está dentro). Se
resolverá junto con el diseño del área logueada.

## Convenciones

**Rutas de assets: relativas a la posición de la landing.** Los `href` y `src`
de CSS, JS, imágenes y fuentes se escriben relativos a la carpeta de la landing:

- Desde la home (`/index.html`): `href="css/base/paramita-base.css"`
- Desde `formacion/index.html`: `href="../css/base/paramita-base.css"`
- Desde `sobre/maestros/index.html`: `href="../../css/base/paramita-base.css"`

Esta convención permite pruebas visuales en GitHub Pages (que sirve el sitio
bajo una subruta tipo `janams.github.io/nombre-repo/`) sin configuración extra.
Cuando el sitio migre a un dominio propio sin subruta, se podrá reconsiderar
volver a rutas absolutas — pero por ahora, relativas.

**Enlaces internos del navbar y footer: absolutos.** Los `href` que apuntan
a otras landings (`/formacion/`, `/blog`, `/sobre/maestros`) se dejan absolutos.
Razón: los partials `navbar-publico.html`, `navbar-practicante.html` y
`footer.html` son fuente única de verdad y deben poder pegarse en cualquier
landing sin adaptación. Consecuencia aceptada: en GitHub Pages con subruta, la
navegación entre landings a través del navbar no funcionará hasta que haya
dominio propio o migración de hosting. Para pruebas visuales se accede a cada
landing por URL directa.

**Fuentes autoalojadas.** Fraunces y Hanken Grotesk se sirven desde `assets/fonts/`
en woff2 variable (subseteado latin + latin-ext + latin extended additional, este
último imprescindible para la transliteración IAST), **sin instanciar los ejes**.
Se precargan con `<link rel="preload" ... crossorigin>`. Para propagarlas al resto
de páginas, seguir `traspaso-fuentes-autoalojadas.md`. Nota: el eje `SOFT` de
Fraunces se mantiene firme en 0 en toda la home, y `WONK` se conserva con default 0
(no eliminar el eje: el CSS lo referencia).

**Nomenclatura Fase 6 de CTAs:**

- `.btn-primario` — primario, conversión (antes `.btn-amigo`)
- `.btn-secundario` — secundario, acompaña (antes `.btn-umbral`)
- `.t-link` / `.t-link--primario` — enlaces terciarios editoriales

Ya no se usa `.btn-amigo` ni `.btn-umbral`.

## Documentación

El registro de decisiones vive en `docs/` como documentos numerados con estructura
común (contexto → decisión → alternativas descartadas → implicaciones → referencias
en el código). Empezar por `docs/00-indice.md`.

**Identidad y sistema visual**

- `01-fundamentos-de-identidad.md` — hilo conceptual "el cruce como acto", identidad sobre tendencia, rechazo del dark mode.
- `02-sistema-de-color.md` — paleta OKLCH, tokens oficiales, regla 70/30, prohibición de colores inventados, `color-mix`.
- `03-tipografia.md` — Fraunces × Hanken Grotesk, eje SOFT, escala semántica de pesos, regla de la italic dorada.
- `04-sistema-de-motion.md` — cuatro capas, respiración ambiente 25s, interruptor `--identidad-estado`, "hover intensifica lo que ya vive".
- `05-sistema-de-ctas.md` — nomenclatura `.btn-primario` / `.btn-secundario` / `.t-link`, pairing por página, evolución desde `.btn-amigo` / `.btn-umbral`.

**Arquitectura y trabajo por página**

- `06-navbar.md` — IA de cinco entradas, pairing dual de CTAs, ajustes de comportamiento.
- `07-formacion-landing.md` — metáfora del sendero, cinco niveles, siete secciones, FLIP, filtro en lenguaje natural, gratuito vs. pago.
- `08-modularizacion-js-fase-6.md` — extracción de ~875 líneas inline a 13 archivos (`primitivos/` · `componentes/` · `paginas/`).
- `09-home-logged-in.md` — propuesta de bloques del practicante autenticado y sus dependencias pendientes.
- `13-home-publica.md` — cierre de la home pública (Fase 7): estructura bloque a bloque, jerarquía de CTAs, "una tradición viva" (sustituye al carrusel), suscripción en el cierre, tipografía firme, rendimiento del LCP.

**Aprendizajes transversales**

- `10-aprendizajes-tecnicos.md` — lecciones de CSS/JS (button nesting, box-shadow + clip-path, `auto-fit` vs. `repeat(N)`, caché, leer antes de proponer, debug visual).
- `11-metodo-de-trabajo.md` — validación visual iterativa, archivos completos vs. diffs, evidencia sobre opinión, pushback esperado, secuenciación por fases.
- `12-hoja-de-ruta-y-fases.md` — resumen de fases completadas, horizonte inmediato, trabajos deferidos.
- `14-claude-design-alcance.md` — por qué el proyecto no migra a Claude Design y en qué casos acotados sí se usa (resumido arriba en "Flujo de trabajo").

## Limpieza pendiente

- El CSS del antiguo carrusel de testimonios (`.testimonios`, `.tcard`, `.tcarousel`)
  quedó huérfano en `paramita-extras.css`, y `js/componentes/paramita-testimonios.js`
  ya no se enlaza. Ambos pueden borrarse.
- **Endpoint de la newsletter** (backend, Alberto): el formulario del cierre es un
  mock visual (valida y muestra acuse); falta conectar el envío real. El JS deja el
  punto marcado.

## Estado de sincronización de partials

| Landing | Navbar | Footer | Notas |
|---|---|---|---|
| `index.html` (home pública) | ✅ público | ✅ | Cerrada · sin aria-current |
| `formacion/index.html` | ✅ público | ✅ | Terminada · aria-current="page" en Cursos |
| `formacion/emi-1-calma-y-lucidez/index.html` | ✅ público | ✅ | Plantilla · pendiente de repaso |
| `home-logueado/index.html` | ✅ practicante | ✅ | A medias |
| `formacion-logueado/index.html` | ✅ practicante | ✅ | Diseño por concretar |
| todas las demás | — | — | Pendientes de crear |
