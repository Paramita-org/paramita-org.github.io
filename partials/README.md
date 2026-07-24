# Partials · Paramita

Fragmentos HTML canónicos del sistema. Fuente única de verdad para navbar y footer.

## Archivos

- `navbar-publico.html` — Navbar para visitantes no autenticados. IA: Meditación · Cursos · Actividades · Blog · Sobre (desplegable) + CTAs Únete/Contribuir.
- `navbar-practicante.html` — **Borrador** para usuarios logueados. IA: Mi sendero · Cursos · Actividades · Blog + avatar dropdown. Requiere CSS y JS específicos aún no creados (Fase 8).
- `footer.html` — Footer canónico con "Practiquemos juntos" y navegación reflejo del navbar público.

## Cómo se usan

Estos archivos **no** se cargan solos — son referencia canónica que se **copia y pega** dentro de cada landing (`index.html`, `emi-1-index.html`, futuras).

Flujo cuando cambies algo:

1. Editas aquí (el partial) — la fuente de verdad.
2. Copias el bloque a cada landing que lo use.
3. Si son muchas landings y esto se vuelve pesado, migramos a includes por `fetch` (Fase futura).

## Estado por landing

| Landing | Navbar sincronizado | Footer sincronizado | Notas |
|---|---|---|---|
| `index.html` (home) | ✅ | ✅ | Sin aria-current por ahora |
| `index-formacion.html` (/formacion/) | ✅ | ✅ | aria-current="page" en Cursos |

Marca esta tabla cuando vayas actualizando cada landing nueva.

## Decisiones vivas del navbar (Fase 7)

- **"Cursos" en el navbar público apunta a `/formacion/`**, no al LMS externo.
  Razón: el navbar público sirve al visitante, no al practicante. El LMS
  `cursos.paramita.org` se accede desde el navbar practicante y desde CTAs
  contextuales.
- **"Cursos" en el navbar practicante** sí apunta al LMS externo. El contraste
  es intencional.
- **Sobre / Monásticos y monásticas y Maestros** son entradas nuevas del
  desplegable Sobre. Las páginas aún no existen (`/sobre/maestros`,
  `/sobre/monasticos`) — pendiente de crear.

## Cómo sincronizar una landing nueva

Si tienes Python:

```
python3 sync.py <landing.html> [--aria-current="<Texto del enlace>"]
```

Si no tienes Python instalado o prefieres hacerlo a mano:

1. Abre el `.html` de la landing.
2. Reemplaza todo lo que hay entre `<header class="bar">` y `</header>` inclusive
   por el contenido de `navbar-publico.html`.
3. Reemplaza todo lo que hay entre `<footer class="foot" id="contacto">` y
   `</footer>` inclusive por el contenido de `footer.html`.
4. Si la landing corresponde a alguna sección del navbar, añade
   `aria-current="page"` al enlace correspondiente.

## Pendientes de arquitectura

Antes de dar por definitivo `navbar-practicante.html`:

- Decidir con Alberto dónde vive la zona logueada (`paramita.org` vs `cursos.paramita.org`).
- Definir cómo se transmite la señal de sesión.
- Crear `paramita-avatar.css` y `paramita-avatar.js`.
- Rellenar las variables template (`{{USUARIO_NOMBRE}}`, `{{USUARIO_INICIAL}}`, etc.) desde la sesión real.
