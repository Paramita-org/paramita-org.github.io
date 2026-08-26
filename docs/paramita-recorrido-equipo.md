# Paramita · Recorrido rápido de la web

**Para el equipo web · act. 26 ago 2026**
Web en vivo: **https://paramita-org.github.io/**

Esto es un paseo de 10 minutos por la web, no la documentación. Abre el enlace de arriba en una pestaña y ve clicando cada sección conforme lees. Todo lo que aparece aquí ya está publicado y se puede ver ahora mismo.

Una nota de contexto antes de empezar: es un sitio **estático** (HTML/CSS/JS a mano, sin framework), servido desde GitHub Pages. La barra de arriba, el pie y algunas piezas comunes son las mismas en todas las páginas —se propagan solas— así que lo que aprendas de una zona vale para el resto.

---

## 1 · La barra de arriba (lo que verás en todas las páginas)

De izquierda a derecha en la versión pública: el **logo** (vuelve al inicio), y los apartados **Meditación**, **Cursos**, **Actividades** y **Blog**, que son enlaces directos. Después vienen dos apartados con desplegable:

- **Sobre** abre cinco entradas: Maestros, Khenpo Rinchen Gyaltsen, Comunidad Monástica, La Fundación y Preguntas Frecuentes.
- **Únete** abre dos: Grupos y Voluntariado.

A la derecha del todo hay tres cosas: el botón **Contribuir** (es la única acción del navbar), un **sol/luna** para cambiar de modo, y un **círculo con silueta** que lleva al acceso de cuenta.

En móvil, los apartados se pliegan dentro del **menú hamburguesa**, pero el sol y el círculo se quedan siempre visibles en la barra para que estén a un toque.

---

## 2 · Modo penumbra (el "dark mode")

Es el botón del **sol** arriba a la derecha. Al pulsarlo el sitio pasa a "penumbra" (tonos oscuros) y al volver a pulsar regresa a "luz". Tres cosas que conviene saber:

Arranca siempre en luz —la penumbra es **opt-in**, nadie la tiene activada sin haberla pedido. Una vez elegida, **se recuerda** entre páginas y entre visitas (queda guardada en el navegador). Y es **global**: el mismo botón está en todas las páginas, así que la preferencia de lectura te acompaña por todo el sitio. Pruébalo en cualquier página y navega: verás que no se resetea.

---

## 3 · La home pública, por scroll

Baja despacio desde arriba. El orden es este:

1. **Hero** — El titular tiene una palabra en dorado cursiva que va **rotando sola** ("sabiduría interior", "mejor versión", "paz interior"…). Mueve el ratón por encima del hero: hay un **efecto de fluido** que sigue al cursor. Dos botones: "Aprende a meditar" (va al aula) y "Explorar los cursos".
2. **Bienvenida** — el puente entre la sabiduría de los Himalayas y el mundo hispanohablante.
3. **Vídeo** — "Conoce Paramita en dos minutos": al pulsar abre el vídeo en un **modal**.
4. **El camino / Cursos** — tres puertas de entrada al sendero (empiezo hoy · ya practico · vengo a profundizar), que enlazan a los niveles del catálogo.
5. **Participa** — tres vías: practicar en comunidad (Grupos), ofrecer tu tiempo (Voluntariado) y apoyar el proyecto (Contribuir).
6. **Crowdfunding** — bloque del futuro centro de retiros, con acceso a su landing.
7. **Una tradición viva** — Khenpo, el linaje Sakya y los hitos (siglo XI · 2008 · +1 millón), con fotos de la sangha y del centro.
8. **Diario / Blog** — cuatro artículos destacados. Pasa el cursor por una tarjeta: la **imagen crece y el título asoma** desde el fondo.
9. **Boletín** — formulario de newsletter. Al suscribirte muestra el estado "Gracias, te has suscrito correctamente".
10. **Pie** — redes, navegación, contacto y dirección del centro.

Casi todos los bloques **aparecen con una animación suave al entrar en pantalla** conforme haces scroll.

---

## 4 · El área logueada (con sesión iniciada)

Pulsa el **círculo** de la barra: te lleva a la **home logueada** ("Mi espacio"): https://paramita-org.github.io/home-logueado/home-logueado.html

> Ojo: hoy no hay login real todavía. El círculo lleva directo a la home logueada como demo. El sistema de sesión (quién entra, cómo, a dónde redirige) está pendiente de las decisiones de LMS; hasta entonces todo el área logueada es una maqueta funcional.

Cuando hay sesión, **la barra cambia**: donde ponía "Cursos" ahora pone **"Mi formación"**, desaparece el botón de Contribuir del sitio que tenía y el círculo pasa a mostrar la **inicial del usuario** (ahora "J" de ejemplo). Al pulsar esa inicial se abre un desplegable con: Mi cuenta, Mi formación, Ir al aula (LMS) y Cerrar sesión. El resto del menú (Meditación, Actividades, Blog, Sobre, Únete) es igual que en público.

La **home logueada**, de arriba abajo: un **saludo que cambia según la hora** ("Buenas tardes, Jana…"), un mini-mapa del sendero, próximos encuentros, un bloque de enseñanza, novedades, lecturas que acompañan y un cierre con el siguiente paso.

Página relacionada: **Mi formación** (catálogo logueado, con estado de cada curso): https://paramita-org.github.io/formacion-logueado/formacion-logueado.html · y **Mi cuenta**: https://paramita-org.github.io/cuenta/cuenta.html

---

## 5 · Actividades y sus plantillas (recién montadas · aún en revisión)

