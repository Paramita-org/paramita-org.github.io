# Integración · Landing de crowdfunding «Centro de Retiros»

Paquete de archivos para la landing de la campaña, montado sobre el sistema
real (tokens OKLCH, Fraunces/Hanken autoalojadas, `@layer paginas`, pictogramas
canónicos, revelado por `data-reveal`). Copy y cifras provisionales.

## Dónde va cada archivo

| Archivo | Destino en el repo |
|---|---|
| `crowdfunding.html` | **`crowdfunding/`** (su propia carpeta; css/js con `../` como el resto de subcarpetas, assets con `/assets/`) |
| `paramita-crowdfunding.css` | `css/paginas/` |
| `paramita-crowdfunding.js` | `js/paginas/` |
| `silencio.svg` | `partials/pictogramas/` |
| `linaje.svg` | `partials/pictogramas/` |
| `expansion.svg` | `partials/pictogramas/` |
| `seguro.svg` | `partials/pictogramas/` |

Los cuatro SVG deben estar en `partials/pictogramas/` **antes** de sincronizar:
`sync.py` aborta la página entera si un `data-pico` referencia un SVG que no
existe. La página ya lleva los SVG inline verbatim, así que `sync.py` solo los
reafirma; los pictogramas del navbar/footer se reemplazan desde sus partials
como siempre.

## Imágenes que espera (créalas con estos nombres exactos)

| Uso | Ruta esperada |
|---|---|
| Hero (dos columnas, `<img>` contenido) | `/assets/img/hero-crowdfunding.jpg` |
| «Antes de guiar, se retiraron» | `/assets/img/origen-linaje.jpg` |
| «El lugar» (edificio / propiedad) | `/assets/img/imagen-muestra-crowfunding.jpg` |
| Círculo de «La comunidad que ya lo sostiene» | `/assets/img/Pema-Retoque-low.jpg` |

El hero es a **dos columnas** (texto + foto contenida a la derecha, `<img>` con
`fetchpriority="high"`, sin lazy por ser el LCP). Las otras dos son `<img loading="lazy">`
con `width`/`height` para reservar espacio y no penalizar el CLS.

## Rutas

La página vive en `crowdfunding/crowdfunding.html` (un nivel de profundidad). Los CSS y JS del sistema se enlazan con **`../`** (igual que `contribuir` y las demás páginas de subcarpeta); los assets con `/assets/…` absoluto. Debe servirse por **HTTP desde la raíz** (Live Server desde project root o GitHub Pages). `paramita-reveal.js` va en `js/primitivos/` (no en `componentes/`).

**Si al montarlo ves 404 de `paramita-tema.js`/`-menu.js` pedidos desde `/crowdfunding/js/…`**, es que el archivo servido tiene rutas *bare* (`js/…` sin barra ni `../`): reemplázalo por este y, si Live Server sigue mostrando el viejo, reinícialo (cachea).

## Enlace desde el index

El CTA del bloque 7 (crowdfunding) de `index.html` apunta a `/crowdfunding/crowdfunding.html`.

## Orden de despliegue (el de siempre)

1. SVG primero → `partials/pictogramas/silencio.svg`, `linaje.svg`, `expansion.svg`, `seguro.svg`
2. Imágenes → las **cuatro** de la tabla anterior (hero, origen-linaje, imagen-muestra-crowfunding, Pema)
3. HTML/CSS/JS → `crowdfunding/crowdfunding.html`, `css/paginas/…`, `js/paginas/…`
4. `git pull --rebase origin main`
5. `python3 partials/sync.py --all`
6. Comprobación visual (`Cmd+Shift+R`)

## Qué queda del lado de Alberto (backend)

- **Pasarela de pago**: en `paramita-crowdfunding.js`, el `submit` es una demo
  (`setTimeout` → acuse). Sustituir por la llamada real. La página debe seguir
  pareciendo la misma web (no un formulario de pasarela desnudo).
- **Barra de progreso**: hoy es dato fijo (`data-fill="67"` y la cifra en el
  hero). Conectar a la cifra real recaudada. Recomendación del estudio: no
  arrancar por debajo del ~30 % (por debajo, la prueba social resta).
- **Métodos de pago**: los chips (Tarjeta / Apple Pay / Google Pay / PayPal)
  son visuales; que reflejen los realmente activos.
- **Recurrente**: el toggle «Cada mes» cambia copy y CTA; falta el rail real de
  suscripción (dāna sostenido), separado del de donación única.

## Decisiones abiertas (una línea cada una)

- **¿Existe el match 1:1?** Si no hay patrón que iguale, elimina la celda
  `.cf-celda--marca` del bloque 04 («Cada euro, ×2»). El estudio confirma que
  1:1 basta; 2:1/3:1 no aportan.
- **Cifra real de la barra** y nº de personas que sostienen (hero, bloque 01).
- **Importes**: escalera 25/50/108/250/500 + Otro, con 50 € como «el más
  elegido». Ajusta tramos y el `data-txt` de impacto de cada botón.
- **Nombre y foto de la voz** (bloque 07): puse «Pema» como marcador.

## Notas del sistema respetadas

- FAQ con el componente del sistema (`paramita-faq.css` + `paramita-faq.js`),
  no `<details>` propios: mismo acordeón, hilo y punto dorado que el resto del sitio.
- Sin vídeo en la landing de pago (el vídeo emociona en home/«la fundación»).
- `.hero .lede` en Hanken (regla de heroes); Fraunces cursiva solo en `<em>`
  dorados de títulos y en `.cf-cita`/testimonio.
- `data-reveal` en bloques, **nunca** en el `<h1>` ni el eyebrow del hero (LCP).
- Solo tokens OKLCH + `color-mix`; sin hex, sin redefinir tokens en la página.
- `prefers-reduced-motion` respetado (revelado, barra y respiración del CTA).
- Sin cuenta atrás, contadores falsos, ranking ni gamificación.
