# 11 · Método de trabajo

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026)

---

## Contexto

Un sistema de diseño escala tanto por sus decisiones como por el proceso con el que se toman. En Paramita, el método ha ido cristalizando durante el proyecto: qué se acuerda antes de trabajar, cómo se propone algo nuevo, cómo se validan los cambios, y qué señales indican que el proceso está funcionando o no.

## Decisión

**El proyecto sigue un método específico, no un flujo genérico de agencia. Sus principios son evidencia sobre opinión, iteración visual, secuenciación por fases, y pushback esperado.**

---

### 1 · Validación visual iterativa

Cada cambio significativo se revisa en el browser antes de aprobarse. Jana comparte screenshots (a menudo con overlays de DevTools) y decide una cosa a la vez. Se resuelve una decisión, y solo entonces se pasa a la siguiente.

**Implicación operativa.** Las propuestas que abarcan diez cambios de golpe generan fricción — hay que revisar diez cosas simultáneamente. Las propuestas de un solo cambio (o dos relacionados) fluyen. Cuando hay que proponer varios, se separan explícitamente.

---

### 2 · Archivos completos, no diffs

**Se entregan archivos completos, listos para pegar, no diffs ni snippets.** Un CSS parcial obliga a Jana a mentalmente componer dónde va cada línea; un archivo completo se copia y sustituye.

Excepción: cuando el archivo es muy largo y el cambio es puntual, un str_replace acotado es aceptable — pero siempre con contexto suficiente para localizarlo sin ambigüedad.

---

### 3 · Evidencia sobre opinión

Las recomendaciones se fundamentan en:
- Código existente que las respalda (o las contradice).
- Investigación referenciable (documentación oficial, patrones de sistemas de diseño publicados).
- Comportamiento verificable en el browser.

**No se aceptan opiniones sin base.** Un "yo creo que quedaría mejor con más padding" no es una recomendación — es una preferencia. Se convierte en recomendación cuando se justifica con la escala tipográfica del sistema, con lectura en móvil, o con un patrón documentado.

---

### 4 · Pushback esperado, no cortesía

Jana instruyó explícitamente: **no aceptar propuestas por complacencia si contradicen la identidad de Paramita.** Cuando algo entra en conflicto con el hilo conceptual, se explica el conflicto antes de ejecutar.

**Casos típicos.** Solicitudes que reproducen patrones SaaS (badges, streaks, banners de urgencia), sugerencias que rompen la regla 70/30 del degradado, propuestas de dark mode como dirección primaria. En todos, la respuesta correcta es exponer el conflicto y ofrecer alternativa.

Esto no es discutir por discutir. Es proteger la coherencia del sistema — que es más frágil que su código.

---

### 5 · Secuenciación por fases nombradas

El proyecto avanza por fases numeradas: Fase 0 (fundamentos conceptuales), Fase 0.1 (reformulación de la regla de motion), Fase 1a (color), Fase 1b (tipografía), Fase 2 (motion), Fase 3 (componentes por riesgo), Fase 4 (afinado visual), Fase 5.x (mission, cierre, revisiones), Fase 6 (modularización JS + nomenclatura CTA).

Cada decisión importante lleva la fase en el comentario del código. Esto permite entender **por qué** se tomó una decisión y qué la corrige si hay que revisarla.

**Ejemplo real en `paramita-tipografia.css`:**
> "REVISIÓN Fase 4 · legibilidad afinada: Peso subido de contemplativo (300) a presencia (400)."

Sin la etiqueta de fase, la revisión sería opaca en seis meses.

---

### 6 · Nombrar la salida de cada fase

Cada fase produce una entrega concreta y nombrable. Fase 1a → `paramita-color.css` con tokens OKLCH y contraste WCAG verificado. Fase 6 → 13 archivos JS modulares e `index.html` reducido de 1380 a 542 líneas.

Sin salida concreta, la fase se difumina y no se sabe cuándo ha terminado.

---

### 7 · Etiquetar versiones y variantes

Trabajos importantes se identifican con versión (v1.4, v2.1) o variante (Variante A/B/C, cuando se comparan opciones). Esto permite conversaciones del tipo *"volvamos a la Variante B pero con la sombra de v1.4"* sin ambigüedad.

---

### 8 · No saltar pasos en la cadena de dependencias

**Contenido → arquitectura → catálogo → plantilla individual → home logged-in.** Cada paso alimenta al siguiente. Saltar el modelo de contenido para empezar por la home logged-in produce una home que hay que rehacer cuando el modelo llegue.

Este aprendizaje viene del proyecto real: se propuso finalizar la home logged-in antes de resolver el modelo LMS, y la propuesta se pausó hasta cerrar las dependencias. Fue una decisión correcta.

---

### 9 · Distribución de responsabilidades

- **Khenpo** — autoridad de aprobación en identidad y decisiones conceptuales. Escucha primero cuando algo toca la voz o la representación de la fundación.
- **Ale** — decisiones estratégicas y de contenido.
- **Alberto** — lidera LMS y backend en `cursos.paramita.org`.
- **Gerard** — arquitectura y sistemas dinámicos de home.
- **Jana** — dirección de diseño y frontend, gestión del código, interlocución con Claude, síntesis y decisión final en frontend.

No se toma una decisión de identidad sin Khenpo. No se toma una decisión de LMS sin Alberto. Saltar interlocutores produce decisiones que hay que rehacer.

---

## Alternativas descartadas

**Flujo de agencia estándar (brief → propuesta única → revisión → cierre).** Descartado. La riqueza del sistema viene de las iteraciones. Un flujo de una sola propuesta habría producido un sitio correcto pero genérico.

**Documentación exhaustiva antes de empezar cada fase.** Descartado como default. Documentar todo antes de empezar cuesta tiempo y muchas cosas cambian durante la implementación. Se documenta *lo aprendido* al cerrar cada fase, no *lo planeado* al abrirla.

**Trabajar sobre Figma y luego traducir a código.** Descartado. La riqueza expresiva del sistema (Fraunces variable, motion identitario, filtros con FLIP) vive en el código, no en Figma. Diseñar en Figma primero produciría un sistema más pobre. El código es el diseño.

---

## Señales de que el método está funcionando

- Las decisiones envejecen bien — se releen seis meses después y siguen teniendo sentido.
- El código es hojeable — un archivo se abre y se entiende sin depender de una carpeta de documentación externa.
- Las revisiones producen ajustes pequeños, no reescrituras.
- Las nuevas páginas se construyen rápido, porque el sistema tiene sitio para ellas.

## Señales de que hay que corregir

- Aparecen valores hex inventados fuera de la paleta → el sistema de color se está saltando.
- Se repite código entre archivos → falta un componente.
- Una decisión se explica citando la conversación en lugar de citando el código o el sistema → falta un comentario en el código.
- Se propone algo dos veces (ya se propuso, ya se implementó, ya se descartó) → falta leer antes de proponer.
