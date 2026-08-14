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

    ── NUEVO · TODO EL SITIO DE UNA VEZ ────────────────────────────────────
    python3 sync.py --all            # recorre el repo y sincroniza CADA página
    python3 sync.py --all --only-pictos   # solo refresca pictogramas en todo

    Ejemplos típicos:
      # Página pública normal (navbar público + footer + tema):
      python3 sync.py formacion/formacion-publica.html --tema --aria-current="Cursos"

      # Página de /sobre/ · el aria-current marca un ítem del submenú "Sobre"
      python3 sync.py sobre/maestros/maestros.html --tema --aria-current="Maestros"

      # Ficha de curso (2 niveles · el prefijo ../ lo detecta solo):
      python3 sync.py formacion/emi-1-calma-y-lucidez/emi-1-calma-y-lucidez.html --tema

── AUTODECLARACIÓN POR PÁGINA (marcador `sync:`) ─────────────────────────
Para que `--all` sepa qué hacer con cada página SIN que tengas que teclear
flags por archivo, cada página lleva UNA línea de comentario (donde quieras,
normalmente tras <body> o en el <head>):

    <!-- sync: navbar=publico current="Cursos" -->
    <!-- sync: navbar=practicante current="Mi formación" -->
    <!-- sync: navbar=skip -->                 (navbar bespoke: no se toca)
    <!-- sync: navbar=publico current="La Fundación" prefooter -->
    <!-- sync: no-tema -->                     (no inyectar el tema en esta página)
    <!-- sync: ignore -->                      (no sincronizar esta página nunca)

Campos (todos opcionales):
  navbar=publico|practicante|skip   (por defecto: publico)
  current="Texto del enlace"        (marca aria-current="page")
  prefooter                         (inserta también el prefooter)
  no-tema                           (omite el tema en esta página)
  ignore                            (excluye la página del sync)

Precedencia: un flag de línea de comandos SIEMPRE gana sobre el marcador;
el marcador gana sobre el valor por defecto. Así, en modo de un archivo
puedes seguir usando flags, y en `--all` mandan los marcadores.

── QUÉ SINCRONIZA `--all` ────────────────────────────────────────────────
Recorre el repositorio desde el directorio actual y procesa toda página que:
  · contenga un navbar del sistema (<header class="…bar…">), y
  · no esté en una carpeta excluida (partials, css, js, assets, .git, …), y
  · no empiece por informe-/maqueta-/plantilla-, ni lleve `sync: ignore`.
Los informes y maquetas quedan fuera por diseño (no son páginas del sitio).
Cada página se sincroniza según SU marcador; sin marcador → navbar público,
sin aria-current, con tema. Un fallo en una página no aborta el lote.

── AVISO · --practicante y el navbar logueado (ACTUALIZADO) ──────────────
`navbar-practicante.html` está reescrito sobre el componente **.cuenta**
(círculo con inicial + desplegable), que SÍ tiene CSS
(`paramita-formacion-logueado.css`). El antiguo borrador con `.avatar-menu`
(sin CSS) queda DESCARTADO. Por tanto `--practicante` ya es válido para las
páginas logueadas: márcalas con `<!-- sync: navbar=practicante current="…" -->`.
Si alguna página logueada tuviera todavía un navbar a medida que no quieras
tocar, márcala `navbar=skip`.

── PROFUNDIDAD (rutas del tema) ─────────────────────────────────────────
El navbar y el footer usan rutas ABSOLUTAS (/meditacion/…), así que son
independientes de la profundidad de la página. Solo el TEMA necesita prefijo
relativo (../, ../../): se DETECTA leyendo un <link>/<script> hacia css/ o js/
que la página ya tiene. Por eso `--all` funciona a cualquier profundidad.

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

# --all · carpetas que nunca contienen páginas del sitio
EXCLUDE_DIRS = {".git", ".github", "node_modules", "partials", "css", "js",
                "assets", "img", "imagenes", "fonts", "fuentes", "vendor"}
# --all · prefijos de archivos que son documentos, no páginas
EXCLUDE_PREFIXES = ("informe-", "maqueta-", "plantilla-")
# detector de navbar del sistema
_BAR_RE = re.compile(r'<header\s+[^>]*class="[^"]*\bbar\b', re.IGNORECASE)


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


# ── MARCADOR DE PÁGINA · <!-- sync: … --> ────────────────────────────────

