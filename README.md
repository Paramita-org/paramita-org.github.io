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

**Rutas absolutas siempre.** Todos los `href` y `src` que apunten a assets
propios del proyecto empiezan por `/`. Escribimos `/css/base/paramita-base.css`,
nunca `css/base/paramita-base.css` ni `../css/base/paramita-base.css`. Así una
misma referencia funciona igual desde la raíz que desde `sobre/maestros/`.

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
