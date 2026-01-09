#!/bin/bash
# Script de optimización post-reinicio para Mac
# Ejecutar después de reiniciar para mantener el sistema optimizado

echo "🚀 Iniciando optimización del sistema..."

# 1. Desactivar Spotlight en carpetas de desarrollo
echo "📁 Desactivando indexación de Spotlight en carpetas de desarrollo..."
sudo mdutil -i off ~/Desktop 2>/dev/null

# 2. Limpiar cachés de sistema
echo "🧹 Limpiando cachés del sistema..."
sudo purge

# 3. Verificar uso de memoria
echo "💾 Estado de memoria:"
vm_stat | head -10

# 4. Procesos más pesados
echo "⚡ Top 5 procesos por CPU:"
ps aux | sort -rk 3,3 | head -6

echo "📊 Top 5 procesos por RAM:"
ps aux | sort -rk 4,4 | head -6

# 5. Espacio en disco
echo "💿 Espacio en disco:"
df -h / | tail -1

echo ""
echo "✅ Optimización completada!"
echo ""
echo "📝 Recomendaciones:"
echo "  - Abre solo 1 proyecto a la vez en Antigravity"
echo "  - Ejecuta 'npm run dev' solo cuando lo necesites"
echo "  - Cierra Chrome cuando no lo uses"
echo "  - Monitorea memoria con: watch -n 2 'vm_stat | head -10'"
echo ""
