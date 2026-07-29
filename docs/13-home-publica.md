# 13 · Home pública — decisiones, estructura y justificación

*Fase 7 · julio 2026. Documenta el cierre de la home genérica (visitante no autenticado). La home logueada se trata aparte en `09-home-logged-in.md`.*

---

## 1. Propósito y marco

La home pública es la puerta de entrada para **alguien que aún no conoce Paramita**. Su trabajo no es vender ni convertir a toda costa: es **acoger, orientar y dar confianza**.

La decisión de marco que condiciona todo lo demás: **la home es un hub, no una landing de conversión.** Los informes de conversión miden landings de campaña —un objetivo, un CTA, sin vías de escape—. La home hace otro trabajo: repartir hacia varios destinos (meditar, cursos, participar, contribuir, blog) y construir confianza. Por eso hay hallazgos de esos informes que **no** se aplican aquí; el más claro: "quitar la navegación sube la conversión" es cierto para un anuncio, pero en la home el navbar *es* la función, no fricción.

Marco de identidad, del informe de tendencias 2026: el año tiene dos polos —uno ruidoso (brutalismo, 3D por defecto, IA que reordena la página) y uno calmado (minimalismo expresivo, neutros restauradores, curaduría humana, tipografía que respira)—. La columna calmada coincide punto por punto con la identidad fijada en Fase 0. Para Paramita, **estar a la vanguardia y ser fiel a su identidad son lo mismo**. La trampa no es quedarse corto: es importar el polo ruidoso para "parecer moderno".

---

## 2. Fundamento de datos

Las decisiones de esta fase se apoyan en tres documentos previos del proyecto, no en opinión:

- **Informe de conversión (catálogo /formacion/):** velocidad de carga (53% abandona si tarda más de 3 s; +4–7% de conversión por cada segundo ganado), el efecto de un CTA único frente a varios (~+32%), el valor de la auto-cualificación frente al volumen, y el diseño ético como ventaja.
- **Informe de home · conversión y tendencias 2026:** los dos polos del año; el juicio de credibilidad en los primeros 50 ms (46% juzga por lo que ve); los umbrales de Core Web Vitals (LCP ≤ 2,5 s · INP ≤ 200 ms · CLS ≤ 0,1); el rechazo del carrusel (~2% pasa del primer ítem); las condiciones del scroll horizontal; y la "prueba de tradición viva".
- **`01-fundamentos-de-identidad.md`:** el hilo conceptual "el cruce como acto" y el principio rector *"el practicante entra en una tradición viva, no descarga un producto"*, con rechazo explícito de la estética "wellness app".

---

## 3. Estructura de la home, bloque a bloque

El orden sigue un arco: **acoger → orientar → dar confianza → invitar a implicarse**. Scroll vertical; el horizontal se reserva para filas acotadas con sus condiciones.

1. **Navbar.** IA de cinco entradas (Meditación · Cursos · Actividades · Blog · Sobre) + par de CTAs contemplativos + acceso a cuenta.
2. **Hero.** Un mensaje, una acción primaria y credibilidad en los primeros 50 ms. Titular Fraunces, rotador de palabras, par de CTAs (empezar + explorar).
3. **Bienvenidos a Paramita.** Misión y vídeo institucional ("Conoce Paramita en dos minutos"). La única imagen grande de la página.
4. **Frase zen** ("El Camino hacia la Orilla de la Liberación") con zoom de scroll.
5. **Antesala del sendero.** Teaser del camino de cinco niveles → `/formacion/`.
6. **Participación.** Tres vías de implicación (comunidad, voluntariado, apoyo).
7. **Crowdfunding.** El proyecto del centro de retiros.
8. **Una tradición viva.** Prueba de confianza por presencia (ver §4.3).
9. **Blog.** Artículos destacados; autoridad intelectual como credibilidad.
10. **Cierre de umbral.** Suscripción a la newsletter (ver §4.2).
11. **Footer** (con "Practiquemos juntos" y el canvas de lotos).

---

## 4. Decisiones de esta fase

### 4.1 Jerarquía de CTAs

**Decisión.** En el navbar de la home, "Contribuir" pasa de `.btn-primario` a `.btn-secundario`: quedan dos entradas secundarias ("Únete" + "Contribuir"). En el hero, junto al primario "Aprende a meditar" se añade un secundario "Explorar los cursos" → `/formacion/`.

**Justificación.** El navbar contradecía la propia doctrina del proyecto: los documentos 05 (sistema de CTAs) y 06 (navbar) fijan que la home usa pareja de secundarios, sin acción prioritaria, para no romper la calma. Además, poner la petición de dinero como acción de máxima jerarquía a alguien que aún no ha recibido nada invierte lo que el informe recomienda: el visitante nuevo responde a señales de confianza, no a peticiones. En el hero, el primario lleva al LMS (`cursos.paramita.org`) —un compromiso alto, casi un registro—; el secundario ofrece la salida de baja fricción que faltaba, y además retiene al visitante dentro del sitio alimentando el catálogo.

