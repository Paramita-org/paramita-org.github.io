# 03 · Tipografía

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026)

---

## Contexto

La pareja tipográfica Fraunces × Hanken Grotesk es una de las decisiones más sólidas heredadas del sistema anterior, y no se cambió. Lo que sí faltaba en Fase 1b era convertir los ejes de la fuente variable en un vocabulario semántico — sin eso, la herramienta expresiva más potente del sistema quedaba sin usar.

## Decisión

**Fraunces (variable, serif de exhibición) para display, Hanken Grotesk (variable, grotesque humanista) para cuerpo. Los ejes de Fraunces (`wght`, `opsz`, `SOFT`, `WONK`) se mapean a tokens semánticos, y el eje `SOFT` se anima con scroll como movimiento de firma del sitio.**

### Familias
- `--display: "Fraunces", Georgia, serif;`
- `--body: "Hanken Grotesk", system-ui, sans-serif;`

### Escala semántica de pesos
Cinco peldaños nombrados por intención, no por número:
- `--wght-contemplativo: 300` · body, lede, textos largos · **default del sistema**
- `--wght-presencia: 400` · body con más peso, subtítulos ligeros
- `--wght-firmeza: 500` · labels, botones, eyebrows
- `--wght-asertivo: 600` · énfasis dentro de body, CTAs
- `--wght-declaracion: 700` · muy raro, solo declaraciones fuertes

### Escala semántica de tamaño óptico (`opsz`, solo Fraunces)
Responde al tamaño físico del texto:
- `--opsz-cuerpo: 14` · body, lede
- `--opsz-subtitulo: 28` · h4, h3 pequeños
- `--opsz-titulo: 60` · h3, h2 medios
- `--opsz-display: 96` · h2 grandes
- `--opsz-monumental: 144` · hero, títulos gigantes

### El eje SOFT — movimiento de firma
`SOFT` es el eje expresivo clave de Fraunces: 0 = formas firmes, angulosas; 100 = formas ablandadas, casi caligráficas.

**En scroll, el eje transita de 0 (orilla de partida) a 100 (otra orilla).** Es el movimiento de firma del sitio y encarna directamente la metáfora del cruce. Implementado con `scroll-timeline` (Chrome 115+, Safari 26+, Firefox 133+). Sin soporte, la tipografía se queda en SOFT 0 (que es correcto).

### Regla de la italic dorada
**Las palabras en cursiva dentro de títulos (`h1 em`, `h2 em`, `h3 em`) van en `--dorado`, no en azul.** Decidido en Fase 0. Evita conflicto perceptivo con la familia azul dominante y da a la italic una función de acento identitario, no meramente ornamental.

## Alternativas descartadas

**Cambiar la pareja tipográfica.** Descartado. La pareja funciona, tiene identidad, y Fraunces variable habilita el gesto de firma del SOFT. Sustituirla eliminaría el movimiento más característico del sitio.

**Peso `contemplativo` (300) en la `.lede` italic.** Revisado en Fase 4. Al `1.2rem` sobre fondo cálido, el peso 300 en Fraunces italic perdía contraste y competía mal con la ligereza del entorno — especialmente crítico en móvil con ancho de columna menor. **Ajustado a `presencia` (400)** manteniendo el carácter contemplativo pero recuperando legibilidad.

**Nombrar los pesos por número (`--wght-300`, `--wght-400`).** Descartado. Nombrar por intención hace que la decisión sea legible en el código: `font-weight: var(--wght-contemplativo)` comunica el porqué, `font-weight: 300` no.

**Mapear también el eje `WONK`.** Deferido. `WONK` está declarado pero no se activa en el sistema — se reserva para casos futuros donde una excentricidad tipográfica esté justificada por identidad.

## Implicaciones

- **El default del sistema es `wght-contemplativo` (300).** Cualquier peso más alto es una decisión consciente. Un titular en `700` sin razón identitaria clara está fuera del sistema.
- **Fraunces italic + dorado dentro de títulos** es un patrón repetido — todas las secciones importantes lo usan (hero, cierre, mission). Es firma visual, no adorno.
- **El SOFT anima solo hacia adelante (0 → 100 en scroll).** Al subir de vuelta la tipografía puede quedarse ablandada — es coherente con la metáfora (una vez cruzaste, cruzaste).
- **Sin soporte de `scroll-timeline`**, el sitio se ve correcto en su estado firme (SOFT 0). No hay degradación visual — solo ausencia del gesto de firma.
- Cualquier tipografía usada fuera de este sistema (por ejemplo, dentro de un embed externo) debe justificarse — la excepción no se convierte en patrón.

## Referencias en el código

- `paramita-tipografia.css` · archivo canónico
- Regla `h1 em, h2 em, h3 em` en `paramita-tipografia.css` línea ~275
- `Paramita_Roadmap_Design_System.html` · Fase 1b
