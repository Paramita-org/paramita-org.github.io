# Punto de situación · Landing de Meditación

**Sesión de correcciones — 14 de agosto de 2026**
Página: `meditacion/meditacion.html` · Estado: los 9 puntos de la revisión (0–8) **cerrados**.

---

## 1 · Contexto

Revisión completa de la landing de meditación a partir de una lista de 9 observaciones
sobre percepción de usuario, jerarquía visual y coherencia con los informes de diseño.
El trabajo se hizo *file-first* (leyendo el código real antes de proponer nada), una
decisión cada vez y con validación en navegador entre pasos. Ningún valor, token, regla
ni copy se inventó: todo deriva del sistema existente. El copy y los horarios son
**provisionales** hasta firma de Ale (contenido) y Khenpo (doctrina).

**Archivos tocados en la sesión:**

| Archivo | Alcance |
|---|---|
| `meditacion.html` | Bloque de horarios, escalera, práctica, cierre, hero, CTAs |
| `css/paginas/paramita-meditacion.css` | Bloque de horarios, difusor, orbe, título, coda, velo móvil |
| `js/paramita-meditacion.js` | Revelado multi-disparador, sincronía etiqueta↔orbe, motor de husos |
| `js/paramita-formacion.js` | Lector `?nivel=N` para pre-filtrar el catálogo desde otra página |

---

## 2 · Los 9 puntos

### Punto 0 · Bloque «Medita con nosotros» (horarios)

**Diagnóstico.** El único horario del sitio estaba enterrado en un peldaño de la escalera,
y los CTA «Meditar en el centro» apuntaban a `/actividades/`, que **no es** un horario de
meditación semanal sino un calendario de retiros y celebraciones. El botón prometía una
cosa y aterrizaba en otra.

**Decisión.** Sección propia `#horarios` después de la escalera, como «zoom» del beat
«esta semana». Pasa a ser el destino de todos los CTA de centro y del paso 02 de la escalera.

**Solución.**
- Dos sesiones (demo): **L–V 19:30** (meditación guiada) y **Domingos 10:00** (práctica de Tara).
- Online y presencial **por igual** → dos `btn-secundario` sin jerarquía.
- La hora canónica de España vive en el HTML (`data-hora` + `data-tz="Europe/Madrid"`); el
  JS calcula en vivo la equivalencia con `Intl`, de modo que el **DST siempre es correcto**
  (ver §4). Muestra «En tu zona» (huso del visitante) + rejilla de husos LatAm.
- La Tara no lleva fila internacional: a las 10:00 de España cae de madrugada en América
  (2:00–5:00). Se marca con nota + grabación posterior.

**Justificación de diseño.** El doc 02 define `--arena` como superficie de «secciones
alternas»: el sistema separa secciones con atmósfera cálida. El bloque resuelve además una
incoherencia de arquitectura (CTA→calendario de eventos) documentada en el propio análisis.

---

### Punto 1 · Hero en móvil

**Diagnóstico.** El velo del hero (pensado como degradado horizontal para la columna
izquierda de escritorio) en móvil dejaba el texto sobre la foto. Bajaba al 40 % de lino
justo al 70 % de altura —donde caen «respirando» y la meta «Guiado por… 24 años»—, por eso
no se leían. La meta usaba `--texto-suave` (gris claro) sobre la camiseta de la foto.

**Solución (solo CSS, dentro del `@media 768px`).**
- Velo cálido vertical **denso en toda la banda de texto** (90→82→70 % hasta el 72 %),
  aligerando solo hacia la foto (manos/suelo). Sigue luminoso; no oscurece.
- Meta acercada a antracita (78 %) manteniendo jerarquía.

**Justificación.** El «respirando» dorado es doctrina (sólido `--dorado`): su legibilidad
se arregla con el velo, no cambiando el color. Se conserva la luz mediterránea del hero.

---

### Punto 2 · Orbe + título de la práctica

Tres asuntos:

**a) Título «Tu primera práctica» a la izquierda.** Era el gotcha del `h2 { max-width: 20ch }`
global: la caja quedaba anclada a la izquierda y `text-align:center` centraba el texto
*dentro* de esa caja estrecha. Corregido con `max-width:none; margin:0 auto` (mismo patrón
que `.cierre-invita h2`).

**b) Orbe plano.** Los `box-shadow` eran anillos concéntricos de spread sólido → se leían
como aros duros, no como luz. Rediseñado:
- Glow **difuso** (`blur`) que respira con el ciclo.
- **Aura ambiental** detrás (`.orbe-wrap::before`, radial + `blur`) que da la luz lateral
  que faltaba y levanta la pieza del fondo.
- La aura hace un pulso muy suave que **nunca baja de 0.55 de opacidad**, así la composición
  sigue viva incluso durante el «sostén» (cuando la escala se queda quieta).

