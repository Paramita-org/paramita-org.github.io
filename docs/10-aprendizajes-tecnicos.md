# 10 · Aprendizajes técnicos

> Documento de decisiones y análisis · Paramita · Fase 6 (jul 2026)

---

## Contexto

A lo largo del proyecto han aparecido varios problemas técnicos que no venían del diseño ni de la lógica, sino de cómo los navegadores interpretan (o rompen) el HTML/CSS. Documentarlos evita repetirlos.

Cada aprendizaje sigue el formato: **Problema → Causa → Solución**.

---

## 1 · Anidar `<button>` es HTML inválido

**Problema.** El popover del filtro en `/formacion/` tenía un `<button>` para cada faceta, y dentro de él un `<button>` para cada opción. Cuando el navegador parseaba el HTML, el botón interior aparecía fuera del exterior en el DOM, rompiendo la lógica de posicionamiento del popover.

**Causa.** La especificación HTML no permite `<button>` dentro de `<button>`. Los navegadores lo corrigen expulsando el botón interior — sin avisar, sin error en consola.

**Solución.** Usar `<span role="button" tabindex="0">` para los elementos interactivos dentro de un botón. Se comporta como botón para lectores de pantalla y para teclado (con un event listener para `Enter` y `Space`), y no rompe el parser.

```html
<!-- Incorrecto -->
<button class="slot">
  <button class="opcion">Nivel I</button>
</button>

<!-- Correcto -->
<span class="slot" role="button" tabindex="0">
  <span class="opcion" role="button" tabindex="0">Nivel I</span>
</span>
```

Este patrón es el que hoy usa el filtro natural de `/formacion/`.

---

## 2 · `box-shadow` se recorta con `clip-path`

**Problema.** El vídeo cinemático de la sección *mission* usa `clip-path: ellipse(...)` para la máscara. Al aplicarle `box-shadow`, la sombra se cortaba bruscamente en el borde del rectángulo original — no seguía la forma de la elipse.

**Causa.** `box-shadow` y `overflow: hidden` recortan la sombra dentro de la caja del elemento. Es comportamiento estándar de CSS, no un bug — pero cuando el elemento tiene una máscara, la sombra deja de leerse.

**Solución.** Separar responsabilidades en dos capas:
- **Wrapper** (`.mission__video-wrap`) — caja física que proyecta la sombra. Sin `clip-path`, sin `overflow`.
- **Elemento** (`.mission__video`) — máscara visual con `clip-path` y `overflow`.

En el wrapper se usa `filter: drop-shadow(...)` en lugar de `box-shadow`. `drop-shadow` respeta la silueta real del hijo (la elipse), no la caja rectangular. Se aplican dos capas de `drop-shadow` (contacto corto + aire largo) para lectura sobre el fondo cálido:

```css
.mission__video-wrap {
  filter:
    drop-shadow(0 8px 16px rgba(40, 33, 26, 0.10))
    drop-shadow(0 32px 64px rgba(40, 33, 26, 0.18));
}
```

Este es el patrón estándar en Stripe, Linear y Vercel.

---

## 3 · `auto-fit minmax` produce columnas rotas cuando quieres N fijas

**Problema.** Se usó `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` para el catálogo de cursos esperando 4 columnas en desktop. En viewports estrechos daban 2, en anchos daban 4 — pero en tamaños intermedios daban 3 con la última columna descolgada visualmente.

**Causa.** `auto-fit` optimiza el número de columnas en función del espacio disponible; ese es su propósito. Cuando el diseño exige exactamente N columnas, `auto-fit` está resolviendo un problema distinto.

**Solución.** Cuando el número de columnas es una decisión de diseño (no una función del contenido), usar `repeat(N, 1fr)` con media queries para los breakpoints:

```css
.catalogo {
  grid-template-columns: repeat(4, 1fr);
}
@media (max-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 720px)  { grid-template-columns: repeat(2, 1fr); }
@media (max-width: 480px)  { grid-template-columns: 1fr; }
```

Regla operativa: `auto-fit` para catálogos genéricos donde el layout se adapta al contenido; `repeat(N, 1fr)` para grids con estructura pensada.

---

## 4 · Caché del navegador enmascara cambios

**Problema.** Después de subir un CSS actualizado se veía la versión antigua en el browser. Se dedicaron minutos a diagnosticar un "bug" en el CSS que no existía.

**Causa.** El navegador cachea agresivamente CSS y JS servidos desde el mismo host, especialmente cuando el header `Cache-Control` no fuerza revalidación.

**Solución operativa.**
- **Antes de diagnosticar cualquier discrepancia visual**, confirmar que la caché está limpia: DevTools → Network → *Disable cache* con las herramientas abiertas, o `Cmd/Ctrl + Shift + R` para hard reload.
- **En producción**, usar cache-busting con query strings (`paramita-color.css?v=6.2`) o hashes cuando haya build. Sin cache-busting, un cambio puede tardar hasta una semana en llegar a un visitante recurrente.

---

## 5 · Trabajar desde archivos subidos, no desde `/mnt/project/`

**Problema.** El proyecto tiene una copia en `/mnt/project/` que se sincroniza periódicamente. Cuando Jana sube un archivo nuevo en la conversación, esa copia es más reciente que la del proyecto. Trabajar sobre `/mnt/project/` en ese momento produce ediciones sobre una versión obsoleta.

**Causa.** El proyecto en `/mnt/project/` refleja el estado en un momento anterior; los archivos subidos en la conversación son el estado presente.

**Solución.** **Cuando existe una versión subida, es siempre más reciente que la de `/mnt/project/`.** Se trabaja sobre el archivo subido, no sobre la copia del proyecto. Si solo hay copia en `/mnt/project/`, se usa esa.

---

## 6 · Leer antes de proponer

**Problema.** Varias iteraciones tempranas se perdieron proponiendo cambios ya implementados: navbar shrink en scroll, cambio de imagotipo, revisión del texto del hero. En cada caso, el código ya lo contemplaba.

**Causa.** Confianza en la memoria del proyecto sin verificar el estado actual del código.

**Solución.** **Antes de proponer un cambio, revisar el código que lo implementa o lo bloquea.** La memoria del proyecto es un mapa; el código es el territorio. Se propone después de haber visto el territorio.

---

## 7 · Debug visual con screenshots + DevTools overlays

**Problema.** Leer código CSS complejo (grid, motion, clip-path) para adivinar el resultado en pantalla es lento y falible.

**Causa.** El CSS moderno tiene demasiadas interacciones (containment, isolation, layer, transform 3D, blend modes) para simularlo mentalmente con precisión.

**Solución.** Se han resuelto muchos problemas más rápido con un screenshot de DevTools mostrando la superposición de grids/layout que con lectura de código. Este método sigue siendo el default cuando algo se ve mal — no se hace *code review* primero, se hace *browser inspection* primero.

---

## Reglas operativas resultantes

1. **Nunca anidar `<button>`.** Usar `<span role="button" tabindex="0">`.
2. **Nunca `box-shadow` sobre elementos con `clip-path` o `overflow`.** Wrapper + `filter: drop-shadow`.
3. **`repeat(N, 1fr)` cuando la N está decidida por diseño.** `auto-fit` solo si el layout se adapta al contenido.
4. **Caché limpia antes de diagnosticar.** *Disable cache* en DevTools por defecto durante desarrollo.
5. **Archivo subido = versión actual.** Copia en `/mnt/project/` = potencialmente obsoleta.
6. **Leer antes de proponer.** Verificar el código antes de sugerir un cambio.
7. **Debug visual primero.** Screenshot de DevTools antes de code review.
