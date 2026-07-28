# 05 · Sistema de CTAs

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026)

---

## Contexto

El sistema arrancó con nombres metafóricos para los botones: `.btn-amigo` (el CTA cálido, con degradado animado) y `.btn-umbral` (el CTA de invitación, más contenido). La metáfora era coherente con el hilo conceptual, pero al escalar el sistema hacia una arquitectura de componentes reutilizables por varias páginas, los nombres metafóricos empezaron a producir fricción: cualquier persona que se incorporase al proyecto tenía que aprender qué significaba "amigo" y qué "umbral" antes de poder usar el sistema.

En Fase 6 (jul 2026) se unificó la nomenclatura a un vocabulario jerárquico plano.

## Decisión

**El sistema de CTAs se nombra por jerarquía nominal, no por metáfora.**

| Clase actual | Rol | Nombre anterior |
|---|---|---|
| `.btn-primario` | Acción principal · degradado azul→dorado animado, sombra proyectada | `.btn-amigo` |
| `.btn-secundario` | Acción secundaria · outline sobre superficie, sin degradado | `.btn-umbral` |
| `.t-link` / `.t-link--primario` | Enlace editorial · terciario, dentro de párrafo o al pie de sección | (sin cambio) |

Los tres viven en `css/componentes/paramita-cta.css`. Sus variantes se declaran con doble guión (`.btn-secundario--claro`, etc.).

### Pairing por página

**Home:** `btn-secundario` + `btn-secundario`.
Razón: la home es un espacio contemplativo de entrada. Dos CTAs primarios competirían por atención y romperían la calma de la orilla de partida.

**Otras páginas (formación, actividades, blog):** `btn-secundario` + `btn-primario`.
Razón: fuera de la home hay siempre una acción prioritaria clara (inscribirse, contactar, empezar). El primario ancla esa acción; el secundario ofrece la alternativa contemplativa.

### Comportamiento
El `btn-primario` respira con `--dur-identidad-agil` (17.5s) — es el elemento identitario más ágil del sistema, coherente con su rol de acción. Al hacer hover sobre la barra, todos los botones primarios visibles aceleran a 3.4s (principio de hover: intensifica lo que ya vive).

## Alternativas descartadas

**Mantener `.btn-amigo` / `.btn-umbral`.** Descartado en Fase 6. Los nombres eran hermosos pero opacos. Cualquier persona nueva en el proyecto (Alberto, Gerard, o futuros colaboradores) tenía que memorizar la traducción antes de usar el sistema. Un sistema de diseño escala cuando sus nombres son autoexplicativos.

**Nombres funcionales explícitos (`.btn-inscripcion`, `.btn-contacto`).** Descartado. Ata el botón a un caso de uso concreto y multiplica las clases. Un botón "inscripción" en una página y "contacto" en otra terminan siendo el mismo botón — merecen una sola clase.

**Un solo botón con modificadores (`.btn`, `.btn--primario`).** Descartado. La convención `.btn-primario` (sin prefijo `btn` separado) es más legible en el HTML y coincide con la nomenclatura acordada en `paramita-arquitectura.docx`.

**Terciario como botón (`.btn-terciario`).** Descartado. El terciario editorial es un enlace con tratamiento tipográfico — no un botón. Nombrarlo `.t-link` refleja lo que es y evita que se le apliquen estilos de botón.

## Implicaciones

- **La memoria del proyecto está actualizada.** Cualquier referencia previa a `.btn-amigo` o `.btn-umbral` en conversaciones anteriores debe leerse como referencia a `.btn-primario` / `.btn-secundario`.
- **Archivos legacy que aún usan los nombres antiguos** (por ejemplo `emi-1-index.html`, que todavía tiene `.btn-amigo` inline en su `@layer cta`) se migran cuando se toquen, no antes. No es urgente reescribir; sí es urgente no crear código nuevo con los nombres antiguos.
- **La regla del pairing es orientativa, no absoluta.** Una landing puntual con propósito claro (por ejemplo, una donación) puede usar dos primarios si la decisión está justificada por el objetivo.
- **El primario nunca se usa solo por prominencia.** Se usa cuando hay una acción prioritaria real. Un primario decorativo, sin destino claro, es antipatrón.
- **El terciario `.t-link` es la única forma de CTA dentro de párrafo.** Ni primario ni secundario deben aparecer en medio de un texto largo — rompen el ritmo de lectura.

## Referencias en el código

- `css/componentes/paramita-cta.css` · archivo canónico (post-Fase 6)
- `paramita-arquitectura.docx` · sección 4.3 y sección de nomenclatura
- `paramita-estructura.docx` · regla 5: "Nombres semánticos: btn-primario, btn-secundario, no btn-amigo"
- `emi-1-index.html` · ejemplo de legacy no migrado aún (usa `.btn-amigo` inline)
