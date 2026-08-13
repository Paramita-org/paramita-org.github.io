# Paramita · Resumen de decisiones y análisis por temas

> Consolidación · Fase 6 (jul 2026) · **actualizado en Fase 7+ (ago 2026)**

Documentos que resumen el estado actual del sistema de diseño y desarrollo del sitio web de Paramita. Cada documento numerado sigue la misma estructura: **contexto → decisión → alternativas descartadas → implicaciones → referencias en el código**. Los estudios profundos (marco y datos contrastados) viven además como informes HTML, que un documento numerado consolida cuando las decisiones se cierran.

---

## Identidad y sistema visual

- **[01 · Fundamentos de identidad](01-fundamentos-de-identidad.md)**
  El hilo conceptual *"el cruce como acto"*, el principio de identidad sobre tendencia, el rechazo del dark mode como dirección primaria.

- **[02 · Sistema de color](02-sistema-de-color.md)**
  Paleta OKLCH, tokens oficiales, regla 70/30, prohibición de colores inventados, uso obligatorio de `color-mix`.

- **[03 · Tipografía](03-tipografia.md)**
  Fraunces × Hanken Grotesk, eje SOFT animado en scroll, escala semántica de pesos (contemplativo como default), regla de la italic dorada.

- **[04 · Sistema de motion](04-sistema-de-motion.md)**
  Cuatro capas, respiración ambiente a 25s base, interruptor global `--identidad-estado`, principio "hover intensifica lo que ya vive".

- **[05 · Sistema de CTAs](05-sistema-de-ctas.md)**
  Nomenclatura actual (`.btn-primario` / `.btn-secundario` / `.t-link`), pairing por página, evolución desde `.btn-amigo` / `.btn-umbral`.

- **Sistema de pictogramas** · `informe-sistema-pictogramas-paramita.html`
  La llama y la tinta: línea humanista, tinta al 58% + un único acento dorado (`.acc`), escala *inline · lg · feature*, SVG inline vía partial, la regla "nunca desnudo" (88/60/34 % de acierto con/sin etiqueta).

---

## Arquitectura y trabajo activo

- **[06 · Navbar](06-navbar.md)** — *actualizado Fase 7+*
  IA redefinida (Meditación → Cursos → Actividades → Blog → Sobre → **Únete**). Fase 7+: sexta entrada **Únete** con submenú *Grupos* + *Voluntariado*; «Únete» sale de los CTAs y el clúster derecho pasa a **Contribuir + Iniciar sesión**. Submenús mínimos, cinco ajustes de comportamiento.

- **[07 · /formacion/ landing](07-formacion-landing.md)**
  Metáfora del sendero, cinco niveles pedagógicos, siete secciones, FLIP animation, filtro en lenguaje natural, tratamiento gratuito vs. pago.

- **[08 · Modularización JS · Fase 6](08-modularizacion-js-fase-6.md)**
  Extracción de ~875 líneas inline a 13 archivos modulares, arquitectura `primitivos/` · `componentes/` · `paginas/`.

- **[09 · Home logged-in](09-home-logged-in.md)**
  Propuesta de siete bloques para el practicante autenticado, con dependencias pendientes (modelo de contenido, arquitectura de dominio, plantilla individual).

- **[13 · Home pública](13-home-publica.md)**
  Arco de la home (acoger → orientar → dar confianza → invitar a implicarse), estructura bloque a bloque, jerarquía de CTAs, capa de suscripción de un campo en el cierre, de "testimonios" a "una tradición viva".

- **[16 · Landing de contribución](16-landing-contribuir.md)**
  dāna sobre funnel; identidad única «Amigo/a de Paramita»; una landing con dos puertas; transparencia vs. acción; integración al sistema real. Fundamento en `informe-donativo-vs-membresia-2026.html`.

- **Únete · comunidad laica** *(en curso · Fase 7+)*
  La puerta de la pertenencia no monetaria (practicante · Sangha de grupos · voluntariado), hermana de Contribuir. Estudio en dos informes HTML:
  · `informe-landing-unete-comunidad-2026.html` — marco, identidades, conversión honesta, dirección gráfica 2026, SEO local.
  · `informe-unete-arquitectura-neuromarketing-2026.html` — auditoría de las páginas actuales, modelo **hub-and-spoke**, neuromarketing (sobrecarga de opciones, escalera de compromiso), reducción de texto y aplicación de los pictogramas.
  Documento numerado de consolidación (**17 · Únete**), pendiente al cerrar hub-sí/hub-no, rutas y copy.

---

## Aprendizajes transversales

- **[10 · Aprendizajes técnicos](10-aprendizajes-tecnicos.md)**
  Siete lecciones: `<button>` nesting, `box-shadow` + `clip-path`, `auto-fit` vs. `repeat(N)`, caché del navegador, archivos subidos vs. proyecto, leer antes de proponer, debug visual.

- **[11 · Método de trabajo](11-metodo-de-trabajo.md)**
  Validación visual iterativa, archivos completos vs. diffs, evidencia sobre opinión, pushback esperado, secuenciación por fases, distribución de responsabilidades.

- **[12 · Hoja de ruta y fases](12-hoja-de-ruta-y-fases.md)**
  Resumen de Fases 0–6 completadas, horizonte inmediato, trabajos deferidos, fases hipotéticas.

- **[14 · Alcance de Claude Design](14-claude-design-alcance.md)**
  Rol acotado de Claude Design: exploración de páginas nuevas, no producción sobre el sistema maduro.

---

*Documentos vivos · se actualizan cuando el sistema evoluciona. Última actualización: Fase 7+ (ago 2026) — sexta entrada de navbar «Únete» y arranque del estudio de la comunidad laica.*
