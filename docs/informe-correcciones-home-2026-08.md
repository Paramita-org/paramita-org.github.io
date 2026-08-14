# Informe · Correcciones de la home pública (Fase 7+)

*Sesión del 14 ago 2026. Ronda de revisión sobre `index.html` y componentes asociados, a partir de validación en móvil/escritorio. Todo lo que sigue está implementado y verificado en render; el copy sigue provisional (Ale/Khenpo) y varios enlaces apuntan a páginas aún por construir.*

---

## 0. Método de la sesión

- **File-first**: se leyó el código real antes de proponer cada cambio; ningún valor, token o selector inventado.
- **Verificación visual con fuentes reales**: se reprodujeron los bloques con Chromium headless (Playwright). Como los `.woff2` no venían en la copia del proyecto, se usaron primero las variables de Fontsource y después las `.woff2` reales del repo. Las métricas verticales y el peso de la cursiva se juzgaron ya con la tipografía correcta.
- **Coherencia con informes**: cada decisión se contrastó con la doctrina (identidad, color, motion, home pública, Únete). Las reversiones de decisiones previas se marcan de forma explícita.
- **Una decisión a la vez**, con archivo completo por entrega (no diffs).

---

## 1. Correcciones del encargo inicial (6 puntos)

### 1.1 Hero en móvil — peso de la cursiva y legibilidad del lede

**Síntoma.** La cursiva del rotador se veía «más gorda» que en escritorio; el lede se leía flojo.

**Diagnóstico (medido).**
- El rotador (`.rotator__word`) usa `--wght-contemplativo` = **300** en escritorio y saltaba a `--wght-firmeza` = **500** en móvil (`@media ≤768px`). 200 unidades de salto → se percibía como negrita, no como la misma cursiva.
- El lede heredaba `color: --texto-suave` (oklch **58%**, gris medio) y cae justo en la franja donde el velo móvil del hero es más flojo, sobre lo más cargado del vídeo (rueda del Dharma, banderas).

**Decisión.**
- Rotador móvil: **400** (`--wght-presencia`) — cuerpo suficiente para sostenerse sobre el vídeo, mismo carácter que la cursiva de escritorio. Comparativa 300/400/500 renderizada para elegir.
- Lede móvil: `color: color-mix(in oklch, var(--antracita) 70%, var(--texto-suave))` (~33% de claridad). **Doctrina intacta**: sigue en Hanken, recto y en `--wght-presencia`; solo cambia el color, no familia/peso/estilo.

**Archivos.** `paramita-hero.css`.

**Pendiente.** Validar el lede sobre el vídeo real; si aún queda justo sobre la rueda, reforzar el velo en esa franja.

### 1.2 Bloque de cursos — enlace a la landing pública

**Decisión.** «Descubrir el sendero completo» → `/formacion/formacion-publica.html`. En una ronda posterior se **unificaron todos** los `/formacion/` pelados que quedaban (secundario del hero + las tres puertas de la Antesala) a `formacion-publica.html`, para no dejar dos convenciones vivas ni riesgo de 404 por índice inexistente.

**Archivos.** `index.html`.

### 1.3 Bloque Participa — replanteo

**Decisión.**
- Se retira el terciario «Descubre cómo colaborar» (duplicaba la vía 03 y remaba contra la tesis anti-sobrecarga del informe de Únete).
- Las tres vías enlazan a sus destinos reales, alineados con el informe de Únete (enrutado por navbar + este bloque; grupos y voluntariado como spokes; contribuir como «su casa»):
  - 01 Practica en comunidad → `/unete/grupos/grupos.html`
  - 02 Ofrece tu tiempo → `/unete/voluntariado/voluntariado.html`
  - 03 Apoya el proyecto → `/contribuir/contribuir.html`
- **Afordancia de clic**: la vía entera ya es un `<a>`, y un `<a>` no admite otro `<a>` dentro, así que **no** se metió un CTA terciario por vía. En su lugar, una flecha `→` (un `<span>`) visible en reposo — imprescindible en móvil, donde no hay hover.

**Archivos.** `index.html`, `paramita-extras.css`.

### 1.4 Crowdfunding — «refugio de Dharma» y la banda

**Síntoma.** El dorado no se leía; la banda tenía un hueco blanco arriba.

**Diagnóstico.** El dorado está a oklch **78%** de claridad; sobre la banda pálida y muy velada no consigue figura/fondo, y un halo claro detrás lo empeora. El hueco superior venía del `padding` de **64px** en las cuatro caras (sin reducir en móvil) + `min-height: 54vh` + `align-content: center`.

**Decisión (tras iterar).**
- El énfasis pasa **de color a peso**: «refugio de Dharma» (frase completa) en el mismo `--azul-oscuro` del título, en **cursiva** y peso **asertivo (600)** frente al 300 del h2. Un acento por *hue* es frágil sobre superficie clara incierta; uno por peso+estilo es robusto porque no depende del fondo. Halo cálido de vuelta (el azul necesita separación clara de la foto).
- Banda móvil: `padding` a **32px** (`--espacio-contenido`) y `min-height: auto` → desaparece el hueco.

