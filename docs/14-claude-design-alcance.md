# 14 · Claude Design — alcance, encaje y decisión

*Agosto 2026. Documenta la evaluación de Claude Design como posible entorno de trabajo para el proyecto, la prueba realizada y la decisión sobre qué papel se le asigna. Pensado para que cualquiera que llegue nuevo (Ale, Gerard, Khenpo, o una futura Jana) entienda por qué no migramos y en qué casos sí lo usamos.*

---

## 1. Propósito y marco

Este documento responde a una pregunta concreta: **¿debería el proyecto Paramita trasladarse a Claude Design?** La duda es legítima —la herramienta lleva el nombre "Design", se anuncia como un salto grande en 2026, y existe la tentación de "no quedarse fuera de la última tecnología"—. Pero la decisión no puede tomarse por el nombre ni por FOMO: tiene que tomarse por encaje real entre lo que la herramienta hace bien y lo que este proyecto necesita a su altura actual.

La conclusión, adelantada: **Claude Design no sustituye al flujo actual; se incorpora como herramienta puntual para una tarea acotada.** El resto de este doc justifica por qué.

Recordatorio de la doctrina que enmarca todo (doc `01` y `13-home-publica.md`, §1): *estar a la vanguardia y ser fiel a la identidad de Paramita son lo mismo*. La vanguardia no la da la herramienta más nueva; la da el output. Esto es directamente relevante para la decisión.

---

## 2. Qué es Claude Design (estado a agosto 2026)

Para quien no lo haya visto. Claude Design es un espacio de diseño de Anthropic, separado del chat, con **chat a la izquierda y un lienzo a la derecha**: describes lo que quieres, Claude lo genera en el lienzo, e iteras por chat, por comentarios sobre el propio diseño y editando directamente en el lienzo.

Datos de contexto, a fecha de agosto 2026 (producto en evolución rápida; conviene reverificar si se revisita esta decisión):

- Está en **beta**, disponible en los planes Pro, Max, Team y Enterprise.
- Su uso cuenta contra el **mismo pool compartido** que el chat y Claude Code (ya no hay una bolsa de créditos semanal aparte).
- Puede **importar un sistema de diseño** desde un repo de GitHub, archivos de diseño, subidas o el propio código, y construir con los componentes reales, contrastando su output contra ese sistema.
- Cuando un diseño está listo, se hace **handoff a Claude Code**, que continúa desde ese trabajo en vez de partir de una captura.
- **Punto clave para nosotros:** el lienzo renderiza **HTML/CSS**. No reproduce capas de runtime como WebGL/GLSL, GSAP/ScrollTrigger o los stacks de filtros SVG.

---

## 3. La prueba realizada

No es una opinión a priori: se conectó el repo y se probó.

- Se conectó `janams-paramita/janams-paramita.github.io` a un proyecto de Claude Design.
- **Verificación de lectura real:** antes de diseñar nada, se le pidió que citara líneas textuales de los archivos. Devolvió valores reales de `css/tokens/paramita-color.css` (`--lino: #F8F4EB`, `--antracita: #1D1F26`, `--dorado: #ECAC55`) y de `paramita-tipografia.css` (`--display: "Fraunces", Georgia, serif`; `--body: "Hanken Grotesk", system-ui, sans-serif`), incluyendo la ruta real con la estructura de carpetas. Conclusión parcial: **sí lee los tokens y componentes del repo**.
- **Primera propuesta de home:** sobre esa base, generó una home que se desvió del diseño ya cerrado en Fase 7 (`13-home-publica.md`): sin la capa de efectos, con la jerarquía de CTAs alterada y con reestructuración de bloques, reintroduciendo con probabilidad patrones que el proyecto había descartado a conciencia (p. ej. el carrusel de testimonios eliminado en §4.3 de ese doc).

Esa desviación no es un fallo puntual corregible con mejor prompt: es la consecuencia previsible de los dos límites que se explican abajo.

---

## 4. Decisión

**Decisión.** El proyecto Paramita **no migra a Claude Design**. Se mantiene el flujo actual (chat + código, con handoff a Claude Code para la implementación) como columna vertebral. Claude Design queda como **herramienta puntual**, reservada a los casos del §6.