def parse_marker(html):
    """Lee el comentario `<!-- sync: … -->` y devuelve un dict de config.
    Todos los campos son opcionales; None significa «no declarado»."""
    cfg = {"navbar": None, "current": None, "prefooter": False,
           "no_tema": False, "ignore": False}
    m = re.search(r"<!--\s*sync:\s*(.*?)-->", html, re.IGNORECASE | re.DOTALL)
    if not m:
        return cfg
    body = m.group(1)
    if re.search(r"\bignore\b", body, re.IGNORECASE):
        cfg["ignore"] = True
    nm = re.search(r"\bnavbar\s*=\s*(publico|p[úu]blico|practicante|skip)\b", body, re.IGNORECASE)
    if nm:
        v = nm.group(1).lower()
        cfg["navbar"] = "publico" if v.startswith("p") and "sk" not in v and "ract" not in v else v
        # normaliza acentos/variantes
        if v.startswith("prac"):
            cfg["navbar"] = "practicante"
        elif v == "skip":
            cfg["navbar"] = "skip"
        else:
            cfg["navbar"] = "publico"
    cm = re.search(r'\bcurrent\s*=\s*"([^"]*)"', body, re.IGNORECASE)
    if cm:
        cfg["current"] = cm.group(1)
    if re.search(r"\bprefooter\b", body, re.IGNORECASE):
        cfg["prefooter"] = True
    if re.search(r"\bno-tema\b", body, re.IGNORECASE):
        cfg["no_tema"] = True
    return cfg


def apply_aria_current(html, link_text):
    """Marca como página actual el enlace cuyo texto es link_text.

    Reconoce DOS formas:
      · Navlink de primer nivel:  <a class="navlink" href="...">Cursos</a>
      · Ítem de submenú:          <a role="menuitem" href="..."><strong>Maestros</strong>…

    Idempotente: no lo duplica si el <a> ya lo tiene."""
    if not link_text:
        return html
    already = re.compile(
        r'<a\b[^>]*\baria-current="page"[^>]*>\s*(?:<strong>\s*)?'
        + re.escape(link_text)
        + r'(?=\s|<)',
        re.IGNORECASE,
    )
    if already.search(html):
        return html
    pattern = re.compile(
        r'(<a\b(?![^>]*\baria-current=)[^>]*\bhref="[^"]*"[^>]*>)'
        r'(\s*(?:<strong>\s*)?)'
        + re.escape(link_text)
        + r'(?=\s|<)',
        re.IGNORECASE,
    )
    m = pattern.search(html)
    if not m:
        raise ValueError(
            f'No se encontró <a> (navlink o submenú) con texto "{link_text}"'
        )
    open_tag = m.group(1)
    new_open = open_tag[:-1] + ' aria-current="page">'
    return html[: m.start(1)] + new_open + html[m.end(1):]


# ── TEMA · penumbra/luz ─────────────────────────────────────────────────

def detect_prefix(html):
    """Prefijo relativo hacia la raíz ('', '../', …) leyendo un href/src a css/ o js/."""
    m = re.search(r'(?:href|src)="((?:\.\./)*)(?:css|js)/', html, re.IGNORECASE)
    return m.group(1) if m else ""


def sync_tema(html):
    """Inserta/actualiza las 3 piezas del tema. Devuelve (html, resumen:list)."""
    prefix = detect_prefix(html)
    hechos = []

    fouc_presente = re.search(r"getItem\(\s*['\"]paramita-tema['\"]\s*\)", html)
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

    css_line = (
        f'  <!-- TEMA · penumbra/luz · el ÚLTIMO para ganar la cascada (sync) -->\n'
        f'  <link rel="stylesheet" href="{prefix}css/componentes/paramita-tema.css">'
    )
    if re.search(r'<link\b[^>]*paramita-tema\.css[^>]*>', html, re.IGNORECASE):
        html = re.sub(
            r'(?:[ \t]*<!-- TEMA[^\n]*\n)?[ \t]*<link\b[^>]*paramita-tema\.css[^>]*>',
            css_line,
            html,
            count=1,
        )
        hechos.append(f"tema.css actualizado ({prefix or './'})")
    else:
        enlaces = list(re.finditer(r'<link\s+rel="stylesheet"[^>]*>', html, re.IGNORECASE))
        if not enlaces:
            raise ValueError("no hay <link rel=stylesheet> donde anclar el tema.css")
        last = enlaces[-1]
        html = html[: last.end()] + "\n" + css_line + html[last.end():]
        hechos.append(f"tema.css insertado ({prefix or './'})")

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


