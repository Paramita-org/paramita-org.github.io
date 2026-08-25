# 17 · Landing de grupos (`/unete/grupos/`) — estructura, componentes y estado

*Fase 7+ · agosto 2026. Spoke de «Únete» que reúne los círculos de estudio y meditación de la Sangha. Sustituye al README-grupos.md inicial (quedó desfasado: el mapa dejó de ser inline con lotos, los testimonios pasaron a Vimeo, se cerró el prefooter de suscripción y apareció la semblanza de Khenpo). Este doc consolida el estado real.*

---

## 1. Propósito y marco

La página responde a una sola pregunta del visitante: **«¿hay gente practicando cerca de mí?»** — y, si no la hay, invita a **sembrar** un grupo nuevo. El arco es acoger → dar contexto → mostrar el alcance → dejar buscar → filtrar por honestidad si es su momento → dar confianza (voces + Khenpo) → invitar a sembrar → resolver dudas → suscribir. Scroll vertical.

Dos anclas emocionales sostienen la conversión: la **invitación en vídeo de Khenpo** (arriba) y las **voces de la Sangha** (testimonios en vídeo). El buscador es la herramienta; el resto prepara para usarla.

---

## 2. Estructura de la página, bloque a bloque

1. **Navbar público** (partial real, `aria-current="page"` en Grupos, dentro del submenú Únete).
2. **Hero** (`.hero--grupos`) — foto de fondo `assets/img/hero-grupos.jpg`, velo cálido propio de izquierda a derecha (ver §5). Título «Encuentra tu *círculo*.», dos CTA: `.btn-primario` → `#buscador` y `.btn-secundario` → `#invitacion`. Meta «+164 círculos en 15+ países».
3. **Invitación de Khenpo** (`#invitacion`) — entradilla + **vídeo cinematográfico** (`.cinevideo`, id `cineKhenpo`): zoom elástico con muelle + parallax, réplica vanilla del gesto de «Bienvenidos a Paramita». *Distinto de la semblanza del punto 10.*
4. **Qué son** (`#que-son`) — definición breve.
5. **Pictogramas** — cuatro rasgos (claridad, refugio, constancia, comunidad) con dibujado de trazo al revelarse.
6. **Bloque zona-luz** intermedio.
7. **Una comunidad sin fronteras** (`.presencia`) — mapa de presencia + esporas + cifra (ver §4). Difusión reforzada arriba y abajo.
8. **Encuentra el tuyo** (`#buscador`) — buscador filtrable (ver §6).
9. **Con honestidad** (`.momento`) — dos cards sí/no «¿Es el momento para ti?» (ver §9).
10. **Voces de la Sangha** (`.bloque-voces`) — testimonios en vídeo Vimeo (ver §7).
11. **Bajo su tutela** (`.semblanza`) — Khenpo residente, patrón de maestros (ver §8).
12. **Cita del río** (`.cita`) — «Una gota sola…», con divisor «río» dibujado al scroll.
13. **Siembra un grupo nuevo** (`.sembrar`) — imagen + texto + CTA (ver §10).
14. **Preguntas frecuentes** (`.faq`) — con buscador de palabra (ver §11).
15. **Prefooter de suscripción** + **footer** (partials vía sync; ver §12).

---

## 3. Archivos y dónde van

Repo `Paramita-org/paramita-org.github.io` (servido en raíz como sitio de organización).

    unete/grupos/grupos.html                    → spoke bajo unete/ (dos niveles: css/js con ../../)
    css/paginas/paramita-grupos.css             → CSS de página (@layer paginas)
    js/paginas/paramita-grupos.js               → JS de página
    partials/pictogramas/grupos-claridad.svg    → pictograma
    partials/pictogramas/grupos-refugio.svg     → pictograma
    partials/pictogramas/grupos-constancia.svg  → pictograma
    partials/pictogramas/grupos-comunidad.svg   → pictograma
    assets/img/hero-grupos.jpg                  → foto de fondo del hero
    assets/img/mapa-grupos.svg                  → mapamundi (se carga con fetch)
    assets/img/khenpo-luz-dorada-low.jpg        → retrato de Khenpo (semblanza)
    assets/img/semilla-espiritual-grupos.jpg    → imagen del bloque «Siembra un grupo»

Rutas de imagen: absolutas desde raíz (`/assets/img/...`), requieren servir por HTTP (Live Server desde la raíz, nunca `file://`).

> **Importante:** `.semblanza` y el manejador de vídeo Vimeo viven en los archivos de página (`paramita-grupos.css` / `.js`), **no** en los componentes compartidos. Es deliberado: evita descuadres por desajuste con `paramita-tarjetas.css` / `paramita-video.js`. Con reemplazar los tres archivos de grupos, la página queda completa.

