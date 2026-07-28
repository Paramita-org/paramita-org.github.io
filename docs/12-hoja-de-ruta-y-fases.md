# 12 · Hoja de ruta y fases

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026)

---

## Contexto

El proyecto ha avanzado por fases numeradas que quedan documentadas en los comentarios del código. Este documento consolida qué se hizo en cada una, qué se decidió, y qué queda por delante.

Las fases no son estrictamente cronológicas — algunas se solapan, otras se revisan (Fase 0.1 reformuló una regla de Fase 0). El número indica intención más que orden.

---

## Fases completadas

### Fase 0 · Fundamentos conceptuales

**Qué se hizo.** Se estableció el hilo conceptual del sistema: *"el cruce como acto"*. Se validó con Khenpo la paleta base (azul-oscuro + azul-sutil + dorado), la pareja tipográfica (Fraunces × Hanken Grotesk), y la regla 70/30 del degradado de marca (nunca dorado dominante).

**Decisión clave.** El sistema tiene una identidad antes que un componente. Sin identidad clara, cada componente es una decisión aislada.

**Entrega.** Documento fundacional + primeras decisiones cromáticas y tipográficas.

---

### Fase 0.1 · Reformulación de la regla de motion

**Qué se hizo.** Se reformuló la regla "el sistema no se mueve" (Fase 0) hacia "el sistema respira". Se introdujo la familia identitaria de motion — un flujo ambiental lento que atraviesa gestos concretos del sitio — con reversibilidad global (`--identidad-estado`).

**Decisión clave.** El movimiento identitario es opcional a nivel de sistema, no de componente. Un solo cambio (`activo` → `reposo`) detiene todo.

**Entrega.** `paramita-movimiento.css` con las cuatro capas + documento `Paramita_Fase_0_1_Reformulacion.html`.

---

### Fase 1a · Migración de color a OKLCH

**Qué se hizo.** Se migró toda la paleta de hex a OKLCH (con fallback hex). Se retiró el cyan `#00C7E5` por fallo de contraste WCAG y se sustituyó por `--azul-sutil`. Se estableció la regla de "no colores inventados": toda variación deriva de tokens vía `color-mix(in oklch, …)`.

**Decisión clave.** Los formatos importan. Migrar a OKLCH desbloquea contraste correcto, interpolaciones coherentes, y un sistema que no se apoya en el ojo.

**Entrega.** `paramita-color.css` con tokens OKLCH.

---

### Fase 1b · Tipografía y ejes variables

**Qué se hizo.** Se mapearon los ejes de Fraunces (`wght`, `opsz`, `SOFT`, `WONK`) a tokens semánticos con intención (`--wght-contemplativo`, `--opsz-monumental`, etc.). Se implementó el eje SOFT scroll-driven como movimiento de firma del sitio. Se estableció la regla de la italic dorada.

**Decisión clave.** Nombrar por intención, no por número. `wght-contemplativo` explica el porqué; `wght-300` no.

**Entrega.** `paramita-tipografia.css` con familias, escalas, y capa `@layer motion` del eje SOFT.

---

### Fase 2 · Sistema de motion en cuatro capas

**Qué se hizo.** Se reorganizó todo el motion en primitivos + semánticos + familia identitaria + contrato de quietud. Se creó `paramita-movimiento.css`. Se establecieron ritmos proporcionales para los elementos identitarios (logo 1×, botón amigo 0.7×, footer 1.3×, banda 0.9×).

**Decisión clave.** El motion es un sistema, no un adjetivo por componente.

**Entrega.** `paramita-movimiento.css` completo. Aliases retrocompatibles para el prototipo antiguo (marcados como legacy).

---

### Fase 3 · Componentes por orden de riesgo

**Qué se hizo.** Se priorizaron los componentes según el riesgo de improvisación divergente:
1. Sistema de formularios (crítico para conversión) — pendiente aún.
2. Modal con `<dialog>` nativo y focus trap — parcialmente implementado.
3. Sistema de cards con base compartida — pendiente.
4. Patrón de scroll-reveal reutilizable — implementado (`js/primitivos/paramita-reveal.js`).
5. GDPR / cookies / selector de idioma — pendiente.

**Decisión clave.** No todos los componentes tienen el mismo riesgo. El carrusel de testimonios es visible pero de bajo riesgo; los formularios son invisibles pero críticos.

**Entrega.** Iterativa, en curso. Varios componentes cerrados, formularios y cookies pendientes.

---

### Fase 4 · Afinado visual (legibilidad, sombras, contraste)

**Qué se hizo.** Revisiones puntuales de legibilidad y presencia visual:
- `.lede` italic subida de peso 300 a 400 por pérdida de contraste en móvil.
- Sombras del vídeo `mission` migradas a wrapper + `filter: drop-shadow` para respetar `clip-path`.
- Velo cálido del FLIP corregido: `#DBE8F4` (azul inventado) → `color-mix` sobre `--lino`.

