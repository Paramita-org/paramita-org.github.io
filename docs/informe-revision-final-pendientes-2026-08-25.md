# Revisión final · puntos anotados

**2026-08-25** — Notas de la sesión de favicon, títulos y enlaces. Es un checklist para tener a mano en la revisión final; nada urgente.

---

## Hecho en esta sesión

- **Favicon.** Flor de loto del imagotipo con degradado vertical (tres azules de marca). Cuatro archivos: `favicon.svg` + `favicon-32x32.png` + `favicon-16x16.png` + `apple-touch-icon.png` (este último sobre fondo lino, que iOS no admite transparencia). Bloque `<link>` añadido al `<head>` de 20 páginas: las 19 públicas/logueadas + `cuenta`. Rutas absolutas (`/favicon.svg`), válidas a cualquier profundidad.
- **Títulos unificados** a "[nombre] · Paramita". Correcciones puntuales: `actividades` (se quitó el "— Fundació Sakya" con guion largo) y `blog` (se quitó el título de trabajo que colaba la palabra "maqueta" → ahora "Diario · Paramita"). El resto ya cumplía.
- **Enlaces rotos corregidos.** `contribuir`: la tarjeta "Sostener a la sangha monástica" apuntaba a la carpeta inexistente `monasticos-monasticas` → ahora `/sobre/sangha-monastica/sangha-monastica.html`. `inscripcion`: sus dos enlaces `/legal/politica-de-privacidad/` (checkbox de consentimiento y pie) → `/politica-de-privacidad/`.

---

## Verificar en la revisión final

- **Versiones desincronizadas.** `crowdfunding` estaba desactualizado en los archivos del proyecto (le faltaban los arreglos de navbar y darkmode); se rehízo el favicon sobre la versión buena. Según tu revisión era el único afectado, pero conviene una comprobación rápida de que en el resto el favicon quedó sobre la versión más reciente. Si aparece alguna otra desfasada, lo más limpio es aplicar el favicon con un script que recorra el repo real e inserte el bloque tras `<title>` solo si falta.
- **Favicon en páginas nuevas.** `sync.py` no toca el `<head>`, así que cualquier página futura necesita el bloque a mano (o se extiende sync con un partial de head).
- **Fuentes del área logueada.** `home-logueado`, `formacion-logueado` y `cuenta` cargan Fraunces/Hanken desde Google Fonts, no las woff2 autoalojadas del sitio público. Divergencia de rendimiento y de coherencia de render; a revisar con Alberto.

---

## Decisiones abiertas

- **Orden del título de la home.** `index` mantiene la marca delante ("Paramita · Meditación y sabiduría de los Himalayas"), como excepción legítima de home. Si se quiere uniformidad total, girar a "... · Paramita".
- **Descripciones en los títulos.** Nueve páginas llevan cláusula descriptiva en medio y siete van peladas. El formato es el mismo; queda decidir si se uniforma (todas con descripción o todas sin). Es copy.
- **Ubicación de `inscripcion`.** Cableada como hermana de `emi-1` (dos niveles: `formacion/emi-1-calma-y-lucidez/inscripcion.html`), pero su `canonical` apunta a la URL limpia de tres niveles `/formacion/emi-1-calma-y-lucidez/inscripcion/`. Elegir una y cuadrar en consecuencia `canonical`, rutas CSS y el enlace de entrada desde `emi-1`.

---

## Pendiente de construir

- **Landing de formularios** — la pieza principal que queda.
- **Enlaces a páginas que aún no existen** (decidir si se construyen o se retiran los enlaces):
  - `/contacto/` — desde `actividades`.
  - `/mi-progreso` — desde el navbar de practicante, `home-logueado` y `formacion-logueado`.
  - `/sangha/nuevos/` — desde `grupos`.
  - `/unete/unete.html` — desde `contribuir` (índice de la sección Únete; sin confirmar si ya existe dentro de `unete/`).
- **Área logueada** en general (`home-logueado`, navbar de practicante, resolución de `/cuenta`, `/logout`, `/mi-progreso`): bloqueada en las decisiones de LMS/sesión de Alberto.

---

## Notas de despliegue

- Los 4 archivos de favicon van a la **raíz del repo** (junto a `index.html`).
- **Política de privacidad:** el archivo real es `politica-de-privacidad/index.html`; el nombre `index-politica-de-privacidad.html` es solo un alias para no confundirlo con el index de la home.
- `/cuenta`: la carpeta existe; el nombre final del archivo (`index.html` para servir la URL limpia, o `cuenta.html` con redirect) lo cierra Alberto con su capa de sesión.