**Archivos.** `index.html`, `paramita-sections.css`.

**Coherencia (reversión documentada).** El em azul+peso es una **excepción** a la regla del sistema «em de título = dorado» y revierte la nota Fase 6c («la tipografía no lleva muletas de contraste; la superficie garantiza la lectura»). La evidencia visual mandó: esa apuesta no cuajó en la banda velada. Se justifica igual que la cursiva azul del rotador del hero (acento convocado en contexto de baja legibilidad del dorado). **Conviene anotarlo en el doc de tipografía.**

### 1.5 Enlace a la sangha monástica

**Decisión.** «Conoce a toda la sangha monástica» → `/sobre/sangha-monastica/sangha-monastica.html` (antes `/comunidad`), alineado con el submenú del navbar. Página por construir.

**Archivos.** `index.html`.

### 1.6 Footer — Únete dentro de Navegar

**Decisión.** Se añaden **Grupos** y **Voluntariado** a la columna Navegar. Como el footer colapsa cada sección a un enlace y Únete no tiene hub ni landing, se expande a los dos spokes reales en vez de elegir uno arbitrario.

**Reconciliación necesaria.** El partial canónico `footer.html` divergía del `index`: tenía los social en `#` y «Sobre» en ruta pelada. Se corrigieron a las URLs reales para que `sync.py --all` **no regrese** los enlaces buenos del index al propagar.

**Archivos.** `footer.html` (canónico) + footer embebido del `index.html`.

---

## 2. Cambios añadidos durante la sesión

### 2.1 Participa — reestructura de la vía y hover

**Diagnóstico (medido con render real).** Las tres vías miden lo mismo (189px); no había desequilibrio de altura, sino **31px de aire bajo el texto** (16px de padding + interlineado 1.65) que en la tarjeta destacada se veía como hueco. La flecha, con `align-self:center`, caía **33px por debajo** del título (flotando) y a 8px del borde (pegada).

**Decisión.** Estructura determinista: `via__body` + `via__row` (h3 + flecha en la MISMA fila → flecha sobre la línea del título en cualquier fuente, dif 0px). Padding derecho a 16px (aire al borde). Párrafo a `line-height: 1.5`.

**Hover rediseñado.** Iluminación **dorada difusa** (degradado radial de `--dorado` a baja opacidad desde la izquierda + halo suave inferior con `box-shadow`, hilo superior desvanecido). Número y flecha en dorado. Todo por `color-mix` desde `--dorado`. La regla `.is-auto` queda como **alias latente** del hover.

**Archivos.** `index.html`, `paramita-extras.css`.

### 2.2 Retirada del destacado cíclico `.is-auto`

**Decisión.** Se retira `paramita-participacion.js` de la carga (auto-avance del destacado cada 2,2s).

**Fundamento.** Atención que avanza sola en temporizador = misma familia de antipatrón que el carrusel automático que ya se había descartado (doc de motion: lo ambiental identitario sí; lo que se mueve solo reclamando la mirada, no). Con la flecha en reposo, la afordancia ya está cubierta de forma estática. La regla CSS `.is-auto` permanece como alias del hover por si se reactivara.

**Archivos.** `index.html` (script fuera de carga; el `.js` queda huérfano y se puede borrar).

### 2.3 Deep-link por nivel desde la Antesala

**Decisión.** Las tres puertas de la Antesala aterrizan en el catálogo **ya filtrado**:
- Empiezo hoy → `formacion-publica.html#nivel-1`
- Ya practico → `#nivel-2` (II · III)
- Vengo a profundizar → `#nivel-4` (IV · V)

Se replica el mapa exacto de las puertas del propio hero de formación (`#nivel-1`→I, `#nivel-2`→II·III, `#nivel-4`→IV·V).

**Mecanismo.** El catálogo filtra por `data-nivel` con un objeto único `filtros`, pero el JS **no leía la URL**. Se extrajo el cuerpo de las puertas a una función única `aplicarRangoNivel(target, {scroll})` y se añadió que, al cargar con un hash de nivel, aplique ese mismo filtro y salte al catálogo. Es el mismo camino que el click (comportamiento ya probado), disparado desde la URL. Sintaxis validada con `node --check`.

**Archivos.** `index.html`, `paramita-formacion.js`.

### 2.4 Flecha de afordancia en las puertas de la Antesala

**Decisión.** Misma lógica que participa: una flecha `→` (un `<span>`, no enlace anidado) abajo-derecha de cada card, tenue en reposo, dorada y deslizándose en hover/focus (en sintonía con el número, que ya se doraba). Las cards son de igual altura (grid `align-items: stretch`), así que la flecha va en flujo como último elemento para no solaparse con descripciones largas.

**Archivos.** `index.html`, `paramita-antesala.css`.

### 2.5 Ritmo visual entre bloques — frase zen

**Consulta.** Todos los bloques comparten el fondo lino; ¿diferenciar alguno?

