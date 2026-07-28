# 01 · Fundamentos de identidad

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026)

---

## Contexto

Paramita es la fundación Sakya con sede en Alicante que traduce la tradición himalaya a un público hispanohablante contemporáneo. El proyecto web arrancó con una auditoría del sistema existente y evolucionó, ya en Fase 0, hacia una decisión mayor: **antes de rediseñar componentes había que fijar el hilo conceptual del sitio**. Sin ese hilo, cada decisión visual posterior se resolvería por gusto o por tendencia — no por coherencia.

Ese hilo es *"el cruce como acto"*.

## Decisión

**El hilo conceptual del sistema es *"el cruce como acto"* — el paso de una orilla a otra como gesto activo, no pasivo.** Toda decisión visual, tipográfica o de motion se valida contra este hilo antes de aprobarse.

Se derivan cuatro principios operativos:

1. **Identidad sobre tendencia.** Las decisiones se fundamentan en coherencia con la identidad, no en lo que hace el resto de la web ahora mismo.
2. **Paramita no es un SaaS.** Los patrones de producto (gamificación agresiva, streak-shaming, rankings competitivos, urgencia manufacturada, UX transaccional) son antipatrones para este público.
3. **Luminosidad mediterránea como estado por defecto.** La paleta cálida (lino, arena, arcilla) y el peso `contemplativo` (300) son la superficie de reposo del sistema — no una decoración.
4. **El sistema respira.** Existe un movimiento ambiental identitario (Fase 0.1) que atraviesa el sitio de forma imperceptible individualmente pero presente en la acumulación.

## Alternativas descartadas

**Dark mode como dirección primaria.** Rechazado explícitamente en Fase 0. Argumento: contradice la luminosidad mediterránea establecida y el gesto de "el cruce como acto" (que se lee mejor sobre superficies cálidas y claras). Se mantiene abierta la posibilidad de un dark mode *user-toggleable* para lectura larga en una fase futura, pero nunca como dirección de marca.

**Estética "wellness app" contemporánea.** Rechazada por convertir la práctica contemplativa en un producto de autoconsumo. El sitio debe transmitir que el practicante entra en una tradición viva, no que descarga un producto.

**Neutralidad tipográfica y cromática ("mínimo seguro").** Rechazada porque produce un sitio que podría ser de cualquier fundación. La firmeza de la decisión estética es lo que permite que Paramita no se confunda con nadie más.

## Implicaciones

- Cada propuesta nueva se juzga primero por coherencia con el hilo, después por ejecución. Una animación técnicamente impecable pero que rompe el hilo se descarta.
- El sistema tiene derecho al pushback: cuando una petición del cliente entra en conflicto con la identidad, se explica el conflicto en lugar de ejecutar sin más.
- La Fase 0.1 formalizó la reversibilidad — el flujo identitario puede detenerse en todo el sitio con un solo cambio (`--identidad-estado: reposo`). El sistema respira, pero puede callar.
- El hilo se aplica también a lo que **no** se hace: ausencia de streaks, ausencia de leaderboards, ausencia de badges, ausencia de banners de "solo quedan 3 plazas".

## Referencias en el código

- `paramita-movimiento.css` · Capa 3 · Familia identitaria (Fase 0.1)
- `Paramita_Roadmap_Design_System.html` · Fase 0
- Documento `Paramita_Fase_0_1_Reformulacion.html` (referenciado en `paramita-movimiento.css`)
