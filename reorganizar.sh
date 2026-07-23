#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════
# REORGANIZACIÓN PARAMITA · pre-escalado
# 
# EJECUTAR DESDE LA RAÍZ DEL PROYECTO (donde está index.html)
# 
# Qué hace:
#   1. Elimina duplicado paramita-movimiento.css de componentes/
#   2. Mueve paramita-responsive.css a base/ (es global, no componente)
#   3. Renombra js/comportamientos/ → js/componentes/
#   4. Crea css/paginas/
#   5. Mueve archivos específicos de página a css/paginas/
#   6. Consolida todo el JS en js/componentes/ y js/paginas/
# 
# SEGURO: solo mueve archivos, no borra código.
# Antes de ejecutar: haz una copia del proyecto por si acaso.
# ═══════════════════════════════════════════════════════════════════════

set -e  # Si algo falla, detiene el script

echo "→ Verificando que estamos en la raíz del proyecto..."
if [ ! -d "css" ] || [ ! -d "js" ]; then
  echo "✗ No estoy en la raíz del proyecto. Debes estar en la carpeta que contiene css/ y js/"
  exit 1
fi
echo "  ✓ OK, estoy en la raíz"

echo ""
echo "→ 1. Eliminando duplicado css/componentes/paramita-movimiento.css"
if [ -f "css/componentes/paramita-movimiento.css" ]; then
  rm css/componentes/paramita-movimiento.css
  echo "  ✓ Eliminado"
else
  echo "  ~ No existe (ya limpio)"
fi

echo ""
echo "→ 2. Moviendo paramita-responsive.css de componentes/ a base/"
if [ -f "css/componentes/paramita-responsive.css" ]; then
  mv css/componentes/paramita-responsive.css css/base/
  echo "  ✓ Movido a css/base/"
else
  echo "  ~ No está en componentes/ (¿ya movido?)"
fi

echo ""
echo "→ 3. Creando css/paginas/ (si no existe)"
mkdir -p css/paginas
echo "  ✓ OK"

# En este momento no movemos paramita-formacion.css ni paramita-hero.css porque:
#  · hero se reutilizará en varias páginas → se queda en componentes/
#  · formacion.css es específico de /formacion/ → SÍ va a paginas/
echo ""
echo "→ 4. Moviendo paramita-formacion.css a css/paginas/"
if [ -f "css/componentes/paramita-formacion.css" ]; then
  mv css/componentes/paramita-formacion.css css/paginas/
  echo "  ✓ Movido"
else
  echo "  ~ No está aún en componentes/ (¿lo pegarás luego?)"
fi

echo ""
echo "→ 5. Renombrando js/comportamientos/ → js/componentes/"
if [ -d "js/comportamientos" ] && [ ! -d "js/componentes" ]; then
  mv js/comportamientos js/componentes
  echo "  ✓ Renombrado"
elif [ -d "js/componentes" ] && [ -d "js/comportamientos" ]; then
  # Existen ambas · fusiono contenido
  echo "  ~ Ambas existen, fusionando..."
  mv js/comportamientos/*.js js/componentes/ 2>/dev/null || true
  rmdir js/comportamientos 2>/dev/null || true
  echo "  ✓ Fusionado en js/componentes/"
else
  echo "  ~ Ya está renombrado"
fi

echo ""
echo "→ 6. Consolidando JS: moviendo comportamientos que estaban en js/paginas/ a js/componentes/"
# Todos estos son "efectos aplicables a componentes", no lógica de una sola página:
JS_A_MOVER=(
  "paramita-cta-zoom.js"
  "paramita-cursos-flip.js"
  "paramita-footer-lotos.js"
  "paramita-frase-zoom.js"
  "paramita-participacion.js"
  "paramita-testimonios.js"
)
for f in "${JS_A_MOVER[@]}"; do
  if [ -f "js/paginas/$f" ]; then
    mv "js/paginas/$f" js/componentes/
    echo "  ✓ Movido $f → js/componentes/"
  fi
done

echo ""
echo "→ 7. Verificando estructura final..."
echo ""
echo "  css/tokens/:"
ls css/tokens/ 2>/dev/null | sed 's/^/    /'
echo ""
echo "  css/base/:"
ls css/base/ 2>/dev/null | sed 's/^/    /'
echo ""
echo "  css/componentes/:"
ls css/componentes/ 2>/dev/null | sed 's/^/    /'
echo ""
echo "  css/paginas/:"
ls css/paginas/ 2>/dev/null | sed 's/^/    /'
echo ""
echo "  js/primitivos/:"
ls js/primitivos/ 2>/dev/null | sed 's/^/    /'
echo ""
echo "  js/componentes/:"
ls js/componentes/ 2>/dev/null | sed 's/^/    /'
echo ""
echo "  js/paginas/:"
ls js/paginas/ 2>/dev/null | sed 's/^/    /'

echo ""
echo "═══════════════════════════════════════════════════════"
echo "✓ REORGANIZACIÓN COMPLETADA"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "SIGUIENTES PASOS MANUALES:"
echo ""
echo "  1. Añade los archivos nuevos que te descargaste:"
echo "     · formacion/index.html          (renombra formacion-index.html)"
echo "     · css/paginas/paramita-formacion.css   (SI aún no está)"
echo "     · css/componentes/paramita-chat.css"
echo "     · css/componentes/paramita-cta.css     (reemplaza el actual)"
echo "     · js/paginas/paramita-formacion.js"
echo "     · js/componentes/paramita-chat.js"
echo ""
echo "  2. Y reemplaza los archivos actualizados con nomenclatura nueva:"
echo "     · index.html"
echo "     · css/componentes/paramita-sections.css"
echo "     · css/base/paramita-responsive.css     (ya estará en base/)"
echo "     · css/componentes/paramita-extras.css"
echo "     · emi-1-index.html"
echo ""
echo "  3. En el HTML de formacion/index.html, ajusta la ruta del CSS:"
echo "     /css/componentes/paramita-formacion.css → /css/paginas/paramita-formacion.css"
echo ""