**c) El orbe no se movía (bug encontrado, ver §4).** La duración `--respiro-guia` estaba
definida en `.hero--meditacion`, que **no es ancestro del orbe** → la variable no llegaba y
la animación se caía. Reubicada en `.practica`.

**d) Etiqueta desincronizada.** El orbe (CSS) y la etiqueta (JS) corrían con dos relojes
distintos y empezaban desfasados. Ahora la etiqueta se **engancha a los eventos de la
animación del orbe** (`animationstart` / `animationiteration`): el orbe es el reloj maestro,
así «Inhala/Sostén/Exhala» caen exactamente en cada cambio de tamaño y no derivan nunca.

**Justificación.** El orbe es un guía **funcional** de respiración, no motion decorativo;
su función *es* hincharse y deshincharse. Se respeta `prefers-reduced-motion` (orbe y aura
estáticos pero luminosos, con glow base) y la doctrina de motion (lo `infinite` solo para
lo ambiental/identitario). De paso se eliminaron los `oklch()` hardcodeados: **cero** colores
fuera del sistema de tokens.

---

### Punto 3 · CTA «Meditar en el centro» → horarios

Resuelto con el punto 0: todos los «Meditar en el centro» anclan a `#horarios`; `/actividades/`
queda para lo que es (retiros y celebraciones).

---

### Punto 4 · Quitar «Empezar el nivel I» de la práctica

**Decisión.** Eliminado del bloque post-práctica. Tras la primera respiración, empujar un
curso rompe el marco *dāna* y contradice la propia escalera, que reserva el nivel I para
«cuando quieras profundizar». El bloque queda con una sola acción coherente con el momento:
«Meditar en el centro» → horarios. El nivel I no se pierde: vive en la escalera.

**Justificación.** Doc 05: un CTA no se usa por prominencia sino cuando hay una acción
prioritaria real; un CTA decorativo o prematuro es antipatrón.

---

### Punto 5 · La nota «No es magia…»

**Diagnóstico.** Pegada a las cards de pictogramas y con el mismo registro, se leía como una
card más.

**Solución.** Coda de cierre: separada con aire (`--espacio-contemplativo`) y un hairline
corto centrado, en registro más quieto (`--texto-tenue`, centrada, medida estrecha). Se lee
como «un apunte final». Sin itálica, para no rozar la doctrina de Fraunces itálica.

---

### Punto 6 · «Tu camino» (escalera)

**Decisión de fondo (a propuesta de Jana):** los tres pasos con CTA **terciario uniforme**
(`t-link`). Se retiró el `btn-secundario` del paso 02.

- **6.01 · «Hoy»** → un `t-link` «Respirar ahora» que **revela y sube al orbe**, igual que el
  primario del hero. El JS se generalizó a `[data-abre-practica]` (lo llevan el botón del hero
  y este enlace). El `<a href="#practica">` es fallback sin JS.
- **6.02 · «Esta semana»** → ancla a `#horarios` (deja de repetir el horario).
- **6.03 · «Cuando quieras profundizar»** → `/formacion/formacion-publica.html?nivel=1`. En
  `paramita-formacion.js` se añadió un lector que, al cargar con `?nivel=N`, aplica el filtro
  reutilizando el mismo motor que las puertas del hero (`sincronizarMapa` + `aplicarFiltros`),
  con frase-intención y mapa sincronizados. Solo acepta niveles 1–5.

**Justificación.** Doc 05: el `t-link` es continuidad editorial «al pie de sección». La
escalera es un mapa de lectura, no una zona de conversión; el peso (secundario/primario) se
reserva para el bloque de horarios y el hero. Cadencia pareja = ritmo contemplativo.

---

### Punto 7 · «Quién te acompaña» → comunidad monástica

**Decisión.** Repuntado a la ruta canónica `/sobre/sangha-monastica/sangha-monastica.html`
(la que usa el navbar en todo el sitio; confirmada en el informe de maestros/comunidad). Copy
ajustado a «Conoce a la comunidad monástica» para que texto y destino cuadren. La página aún
no existe (se construirá más adelante), pero la ruta ya queda vinculada y correcta.

---

### Punto 8 · El cierre como coda

**Decisión.** Una sola acción suave: `t-link--primario` «Meditar en el centro →» a `#horarios`.
Se retiró el `btn-primario` (chocaba con el tono contemplativo del cierre) y el segundo enlace
redundante.

**Justificación.** Doc 05, mismo razonamiento que la home: dos CTA compitiendo rompen la calma
de la «orilla» contemplativa. El cierre es esa orilla.

---

## 3 · Refinamiento del bloque de horarios (segunda pasada)

Tras la primera versión, dos problemas de percepción, resueltos con fundamento en informes:

