# Paramita · Resumen de decisiones y análisis por temas

> Consolidación · Fase 6 (jul 2026)

Doce documentos que resumen el estado actual del sistema de diseño y desarrollo del sitio web de Paramita. Cada documento sigue la misma estructura: **contexto → decisión → alternativas descartadas → implicaciones → referencias en el código**.

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

---

## Arquitectura y trabajo activo

- **[06 · Navbar](06-navbar.md)**
  IA redefinida (Meditación → Cursos → Actividades → Blog → Sobre), pairing dual de CTAs, cinco ajustes de comportamiento integrados.

- **[07 · /formacion/ landing](07-formacion-landing.md)**
  Metáfora del sendero, cinco niveles pedagógicos, siete secciones, FLIP animation, filtro en lenguaje natural, tratamiento gratuito vs. pago.

- **[08 · Modularización JS · Fase 6](08-modularizacion-js-fase-6.md)**
  Extracción de ~875 líneas inline a 13 archivos modulares, arquitectura `primitivos/` · `componentes/` · `paginas/`.

- **[09 · Home logged-in](09-home-logged-in.md)**
  Propuesta de siete bloques para el practicante autenticado, con dependencias pendientes (modelo de contenido, arquitectura de dominio, plantilla individual).

---

## Aprendizajes transversales

- **[10 · Aprendizajes técnicos](10-aprendizajes-tecnicos.md)**
  Siete lecciones: `<button>` nesting, `box-shadow` + `clip-path`, `auto-fit` vs. `repeat(N)`, caché del navegador, archivos subidos vs. proyecto, leer antes de proponer, debug visual.

- **[11 · Método de trabajo](11-metodo-de-trabajo.md)**
  Validación visual iterativa, archivos completos vs. diffs, evidencia sobre opinión, pushback esperado, secuenciación por fases, distribución de responsabilidades.

- **[12 · Hoja de ruta y fases](12-hoja-de-ruta-y-fases.md)**
  Resumen de Fases 0–6 completadas, horizonte inmediato, trabajos deferidos, fases hipotéticas.

---

*Documentos vivos · se actualizan cuando el sistema evoluciona.*
