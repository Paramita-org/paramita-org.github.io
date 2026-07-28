# 06 · Navbar

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026)

---

## Contexto

La navegación anterior mezclaba categorías (Meditación, Cursos, Actividades) con contenido (Blog, Sobre nosotros) sin criterio jerárquico. Los usuarios llegaban a la home y no sabían qué diferenciaba "Meditación" de "Cursos", ni dónde encontrar los eventos presenciales. Se rediseñó la arquitectura de información y los CTAs asociados, con ajustes de comportamiento acordados durante la implementación.

## Decisión

**IA principal reordenada como recorrido natural del practicante: Meditación → Cursos → Actividades → Blog → Sobre. Dos CTAs a la derecha, con pairing distinto en home vs. resto de páginas.**

### Arquitectura de información

1. **Meditación** — entrada contemplativa, el "qué es" del sitio. Enlace directo, sin submenú.
2. **Cursos** — formación estructurada por niveles. Enlace directo a `/formacion/`.
3. **Actividades** — vida presencial del centro. Con submenú: *Calendario* (sesiones y retiros) + *Visita el centro*.
4. **Blog** — artículos y enseñanzas. Enlace directo (o alojado bajo *Sobre nosotros* según la variante).
5. **Sobre nosotros** — quién guía la práctica y qué es la fundación. Con submenú: *Maestros* + páginas institucionales.

### Pairing de CTAs

- **Home:** `.btn-secundario` + `.btn-secundario` — dos entradas contemplativas, sin acción prioritaria.
- **Otras páginas:** `.btn-secundario` + `.btn-primario` — el primario ancla la acción principal del contexto (inscribirse, contactar).

### Cinco ajustes de comportamiento integrados

1. **Peso del `.navlink` sube en hover** — de `400` (reposo) a `600` (activo/hover) con transición sutil. Enfoca sin latidos.
2. **Underline animada desde el centro** — degradado azul→dorado que crece desde el centro hacia los bordes en hover. Aplica también al enlace de la página actual (`aria-current="page"`).
3. **Atenuación cruzada** — cuando un `.navlink` está en hover, los demás bajan a `opacity: 0.55`. Guía la atención sin oscurecer.
4. **Barra sticky con estado `scrolled`** — al bajar más de 8px, la barra pasa a fondo de cristal opaco. La lógica vive en `paramita-bar.js` (`onScroll` con `requestAnimationFrame`).
5. **Estado `aria-current="page"`** — el enlace de la página actual mantiene el tratamiento del hover de forma permanente (peso 600, underline llena). Recomendación W3C WAI.

## Alternativas descartadas

**Mega-menú horizontal en todos los apartados.** Descartado. Rompe la calma visual y sobre-estructura una navegación que solo necesita cinco puntos. Los submenús mínimos (Actividades, Sobre nosotros) son suficientes.

**Un solo CTA a la derecha.** Descartado. Un CTA único obliga a elegir entre acción y entrada contemplativa. El pairing dual permite que la barra sirva ambos propósitos sin ceder ninguno.

**Latido / pulso permanente en el CTA primario para llamar la atención.** Rechazado. Contradice el principio de que el sistema respira ambientalmente, no reclama. El primario ya respira con `--dur-identidad-agil` (17.5s) — ese es su presencia.

**Hover que oscurece los `.navlink` no activos hasta 0.4.** Ajustado a 0.55 durante la implementación. 0.4 se sentía como un apagón; 0.55 guía sin ocultar.

**Submenú "Actividades" con más entradas (Retiros, Talleres, Cursos presenciales, Peregrinaciones…).** Descartado por ahora. Con solo Calendario + Visita se cubre el 90% del caso, y el submenú se abre visualmente. Añadir más entradas se pospone hasta que la fundación tenga un volumen de contenido que lo justifique.

## Implicaciones

- **La navegación es de solo cinco puntos.** Añadir un sexto obliga a repensar la IA entera — no se añade "en el hueco disponible".
- **`aria-current="page"` es responsabilidad del HTML de cada plantilla.** El CSS ya está preparado para responder; falta que cada plantilla marque el navlink correcto.
- **La caret del submenú se construye con borders**, no con SVG ni icono — más eficiente y coherente con el resto del sistema. Rota 45° en reposo, -135° cuando `aria-expanded="true"`.
- **La barra sticky reacciona con `scrolled` a partir de 8px.** No usa `IntersectionObserver` — es un scroll listener puro con `requestAnimationFrame` para no bloquear.
- **Una variante logged-in del navbar (con acceso directo a Cursos/Actividades del practicante inscrito) está scoped a fase futura.** No se implementa hasta que la home logged-in esté resuelta.
- **El mobile burger conserva el patrón `<input type=checkbox hidden>` + `<label>`** — CSS puro, sin JS para abrir/cerrar. Deliberado.

## Referencias en el código

- `css/componentes/paramita-menu.css` · comportamiento del `.navlink`, caret, submenús
- `css/componentes/paramita-bar.css` · barra sticky y estado `scrolled`
- `js/componentes/paramita-bar.js` · scroll listener
- `emi-1-index.html` · implementación de referencia del navbar (aunque con CTAs `.btn-amigo` aún sin migrar)
