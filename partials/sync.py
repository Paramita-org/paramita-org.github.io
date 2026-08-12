#!/usr/bin/env python3
"""
Sincroniza navbar, prefooter, footer, PICTOGRAMAS y (opcional) las piezas del
TEMA penumbra/luz de una landing con los partials canónicos.

Uso:
    python3 sync.py <landing.html>
    python3 sync.py <landing.html> --aria-current="Cursos"
    python3 sync.py <landing.html> --with-prefooter
    python3 sync.py <landing.html> --only-pictos          # solo pictogramas
    python3 sync.py "formacion/*/index.html" --only-pictos # varios de golpe

    ── NUEVO ──────────────────────────────────────────────────────────────
    python3 sync.py <landing.html> --tema                 # + piezas del tema
    python3 sync.py <landing.html> --practicante          # navbar logueado
    python3 sync.py <landing.html> --skip-navbar          # no tocar el navbar

    Ejemplos típicos:
      # Página pública normal (navbar público + footer + tema):
      python3 sync.py formacion/formacion-publica.html --tema --aria-current="Cursos"

      # Ficha de curso (2 niveles de profundidad · el prefijo ../ lo detecta solo):
      python3 sync.py formacion/emi-1-calma-y-lucidez/emi-1-calma-y-lucidez.html --tema

      # Página logueada · su navbar es bespoke (.cuenta), NO se sincroniza aún:
      python3 sync.py home-logueado/home-logueado.html --tema --skip-navbar

── FLAGS ───────────────────────────────────────────────────────────────
  --aria-current="Texto"   Marca ese navlink como página actual.
  --with-prefooter         Inserta también el prefooter (foot__hero).
  --only-pictos            Solo refresca pictogramas (modo rápido).
  --practicante            Usa navbar-practicante.html en vez del público.
                           ⚠️ Ver AVISO abajo — no usar aún en las páginas
                           logueadas actuales.
  --skip-navbar            No toca el navbar (para páginas cuyo navbar es
                           bespoke, p. ej. las logueadas sobre .cuenta).
  --tema                   Inyecta/actualiza las 3 piezas del tema:
                             1. script anti-FOUC en el <head>
                             2. <link> a paramita-tema.css (el último del head)
                             3. <script> a paramita-tema.js (antes de </body>)
                           Idempotente: si ya están, refresca su ruta según la
                           profundidad de la página; no las duplica.

── AVISO · --practicante y el navbar logueado ───────────────────────────
El partial navbar-practicante.html usa el componente .avatar-menu, que TODAVÍA
no tiene CSS (Fase 8). Las páginas logueadas actuales (home-logueado,
formacion-logueado) usan el componente .cuenta, que SÍ está estilado. Si
sincronizas --practicante sobre ellas, cambiarías un navbar funcional por uno
sin estilos. Hasta unificar .cuenta y .avatar-menu (Fase 8), sincroniza las
logueadas con --skip-navbar (footer + tema) y deja su navbar como está.

── PROFUNDIDAD (rutas del tema) ─────────────────────────────────────────
El prefijo relativo (../, ../../, …) NO se adivina por la ruta del archivo:
se DETECTA leyendo un <link>/<script> que la página ya tiene hacia css/ o js/.
Así el tema se inyecta con la ruta correcta a cualquier profundidad.

── PICTOGRAMAS ────────────────────────────────────────────────────────
En las páginas marcas cada pictograma con un span vacío (o con el SVG viejo):

    <span class="pico" data-pico="duracion" aria-hidden="true"></span> 8 semanas

Al pasar el sync, el span se rellena con el SVG canónico de
partials/pictogramas/duracion.svg — y se re-rellena en cada pasada.
"""
import re
import sys
import glob
from pathlib import Path

# Los partials viven en la misma carpeta que este script
PARTIALS_DIR = Path(__file__).resolve().parent
# Los pictogramas, en una subcarpeta
PICTOS_DIR = PARTIALS_DIR / "pictogramas"


