#!/usr/bin/env python3
"""
Sincroniza navbar, prefooter, footer y PICTOGRAMAS de una landing con los
partials canónicos.

Uso:
    python3 sync.py <landing.html>
    python3 sync.py <landing.html> --aria-current="Cursos"
    python3 sync.py <landing.html> --with-prefooter
    python3 sync.py <landing.html> --aria-current="Cursos" --with-prefooter
    python3 sync.py <landing.html> --only-pictos     # solo pictogramas
    python3 sync.py "formacion/*/index.html" --only-pictos   # varios de golpe

── PICTOGRAMAS ────────────────────────────────────────────────────────
En las páginas marcas cada pictograma con un span vacío (o con el SVG viejo):

    <span class="pico" data-pico="duracion" aria-hidden="true"></span> 8 semanas

Al pasar el sync, el span se rellena con el SVG canónico de
partials/pictogramas/duracion.svg — y se re-rellena en cada pasada, así que
cambiar el .svg y volver a sincronizar lo actualiza en TODAS las páginas.
El span conserva sus clases y atributos (pico--sm, etc.); solo cambia lo de dentro.
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
# Non-greedy hasta el primer </span>; un pictograma solo contiene un <svg>,
# nunca otro <span>, así que el cierre es siempre el correcto.
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

def process_file(target, aria_current, with_prefooter, only_pictos):
    html = target.read_text(encoding="utf-8")

    # Modo rápido: solo pictogramas (para refrescar iconos en muchas páginas)
    if only_pictos:
        html, n = sync_pictograms(html)
        target.write_text(html, encoding="utf-8")
        print(f"[ok] {target} · pictogramas: {n}")
        return

    # 1 · Navbar
    navbar = read_partial("navbar-publico.html")
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

    # 3 · Pictogramas
    html, n_pictos = sync_pictograms(html)

    target.write_text(html, encoding="utf-8")
    print(f"[ok] Sincronizado: {target}")
    if aria_current:
        print(f"     aria-current='page' aplicado a: {aria_current}")
    print(f"     prefooter: {'sí' if with_prefooter else 'no'}")
    print(f"     pictogramas: {n_pictos}")


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    aria_current = None
    with_prefooter = False
    only_pictos = False
    for arg in sys.argv[2:]:
        if arg.startswith("--aria-current="):
            aria_current = arg.split("=", 1)[1]
        elif arg == "--with-prefooter":
            with_prefooter = True
        elif arg == "--only-pictos":
            only_pictos = True

    # El target admite comodines (glob) para procesar varias páginas de golpe
    matches = [Path(p) for p in glob.glob(sys.argv[1])]
    if not matches:
        print(f"[!] No se encontró ningún archivo para: {sys.argv[1]}")
        sys.exit(1)

    hubo_error = False
    for target in matches:
        try:
            process_file(target, aria_current, with_prefooter, only_pictos)
        except ValueError as e:
            # Un fallo en una página (p. ej. un data-pico mal escrito) no
            # debe abortar el lote: avisa y sigue con las demás.
            hubo_error = True
            print(f"[!] {target}: {e}")

    if hubo_error:
        sys.exit(1)


if __name__ == "__main__":
    main()