### 4.2 Capa de suscripción en el cierre

**Decisión.** El cierre "Respira. Observa. Suelta." conserva su gesto contemplativo como cabecera y suma debajo un formulario de suscripción de **un solo campo** (email + consentimiento RGPD + botón primario "Suscribirme"). "Aprende a meditar" sale del cierre; "Contribuir" baja a un `t-link` discreto. El subtítulo nombra explícitamente la **newsletter** para que la persona sepa a qué se apunta.

**Justificación.** La conversión honesta del recién llegado no es meditar ya (compromiso alto) ni donar (prematuro), sino **suscribirse**: dejar un correo a cambio de algo. El cierre carecía de esa salida. Un solo campo porque menos campos elevan la finalización; se pide solo email (el nombre, más adelante). Aquí sí aplica el hallazgo del CTA único: dos acciones de igual peso en el cierre diluyen, así que la suscripción es el acto principal y el apoyo queda en segundo plano.

**Estado.** El formulario no tiene endpoint: es un mock visual (valida y muestra el acuse) hasta que el backend conecte el servicio de email. El copy es provisional, a validar por Ale/Khenpo.

### 4.3 De "testimonios" a "una tradición viva"

**Decisión.** Se elimina el carrusel de diez citas anónimas ("Nombre del practicante") y se sustituye por presencia real: el retrato de **Lama Khenpo Rinchen Gyaltsen** (director espiritual), tres cifras de arraigo (linaje Sakya del siglo XI · fundación en 2008 · +1 millón de practicantes de la tradición en el mundo), y una fila con la sangha monástica y el centro de Alicante a tamaño medio. Un `t-link` — "Conoce a toda la sangha monástica" → `/comunidad` (landing por hacer)— actúa de teaser.

**Justificación.** El carrusel no solo era débil (las citas eran lenguaje de producto de bienestar, justo lo que el doc 01 rechaza; y anónimas, restaban credibilidad en vez de sumarla), sino que apuntaba en dirección contraria a la identidad. El informe pide en su lugar "prueba de tradición viva": no reseñas estilo SaaS, sino presencia —linaje, maestro, sede, comunidad—, porque el 46% juzga la credibilidad por lo que ve. Rostros humanos reales pesan más que un edificio o que citas sin rostro.

**Sobre el formato de la comunidad.** Se descartó el carrusel para los monásticos: el propio informe cifra en ~2% quienes pasan del primer ítem de un carrusel; escondería justo lo que se quiere lucir. Al ser muchos, se opta por el patrón "teaser → landing con todos" (como en cursos). Cuando exista esa landing, la comunidad completa usará rejilla (si son pocos por vista) o scroll horizontal **controlado por el usuario** (distinto del carrusel), con las tres condiciones del informe: sangrado a la derecha (sin él, 75% no ve que hay más), señal de arrastre visible y fuera del camino principal.

### 4.4 Jerarquía de imagen

**Decisión.** Una sola media protagonista: el vídeo institucional, contenido a 920 px (antes 1180, se leía de punta a punta). Las fotos del bloque de tradición —sangha y monasterio— van a tamaño medio (formato 3/2 contenido), nunca a banda de punta a punta.

**Justificación.** Dos imágenes grandes del mismo tamaño y la misma luz dorada competían y aplanaban la jerarquía. Con una sola pieza grande (el vídeo) y el resto a escala de contenido, el ojo lee una jerarquía clara: vídeo arriba, luego presencia humana y lugar a tamaño medio.

### 4.5 Tipografía firme en toda la página

**Decisión.** El eje `SOFT` de Fraunces se mantiene en 0 (firme, serifas afiladas y de alto contraste) de principio a fin. El "cruce" en scroll conserva solo un ajuste sutil de peso (`wght` 300 → 320).

**Justificación y contexto.** El movimiento de firma —`SOFT` 0 → 100 al descender, la metáfora del cruce— **nunca había funcionado**: la URL de Google Fonts solo cargaba `ital, opsz, wght`, de modo que el archivo servido congelaba `SOFT` en 0 y la animación era letra muerta. Al autoalojar el archivo completo, el eje cobró vida por primera vez y ablandaba los títulos de la mitad inferior (lo que se percibió como "serifas robustas y distintas"). Decisión de identidad (jul 2026): se prefiere el carácter firme y contrastado de bienvenida en toda la página. El gesto del cruce puede recuperarse en el futuro de forma sutil (`SOFT` 0 → 30) reactivando el eje en el keyframe.

### 4.6 Rendimiento del primer viewport

**Decisión.** El eyebrow y el `<h1>` del hero dejan de llevar `data-reveal`: se pintan a opacidad plena desde el primer frame. Las fuentes se autoalojan y se precargan (ver §5).

