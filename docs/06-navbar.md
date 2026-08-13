# 06 · Navbar

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026) · **actualizado Fase 7+ · reconciliado con los partials reales (ago 2026)**

---

> **Actualización · Fase 7+ (ago 2026).** Este documento se ha puesto al día contra los partials reales `partials/navbar-publico.html` y `partials/navbar-practicante.html`. Dos bloques de cambios:
>
> **A · Sexta entrada «Únete».** La IA pasa de cinco a seis apartados: se añade **«Únete»** con submenú *Grupos* + *Voluntariado*, con el mismo patrón que «Sobre» (padre `<button>` no navegable). Aparece en **ambos** navbars —público y practicante—. «Únete» **deja de ser CTA**.
>
> **B · Reconciliación con producción** (cosas que el doc original de Fase 6 ya no reflejaba):
> 1. **CTAs sin acción prioritaria en ningún navbar.** La regla original «home: sec+sec / otras páginas: sec+primario» quedó **superada**: el navbar es idéntico en todas las páginas y nunca lleva primario; la acción principal vive en el hero/contexto. Tras sacar «Únete», el `.ctas` queda con **un único secundario: Contribuir**.
> 2. **Acceso a cuenta y tema, ya en el partial.** Existen `.btn-acceso` (círculo de login → avatar al iniciar sesión) y `.tema-toggle` (penumbra/luz global), fuera del `.menu`, siempre visibles en móvil.
> 3. **Actividades es enlace plano**, sin submenú (el submenú Calendario+Visita no llegó a producción).
> 4. **El navbar logueado ya existe** (`navbar-practicante.html`): deja de ser «fase futura».

---

## Contexto

La navegación anterior mezclaba categorías (Meditación, Cursos, Actividades) con contenido (Blog, Sobre nosotros) sin criterio jerárquico. Los usuarios llegaban a la home y no sabían qué diferenciaba "Meditación" de "Cursos", ni dónde encontrar los eventos presenciales. Se rediseñó la arquitectura de información y los CTAs asociados, con ajustes de comportamiento acordados durante la implementación.

## Decisión

**IA como recorrido natural del practicante: Meditación → Cursos → Actividades → Blog → Sobre → Únete. Sin acción prioritaria en el navbar en ninguna página. Dos partials en paridad (público / practicante).**

### Arquitectura de información (estado real en producción)

1. **Meditación** — entrada contemplativa, el "qué es" del sitio. Enlace plano → `/meditacion/meditacion.html`.
2. **Cursos** — puerta pública al catálogo formativo → `/formacion/formacion-publica.html` (no el LMS). *En el navbar logueado se renombra a **«Mi formación»*** → `/formacion-logueado/`.
3. **Actividades** — vida presencial del centro. **Enlace plano** → `/actividades/actividades.html`. *(El submenú Calendario + Visita del planteamiento de Fase 6 no llegó a producción; hoy es un enlace directo.)*
4. **Blog** — artículos y enseñanzas. Enlace plano → `/blog/blog.html`.
5. **Sobre** — institucional. `.has-sub end` con padre `<button>` no navegable. Submenú: *Maestros · Khenpo Rinchen Gyaltsen · Comunidad Monástica · La Fundación · Preguntas Frecuentes*.
6. **Únete** *(Fase 7+)* — comunidad laica no monetaria. `.has-sub end` con padre `<button>` no navegable. Submenú: *Grupos* (`/unete/grupos/`) + *Voluntariado* (`/unete/voluntariado/`). Último apartado, pegado al clúster de acción.

Solo **dos apartados** tienen submenú: Sobre y Únete. El resto son enlaces planos.

### CTAs y clúster derecho (estado real)

- **Sin acción prioritaria en el navbar, en ninguna página.** El navbar no lleva primario: la acción principal vive siempre en el hero/contexto. Así el navbar es idéntico en home y resto, y `sync.py` lo propaga sin excepciones. *(Esto supera la regla de Fase 6 «home: sec+sec / otras: sec+primario»: queda unificado a «sin primario en el navbar».)*
- **`.ctas` → un único secundario: `Contribuir`** (`.btn-secundario` → `/contribuir/contribuir.html`). Antes eran dos (Únete + Contribuir); «Únete» se movió al menú.
- **`.tema-toggle`** — conmutador penumbra/luz, preferencia de lectura **global** (vive en el partial, no solo en la home). Requiere en cada página el script anti-FOUC, el `<link>` a `paramita-tema.css` y `paramita-tema.js`.
- **`.btn-acceso`** — círculo con silueta → login. Al iniciar sesión, este mismo círculo se sustituye por el **avatar** del navbar practicante (misma posición y tamaño; continuidad visual). Vive **fuera** del `.menu`, así que en móvil queda siempre visible en la barra sin abrir el hamburguesa.

### Navbar logueado (`navbar-practicante.html`) — paridad

Mismo esqueleto que el público; solo cambia lo imprescindible:

- **«Cursos» → «Mi formación»** (catálogo logueado con estado) → `/formacion-logueado/`.
- **«Únete» se mantiene** (Fase 7+): Grupos y Voluntariado le siguen sirviendo al practicante (encontrar su círculo, ofrecer seva). *Corrige la nota previa «Únete se retira», que valía cuando «Únete» significaba «hazte miembro».*
- **CTA:** solo `Contribuir` (dāna nunca inaccesible; en móvil cae en el hamburguesa por estar dentro del `<nav>`).
- **Cuenta:** componente `.cuenta` (avatar con inicial + panel: *Mi cuenta · Mi progreso · Ir al aula (LMS) · Cerrar sesión*), en `.bar-derecha` fuera del `<nav>` junto al `.tema-toggle`, siempre visibles. Destinos del panel provisionales — **pendiente Alberto** (sesión / LMS).
- **`aria-current`** no va fijo en el partial (si no, «Mi formación» saldría marcada en todas las páginas): lo aplica `sync.py … --practicante --aria-current="…"`.

