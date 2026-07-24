#!/usr/bin/env python3
"""
Sincroniza los bloques <header class="bar">…</header> y <footer class="foot"…>…</footer>
de una landing con los parciales canónicos, preservando el resto del HTML.

Uso:
    python3 sync.py <landing.html> [--aria-current=<selector>]

El selector aria-current es opcional. Formato: "Cursos" (marca el <a> cuyo texto empieza por "Cursos").
"""
import re
import sys
from pathlib import Path

PARTIALS_DIR = Path("/mnt/user-data/outputs/partials")


def read_partial(name):
    return PARTIALS_DIR.joinpath(name).read_text(encoding="utf-8").rstrip() + "\n"


def replace_block(html, tag, class_hint, replacement):
    """
    Reemplaza el primer bloque <tag ... class_hint ...>…</tag> por replacement.
    Usa un regex tolerante que localiza la apertura y busca su cierre.
    """
    # Localizar apertura de la etiqueta con la clase
    open_pattern = re.compile(
        rf'<{tag}\b[^>]*class="[^"]*\b{re.escape(class_hint)}\b[^"]*"[^>]*>',
        re.IGNORECASE,
    )
    m = open_pattern.search(html)
    if not m:
        raise ValueError(f"No se encontró <{tag} class='...{class_hint}...'>")

    start = m.start()
    # Ahora buscar el </tag> de cierre correspondiente, contando anidamientos
    close_tag = f"</{tag}>"
    open_tag_short = f"<{tag}"
    pos = m.end()
    depth = 1
    lower_html = html.lower()
    close_tag_lower = close_tag.lower()
    open_tag_lower = open_tag_short.lower()
    while depth > 0 and pos < len(html):
        next_close = lower_html.find(close_tag_lower, pos)
        next_open = lower_html.find(open_tag_lower, pos)
        if next_close == -1:
            raise ValueError(f"No se encontró {close_tag} de cierre")
        # ¿hay una apertura anidada antes del próximo cierre?
        if next_open != -1 and next_open < next_close:
            # asegurar que no sea "<tag" dentro de un atributo como <tagname>
            # como estamos hablando de <header>/<footer>, el riesgo es bajo
            depth += 1
            pos = next_open + len(open_tag_short)
        else:
            depth -= 1
            pos = next_close + len(close_tag)
    end = pos
    return html[:start] + replacement + html[end:]


def apply_aria_current(html, link_text):
    """
    Añade aria-current="page" al primer <a class="navlink" ...>link_text</a>
    dentro del bloque <header class="bar">.
    """
    if not link_text:
        return html

    # Regex que localiza la etiqueta <a class="navlink" ...>LINK_TEXT
    # y añade aria-current si no lo tiene ya.
    pattern = re.compile(
        r'(<a\s+class="navlink"\s+href="[^"]*")(\s*>\s*'
        + re.escape(link_text)
        + r"(?:\s|<))",
        re.IGNORECASE,
    )
    if not pattern.search(html):
        raise ValueError(f'No se encontró <a class="navlink"> con texto "{link_text}"')
    return pattern.sub(r'\1 aria-current="page"\2', html, count=1)


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    target = Path(sys.argv[1])
    aria_current = None
    for arg in sys.argv[2:]:
        if arg.startswith("--aria-current="):
            aria_current = arg.split("=", 1)[1]

    html = target.read_text(encoding="utf-8")

    navbar = read_partial("navbar-publico.html")
    footer = read_partial("footer.html")

    # Aplicar aria-current dentro del navbar si se pidió
    if aria_current:
        navbar = apply_aria_current(navbar, aria_current)

    # Reemplazar los dos bloques
    html = replace_block(html, "header", "bar", navbar.rstrip())
    html = replace_block(html, "footer", "foot", footer.rstrip())

    target.write_text(html, encoding="utf-8")
    print(f"[ok] Sincronizado: {target}")
    if aria_current:
        print(f"     aria-current='page' aplicado a: {aria_current}")


if __name__ == "__main__":
    main()