def read_partial(name):
    return PARTIALS_DIR.joinpath(name).read_text(encoding="utf-8").rstrip() + "\n"


def find_block(html, open_regex, close_tag):
    m = re.search(open_regex, html, re.IGNORECASE)
    if not m:
        return None, None
    start = m.start()
    open_tag_short = f"<{close_tag[2:-1]}"
    pos = m.end()
    depth = 1
    lower = html.lower()
    close_low = close_tag.lower()
    open_low = open_tag_short.lower()
    while depth > 0 and pos < len(html):
        next_close = lower.find(close_low, pos)
        next_open = lower.find(open_low, pos)
        if next_close == -1:
            return None, None
        if next_open != -1 and next_open < next_close:
            depth += 1
            pos = next_open + len(open_tag_short)
        else:
            depth -= 1
            pos = next_close + len(close_tag)
    return start, pos


def replace_block(html, open_regex, close_tag, replacement, label):
    start, end = find_block(html, open_regex, close_tag)
    if start is None:
        raise ValueError(f"No se encontró el bloque {label}")
    return html[:start] + replacement + html[end:]


def apply_aria_current(html, link_text):
    if not link_text:
        return html
    pattern = re.compile(
        r'(<a\s+class="navlink"\s+href="[^"]*")(\s*>\s*'
        + re.escape(link_text)
        + r"(?:\s|<))",
        re.IGNORECASE,
    )
    if not pattern.search(html):
        raise ValueError(f'No se encontró <a class="navlink"> con texto "{link_text}"')
    return pattern.sub(r'\1 aria-current="page"\2', html, count=1)


# ── TEMA · penumbra/luz ─────────────────────────────────────────────────
# Tres piezas que toda página necesita para que el toggle sea global.
# La inyección es IDEMPOTENTE: si una pieza ya existe, se reemplaza (para
# refrescar la ruta si la página cambió de profundidad); si no, se inserta.

def detect_prefix(html):
    """Devuelve el prefijo relativo hacia la raíz ('', '../', '../../', …)
    leyendo un href/src existente hacia css/ o js/. Es lo que la página YA usa,
    así que el tema queda con la misma profundidad que el resto de sus assets."""
    m = re.search(r'(?:href|src)="((?:\.\./)*)(?:css|js)/', html, re.IGNORECASE)
    return m.group(1) if m else ""