def sync_menu_js(html):
    """Inserta/actualiza el <script> del acordeón de submenús en móvil.

    Se inyecta en TODA página con navbar del sistema, con independencia del
    tema: el CSS de móvil (paramita-responsive.css) deja los submenús
    colapsados por defecto y paramita-menu.js es lo que los abre al tocar.
    Sin este script, en móvil «Sobre»/«Únete» quedarían inabribles — por eso
    NO cuelga de --tema (a diferencia de tema.js), sino de la presencia de
    navbar. Idempotente: en re-pasadas actualiza la línea en su sitio.
    Devuelve (html, resumen:list)."""
    prefix = detect_prefix(html)
    hechos = []

    js_line = (
        f'<!-- MENÚ · acordeón de submenús en móvil · compartido (sync) -->\n'
        f'<script src="{prefix}js/componentes/paramita-menu.js" defer></script>'
    )
    if re.search(r'<script\b[^>]*paramita-menu\.js[^>]*>', html, re.IGNORECASE):
        html = re.sub(
            r'(?:[ \t]*<!-- MENÚ[^\n]*\n)?[ \t]*<script\b[^>]*paramita-menu\.js[^>]*>\s*</script>',
            js_line,
            html,
            count=1,
        )
        hechos.append(f"menu.js actualizado ({prefix or './'})")
    else:
        scripts = list(
            re.finditer(r'<script\b[^>]*\bsrc="[^"]*"[^>]*>\s*</script>', html, re.IGNORECASE)
        )
        if scripts:
            last = scripts[-1]
            html = html[: last.end()] + "\n" + js_line + html[last.end():]
        else:
            html = re.sub(r"(</body>)", js_line + r"\n\1", html, count=1)
        hechos.append(f"menu.js insertado ({prefix or './'})")

    return html, hechos


# ── PICTOGRAMAS ────────────────────────────────────────────────────────

_pico_cache = {}


def read_pictogram(name):
    if name not in _pico_cache:
        ruta = PICTOS_DIR.joinpath(f"{name}.svg")
        if not ruta.exists():
            disponibles = ", ".join(sorted(p.stem for p in PICTOS_DIR.glob("*.svg"))) or "ninguno"
            raise ValueError(
                f'No existe el pictograma "{name}" en {PICTOS_DIR}. Disponibles: {disponibles}'
            )
        _pico_cache[name] = ruta.read_text(encoding="utf-8").strip()
    return _pico_cache[name]


_PICO_TAG = re.compile(
    r'(<span\b[^>]*\bdata-pico="([a-z0-9-]+)"[^>]*>)(.*?)(</span>)',
    re.IGNORECASE | re.DOTALL,
)


def sync_pictograms(html):
    count = 0

    def repl(m):
        nonlocal count
        open_tag, name, _inner, close_tag = m.groups()
        svg = read_pictogram(name)
        count += 1
        return open_tag + svg + close_tag

    return _PICO_TAG.sub(repl, html), count


# ── PROCESO POR ARCHIVO ─────────────────────────────────────────────────

