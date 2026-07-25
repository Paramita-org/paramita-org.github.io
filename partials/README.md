# Partials · Paramita

Fragmentos HTML canónicos del sistema. Fuente única de verdad para navbar,
prefooter y footer.

## Archivos

- `navbar-publico.html` — Navbar para visitantes no autenticados.
- `navbar-practicante.html` — **Borrador** para usuarios logueados (Fase 8).
- `prefooter.html` — Bloque "Practiquemos juntos" con canvas de lotos físicos.
  Se usa SOLO en landings donde tenga sentido narrativo (home, y candidatas
  a decidir landing a landing).
- `footer.html` — Pie institucional (marca, navegar, contacto).
  Se pega SIEMPRE, con o sin prefooter delante.

## Cómo se usan

Estos archivos son referencia canónica que se copia y pega dentro de cada
landing.

**Landing con pre-footer (home):**
```
...contenido...
<!-- pegar prefooter.html aquí -->
<!-- pegar footer.html a continuación -->
</body>
```

**Landing sin pre-footer:**
```
...contenido...
<!-- pegar solo footer.html -->
</body>
```

## Estado por landing

| Landing | Navbar | Prefooter | Footer | Notas |
|---|---|---|---|---|
| `index.html` (home) | ✅ | ✅ | ✅ | Sin aria-current |
| `formacion/index.html` | ✅ | — | ✅ | aria-current en Cursos |
| resto pendientes | — | — | — | Decidir prefooter caso a caso |

## Decisiones vivas del navbar (Fase 7)

- **"Cursos" en el navbar público apunta a `/formacion/`**, no al LMS externo.
- **"Cursos" en el navbar practicante** sí apunta al LMS externo (contraste
  intencional).
- **Nuevas entradas en Sobre**: Maestros y Monásticos/as (páginas pendientes).

## Decisión viva del footer (Fase 7)

- **El prefooter "Practiquemos juntos"** se separó del footer canónico.
  Solo se incluye en landings donde la invitación a formar comunidad tenga
  sentido narrativo. Por defecto: solo la home. El resto se irá decidiendo
  landing a landing.
- Como el JS `paramita-footer-lotos.js` es defensivo (`if (!cv) return;`),
  puede cargarse en todas las landings sin problema aunque no haya prefooter.

## Sincronización con `sync.py`

```
python3 sync.py <landing.html> [--aria-current="<Texto>"] [--with-prefooter]
```

- `--aria-current` marca el enlace del navbar como página activa.
- `--with-prefooter` incluye el pre-footer antes del footer.
