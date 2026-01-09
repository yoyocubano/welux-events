#!/bin/bash
# Enlaces Rápidos para Desarrollo en la Nube
# Ejecuta este script para abrir tus proyectos en diferentes plataformas

echo "🚀 DESARROLLO EN LA NUBE - ENLACES RÁPIDOS"
echo "=========================================="
echo ""
echo "📦 TUS PROYECTOS:"
echo ""
echo "1️⃣  WELUX EVENTS"
echo "   GitHub: https://github.com/yoyocubano/welux-events"
echo "   Codespaces: https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=yoyocubano/welux-events"
echo "   StackBlitz: https://stackblitz.com/github/yoyocubano/welux-events"
echo ""
echo "2️⃣  LUXELECTRO WEB"
echo "   GitHub: https://github.com/yoyocubano/luxelectricweb1"
echo "   Codespaces: https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=yoyocubano/luxelectricweb1"
echo "   StackBlitz: https://stackblitz.com/github/yoyocubano/luxelectricweb1"
echo ""
echo "=========================================="
echo ""
echo "💡 RECOMENDACIÓN:"
echo "   Usa GitHub Codespaces para desarrollo serio"
echo "   Usa StackBlitz para ediciones rápidas"
echo ""
echo "📖 Guía completa: ~/GUIA_DESARROLLO_NUBE.md"
echo ""
echo "¿Qué quieres abrir?"
echo "1) Welux Events en Codespaces"
echo "2) Welux Events en StackBlitz"
echo "3) Luxelectro en Codespaces"
echo "4) Ver guía completa"
echo "5) Salir"
echo ""
read -p "Selecciona (1-5): " choice

case $choice in
    1)
        echo "🚀 Abriendo Welux Events en GitHub Codespaces..."
        open "https://github.com/codespaces"
        ;;
    2)
        echo "⚡ Abriendo Welux Events en StackBlitz..."
        open "https://stackblitz.com/github/yoyocubano/welux-events"
        ;;
    3)
        echo "🚀 Abriendo Luxelectro en GitHub Codespaces..."
        open "https://github.com/codespaces"
        ;;
    4)
        echo "📖 Abriendo guía..."
        open ~/GUIA_DESARROLLO_NUBE.md
        ;;
    5)
        echo "👋 ¡Hasta luego!"
        ;;
    *)
        echo "❌ Opción inválida"
        ;;
esac
