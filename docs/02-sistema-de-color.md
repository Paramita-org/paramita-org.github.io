# 02 · Sistema de color

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026)

---

## Contexto

El sistema heredado usaba hex (#RRGGBB), un formato de 2012 que recorta el rango cromático de las pantallas modernas y hace imposible la interpolación perceptualmente uniforme. Además convivían valores inventados a lo largo del sitio — colores puestos "a ojo" que no derivaban de ningún token. En Fase 1a se decidió migrar el sistema a **OKLCH**, el espacio de color perceptualmente uniforme adecuado para 2025–2026.

## Decisión

**Todo el color del sistema vive en `paramita-color.css` como tokens OKLCH, con fallback hex para navegadores sin soporte.** No hay hex fuera de la paleta oficial. Toda variación cromática se produce con `color-mix(in oklch, …)` a partir de los tokens existentes.

### Paleta oficial

**Superficies (gradiente cálido base)**
- `--lino` · hueso cálido, fondo global · `oklch(97% 0.008 85)`
- `--arena` · pergamino suave, secciones alternas · `oklch(94% 0.014 82)`
- `--arcilla` · tierra lavada, hovers · `oklch(90% 0.02 80)`
- `--calido-zen` · fondo hero + hover de cursos/eventos · `oklch(88% 0.03 78)`
- `--card` · blanco cálido (nunca `#FFF` puro) · `oklch(98% 0.006 85)`
- `--base-bg` · fondo del lienzo de fluido + fallback WebGL

**Tinta (texto)**
- `--antracita` · tinta cálida, cuerpo y titulares · `oklch(22% 0.02 250)`
- `--texto-suave` · texto secundario, lede, captions · `oklch(58% 0.015 250)`
- `--texto-tenue` · metadatos, eyebrows, deshabilitado · `oklch(72% 0.012 250)`

**Marca (degradado 70/30)**
- `--azul-oscuro` · anclaje visual principal
- `--azul-sutil` · sustituyó al cyan `#00C7E5` retirado en Fase 1a
- `--dorado` · acento cálido, ocupa siempre el 30% final del degradado

### La regla 70/30

**El degradado de marca se distribuye 70% familia azul → 30% dorado.** Nunca al revés. Nunca el dorado como dominante. Decidido con Khenpo en Fase 0. Se aplica en logo, botones primarios, subrayado del navlink, títulos con italic dorado, y cualquier elemento identitario.

## Alternativas descartadas

**Mantener hex.** Descartado en Fase 1a. Justificación: pierde rango cromático en pantallas modernas y produce escalas visualmente incoherentes al interpolar.

**Cyan `#00C7E5` como acento secundario.** Retirado en Fase 1a — fallaba contraste WCAG AA sobre superficies claras y competía perceptivamente con el dorado. Sustituido por `--azul-sutil`, dentro de la misma familia cromática que `--azul-oscuro`.

**Invertir la paleta clara para hacer el modo oscuro.** Rechazado explícitamente en el roadmap. Invertir la paleta clara siempre produce resultados incorrectos; un dark mode necesita su propio conjunto de tokens semánticos pensado para fondos oscuros desde el principio.

**Colores "a ojo" en componentes específicos.** Prohibido. Un caso reciente: la celda FLIP tenía un velo azul `#DBE8F4` inventado que rompía la unidad cromática cálida del sistema. Sustituido por `color-mix(in oklch, var(--lino) 92%, transparent)` — misma familia cromática, resultado coherente.

## Implicaciones

- **Toda variación es derivada.** Un hover más claro no se hace subiendo lightness a ojo; se hace con `color-mix(in oklch, var(--token) X%, transparent)`.
- **`--card` no es `#FFF`.** Se eligió deliberadamente un blanco cálido para no romper la luminosidad mediterránea con un blanco puro que se lee azulado.
- **La familia de tinta lleva matiz azul (250°).** No es neutra. Tiñe muy sutilmente el texto en dirección azulada para que no compita con el dorado y para que dialogue con la familia de marca.
- **Colores de estado (error, éxito, aviso, deshabilitado) siguen pendientes.** Marcado como deuda crítica en el roadmap; sin ellos no hay formularios accesibles.
- Al revisar código, cualquier hex fuera de la paleta o cualquier `rgba(…)` con valor arbitrario debe cuestionarse antes de fusionar.

## Referencias en el código

- `paramita-color.css` · archivo canónico
- `paramita-extras.css` · líneas del velo FLIP (ejemplo de aplicación correcta de `color-mix`)
- `Paramita_Roadmap_Design_System.html` · Fase 1a