def sync_tema(html):
    """Inserta/actualiza las 3 piezas del tema. Devuelve (html, resumen:list)."""
    prefix = detect_prefix(html)
    hechos = []

    # 1 · Anti-FOUC · script inline en el <head> (sin ruta → igual en todas).
    #     Se detecta por la llamada a localStorage.getItem('paramita-tema').
    fouc_presente = re.search(
        r"getItem\(\s*['\"]paramita-tema['\"]\s*\)", html
    )
    if not fouc_presente:
        fouc = (
            "  <!-- TEMA · anti-FOUC (sync) · aplica la penumbra guardada ANTES de pintar -->\n"
            "  <script>\n"
            "    try { if (localStorage.getItem('paramita-tema') === 'oscuro') "
            "document.documentElement.setAttribute('data-tema','oscuro'); } catch(e){}\n"
            "  </script>\n"
        )
        m = re.search(r'<link\s+rel="stylesheet"', html, re.IGNORECASE)
        if m:
            html = html[: m.start()] + fouc + html[m.start():]
        else:
            html = re.sub(r"(<head[^>]*>)", r"\1\n" + fouc, html, count=1)
        hechos.append("anti-FOUC insertado")
    else:
        hechos.append("anti-FOUC ya presente")

    # 2 · <link> a paramita-tema.css · debe ir EL ÚLTIMO del head (gana cascada).
    css_line = (
        f'  <!-- TEMA · penumbra/luz · el ÚLTIMO para ganar la cascada (sync) -->\n'
        f'  <link rel="stylesheet" href="{prefix}css/componentes/paramita-tema.css">'
    )
    # OJO · comprobar el <link> REAL, no una mención en comentarios: el
    # navbar-publico.html trae un comentario que nombra "paramita-tema.css",
    # y un `in html` a secas daba falso positivo (no insertaba el <link>).
    if re.search(r'<link\b[^>]*paramita-tema\.css[^>]*>', html, re.IGNORECASE):
        html = re.sub(
            r'(?:[ \t]*<!-- TEMA[^\n]*\n)?[ \t]*<link\b[^>]*paramita-tema\.css[^>]*>',
            css_line,
            html,
            count=1,
        )
        hechos.append(f"tema.css actualizado ({prefix or './'})")
    else:
        # Insertar tras el ÚLTIMO <link rel="stylesheet"> del documento.
        enlaces = list(re.finditer(r'<link\s+rel="stylesheet"[^>]*>', html, re.IGNORECASE))
        if not enlaces:
            raise ValueError("no hay <link rel=stylesheet> donde anclar el tema.css")
        last = enlaces[-1]
        html = html[: last.end()] + "\n" + css_line + html[last.end():]
        hechos.append(f"tema.css insertado ({prefix or './'})")

    # 3 · <script> a paramita-tema.js · antes de </body>.
    js_line = (
        f'<!-- TEMA · listener del toggle · compartido (sync) -->\n'
        f'<script src="{prefix}js/componentes/paramita-tema.js" defer></script>'
    )
    if re.search(r'<script\b[^>]*paramita-tema\.js[^>]*>', html, re.IGNORECASE):
        html = re.sub(
            r'(?:[ \t]*<!-- TEMA[^\n]*\n)?[ \t]*<script\b[^>]*paramita-tema\.js[^>]*>\s*</script>',
            js_line,
            html,
            count=1,
        )
        hechos.append(f"tema.js actualizado ({prefix or './'})")
    else:
        scripts = list(
            re.finditer(r'<script\b[^>]*\bsrc="[^"]*"[^>]*>\s*</script>', html, re.IGNORECASE)
        )
        if scripts:
            last = scripts[-1]
            html = html[: last.end()] + "\n" + js_line + html[last.end():]
        else:
            html = re.sub(r"(</body>)", js_line + r"\n\1", html, count=1)
        hechos.append(f"tema.js insertado ({prefix or './'})")

    return html, hechos


# ── PICTOGRAMAS ────────────────────────────────────────────────────────

_pico_cache = {}


def read_pictogram(name):
    """Lee partials/pictogramas/<name>.svg una sola vez (cacheado)."""
    if name not in _pico_cache:
        ruta = PICTOS_DIR.joinpath(f"{name}.svg")
        if not ruta.exists():
            disponibles = ", ".join(sorted(p.stem for p in PICTOS_DIR.glob("*.svg"))) or "ninguno"
            raise ValueError(
                f'No existe el pictograma "{name}" en {PICTOS_DIR}. '
                f"Disponibles: {disponibles}"
            )
        _pico_cache[name] = ruta.read_text(encoding="utf-8").strip()
    return _pico_cache[name]


# <span ... data-pico="nombre" ...> ...lo que sea... </span>
_PICO_TAG = re.compile(
    r'(<span\b[^>]*\bdata-pico="([a-z0-9-]+)"[^>]*>)(.*?)(</span>)',
    re.IGNORECASE | re.DOTALL,
)


def sync_pictograms(html):
    """Rellena el interior de cada <span data-pico="X"> con el SVG canónico.
    Devuelve (html_nuevo, nº_de_pictogramas_sincronizados)."""
    count = 0

    def repl(m):
        nonlocal count
        open_tag, name, _inner, close_tag = m.groups()
        svg = read_pictogram(name)  # lanza ValueError con nombre útil si no existe
        count += 1
        return open_tag + svg + close_tag

    return _PICO_TAG.sub(repl, html), count


# ── PROCESO POR ARCHIVO ─────────────────────────────────────────────────

