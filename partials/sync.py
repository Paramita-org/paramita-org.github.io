#!/usr/bin/env python3
"""
Sincroniza navbar, prefooter y footer de una landing con los partials canónicos.

Uso:
    python3 sync.py <landing.html>
    python3 sync.py <landing.html> --aria-current="Cursos"
    python3 sync.py <landing.html> --with-prefooter
    python3 sync.py <landing.html> --aria-current="Cursos" --with-prefooter
"""
import re
import sys
from pathlib import Path

# Los partials viven en la misma carpeta que este script
PARTIALS_DIR = Path(__file__).resolve().parent


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


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    target = Path(sys.argv[1])
    aria_current = None
    with_prefooter = False
    for arg in sys.argv[2:]:
        if arg.startswith("--aria-current="):
            aria_current = arg.split("=", 1)[1]
        elif arg == "--with-prefooter":
            with_prefooter = True

    html = target.read_text(encoding="utf-8")

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
    # El bloque a reemplazar puede ser un <section class="foot__hero"> previo
    # (si ya existía como partial separado) o estar dentro del <footer>.
    # Estrategia: quitar cualquier <section class="foot__hero"> huérfano primero,
    # luego reemplazar el <footer class="foot">.

    # Quitar <section class="foot__hero"> si existe como hermano
    prefooter_start, prefooter_end = find_block(
        html, r'<section\s+class="[^"]*\bfoot__hero\b[^"]*"[^>]*>', "</section>"
    )
    if prefooter_start is not None:
        # Recortar también el whitespace que sigue
        after = prefooter_end
        while after < len(html) and html[after] in " \t\n\r":
            after += 1
        html = html[:prefooter_start] + html[after:]

    # Reemplazar footer
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

    target.write_text(html, encoding="utf-8")
    print(f"[ok] Sincronizado: {target}")
    if aria_current:
        print(f"     aria-current='page' aplicado a: {aria_current}")
    print(f"     prefooter: {'sí' if with_prefooter else 'no'}")


if __name__ == "__main__":
    main()