**Transición escalera → horarios inexistente.** Dos secciones planas seguidas sin cambio de
superficie se leían como una sola; peor, el eyebrow «EN GRUPO · CADA SEMANA» usaba el mismo
lenguaje que las etiquetas de la escalera y parecía un «peldaño 04». Solución: **difusor**
cálido suave y sin borde (`#horarios::before`, aura de la familia identitaria, no la banda
dura de `.zona-luz`), que marca el cambio de zona sin costura y levanta el panel `--card`.
No se hizo `zona-luz` para no chocar con «Quién guía» (que sí lo es) justo debajo.

**Bloque plano, husos poco diferenciados.** Los husos se leían como continuación del párrafo.
Solución (rejilla sobria, elegida frente a chips): tres estratos claros por sesión —título+desc,
hairline, equivalencias—; «En tu zona» promovido a lo más prominente con acento dorado a la
izquierda; rejilla rótulo/valor `En el mundo` (ciudad `--texto-tenue`, hora `--antracita` bold
tabular); divisor vertical sutil entre el «cuándo» y el cuerpo. Robustez: el separador usa
`:has()` para aparecer solo si hay contenido visible (sin JS no cuelga una línea vacía).

---

## 4 · Aprendizajes técnicos

1. **Husos horarios y DST.** El desfase España↔LatAm cambia según la estación (España hace
   cambio de hora; casi toda LatAm ya no, y Chile al revés). Hardcodear horas estaría mal medio
   año. Solución: hora canónica en `Europe/Madrid` en el HTML + cálculo en vivo con `Intl`
   (`formatToParts` para el offset de zona) → el navegador aplica el DST correcto de cada país.
   Ejemplo verificado: L–V 19:30 ES = 11:30 México en verano, 12:30 en invierno; Santiago salta
   13:30 → 15:30 al invertir Chile su horario.

2. **Scope de variables CSS.** `--respiro-guia` definida en `.hero--meditacion` no llegaba al
   orbe (que vive en `.practica`, no descendiente del hero). Una `var()` indefinida en el
   shorthand `animation` lo invalida entero → sin animación. Lección: **definir las custom
   properties en un ancestro común real de quien las usa**.

3. **Gotcha del `h2` global.** `h2 { max-width: 20ch }` rompe cualquier título centrado: hay
   que neutralizar con `max-width:none; margin-inline:auto`.

4. **Sincronía CSS↔JS.** Para que una etiqueta JS cuadre con una animación CSS, la animación
   debe ser el reloj maestro vía `animationstart`/`animationiteration`, no un `setTimeout`
   paralelo (empiezan desfasados y derivan).

5. **Disciplina de tokens.** Se eliminaron los `oklch()` hardcodeados del orbe; todo color
   deriva de tokens con `color-mix(in oklch, …)`. Sombras basadas en `--antracita` (nunca
   `color-mix(dorado, azul)`, que da verde).

---

## 5 · Jerarquía resultante de CTAs

- **Un único `btn-primario` en toda la página**: el del hero («Empiezo a respirar»), que es la
  conversión real.
- **Secundarios** reservados al bloque de horarios (dos vías por igual).
- **Terciarios** (`t-link`) para toda continuidad editorial: escalera, «quién te acompaña»,
  cierre, post-práctica.
- **Nivel I** aparece en un solo sitio: la escalera (→ catálogo pre-filtrado).

---

## 6 · Dependencias y pendientes

- **Contenido (Ale/Khenpo):** horarios reales (¿solo estas dos sesiones?), copy de todos los
  bloques, y si el online es en directo o diferido. Todo provisional hasta firma.
- **Comunidad monástica:** la página `/sobre/sangha-monastica/` está enlazada pero aún por
  construir.
- **Incoherencias de ruta en otras páginas** (no tocadas, para lista aparte): `index.html`
  enlaza la sangha a `/comunidad`; `contribuir.html` usa `/sobre/monasticos-monasticas/…`.
  Ambas difieren de la canónica `/sobre/sangha-monastica/`. Alinear o dejar redirect de
  `/comunidad`.
- **Anclas `#nivel-1/2/4`** en formación: parecen no tener `id` de destino (el pre-filtro por
  `?nivel=` no los necesita, pero conviene revisarlas).

## 7 · Nota de despliegue

`paramita-formacion.js` es de otra página. Hacer `git pull` antes de empujar para no chocar con
el auto-commit del GitHub Action.

---

## 8 · Conclusión

La landing de meditación queda coherente con el sistema en las tres capas que se revisaron:
**arquitectura** (los CTA de centro llevan por fin a un horario real; el nivel I a un solo
lugar), **percepción** (transiciones de zona con difusor, jerarquía interna del bloque de
horarios, hero legible en móvil, orbe que por fin respira y sincroniza) y **doctrina** (un solo
primario, terciarios contemplativos, marco *dāna* respetado, cero color fuera de tokens). Los
bugs de fondo —el orbe congelado por el scope de la variable y el desfase de la etiqueta— eran
previos y quedan resueltos. Lo que falta es contenido real y la página de comunidad monástica.