Actividades es el segundo carril del sitio, distinto del de cursos: aquí la lógica no es temario, sino **fecha, lugar, aforo y reserva**. La página índice reúne el calendario y las tarjetas de cada actividad, y de ella cuelgan cinco plantillas —una por tipo— montadas todas sobre el mismo sistema de diseño (igual que la ficha de curso EMI es la muestra del carril de formación).

> **Importante:** estas landings están **recién construidas y todavía no revisadas al 100%**. Úsalas como muestra del formato, no como versión final: textos, fechas, fotos y algún enlace son provisionales, y falta rematar el cableado de algunas tarjetas del índice y el repaso en móvil.

- Índice de Actividades — https://paramita-org.github.io/actividades/actividades.html
- Plantilla · Retiro (multi-día, residencial, con aforo y reserva) — https://paramita-org.github.io/actividades/retiros/retiro.html
- Plantilla · Evento (sesión suelta, compromiso ligero) — https://paramita-org.github.io/actividades/eventos/evento.html
- Plantilla · Gira genérica (un maestro, varias fechas/ciudades) — https://paramita-org.github.io/actividades/giras/gira.html
- Plantilla · Gira por ciudad (ejemplo Madrid) — https://paramita-org.github.io/actividades/giras/gira-madrid.html
- Plantilla · Celebración (festividad de acceso libre, dāna opcional) — https://paramita-org.github.io/actividades/celebraciones/celebracion.html

Igual que la inscripción a cursos, la **reserva de actividades** todavía no tiene backend: los botones de reserva apuntan a vacío hasta que se conecte.

---

## 6 · El resto de páginas (para clicar)

**Públicas**
- Meditación — https://paramita-org.github.io/meditacion/meditacion.html
- Cursos (catálogo público) — https://paramita-org.github.io/formacion/formacion-publica.html
- Blog — https://paramita-org.github.io/blog/blog.html · entrada de ejemplo — https://paramita-org.github.io/blog/maqueta-blog-entrada.html

**Sobre**
- Maestros — https://paramita-org.github.io/sobre/maestros/maestros.html
- Khenpo — https://paramita-org.github.io/sobre/khenpo/khenpo.html
- Comunidad Monástica — https://paramita-org.github.io/sobre/sangha-monastica/sangha-monastica.html
- La Fundación — https://paramita-org.github.io/sobre/la-fundacion/la-fundacion.html
- Preguntas Frecuentes — https://paramita-org.github.io/sobre/preguntas-frecuentes/preguntas-frecuentes.html

**Únete y apoyo**
- Grupos — https://paramita-org.github.io/unete/grupos/grupos.html
- Voluntariado — https://paramita-org.github.io/unete/voluntariado/voluntariado.html
- Contribuir — https://paramita-org.github.io/contribuir/contribuir.html
- Crowdfunding — https://paramita-org.github.io/crowdfunding/crowdfunding.html

---

## 7 · Formularios y en qué punto están

El sitio tiene tres "vías" de transacción separadas, sin carrito de la compra: **donativo** (Contribuir), **inscripción a cursos** e **inscripción a actividades**. Cada una es de un solo elemento.

- **Newsletter** (home y pie) — completo a nivel de interfaz: valida, muestra el estado de éxito y el aviso de privacidad.
- **Voluntariado** — hay página de puertas (Voluntariado) y una página de **solicitud** con su formulario de campos. La interfaz está montada.
- **Grupos** — página de grupos y una **solicitud de nuevo grupo** con formulario.
- **Inscripción a cursos** — pantalla de inscripción montada; el flujo real es: **pago en paramita.org → alta por API en el aula** (LearnWorlds, en `cursos.paramita.org`, URL provisional).
- **Contribuir** — la página está, pero sus botones de aportación apuntan de momento a vacío: **esperan la pasarela de pago y los endpoints**.

En resumen: **el frontend de los formularios está**, lo que falta es conectar el backend (pasarela y endpoints de envío).

---

## 8 · Cómo se comporta el movimiento

Hay dos familias de animación, a propósito:

- **De ambiente** — cosas lentas que están siempre (gradientes que fluyen, el fluido del cursor). Marcan identidad y no distraen.
- **Por interacción tuya** — al hacer scroll (los bloques aparecen), al pasar el ratón (tarjetas del blog), al abrir el acordeón de las FAQ, al reproducir el vídeo, al desplegar un menú.

Lo que **no** vas a ver, y es deliberado: carruseles que avanzan solos, contadores de urgencia, ni animaciones infinitas fuera de la familia de ambiente. Además, si alguien tiene activado en su sistema el "reducir movimiento", el sitio lo respeta y baja las animaciones.

---

## 9 · Cosas que conviene tener claras

- El sitio ya tiene **favicon propio**: la flor de loto del logo, en degradado de los azules de marca. Lo verás en la pestaña del navegador.
- **`www.paramita.org` es la web viva actual** (la que gestiona Alberto). Esto de GitHub Pages es el rediseño nuevo. No se toca la web viva.
- El **aula** (`cursos.paramita.org`) es una URL provisional hasta que lance el sitio nuevo.
- Toda el **área logueada** (home logueada y su barra) está a la espera de las decisiones de sesión/LMS.
- El sitio es **responsive**, pero la revisión a fondo en móvil está **aún en curso**: puede haber ajustes de espaciado, tipografía o algún bloque puntual pendientes de pulir en pantallas pequeñas.
- Los textos son **provisionales**: pueden cambiar sin que cambie la estructura.
- Las **imágenes son provisionales**: fotos de muestra que se sustituirán por las definitivas.

---

*Si algo no se ve bien en GitHub Pages, el primer paso casi siempre es recargar forzando caché (Cmd+Shift+R): la web se cachea de forma agresiva.*
