# Paramita · Paquete de pictogramas

Siete pictogramas nuevos (modalidad + meta de curso), hermanos de los cuatro
del bloque «¿Qué incluye?». Misma receta que ya usas: línea humanista en tinta
`antracita 58%` + **un único acento** `--dorado`.

## Contenido

```
pictogramas-paramita/
├── pictogramas/               → va a  partials/pictogramas/
│   ├── presencial.svg
│   ├── en-linea.svg
│   ├── a-tu-ritmo.svg
│   ├── acompanado.svg
│   ├── retiro.svg
│   ├── duracion.svg
│   └── idioma.svg
├── sync.py                    → va a  partials/  (sustituye tu sync.py actual)
├── paramita-pictogramas.css   → va a  css/componentes/  (+ añadir al <link>)
├── eleventy-pictogramas.js    → referencia · para el futuro 11ty
├── pictogramas.py             → DESCARTADO · no encaja con tu flujo
└── README.md                  → va a  partials/pictogramas/ (junto a los SVG)
```

Ubicación final en el repo:

```
partials/
├── sync.py
└── pictogramas/
    ├── README.md            ← este archivo, junto a lo que describe
    ├── presencial.svg
    ├── en-linea.svg
    ├── a-tu-ritmo.svg
    ├── acompanado.svg
    ├── retiro.svg
    ├── duracion.svg
    └── idioma.svg

css/componentes/paramita-pictogramas.css
docs/informe-sistema-pictogramas-paramita.html   ← el «porqué» (nº 15)
```

## La forma de incrustar (recomendada)

**SVG inline, con una sola copia en disco, inyectado por partial.** En el navegador
el icono es inline —así `currentColor` hereda la tinta de la sección y el acento
`--dorado` funciona, sin peticiones de red, sin JS, animable y accesible—; en el
código fuente hay **una sola copia**, así que cambiar un icono lo cambia en todas
las páginas.

> Descartados: **icon-font** (un color, inaccesible), **`<img src>`** y
> **`mask`/`background`** (aíslan el SVG: ni heredan la tinta ni ven `--dorado`).
> Solo *inline* y `<use>`+sprite permiten tinta + acento; inline gana con tu volumen.

### 1 · Añade el CSS

Enlaza `paramita-pictogramas.css` en la cadena de `<link>` (capa componentes).
Define el primitivo `.pico` y —lo importante— colorea el acento por CSS:

```css
.pico .acc,
.incluye__ico .acc { stroke: var(--dorado); }
```

**Por qué por CSS y no `stroke="var(--dorado)"` inline:** `var()` dentro de un
atributo de presentación es frágil entre navegadores. La clase `.acc` funciona
el 100 % de las veces y deja el markup del icono sin colores dentro.

### 2 · Inserta el icono · elige tu vía

**a) A mano (puntual):**
```html
<span class="pico" aria-hidden="true"><!-- pega aquí el contenido de duracion.svg --></span>
8 semanas
```

**b) Con tu `sync.py` extendido (vía elegida · repites en muchas páginas):**
En las páginas marcas cada pictograma con un `<span>` que lleva `data-pico`
(vacío la primera vez); `sync.py` le rellena el SVG canónico y lo **re-rellena en
cada pasada** — cambiar un `.svg` + volver a sincronizar lo actualiza en todo el sitio.
```html
<span class="metatag"><span class="pico pico--sm" data-pico="presencial" aria-hidden="true"></span> Presencial</span>
<span class="metatag"><span class="pico pico--sm" data-pico="duracion"   aria-hidden="true"></span> 8 semanas</span>
```
```bash
python3 sync.py formacion/emi-1/index.html          # navbar + footer + pictos
python3 sync.py "formacion/*/index.html" --only-pictos   # solo pictos, de golpe
```
> El `sync.py` de este paquete es tu script de siempre + la función
> `sync_pictograms()`. Sustituye el actual en `partials/`. Los SVG van en
> `partials/pictogramas/`.

**c) Con Eleventy (futuro):** cuando migres, pega el bloque de
`eleventy-pictogramas.js` en tu `.eleventy.js` y usa `{% pico "presencial" %}`.
(Nota: `pictogramas.py`, del entregable anterior, queda descartado — no encajaba
con tu flujo de HTML autónomo.)

### 3 · Regla de oro

Cada pictograma va **`aria-hidden="true"` + una etiqueta de texto** al lado.
Ninguno viaja solo (88 % de acierto con palabra frente a 34 % sin ella).

## Peso

~150–300 bytes por icono; 7–10 inline por página son unos cientos de bytes tras
gzip, **cero peticiones**. Ya están razonablemente limpios; una pasada de
[SVGO](https://github.com/svg/svgo) recorta un 20–40 % extra si quieres.

## Migración opcional de tus cuatro actuales

Para que los cuatro del bloque incluye usen el mismo mecanismo robusto, cambia en
cada uno `stroke="var(--dorado)"` por `class="acc"`. El CSS de arriba ya los cubre.
No es urgente: funcionan como están.

---

Receta: `viewBox 0 0 24 24` · `fill none` · `stroke currentColor` · `stroke-width 1.5`
· caps redondeados · un `class="acc"`. Coherente con `.incluye__ico`.