### Cinco ajustes de comportamiento integrados

1. **Peso del `.navlink` sube en hover** — de `400` a `600` con transición sutil.
2. **Underline animada desde el centro** — degradado azul→dorado en hover; también en `aria-current="page"`.
3. **Atenuación cruzada** — los demás `.navlink` bajan a `opacity:.55` cuando uno está en hover.
4. **Barra sticky con estado `scrolled`** — a partir de 8px pasa a cristal opaco (`paramita-bar.js`, `requestAnimationFrame`).
5. **`aria-current="page"`** — el enlace de la página actual mantiene el tratamiento de hover de forma permanente.

**Submenús** (Sobre, Únete): abren con hover (delay de intención 140ms) y con `:focus-within` (teclado, inmediato); caret de borders que rota 45°→−135°; panel *glass*; `.end` **ancla el desplegable al borde derecho** para que no se salga (no empuja el ítem: el menú entero ya va a la derecha con `margin-left:auto`).

## Alternativas descartadas

**Mega-menú horizontal.** Descartado — rompe la calma; bastan los submenús mínimos (Sobre, Únete).

**CTA primario en el navbar.** Descartado — obligaría a que el navbar compitiera con el hero. La acción principal vive en el contexto; el navbar solo lleva `Contribuir` (secundario) + el acceso a cuenta. *(Esto reemplaza el «pairing dual» de Fase 6.)*

**Latido/pulso permanente en un CTA.** Rechazado — el sistema respira ambientalmente, no reclama.

**Submenú de Actividades (Calendario + Visita…).** Planteado en Fase 6, **no llevado a producción**: hoy Actividades es enlace plano. Si el volumen de contenido lo pide, se reconsiderará.

**«Únete» como CTA suelto a una sola página (`/unete/unete.html`).** Revisado en Fase 7+: amontonaba la red internacional de grupos y el programa residencial de voluntariado en un destino saturado. Sustituido por el apartado con submenú → dos spokes. Ya **no hace falta** una página-hub `/unete/`.

**Retirar «Únete» en el navbar logueado.** Revisado: se mantiene, porque «Únete» = Grupos + Voluntariado (ongoing), no «hazte miembro» (one-time).

**Un solo CTA a la derecha (preocupación de Fase 6).** Resuelta de otro modo: el clúster derecho es `Contribuir` + `.btn-acceso` (cuenta) + `.tema-toggle`, así que no queda un botón solitario aunque `.ctas` tenga un único secundario.

## Implicaciones

- **La navegación es de seis apartados** (Fase 7+). La regla «no se añade un apartado en el hueco disponible» sigue vigente: el sexto se añadió tras repensar el área de participación (ver estudio «Únete»), no por conveniencia.
- **El padre «Únete» no navega** (como «Sobre»): `<button>` que solo abre el submenú. Cierra la duda que quedaba abierta sobre «a qué apunta el padre»: no apunta a página; los destinos son los dos spokes. Coherente con no construir hub.
- **`aria-current="page"`** es responsabilidad del HTML de cada plantilla (aplica también a Únete y a sus hijos Grupos/Voluntariado).
- **Dos partials en paridad.** Cualquier cambio de IA se hace en los dos (`navbar-publico.html` + `navbar-practicante.html`) y se propaga con `sync.py` (`--practicante` para el logueado). El navbar logueado **ya existe** (deja de estar *scoped* a fase futura).
- **Móvil.** `.tema-toggle`, `.btn-acceso`/`.cuenta` y el burger van fuera del `.menu` → visibles siempre. El menú móvil es CSS puro (`<input type=checkbox hidden>` + `<label class="burger">`). El padre de submenú `<button>` abre el desplegable con el tap (no navega), lo que resuelve bien Únete/Sobre en móvil.
- **Deuda menor.** Un toggle JS de `aria-expanded` para submenús en móvil/teclado es refinamiento de fase posterior (hoy hover puro + `:focus-within`).

## Referencias en el código

- `partials/navbar-publico.html` — navbar sin sesión (6 apartados · Únete submenú · `.ctas` Contribuir · `.tema-toggle` · `.btn-acceso`).
- `partials/navbar-practicante.html` — navbar logueado (Mi formación · Únete · Contribuir · `.tema-toggle` · `.cuenta`).
- `css/componentes/paramita-menu.css` — `.navlink`, caret, submenús; `.end` ancla el `.sub` a la derecha.
- `css/componentes/paramita-bar.css` — barra sticky, glass, logo, `.bar-derecha`.
- `css/componentes/paramita-cta.css` — `.btn-secundario`, `.btn-acceso`.
- `css/paginas/paramita-formacion-logueado.css` — `.cuenta`, `.avatar`.
- `css/paramita-tema.css` + `js/…/paramita-tema.js` — conmutador penumbra/luz (anti-FOUC).
- `js/componentes/paramita-bar.js` — scroll listener (`scrolled`).
- Estudio de «Únete» (Partes 1 y 2) — fundamento de la sexta entrada.

---

*Añadir al `00-indice.md`: doc 06 reconciliado con los partials reales (Fase 7+) — sexta entrada Únete en ambos navbars, CTAs sin primario, Actividades plano, navbar logueado existente.*
