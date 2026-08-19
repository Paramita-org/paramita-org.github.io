# Grupos · demo real — integración

Archivos y dónde van (repo `janams-paramita.github.io`):

    unete/grupos/grupos.html                         → spoke bajo unete/ (dos niveles)
    css/paginas/paramita-grupos.css            → CSS de página (@layer paginas)
    js/paginas/paramita-grupos.js              → JS de página (buscador, cine, esporas, río)
    partials/pictogramas/grupos-claridad.svg   → pictograma
    partials/pictogramas/grupos-refugio.svg    → pictograma
    partials/pictogramas/grupos-constancia.svg → pictograma
    partials/pictogramas/grupos-comunidad.svg  → pictograma
    img/hero-grupos.jpg                         → foto de fondo del hero (la pones tú)
    img/bienvenida-paramita.jpg                 → captura de muestra del vídeo cinematográfico

## Imágenes
- Hero: `<img class="hero__bg-img" src="/img/hero-grupos.jpg">` (ruta absoluta desde raíz).
  Si tus fotos viven en `/assets/img/`, cambia esa ruta y la `url()` del `.cinevideo__media`
  en `paramita-grupos.css` (ahora `/img/bienvenida-paramita.jpg`).

## Orden de despliegue (imprescindible por los pictogramas)
1. Copia primero los 4 SVG a `partials/pictogramas/` (si falta uno, `sync.py` aborta la página entera).
2. Copia HTML + CSS + JS.
3. `git pull`
4. `python3 partials/sync.py unete/grupos/grupos.html --tema --aria-current="Únete"`
   (o en lote: `python3 partials/sync.py --all`)
   Esto inyecta navbar (marcador `<!-- sync: navbar=publico current="Únete" prefooter -->`),
   prefooter, footer y re-rellena los `data-pico` desde los SVG.
5. Sirve desde la raíz con Live Server (nunca `file://`).

## Componentes del sistema que reutiliza (ya enlazados en el `<head>`)
- Revelados: `data-reveal` → `.is-in` (paramita-reveal.js) · bidireccional.
- Testimonios: `.voces/.voz/.video-facade` (paramita-testimonios.css/js). Rellena los `data-yt` reales.
- FAQ: `.faq/.faq__item/.faq__q/.faq__panel` (paramita-faq.css/js).
- CTA: `.btn-primario` / `.btn-secundario` / `.t-link` (doc 05).
- Hero, pictogramas, tarjetas, tema: sus CSS del sistema.

## Efectos propios (paramita-grupos.js)
- Buscador «encuentra el tuyo»: índice filtrable estático (Nivel A) + Grid FLIP (ref. 09).
  Estado inicial vacío (aviso); resultados al elegir país/tipo o escribir. Datos DE MUESTRA:
  sustituir el array `DATOS` por un JSON real de los ~164 círculos.
- Vídeo cinematográfico Khenpo: zoom elástico (muelle) + parallax (réplica vanilla de
  «Bienvenidos a Paramita»; allí GSAP `elastic.out`).
- Mapa de presencia: esporas repartidas que derivan y brillan (canvas).
- Pictogramas que se dibujan al revelarse; divisor «río» dibujado con scroll.
- Entradas especiales: `.entra-zoom` (cifra) y `.entra-cita` (cita), enganchadas a `.is-in`.

## Pendiente / a validar
- Copy y pictogramas: Ale (copy) · Khenpo (doctrina). Todo provisional.
- Newsletter: bloque unificado aparte (se insertará cuando Jana lo cierre).
- Buscador: decidir Nivel A (estático, recomendado) vs B (geolocalización) con Alberto.
- Chips: 19 en total. Alternativa más limpia si crece: `<select>` de país + 3 chips de modo.
- El acento de pictograma se colorea por CSS (`.acc { stroke: var(--dorado) }`), no inline.