---

## 4. Mapa de presencia (SVG externo · glow tranquilo)

- Es un **SVG externo** (`assets/img/mapa-grupos.svg`) que se **carga con fetch+inject** (bloque 3b de `paramita-grupos.js`). Ya no es inline ni lleva flores de loto.
- Geometría: proyección Natural Earth (d3-geo + world-atlas 110m). `viewBox 0 0 1000 519`.
- Colores: países sin presencia en gris muy tenue (`.pais`); **los 19 con presencia iluminados en dorado** (`.pais--on`, ya marcado en el propio SVG). El dorado crea sinergia con la palabra «círculos» y las partículas del bloque.
- **Sin interacción**: es un glow de alcance, no un control. El filtrado real vive en el buscador de abajo. (Se retiraron los lotos y el clic-para-filtrar de la versión anterior.)
- Para cambiar países: editar las clases `pais--on` del SVG (cada país presencia lleva `data-id` con código ISO numérico).
- Decisión de color: se valoró azul claro atenuado, pero mezclar azul con el `--card` cálido en OKLCH cruza el verde en mezclas intermedias; y el dorado da coherencia con el bloque. Se mantuvo el dorado.

---

## 5. Hero (velo propio)

- El velo base del sistema (`paramita-hero.css`) está pensado para el hero de vídeo de la home y solo protege la franja superior. Sobre la foto de grupos dejaba ilegible la mitad inferior de la columna de texto.
- Grupos define su **velo propio** `.hero--grupos::after` (en `paramita-grupos.css`, gana por capa `paginas`): degradado cálido de `--lino` de izquierda a derecha a toda la altura de la columna, que se disuelve hacia la foto; foto a `object-position:center right` y opacidad `.95`.
- Móvil: el velo pasa a vertical denso (el texto cae sobre la foto) y la meta se refuerza hacia `--antracita`.

---

## 6. Buscador «Encuentra el tuyo»

- Índice filtrable estático (Nivel A) + Grid FLIP (ref. doc 09). Estado inicial **vacío** con aviso e icono en **dorado** (`.res__prompt svg`).
- 19 chips de país/región + Todos/Presencial/Online. Filtra por chip o por texto («Tu ciudad o país…»).
- Datos **DE MUESTRA**: sustituir el array `DATOS` de `paramita-grupos.js` por un JSON real de los ~164 círculos.
- Pendiente con Alberto: Nivel A (estático, recomendado) vs. B (geolocalización).

---

## 7. Testimonios en vídeo (Vimeo)

- Componente `.bloque-voces / .voces / .voz` (estilos y **animación en cascada** por `paramita-testimonios.css/js`, ya enlazados). El revelado escalonado lo hace el componente; **grupos.js no lo duplica**.
- Los vídeos son **Vimeo**, no YouTube. El facade del sistema (`paramita-video.js`) solo cubre `data-yt`; el manejo de Vimeo (`data-vimeo`) está en **`paramita-grupos.js` (bloque 7)**: miniatura vía oEmbed (`vimeo.com/api/oembed.json`, con CORS) e iframe de `player.vimeo.com` inyectado al pulsar (nada se carga hasta el clic).
- Testimonios actuales: Lucía (`1203205356`), Luisa (`1203205443`), Víctor (`1203205358`).
- Si un vídeo no muestra miniatura o no reproduce: es la **privacidad de Vimeo** (permitir «embed» + miniatura pública). Si el enlace de Embed incluye hash `?h=…`, hay que añadirlo a la URL del reproductor. Opcional: fijar miniatura propia con `data-thumb="…"` en cada facade.

---

## 8. Semblanza de Khenpo («Bajo su tutela»)

- Bloque `.semblanza` con la **estética de la `.bisagra`** de la landing de maestros: banda cálida `--lino → --calido-zen` a sangre (la clase va en la `<section>`), contenido centrado en `.g-wrap.semblanza__grid`, retrato vertical 120×150 con marco dorado tenue + sombra azul, título grande y CTA `.btn-secundario` → `/sobre/khenpo/khenpo.html`.
- La pastilla «khenpo» y las iniciales «RG» son **reserva**: quedan bajo la foto (solo aparecen si la imagen falla).
- **Estilos en `paramita-grupos.css`** (locales de página), no en el componente, para blindar el bloque frente a desajustes de archivos.

---

## 9. Card «Con honestidad» (sombra dorada)

