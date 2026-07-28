# 07 · /formacion/ · landing de cursos

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026)

---

## Contexto

`/formacion/` es la página con más presión conceptual del sitio: tiene que ordenar toda la oferta pedagógica de la fundación (varios niveles, formatos, modalidades y aportaciones) sin convertirse en un catálogo tipo e-commerce. Un "grid con filtros" al uso rompía la identidad; una editorial estática no permitía navegar. La solución es una página con siete secciones que combinan metáfora contemplativa y funcionalidad de catálogo.

## Decisión

**La página se organiza como un sendero — cinco niveles pedagógicos que el practicante recorre. Siete secciones estructuran la navegación entre metáfora (identidad) y catálogo (utilidad).**

### Los cinco niveles pedagógicos

| Nivel | Rol |
|---|---|
| **I** | Introducción · primer contacto con la práctica |
| **II** | Fundamentos · base sostenida |
| **III** | Profundización · práctica regular |
| **IV** | Estudio avanzado · texto y análisis |
| **V** | Práctica integrada · retiro, transmisión, comunidad |

Los rangos por puerta del hero: **I** (solo Nivel I) · **II·III** (fundamentos y profundización) · **IV·V** (avanzado e integrado).

### Las siete secciones

1. **Hero con tres puertas de entrada** — cabecera editorial + tres cards (I / II·III / IV·V) sobre un camino luminoso con spotlight dorado que recorre en loop de 20s. En hover de una card, el tramo del camino desde el inicio hasta la card se ilumina y el spotlight se detiene en esa intersección.
2. **Mapa del sendero (cinco nodos)** — visualización de los cinco niveles en orden. Click en un nodo pre-filtra el catálogo por ese nivel y hace scroll suave hasta el catálogo.
3. **Frase-intención (filtro en lenguaje natural)** — una frase editable del tipo *"Estoy buscando un curso de nivel II, corto, online en vivo y gratuito."* Cada faceta es un slot con popover Fraunces italic dorado.
4. **Cuadrícula de cursos** — grid con FLIP animation al filtrar. Tratamiento diferencial entre gratuitos y de pago.
5. **Próximos cursos (carrusel de fechas)** — sección temporal, no jerárquica. Muestra qué empieza pronto independientemente del nivel.
6. **Cómo estudiamos (metodología)** — bloque editorial sobre el enfoque pedagógico. Sin filtros, sin catálogo — descanso conceptual.
7. **Cierre / CTA** — fondo azul degradado, `h2` con italic en `--lino` y sombra difusa, CTAs centrados.

### Decisiones UX finalizadas

- **Filtro en lenguaje natural con slots `<span role="button">`.** Cada faceta se presenta como parte de una frase legible en lugar de dropdowns aislados. Ver documento 10 (aprendizajes técnicos) — no se usa `<button>` porque anidar botones es HTML inválido.
- **Popovers en Fraunces italic dorado.** Coherentes con la regla del sistema (`h1 em, h2 em, h3 em → dorado`). El popover se comporta como una "elección editorial", no como un formulario.
- **FLIP animation al filtrar.** Los cursos que dejan de encajar se desvanecen con blur y los que quedan se reorganizan con la API Flip de GSAP. Después del reencaje, los seleccionados reciben una "luz" (aura sutil dorada) para confirmar el filtro visualmente.
- **Tratamiento diferencial gratuito vs. pago.** Los cursos gratuitos llevan una marca sutil de disponibilidad; los de pago llevan el tratamiento estándar. Ninguno grita — la diferencia se lee, no se anuncia.
- **Reset con botón "Limpiar filtros"** que solo aparece cuando hay al menos un filtro activo (`is-visible`).
- **Mapa y puertas del hero pre-filtran + hacen scroll.** Al hacer click en un nodo del mapa o una puerta del hero, se aplica el filtro correspondiente al catálogo y se hace `scrollIntoView({ behavior: 'smooth' })` hasta él.

## Alternativas descartadas

**Un grid con dropdowns clásicos (nivel, modalidad, tipo, precio) en la cabecera.** Descartado. Convierte la página en un catálogo de e-commerce y rompe la identidad. El filtro en lenguaje natural mantiene el tono editorial.

**Cinco secciones separadas, una por nivel.** Descartado. Obliga al usuario a saber qué nivel quiere antes de navegar. El mapa + las puertas del hero permiten aproximarse por rango, no por nivel exacto.

**Sin sección de "Próximos cursos".** Descartado. La lógica temporal (qué empieza pronto) es un vector de decisión legítimo — muchas personas se inscriben porque "el próximo empieza en dos semanas", no porque un nivel les resuene. Requiere su propia sección.

**Cursos gratuitos destacados con badge de color.** Descartado. El badge convierte la gratuidad en un reclamo comercial. El tratamiento diferencial es sutil.

**Carrusel horizontal de próximos cursos con auto-scroll.** Diferido. La v2 con auto-scroll está scoped como fase futura; la v1 es un scroll horizontal controlado por el usuario.

**Popover de filtro con dropdown nativo `<select>`.** Descartado. Rompe la tipografía y el color del sistema — el `<select>` nativo hereda de la UA, no del CSS.

## Implicaciones

- **La cuadrícula tiene tres estados visuales**: reposo, en tránsito (blur + reordenación FLIP), y filtrada (con luz).
- **El JS de la página (`js/paginas/paramita-formacion.js`)** contiene toda esta lógica: popovers, filtros, mapa, puertas. No es un componente reutilizable — es lógica de página.
- **Reset completo al hacer click en una puerta.** Las puertas del hero son un "empezar de cero desde un rango" — cualquier filtro previo se limpia.
- **Reset completo al hacer click en un nodo del mapa.** Igual que las puertas, pero para un nivel exacto.
- **`prefers-reduced-motion`** desactiva las animaciones del spotlight del camino, del punto activo del nodo, y del `.curso__pic`.
- **Sin login requerido para navegar el catálogo.** La página `/formacion/` es pública. La inscripción abre a un flujo separado (posiblemente en `cursos.paramita.org`).
- **Pendiente:** finalizar testing en browser, resolver decisiones de arquitectura LMS (documento 09), diseñar la plantilla de página individual de curso.

## Referencias en el código

- `css/paginas/paramita-formacion.css` · estilos (hero, mapa, intención, catálogo, cierre)
- `css/componentes/paramita-antesala.css` · bloque prólogo si aparece en home
- `js/paginas/paramita-formacion.js` · lógica completa
- `paramita-extras.css` · `.flip-celda` (velo veil-top/veil-bot, patrón de expansión)
