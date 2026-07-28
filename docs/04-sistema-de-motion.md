# 04 · Sistema de motion

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026)

---

## Contexto

El prototipo original tenía 15 duraciones únicas dispersas por el código, sin arquitectura ni interruptor global. Cada componente elegía su propio timing y su propio easing, con el resultado predecible: incoherencia, movimientos que "chocaban" entre sí, y ninguna forma de detener el sistema si el motion resultaba excesivo. En Fase 2 se rediseñó como cuatro capas; en Fase 0.1 se añadió la familia identitaria (respiración del sistema) y su reversibilidad global.

## Decisión

**El motion se organiza en cuatro capas: primitivos (valores crudos), semánticos (tokens con intención), familia identitaria (respiración ambiental del sistema, Fase 0.1), y contrato de quietud (reglas de uso). El sistema respira por defecto y puede detenerse en todo el sitio con un solo cambio.**

### Principio rector
> En Paramita el sistema respira. Un flujo ambiental lento, identitario, atraviesa gestos concretos del sitio como el agua atraviesa el paisaje. Todo lo demás es movimiento convocado por el usuario (scroll, hover, focus, click).

### Familias de motion

| Familia | Quién la invoca | Ejemplos |
|---|---|---|
| **Identitaria** (ambiental) | El sistema, en bucle | Respiración del logo, flujo del degradado de marca, canvas de lotos del footer |
| **Convocada por el usuario** | Interacción directa | Hover, focus, click, apertura de menú, cambio de sección |
| **Scroll-driven** | Movimiento en scroll | Eje SOFT de Fraunces, expansión cinematográfica del vídeo mission, reveal on scroll |

### El interruptor `--identidad-estado`

```css
:root {
  --identidad-estado: activo;  /* activo | reposo */
}
```

- **`activo`** — el degradado identitario fluye en los elementos identitarios.
- **`reposo`** — se congela el flujo. Los colores estáticos se conservan.

Cuando el sistema está en reposo, la duración del flujo se anula (`--dur-identidad-flujo: 0s`) y el elemento conserva sus colores sin animarse.

### Ritmos proporcionales

La respiración base es `--dur-respiro: 25s`. Los elementos identitarios secundarios respiran con múltiplos:

- Logo principal (barra) · **1.0×** → 25s · canónico
- Banda de cursos · **0.9×** → 22.5s
- Botón amigo · **0.7×** → 17.5s · más ágil, es un botón
- Logo del footer · **1.3×** → 32.5s · más lento, es descanso

Cambiar `--dur-respiro` reajusta toda la familia manteniendo las relaciones.

### El principio de hover
**Hover intensifica lo que ya vive.** El primario ya respira → en hover respira más rápido. El terciario ya tiene un trazo → en hover el trazo se completa. El secundario ancla en reposo → en hover se activa. Hover no inventa movimiento; acelera o completa el que ya estaba.

Ejemplo concreto en `emi-1-index.html`:
```css
.bar:hover .btn-amigo::before { animation-duration: 3.4s; }
```
El botón siempre respira a 8s; al pasar el ratón por la barra, todos los botones amigos aceleran a 3.4s.

## Alternativas descartadas

**Un único easing global (`ease-in-out` para todo).** Descartado. El sistema tiene tres easings diferenciados por intención: `--ease-llegada` (elementos que aparecen), `--ease-salida` (elementos que se van), `--ease-ambiental` (bucles identitarios) y `--ease-umbral` (transiciones cinematográficas del cruce).

**Duraciones libres por componente.** Descartado. Los seis peldaños (`micro`, `rapido`, `estandar`, `deliberado`, `cinematografico`, `respiro`) absorben las 15 duraciones del prototipo. Un componente que declara `transition: 0.4s ease` sin token está fuera del sistema.

**Motion sincronizado entre elementos identitarios.** Rechazado. Ver a todos los elementos respirando al unísono resulta antinatural — como si el sitio fuera un solo objeto. Los ritmos proporcionales garantizan que respiren juntos pero desfasados.

**Duraciones muy cortas para la respiración (los 11s del prototipo).** Ajustado a 25s como compromiso: los 11s originales eran demasiado evidentes, los 40s teóricos de Fase 0.1 eran imperceptibles. 25s se calibra visualmente y probablemente termine ajustándose una vez enlazado el index completo.

## Implicaciones

- **`prefers-reduced-motion` lo respeta todo el sistema.** No como opt-in por componente — como capa 4 del sistema.
- **Texto en lectura no se mueve.** Regla 1 del contrato de quietud. Un párrafo puede animarse al entrar en vista, pero una vez presente permanece estático.
- **`animation-iteration-count: infinite` requiere justificación.** Solo se permite en la familia identitaria o en UX funcional documentada (por ejemplo, el scroll-hint del hero, que además el JS retira al primer scroll del usuario).
- **Los aliases retrocompatibles (`--t-fast`, `--t-med`, `--t-slow`) están marcados como legacy** y se eliminarán cuando ningún componente los use. Nuevo código no debe usarlos.
- Si Khenpo o el equipo considera que el sitio se mueve demasiado, `--identidad-estado: reposo` detiene todo sin tocar componentes. La reversibilidad es total.

## Referencias en el código

- `paramita-movimiento.css` · archivo canónico, cuatro capas + interruptor
- Documento `Paramita_Fase_0_1_Reformulacion.html` (referenciado desde el CSS)
- `paramita-tipografia.css` · capa `@layer motion` con la implementación del eje SOFT scroll-driven