**No se re-deriva en Claude Design ninguna página ya cerrada y documentada** (la home es Fase 7 cerrada). Re-generar una decisión justificada solo puede introducir deriva respecto a lo ya resuelto con criterio.

---

## 5. Justificación

**5.1 · Claude Design está optimizado para *greenfield*; el proyecto ya no está ahí.**
La herramienta brilla en página en blanco: estructura por decidir, UI relativamente estándar, explorar direcciones rápido. Ese es el avance real del que se habla, y es cierto para ese problema. Pero el cuello de botella de Paramita a esta altura no es "generar diseño": es **extender con precisión un sistema ya decidido y bordar la capa de creative-coding**. Para eso, el lienzo no aporta.

**5.2 · El trabajo de firma es justo lo que el lienzo no renderiza.**
El WebGL del fluido, GSAP/ScrollTrigger, los filtros SVG, la animación de ejes variables de Fraunces en scroll: eso es lo que impide que Paramita parezca una "wellness app" (estética rechazada en el doc `01`), y es exactamente lo que Claude Design no reproduce, porque solo pinta HTML/CSS. Un mockup sin esa capa no representa el sitio; representa su esqueleto. La prueba del §3 lo confirmó en directo.

**5.3 · Importar tokens no es importar decisiones.**
Que lea `--dorado` correctamente no significa que conozca por qué la home no lleva primario en el navbar, por qué "una tradición viva" sustituyó al carrusel, o por qué hay una sola media grande. Esas decisiones viven en los docs, no en los tokens, y re-diseñar sin ellas equivale a re-litigar lo cerrado. El riesgo no es que diseñe mal: es que **deshaga trabajo bueno**.

**5.4 · Coste de continuidad.**
El proyecto acumula semanas de trabajo y numerosos hilos donde vive el contexto. Los proyectos de Claude Design son un espacio aparte. Migrar ahora fragmenta esa continuidad a cambio de una capacidad que no ataca el problema real del proyecto.

---

## 6. Encaje operativo

Claude Design **no se entierra**: tiene un hueco legítimo y acotado.

**Úsalo cuando:**
- Empiece una página **nueva** cuya estructura aún no está decidida y se quiera explorar layouts rápido.
- Se quieran **2–3 variaciones** para comparar de un vistazo antes de comprometerse con una dirección.
- Se necesite un **mockup navegable** para que Ale, Gerard o Khenpo comenten sin tocar código.

En esos casos: se saca la estructura en el lienzo y se trae al flujo actual (o a Claude Code) para bordarla.

**Quédate en el flujo actual / código para:**
- La capa de efectos y motion (WebGL, GSAP, SVG).
- Todo lo ya documentado y cerrado.
- Ediciones quirúrgicas sobre el sistema existente.
- Cualquier trabajo que dependa de la continuidad de contexto de los hilos actuales.

---

## 7. Sobre "estar a la vanguardia"

Se aborda de frente porque es el argumento emocional que empuja a migrar. Estar a la vanguardia no lo da usar la herramienta con el nombre más reciente: lo da el resultado. El sitio ya encarna el expresivismo calmado de 2026 punto por punto (ver el marco de los dos polos en `13-home-publica.md`, §1). Para el tipo de trabajo de este proyecto —creative-coding artesanal— la frontera **sigue siendo artesanal**, no generada en un lienzo. Adoptar Design como entorno principal no haría el proyecto más avanzado; podría aplanarlo hacia lo que produce el promedio. La fidelidad a la identidad no es lo opuesto a la vanguardia: aquí, es la vanguardia.

---

## 8. Revisión

Esta decisión es para el momento actual (agosto 2026), no permanente. Conviene revisitarla si cambia alguna de sus premisas:

- Que Claude Design pase a **renderizar capas de runtime personalizadas** (WebGL/GSAP/SVG) con fidelidad, no solo HTML/CSS.
- Que arranque un **sub-proyecto genuinamente nuevo** (una landing de campaña, una micro-web) donde el modo *greenfield* sí sea el problema.
- Que la herramienta cambie de forma material su modelo de importación o su relación con el contexto del proyecto.

Mientras tanto: flujo actual como columna vertebral, Claude Design como herramienta de exploración puntual.
