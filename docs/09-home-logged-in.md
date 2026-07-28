# 09 · Home logged-in · pantalla del practicante autenticado

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026)
> **Estado: propuesta pendiente de resolución de dependencias.**

---

## Contexto

Con EMI 1 en marcha (Entrenamiento Mental Integral, ver `emi-1-index.html`), llega un momento en el que las personas inscritas vuelven al sitio autenticadas y necesitan una pantalla de aterrizaje distinta a la home pública. La home pública está diseñada para invitar; la home logged-in tiene que acompañar a alguien que ya está dentro.

Sin decidir bien esta pantalla, la fundación termina reproduciendo los patrones estándar de plataforma edtech (dashboard con progreso, streaks, badges) que contradicen la identidad. Con decidirla bien, la pantalla se convierte en un umbral diario a la práctica, no en un panel de control.

## Decisión (propuesta)

**La home logged-in es un espacio contemplativo de retorno, no un dashboard. Estructura de siete bloques con bienvenida, práctica del día, progreso no gamificado, comunidad, y upsell suave. Se implementa cuando las decisiones de arquitectura previas estén cerradas (ver "Dependencias").**

### Los siete bloques

1. **Bienvenida contemplativa** — saludo por nombre, sin métricas ni notificaciones agresivas. Frase Fraunces italic con la fecha o el ritmo del día ("Es lunes por la mañana", "Estás de vuelta").
2. **Práctica del día (context-aware)** — sugerencia basada en dónde estaba el practicante en su curso, y en el momento del día. Una sola acción visible: *"Continuar con la Lección 04 · Maximizar la oportunidad"*.
3. **Progreso no gamificado** — visualización orgánica del avance sin porcentajes agresivos, sin barras que hay que llenar, sin streaks que se rompen. Puede ser una línea que se dibuja, un círculo que se completa, una flor que abre pétalos. Estética coherente con el sistema.
4. **Comunidad / retiro** — bloque suave con lo que está pasando en la fundación esta semana: próxima sesión abierta, retiro, celebración. No calendario denso — un puñado de eventos que resuenen con la práctica de esta persona.
5. **Enseñanza corta del día** — cita, fragmento, o audio breve. Rotación diaria. Sin obligación de "consumirlo" — está ahí si el momento lo pide.
6. **Blog / lectura** — uno o dos artículos recientes que expandan la práctica en curso. Menos lista de posts, más "esto podría interesarte ahora".
7. **Upsell suave** — si la persona está terminando EMI 1, aparece una invitación contenida a EMI 2 o al siguiente nivel del sendero. No banner, no descuento, no urgencia — mención editorial.

### Principios operativos
- **No gamificar.** Sin streaks ("Llevas 7 días seguidos"), sin XP, sin badges, sin ranking.
- **No metrificar el silencio.** El practicante que hoy no medita no ha fallado nada.
- **Uno o dos focos claros por bloque.** Un dashboard con 20 tarjetas es antipatrón.
- **Estados sensibles.** Un practicante que no vuelve en dos semanas ve una pantalla ligeramente distinta a uno que vuelve a diario — pero nunca con reproches implícitos.

## Alternativas descartadas

**Dashboard tipo edtech (progress bar + streak + notifications + course grid).** Descartado. Es el patrón por defecto de las plataformas de aprendizaje online y contradice la identidad contemplativa de Paramita. Adoptarlo convertiría la fundación en "un curso online más".

**Feed cronológico tipo red social ("qué hay de nuevo").** Descartado. Introduce lógica de scroll infinito y ansiedad por FOMO. La home logged-in no es un timeline; es un umbral.

**Recomendaciones algorítmicas ("porque terminaste X, prueba Y").** Descartado por ahora. La lógica editorial (Khenpo y Ale eligen qué mostrar cuándo) es más coherente con la fundación que un motor de recomendación opaco.

**Chat/comunidad en primer plano.** Deferido. El foro / grupo existe (mencionado en `emi-1-index.html`) pero no es lo primero que ve el practicante al entrar. Vive dentro del bloque 4 (comunidad), no como bloque de aterrizaje.

**Un único CTA gigante "Continuar mi práctica".** Descartado. Reduce demasiado. La práctica no es un solo botón — es un contexto donde hay varios puntos de entrada legítimos según el momento.

## Dependencias pendientes

**La pantalla no se finaliza hasta resolver tres decisiones estructurales con Khenpo, Ale y Alberto:**

1. **Modelo de contenido.** ¿Qué tipos de curso existen? (video autoestudio, video + tutor, presencial, retiro, gratuito, membresía…). ¿Qué estructura interna tiene un curso? (lecciones, semanas, módulos). ¿Qué modelos de acceso hay? (compra única, membresía, dana). Sin este modelo, el bloque 2 no puede construirse.

2. **Arquitectura de dominio.** ¿La experiencia logged-in vive en `paramita.org` (home unificada) o en `cursos.paramita.org` (subdominio del LMS)? Alberto lidera esta decisión desde backend. Tiene implicaciones grandes para SSO, sesión compartida, y diseño de la barra.

3. **Plantilla de página individual de curso.** Antes de la home logged-in hay que resolver la plantilla del curso concreto (lecciones, progreso, ejercicios, foro). La home logged-in enlaza a esa plantilla — no tiene sentido diseñar el aterrizaje antes de diseñar el destino.

### Secuencia recomendada
> Modelo de contenido → Arquitectura de dominio → Catálogo (`/formacion/`) → Plantilla individual de curso → Home logged-in.

Saltar pasos produce rework — es uno de los aprendizajes del proyecto (ver documento 11).

## Implicaciones

- **La navbar necesitará una variante logged-in** con acceso directo a Cursos y Actividades del practicante, y con el chip de usuario a la derecha en lugar del CTA de contacto. Scoped a la fase de home logged-in.
- **Sesión y estado.** Cómo se persiste que un practicante está autenticado, y cómo se sincroniza entre `paramita.org` y `cursos.paramita.org`, depende de la decisión de dominio (punto 2 de dependencias).
- **La copia de todos los bloques la firma Khenpo / Ale.** No es texto de UX genérico — es voz editorial de la fundación. No se redacta en vacío.
- **La accesibilidad importa especialmente aquí.** Un porcentaje del alumnado de la fundación es mayor y práctica en pantalla grande. Tamaños de tipografía y densidad de información deben calibrarse para ese público, no para el default 16px de Silicon Valley.

## Referencias

- `emi-1-index.html` · pantalla actual de EMI 1 (la que evolucionará hacia la logged-in)
- `paramita-arquitectura.docx` · convenciones que aplicarán al nuevo código
- Este documento se cierra cuando las tres dependencias estén resueltas.