**Justificación.** El titular del hero es el elemento LCP, y dependía de JavaScript para hacerse visible: la clase `.js` lo ocultaba (`opacity:0`) y solo reaparecía cuando el observer de `paramita-reveal.js` lo revelaba con una transición lenta. El informe es tajante: el primer render debe ser el titular Fraunces, instantáneo. `data-reveal` es correcto para lo que entra al hacer scroll, no para lo que ya está en pantalla al cargar.

**Pendiente diagnosticado.** En el primer viewport conviven dos fondos animados: el vídeo del hero y el canvas WebGL del fluido, que corre a la vez aunque el hero lo tape. El fluido está bien construido (respeta `prefers-reduced-motion`, degrada sin WebGL, pausa en segundo plano) pero le falta arrancar después del LCP o pausarse mientras el hero lo cubre. Es un ajuste de orquestación (dos líneas: `requestIdleCallback` + un observer), no de arquitectura. Queda supeditado a medir con Lighthouse.

---

## 5. Aprendizajes técnicos

**Autoalojar una fuente variable no es mover el `.ttf`.** Se sirve en woff2 (2–3× más ligero), subseteado por glifos —latin + latin-ext + latin extended additional, este último imprescindible para la transliteración sánscrita/tibetana (IAST: ā, ī, ū, ṃ, ḥ, ṭ, ḍ, ṇ, ś, ṣ…)— pero **sin instanciar los ejes**, que deben seguir variables. La ganancia de LCP no es tanto el peso como eliminar los dominios de terceros (`fonts.googleapis`, `fonts.gstatic`) y poder precargar el archivo exacto con `<link rel="preload" ... crossorigin>`.

**No eliminar un eje variable que el CSS referencia.** Fraunces trae `WONK` (formas caligráficas alternativas) encendido por defecto en el archivo crudo; Google Fonts lo apagaba al servir. Al autoalojar hubo que apagarlo, pero **eliminar** el eje rompió las cosas: el CSS lo nombra en cada título (`"WONK" var(--wonk-desactivado)`), y al no existir el eje, el navegador invalidaba el `font-variation-settings` completo en unos bloques y en otros no, perdiendo el `opsz`. La solución correcta es **conservar el eje con default 0**, no borrarlo.

**Google Fonts congela los ejes que no pides en la URL.** Si la URL lista `opsz,wght`, el archivo servido no trae `SOFT` ni `WONK` animables. Cualquier animación de esos ejes en el CSS es inerte hasta que se autoaloja el archivo completo (ver §4.5).

**El LCP no debe depender de JavaScript.** Un titular oculto por `.js` + revelado por observer + transición lenta retrasa el LCP tanto como cualquier recurso pesado.

**`box-shadow` lo recorta `clip-path`.** En elementos con recorte (el vídeo, las fotos que puedan llevarlo), la sombra va como `filter: drop-shadow` en un envoltorio.

**Carrusel automático ≠ scroll horizontal controlado.** El primero decide por el usuario y esconde contenido (~2% avanza); el segundo lo controla el usuario y, con sangrado a la derecha, comunica que hay más.

---

## 6. Pendientes

- **Endpoint de la newsletter** (backend, Alberto): sustituir el mock por el envío real (Mailchimp/Brevo/propio). El JS deja el punto marcado.
- **Medición de rendimiento:** Lighthouse en móvil con throttling sobre el sitio desplegado; comprobar LCP/INP/CLS antes y después, y decidir sobre el arranque diferido del fluido.
- **Landing de la comunidad** (sangha monástica) con su teaser desde la home; reincorporar allí la foto del centro como contexto.
- **Propagar las fuentes** al resto de páginas (formación, cursos) según `traspaso-fuentes-autoalojadas.md`, con los `.woff2` definitivos.
- **Copy** del cierre y de tradición: validación de Ale/Khenpo.

---

## 7. Archivos tocados o creados en esta fase

- `index.html` — home pública completa.
- `css/tokens/paramita-fuentes.css` — `@font-face` de las fuentes autoalojadas (nuevo).
- `css/tokens/paramita-tipografia.css` — `SOFT` firme; el cruce solo aplica peso.
- `css/componentes/paramita-suscripcion.css` — formulario del cierre (nuevo).
- `css/componentes/paramita-tradicion.css` — bloque "Una tradición viva" (nuevo).
- `css/componentes/paramita-extras.css` — vídeo contenido a 920 px.
- `js/componentes/paramita-suscripcion.js` — validación y acuse (mock) del formulario (nuevo).
- `assets/fonts/` — `fraunces-latin.woff2`, `fraunces-italic-latin.woff2`, `hanken-latin.woff2`, `hanken-italic-latin.woff2` (nuevos).
- `traspaso-fuentes-autoalojadas.md` — guía para replicar el self-hosting en otras páginas (nuevo).

*Nota: el CSS del antiguo carrusel de testimonios (`.testimonios`, `.tcard`, `.tcarousel`) queda huérfano en `paramita-extras.css` y `js/componentes/paramita-testimonios.js` ya no se enlaza; ambos pueden borrarse.*