**Investigación.** El sistema ya prevé esto: `--arena` está definido como token de «secciones alternas». El halo dorado del `cta-final` está pensado como **gesto singular de cierre**.

**Iteración.**
1. Primera propuesta: asiento en `--arena` plano. Se descartó por «muy plano».
2. Solución final: se replica la atmósfera **`.zona-luz`** de la landing de meditación (que sí gustaba): luz cálida `--calido-zen` desde arriba-derecha + `--dorado` muy tenue abajo-izquierda + banda de `--arena` que **se difumina en los cantos** (transparente→arena→transparente). Montada en `.zen-frase::before` a `z-index:-1` con `isolation:isolate`.

**Por qué no el halo dorado en la frase zen.** Sería dorado-sobre-dorado con el degradado del propio título (se emborrona) y clonaría la firma del cierre, restándole singularidad. Verificado con render comparativo (liso / arena / halo).

**Archivos.** `paramita-extras.css`.

**Coherencia (duplicación).** La receta está **replicada** de `.zona-luz` (`paramita-meditacion.css`): dos fuentes del mismo efecto. Pendiente opcional: promover `.zona-luz` a componente compartido (DRY) y usarlo en ambas páginas.

---

## 3. Principios que guiaron las decisiones

- **La home es un hub, no una landing de conversión**: hallazgos de los informes de conversión (CTA único, quitar navegación) no se importan aquí sin filtro.
- **Polo calmado**: el ritmo se hace **puntuando** set-pieces (arena / zona-luz en uno o dos bloques), no alternando todos los fondos — eso sería el «polo ruidoso» que la identidad rechaza.
- **Motion**: el hover intensifica/convoca; nada de movimiento que avance solo reclamando atención.
- **Afordancia estática**: si algo es enlace, debe parecerlo en reposo (clave en móvil, sin hover). Nunca un `<a>` dentro de otro `<a>`.
- **Énfasis robusto**: sobre superficie de contraste incierto, acentuar por **peso+estilo** antes que por *hue*.
- **Tokens estrictos**: todo color por `color-mix` desde la paleta OKLCH; sin hex sueltos.

---

## 4. Archivos tocados

| Archivo | Qué cambió |
|---|---|
| `index.html` | Enlaces (formación unificada + deep-link por nivel, sangha, vías de participa, footer Únete); reestructura de vías (`via__body`/`via__row`) y flechas; flecha en puertas de la Antesala; `<em>refugio de Dharma</em>`; retirada de la carga de `paramita-participacion.js`. |
| `paramita-extras.css` | Flecha y hover dorado difuso de participa; atmósfera `zona-luz` de la frase zen (`.zen-frase` + `::before`). |
| `paramita-antesala.css` | `.antesala__puerta__arw` (flecha de afordancia) + hover. |
| `paramita-sections.css` | `.band h2 em` en azul-oscuro con peso asertivo e itálica; padding y `min-height` de la banda en móvil. |
| `paramita-hero.css` | Cursiva móvil a `--wght-presencia` (400); color del lede reforzado en móvil. |
| `paramita-formacion.js` | `aplicarRangoNivel()` como fuente única + lectura de hash al cargar para pre-filtrar el catálogo. |
| `footer.html` | Grupos + Voluntariado en Navegar; social reales y ruta de «Sobre» reconciliados. |

---

## 5. Pendientes y decisiones abiertas

- **Copy provisional** (Ale/Khenpo): el énfasis «refugio de Dharma» y cualquier texto tocado.
- **Doc de tipografía**: anotar la excepción del `em` azul+peso en `.band` (rompe «em de título = dorado»).
- **Páginas por construir** a las que ahora apuntan enlaces: `/unete/grupos/`, `/unete/voluntariado/`, `/sobre/sangha-monastica/`.
- **Backend (Alberto)**: endpoints de formularios y pasarela; los deep-links funcionan en cuanto se despliegue el JS.
- **DRY opcional**: promover `.zona-luz` a componente compartido.
- **Ritmo de un 2º bloque** (sugerencia: «Una tradición viva» como cámara de confianza) — solo si al ver la frase zen encaja.
- **Limpieza**: `paramita-participacion.js` queda huérfano (se puede borrar).
- **Lede sobre vídeo real**: confirmar contraste en móvil; reforzar velo si hace falta.

---

## 6. Recordatorios de despliegue

- `git pull` antes de empezar y antes de cada push (evita conflictos con los auto-commits de la Action).
- `footer.html` es partial: solo llega al resto de páginas tras `python3 sync.py --all` (o el push, que dispara `sync.yml` al tocar `partials/**`).
- `paramita-formacion.js` y `paramita-antesala.css` van directos a sus carpetas (`js/componentes/`, `css/componentes/`); no los toca el sync.
- Servir siempre desde la raíz del proyecto; las rutas absolutas (`/assets/…`) fallan bajo `file://`.

---

*Cierre de sesión. Todos los cambios verificados en render con la tipografía real del repo.*