**Decisión clave.** Los detalles se revisan en dispositivo real, no en el mockup.

**Entrega.** Ajustes finos en múltiples archivos (`paramita-tipografia.css`, `paramita-extras.css`).

---

### Fase 5.x · Bloques finales del prototipo

**Qué se hizo.** Cierre del prototipo `emi-1-index.html`: bloque mission con vídeo cinemático, bloque cierre editorial, revisiones de metodología, bloque incluye, inscripción, testimonios.

**Decisión clave.** El prototipo cerrado sirve como referencia canónica de cómo se aplican los tokens en una página real.

**Entrega.** `emi-1-index.html` como prototipo de referencia.

---

### Fase 6 · Modularización JS + nomenclatura CTA

**Qué se hizo.**
- Se extrajeron ~875 líneas de JS inline en 13 archivos modulares organizados en `primitivos/` + `componentes/` + `paginas/`. `index.html` pasó de ~1380 a ~542 líneas.
- Se unificó la nomenclatura de botones: `.btn-amigo` → `.btn-primario`, `.btn-umbral` → `.btn-secundario`. Terciario editorial sigue como `.t-link` / `.t-link--primario`.
- Se documentó la arquitectura de carpetas en `paramita-arquitectura.docx` y `paramita-estructura.docx`.

**Decisión clave.** Nombres semánticos sobre metafóricos. Escalar el sistema exige que los nombres se autoexplican.

**Entrega.** 13 archivos JS + arquitectura de carpetas documentada + `paramita-cta.css` renombrado.

---

## En el horizonte inmediato

Trabajos en curso o siguientes en la cola:

1. **Finalizar y testear `/formacion/` en browser.** Toda la lógica está en código; falta el paso de validación con Jana.
2. **Resolver decisiones LMS con Khenpo / Ale / Alberto:**
   - Modelo de contenido (tipos de curso, estructura, modelos de acceso).
   - Arquitectura de dominio (`paramita.org` vs. `cursos.paramita.org`).
3. **Diseñar plantilla de página individual de curso.** Depende de las decisiones anteriores.
4. **Finalizar home logged-in.** Depende de la plantilla individual (ver documento 09).

---

## Deferido a fases futuras

Trabajos scoped pero no iniciados:

- **Navbar logged-in** — variante para practicantes autenticados con acceso directo a cursos y actividades. Se implementa cuando la home logged-in esté cerrada.
- **v2 del carrusel "próximos cursos"** — versión con scroll horizontal auto-avanzado. La v1 (scroll manual) queda estable.
- **Subsistema YouTube derivado de la identidad Paramita** — plantillas de miniaturas, cabeceras de canal, elementos gráficos coherentes con la paleta dark (azul-oscuro dominante + dorado como acento + Fraunces solo para títulos grandes).
- **Dark mode toggleable por el usuario para lectura larga** — se estudia como opción de accesibilidad en el bloque de blog. Nunca como dirección primaria de identidad.
- **Sistema de formularios completo** — pendiente desde Fase 3, sube en prioridad cuando arranque el flujo de inscripción.
- **Modal con `<dialog>` nativo + focus trap** — mejora de accesibilidad pendiente.
- **Cards con base compartida** — refactor de las tres cards actuales (flip, blog, testimonial) hacia una `card-base` común.
- **GDPR/cookies + selector de idioma** — requisito legal UE, entra cuando el sitio se acerque a producción.
- **Migración de aliases legacy de motion** (`--t-fast`, `--t-med`, `--t-slow`) — se hace componente a componente cuando se toquen.
- **Migración de HTML legacy con `.btn-amigo`** — se hace página a página cuando se toquen. `emi-1-index.html` es el mayor pendiente.

---

## Fases hipotéticas (no confirmadas)

- **Fase 7 · sistema de formularios completo.** Requisito para inscripción funcional.
- **Fase 8 · plantilla individual de curso + home logged-in.** Requiere decisiones LMS previas.
- **Fase 9 · producción (SEO, sitemap, GDPR, analítica, deploy final).** Cierre del sitio v1.

Estas fases no están comprometidas — su orden y contenido dependen de las decisiones que Khenpo, Ale y Alberto tomen sobre LMS y modelo de contenido.

---

## Referencias

- Cada archivo del código lleva la fase de su decisión en los comentarios.
- `Paramita_Design_System_Audit_dc.html` · auditoría inicial (pre-Fase 0).
- `Paramita_Roadmap_Design_System.html` · roadmap completo con detalles de cada fase.
- `paramita-arquitectura.docx` / `paramita-estructura.docx` · documentación viva de la arquitectura Fase 6.
