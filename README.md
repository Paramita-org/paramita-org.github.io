# Paramita · Sitio web

Fundación Sakya · Alicante. Diseño y desarrollo del sitio institucional.

## Estructura de landings

Cada landing vive en su propia carpeta con un `index.html` dentro. GitHub Pages
sirve `carpeta/index.html` como `carpeta/`, así que las URLs quedan limpias
(`paramita.org/formacion/` en vez de `paramita.org/index-formacion.html`).

```
/
├── index.html                     ← home (paramita.org/)
├── formacion/index.html           ← paramita.org/formacion/
├── meditacion/index.html          ← pendiente
├── actividades/index.html         ← pendiente
├── blog/index.html                ← pendiente
├── crowdfunding/index.html        ← pendiente
├── unete/index.html               ← pendiente (destino CTA "Únete")
├── contribuir/index.html          ← pendiente (destino CTA "Contribuir")
└── sobre/
    ├── index.html                 ← La Fundación · pendiente
    ├── maestros/index.html        ← pendiente
    ├── monasticos/index.html      ← pendiente
    └── faq/index.html             ← pendiente
```

Las carpetas vacías tienen un `.gitkeep` para que Git preserve la estructura
hasta que se cree el `index.html` correspondiente.

## Estructura de assets

```
/
├── css/
│   ├── tokens/           ← color, tipografía, layout, movimiento
│   ├── base/             ← reset, base, responsive
│   ├── componentes/      ← bar, menu, cta, cursos, footer, modal, etc.
│   └── paginas/          ← estilos específicos por landing
├── js/
│   ├── primitivos/       ← utilidades reutilizables
│   ├── componentes/      ← comportamientos de componentes
│   └── paginas/          ← comportamientos específicos por landing
├── assets/
│   └── img/              ← imágenes del sitio
└── partials/             ← fragmentos HTML canónicos (navbar, footer)
```

## Convenciones

**Rutas de assets: relativas a la posición de la landing.** Los `href` y `src`
de CSS, JS, imágenes y fuentes se escriben relativos a la carpeta de la landing:

- Desde la home (`/index.html`): `href="css/base/paramita-base.css"`
- Desde `formacion/index.html`: `href="../css/base/paramita-base.css"`
- Desde `sobre/maestros/index.html`: `href="../../css/base/paramita-base.css"`

Esta convención permite pruebas visuales en GitHub Pages (que sirve el sitio
bajo una subruta tipo `janams.github.io/nombre-repo/`) sin configuración extra.
Cuando el sitio migre a un dominio propio sin subruta, se podrá reconsiderar
volver a rutas absolutas — pero por ahora, relativas.

**Enlaces internos del navbar y footer: absolutos.** Los `href` que apuntan
a otras landings (`/formacion/`, `/blog`, `/sobre/maestros`) se dejan absolutos.
Razón: los partials `navbar-publico.html` y `footer.html` son fuente única de
verdad y deben poder pegarse en cualquier landing sin adaptación. Consecuencia
aceptada: en GitHub Pages con subruta, la navegación entre landings a través
del navbar no funcionará hasta que haya dominio propio o migración de hosting.
Para pruebas visuales se accede a cada landing por URL directa.

**Partials como fuente única de verdad.** El navbar y el footer viven en
`partials/`. Cuando cambian, se editan ahí primero y luego se sincronizan a
todas las landings (a mano o con `partials/sync.py`).

**Nomenclatura Fase 6 de CTAs:** `.btn-primario` (conversión) y
`.btn-secundario` (acompaña). Ya no se usa `.btn-amigo` ni `.btn-umbral`.

## Estado de sincronización de partials

| Landing | Navbar | Footer | Notas |
|---|---|---|---|
| `index.html` (home) | ✅ | ✅ | Sin aria-current |
| `formacion/index.html` | ✅ | ✅ | aria-current="page" en Cursos |
| todas las demás | — | — | Pendientes de crear |
