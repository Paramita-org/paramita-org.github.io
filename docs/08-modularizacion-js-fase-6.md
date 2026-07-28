# 08 · Modularización JS · Fase 6

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026)

---

## Contexto

El prototipo original tenía un único bloque `<script>` inline de ~875 líneas al final de `index.html` con toda la lógica del sitio mezclada: barra sticky, hero, blog, FLIP de cursos, canvas de lotos del footer, modales, testimonios, participación, chat, y utilidades varias. Ese bloque hacía `index.html` inmanejable (unas 1380 líneas totales) y bloqueaba la reutilización — cualquier página nueva que necesitase la barra sticky tenía que copiar-pegar código o depender de una copia del index entero.

En Fase 6 se extrajo todo a módulos organizados por nivel de reutilización.

## Decisión

**El JavaScript se organiza en tres carpetas por nivel de dependencia con el DOM: `primitivos/` (utilidades puras), `componentes/` (lógica de piezas reutilizables), `paginas/` (lógica específica de una página). Los scripts se cargan con `defer` de más primitivo a más específico.**

### Estructura final

```
js/
├── primitivos/                      utilidades puras (sin DOM ni negocio)
│   ├── paramita-gsap-refresh.js     refresh de GSAP en cambios de layout
│   └── paramita-reveal.js           utilidad de reveal on scroll
│
├── componentes/                     lógica de piezas reutilizables
│   ├── paramita-bar.js              barra sticky
│   ├── paramita-blog-cascada.js     cascada de posts
│   ├── paramita-chat.js             widget de chat
│   ├── paramita-cta-zoom.js         efecto zoom en CTAs
│   ├── paramita-cursos-flip.js      FLIP en tarjetas de curso
│   ├── paramita-fluido.js           utilidad de escalado fluido
│   ├── paramita-footer-lotos.js     canvas de lotos del footer
│   ├── paramita-frase-zoom.js       zoom animado de frases hero
│   ├── paramita-hero.js             comportamiento del hero
│   ├── paramita-modal.js            modales genéricos
│   ├── paramita-participacion.js    bloque participación
│   ├── paramita-testimonios.js      carrusel de testimonios
│   └── paramita-trazo-divisor.js    divisor decorativo
│
└── paginas/                         lógica específica de una página
    └── paramita-formacion.js        frase-intención, filtros, mapa, puertas
```

**13 archivos modulares** (10 componentes + 2 primitivos + 1 página). Antes: 1 bloque inline de ~875 líneas. `index.html` pasó de ~1380 a ~542 líneas.

### Reglas de decisión

| Situación | Carpeta |
|---|---|
| Utilidad pura sin DOM | `js/primitivos/` |
| Pieza reutilizable por dos o más páginas | `js/componentes/` |
| Lógica que solo tiene sentido en una página concreta | `js/paginas/` |

### Convenciones

- **Todos los archivos empiezan por `paramita-`** — coherencia con el CSS.
- **Cada archivo es una IIFE** `(function() { 'use strict'; … })();` para aislar scope y no contaminar `window`.
- **Salida temprana si no encuentra su DOM.** Un componente carga en todas las páginas, pero si su elemento raíz no existe, retorna en el primer `if (!elemento) return;`. Sin errores, sin coste.
- **Carga con `defer`** siempre. El orden entre scripts casi nunca importa por eso, pero por convención se cargan primitivos → componentes → páginas.
- **La carpeta que antes se llamaba `comportamientos/` se renombró a `componentes/`** para coherencia con la nomenclatura de CSS. Una única fuente de verdad para el nombre.

## Alternativas descartadas

**Un único bundle minificado (`paramita.min.js`) generado por un build step.** Descartado. Introduce un paso de build que Jana no necesita hoy — el sitio se sirve tal cual desde GitHub. Si en el futuro hace falta minificación, se añade sin cambiar la arquitectura fuente.

**Módulos ES nativos (`import/export`).** Deferido. Podría hacerse (todos los navegadores soportados los aceptan) pero exige que cada archivo declare sus dependencias y complica el hosting file-based. Con `defer` + IIFE se consigue el 90% del beneficio con 0% del coste. Se puede migrar en fase futura sin ruptura.

**Separar por *feature* (todo lo del hero en una carpeta, todo lo del footer en otra) en lugar de por *nivel de reutilización*.** Descartado. La pregunta operativa al crear código nuevo no es "¿de qué feature es esto?" (obvio por el nombre del componente) sino "¿lo va a usar otra página?". Organizar por nivel de reutilización responde a la pregunta correcta.

**Mantener parte del script inline en `index.html`** para el código "muy específico" de la home. Descartado. Producía una excepción a la regla ("todo modular, excepto…") que erosionaba la arquitectura. Si el código de la home es único, va en `js/paginas/paramita-home.js`.

## Implicaciones

- **`index.html` es hoy hojeable.** ~542 líneas de HTML semántico + `<link>` y `<script>` al final. Ningún bloque inline.
- **Crear una página nueva es mecánico.** Se copia la estructura, se enlazan los CSS/JS necesarios, y se añade opcionalmente un `js/paginas/paramita-<nombre>.js` si hace falta lógica específica.
- **Los componentes cargan en todas las páginas** — los que no encuentran su DOM salen sin coste. Esto simplifica el HTML de cada página (mismo bloque de scripts) a cambio de una carga marginal en runtime.
- **Los primitivos no dependen de nada.** `paramita-gsap-refresh.js` y `paramita-reveal.js` son helpers pequeños; se pueden reescribir sin tocar otro archivo.
- **El único archivo en `paginas/` hoy es `paramita-formacion.js`.** Cuando se implementen otras páginas específicas (blog, meditación, home logged-in), tendrán su archivo hermano.
- **La lógica del chat está aislada.** `paramita-chat.js` puede reemplazarse por otra implementación sin tocar el resto del sistema. Igual con el canvas de lotos, los testimonios, etc.

## Referencias en el código

- `paramita-arquitectura.docx` · secciones 5.1, 5.2, 5.3
- `paramita-estructura.docx` · reglas rápidas
- Cada archivo `paramita-*.js` en el proyecto