- Dos cards sí/no. La afirmativa («Este es tu espacio») quedó con **fondo neutro (`--card`) + sombra cálida dorada** (no negra, no relleno de color): la calidez vive en el glow inferior y en el acento dorado del icono y los tics ✓. La card «no es el momento» permanece neutra, así el contraste sí/no se lee.
- Historial de la decisión: se probó relleno dorado (demasiado naranja) y velo azul (demasiado frío); la solución fue neutro + sombra dorada. La sombra usa `color-mix(dorado, transparent)` para conservar el tono sin virar a verde.

---

## 10. Bloque «Siembra un grupo» (con imagen)

- `.sembrar`: card cálida con **imagen** (`semilla-espiritual-grupos.jpg`) como panel lateral (izquierda en escritorio, arriba a todo el ancho en móvil) + texto y CTA agrupados. La imagen lleva `onerror` que retira la figura si la ruta falta (el bloque sigue funcionando solo con texto).

---

## 11. Efectos propios (`paramita-grupos.js`)

1. **Buscador** (Grid FLIP + estado vacío).
2. **Vídeo cinematográfico** de Khenpo (muelle elástico + parallax).
3. **Mapa**: 3a esporas de fondo (canvas; tamaño consciente de densidad de píxel + `ResizeObserver` para que siempre sean círculos) · 3b carga del SVG.
4. **Pictogramas**: longitud de trazo para el dibujado al revelarse.
5. **Divisor «río»**: dibujado con el scroll.
7. **Testimonios Vimeo** (facade con miniatura + click-to-play).

Todos respetan `prefers-reduced-motion`.

---

## 12. Prefooter y footer (partials vía sync)

- El prefooter es el **de suscripción** (`.foot__hero` con `.suscribe`), no el antiguo «Practiquemos juntos». Requiere en el `<head>`: `paramita-suscripcion.css`, `paramita-suscripcion.js` y `paramita-footer-lotos.js` (canvas `#physics`), más `paramita-footer.css` (ya presente).
- El partial `partials/prefooter.html` ya es este; al correr sync queda idéntico.

---

## 13. Componentes del sistema que reutiliza

- Revelados: `data-reveal` → `.is-in` (paramita-reveal.js).
- Testimonios: `paramita-testimonios.css/js` (§7).
- FAQ: `paramita-faq.css/js` — buscador `#faqBuscar` + `.faq__lista` + `#faqVacio` (§14... ver abajo).
- CTA: `.btn-primario` / `.btn-secundario` / `.t-link` (doc 05).
- Hero, pictogramas, tarjetas, suscripción, tema: sus CSS del sistema.

> **FAQ con buscador:** el bloque `.faq` lleva `#faqBuscar` (input con icono `.faq__buscador`); `paramita-faq.js` lo cablea contra `.faq__lista` y muestra `#faqVacio` («Sin coincidencias») cuando no hay resultados.

---

## 14. Orden de despliegue

Los pictogramas primero: si falta un SVG referenciado por `data-pico`, `sync.py` **aborta la página entera** (todo-o-nada).

1. Copia los 4 SVG a `partials/pictogramas/` (`grupos-claridad`, `grupos-refugio`, `grupos-constancia`, `grupos-comunidad`).
2. Copia HTML + CSS + JS + imágenes.
3. `git pull --rebase origin main` (la Action commitea sola tras tocar `partials/**`).
4. `python3 partials/sync.py --all` — inyecta navbar (marcador `<!-- sync: navbar=publico current="Únete" prefooter -->`), prefooter, footer y re-rellena los `data-pico`. Flags disponibles: `--all`, `--aria-current`, `--with-prefooter`, `--only-pictos`.
5. Sirve desde la raíz con Live Server; primer paso de depuración visual: `Cmd+Shift+R`.

---

## 15. Pendiente / a validar

- **Copy y pictogramas:** Ale (copy) · Khenpo (doctrina). Provisional.
- **Buscador:** sustituir `DATOS` de muestra por el JSON real de círculos (con Alberto: Nivel A vs. B).
- **Vídeos Vimeo:** confirmar privacidad/embed de cada uno; añadir `?h=` si aplica.
- **Entradilla en cursiva** de «Una invitación personal» (`.lede` = Fraunces italic): decisión de sistema aparcada; afecta a otras landings.
- **Duplicado latente:** `paramita-tarjetas.css` conserva una copia de `.semblanza` que ya no se usa (los estilos de página mandan). Limpiar si algún día se unifica maestros con este patrón.
- **CTA `Cómo empezar un grupo`** apunta a `/sangha/nuevos/` (verificar destino real).