def process_file(target, aria_current, with_prefooter, only_pictos,
                 practicante, skip_navbar, tema):
    html = target.read_text(encoding="utf-8")

    # Modo rápido: solo pictogramas (para refrescar iconos en muchas páginas)
    if only_pictos:
        html, n = sync_pictograms(html)
        target.write_text(html, encoding="utf-8")
        print(f"[ok] {target} · pictogramas: {n}")
        return

    # 1 · Navbar (salvo --skip-navbar)
    if not skip_navbar:
        navbar_partial = "navbar-practicante.html" if practicante else "navbar-publico.html"
        navbar = read_partial(navbar_partial)
        if aria_current:
            navbar = apply_aria_current(navbar, aria_current)
        html = replace_block(
            html,
            r'<header\s+class="[^"]*\bbar\b[^"]*"[^>]*>',
            "</header>",
            navbar.rstrip(),
            "navbar",
        )

    # 2 · Prefooter (opcional) + Footer
    prefooter_start, prefooter_end = find_block(
        html, r'<section\s+class="[^"]*\bfoot__hero\b[^"]*"[^>]*>', "</section>"
    )
    if prefooter_start is not None:
        after = prefooter_end
        while after < len(html) and html[after] in " \t\n\r":
            after += 1
        html = html[:prefooter_start] + html[after:]

    footer = read_partial("footer.html").rstrip()
    if with_prefooter:
        prefooter = read_partial("prefooter.html").rstrip()
        replacement = prefooter + "\n\n" + footer
    else:
        replacement = footer

    html = replace_block(
        html,
        r'<footer\s+class="[^"]*\bfoot\b[^"]*"[^>]*>',
        "</footer>",
        replacement,
        "footer",
    )

    # 3 · Tema (opcional)
    tema_resumen = []
    if tema:
        html, tema_resumen = sync_tema(html)

    # 4 · Pictogramas
    html, n_pictos = sync_pictograms(html)

    target.write_text(html, encoding="utf-8")
    print(f"[ok] Sincronizado: {target}")
    print(f"     navbar: {'omitido (--skip-navbar)' if skip_navbar else ('practicante' if practicante else 'público')}")
    if aria_current and not skip_navbar:
        print(f"     aria-current='page' aplicado a: {aria_current}")
    print(f"     prefooter: {'sí' if with_prefooter else 'no'}")
    if tema:
        for h in tema_resumen:
            print(f"     tema · {h}")
    print(f"     pictogramas: {n_pictos}")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    aria_current = None
    with_prefooter = False
    only_pictos = False
    practicante = False
    skip_navbar = False
    tema = False
    for arg in sys.argv[2:]:
        if arg.startswith("--aria-current="):
            aria_current = arg.split("=", 1)[1]
        elif arg == "--with-prefooter":
            with_prefooter = True
        elif arg == "--only-pictos":
            only_pictos = True
        elif arg == "--practicante":
            practicante = True
        elif arg == "--skip-navbar":
            skip_navbar = True
        elif arg == "--tema":
            tema = True
        else:
            print(f"[!] Flag no reconocido: {arg}")
            sys.exit(1)

    if practicante and skip_navbar:
        print("[!] --practicante y --skip-navbar son incompatibles (uno pone navbar, el otro lo omite).")
        sys.exit(1)

    # El target admite comodines (glob) para procesar varias páginas de golpe
    matches = [Path(p) for p in glob.glob(sys.argv[1])]
    if not matches:
        print(f"[!] No se encontró ningún archivo para: {sys.argv[1]}")
        sys.exit(1)

    hubo_error = False
    for target in matches:
        try:
            process_file(target, aria_current, with_prefooter, only_pictos,
                         practicante, skip_navbar, tema)
        except ValueError as e:
            # Un fallo en una página no aborta el lote: avisa y sigue.
            hubo_error = True
            print(f"[!] {target}: {e}")

    if hubo_error:
        sys.exit(1)


if __name__ == "__main__":
    main()