def process_file(target, *, cli_aria=None, cli_prefooter=None, only_pictos=False,
                 cli_navbar=None, tema=None, footer_optional=False, quiet=False):
    """Sincroniza una página. Los valores `cli_*` (de la línea de comandos)
    ganan sobre el marcador de la página; el marcador gana sobre el defecto."""
    html = target.read_text(encoding="utf-8")

    if only_pictos:
        html, n = sync_pictograms(html)
        target.write_text(html, encoding="utf-8")
        print(f"[ok] {target} · pictogramas: {n}")
        return

    marker = parse_marker(html)

    # Resolución de config · CLI > marcador > defecto
    navbar = cli_navbar or marker["navbar"] or "publico"   # publico|practicante|skip
    aria_current = cli_aria if cli_aria is not None else marker["current"]
    with_prefooter = cli_prefooter if cli_prefooter is not None else marker["prefooter"]
    do_tema = tema if tema is not None else (not marker["no_tema"])

    skip_navbar = (navbar == "skip")
    practicante = (navbar == "practicante")

    # 1 · Navbar
    if not skip_navbar:
        navbar_partial = "navbar-practicante.html" if practicante else "navbar-publico.html"
        nav = read_partial(navbar_partial)
        if aria_current:
            nav = apply_aria_current(nav, aria_current)
        html = replace_block(
            html,
            r'<header\s+class="[^"]*\bbar\b[^"]*"[^>]*>',
            "</header>",
            nav.rstrip(),
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

    fstart, fend = find_block(
        html, r'<footer\s+class="[^"]*\bfoot\b[^"]*"[^>]*>', "</footer>"
    )
    footer_nota = None
    if fstart is None:
        if footer_optional:
            footer_nota = "footer no encontrado — omitido"
        else:
            raise ValueError("No se encontró el bloque footer")
    else:
        html = html[:fstart] + replacement + html[fend:]

    # 3 · Tema (opcional)
    tema_resumen = []
    if do_tema:
        html, tema_resumen = sync_tema(html)

    # 3b · Menú · toggle de submenús en móvil (SIEMPRE que haya navbar del
    #      sistema; NO depende del tema, para que ninguna página quede con el
    #      CSS colapsado pero sin el JS que lo abre).
    menu_resumen = []
    if not skip_navbar:
        html, menu_resumen = sync_menu_js(html)

    # 4 · Pictogramas
    html, n_pictos = sync_pictograms(html)

    target.write_text(html, encoding="utf-8")

    if quiet:
        marca = f" · {aria_current}" if aria_current else ""
        print(f"[ok] {target} · navbar:{'skip' if skip_navbar else navbar}{marca} · pictos:{n_pictos}"
              + (" · menu.js" if menu_resumen else "")
              + (f" · {footer_nota}" if footer_nota else ""))
        return

    print(f"[ok] Sincronizado: {target}")
    print(f"     navbar: {'omitido (skip)' if skip_navbar else navbar}")
    if aria_current and not skip_navbar:
        print(f"     aria-current='page' aplicado a: {aria_current}")
    print(f"     prefooter: {'sí' if with_prefooter else 'no'}")
    if footer_nota:
        print(f"     {footer_nota}")
    if do_tema:
        for h in tema_resumen:
            print(f"     tema · {h}")
    for h in menu_resumen:
        print(f"     menú · {h}")
    print(f"     pictogramas: {n_pictos}")


# ── DESCUBRIMIENTO DE PÁGINAS (--all) ────────────────────────────────────

def discover_pages(root):
    """Devuelve las páginas del sitio bajo `root`, excluyendo partials,
    carpetas de assets, informes y maquetas, y las marcadas `sync: ignore`."""
    pages = []
    for p in sorted(root.rglob("*.html")):
        rel = p.relative_to(root)
        if set(rel.parts) & EXCLUDE_DIRS:
            continue
        if p.resolve() == PARTIALS_DIR or PARTIALS_DIR in p.resolve().parents:
            continue
        if p.name.startswith(EXCLUDE_PREFIXES):
            continue
        try:
            html = p.read_text(encoding="utf-8")
        except Exception:
            continue
        if re.search(r"<!--\s*sync:\s*[^>]*\bignore\b", html, re.IGNORECASE):
            continue
        if not _BAR_RE.search(html):
            continue  # no es una página del sitio (informe suelto, etc.)
        pages.append(p)
    return pages


def run_all(only_pictos, tema_cli):
    root = Path.cwd()
    pages = discover_pages(root)
    if not pages:
        print(f"[!] --all: no encontré páginas con navbar bajo {root}")
        sys.exit(1)
    print(f"── sync --all · {len(pages)} páginas bajo {root} ──")
    hubo_error = False
    for target in pages:
        try:
            process_file(
                target,
                cli_aria=None, cli_prefooter=None, only_pictos=only_pictos,
                cli_navbar=None, tema=tema_cli, footer_optional=True, quiet=True,
            )
        except ValueError as e:
            hubo_error = True
            print(f"[!] {target}: {e}")
    print("── fin ──")
    if hubo_error:
        sys.exit(1)


# ── MAIN ─────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    args = sys.argv[1:]
    all_mode = "--all" in args
    only_pictos = "--only-pictos" in args

    if all_mode:
        # En --all, el tema se aplica salvo que la página diga `no-tema`.
        # `--tema` fuerza tema en todas; sin flag, se respeta el marcador.
        tema_cli = True if "--tema" in args else None
        run_all(only_pictos=only_pictos, tema_cli=tema_cli)
        return

    # ── Modo de un archivo (o glob) · compatible con el uso anterior ──
    aria_current = None
    with_prefooter = None
    practicante = False
    skip_navbar = False
    tema = None
    for arg in args[1:]:
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
        print("[!] --practicante y --skip-navbar son incompatibles.")
        sys.exit(1)

    cli_navbar = "practicante" if practicante else ("skip" if skip_navbar else None)

    matches = [Path(p) for p in glob.glob(args[0])]
    if not matches:
        print(f"[!] No se encontró ningún archivo para: {args[0]}")
        sys.exit(1)

    hubo_error = False
    for target in matches:
        try:
            process_file(
                target,
                cli_aria=aria_current, cli_prefooter=with_prefooter,
                only_pictos=only_pictos, cli_navbar=cli_navbar, tema=tema,
                footer_optional=False,
            )
        except ValueError as e:
            hubo_error = True
            print(f"[!] {target}: {e}")

    if hubo_error:
        sys.exit(1)


if __name__ == "__main__":
    main()
