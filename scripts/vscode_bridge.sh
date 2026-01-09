#!/bin/bash

# 🌉 VSCODE BRIDGE - Tunnel de comunicación bidireccional
# Este script actúa como intermediario entre Antigravity y VS Code

TASK_NAME=$1
OUTPUT_FILE="vscode-response.json"

echo "🔗 Iniciando túnel con VS Code..."
echo "📋 Tarea solicitada: $TASK_NAME"

# Función para ejecutar tareas de VS Code y capturar la salida
execute_vscode_task() {
    local task=$1
    
    # Ejecutar la tarea de VS Code en background
    code --goto .vscode/tasks.json
    
    # Simular la ejecución de la tarea (VS Code lo hará)
    case $task in
        "audit")
            echo "🔍 Ejecutando auditoría de código..."
            cd client && npx eslint src/ --format json --output-file ../audit-results.json
            echo '{"status": "complete", "task": "audit", "output": "audit-results.json"}' > ../$OUTPUT_FILE
            ;;
        "fix")
            echo "🔧 Aplicando correcciones automáticas..."
            cd client && npx eslint src/ --fix
            echo '{"status": "complete", "task": "fix", "message": "Auto-fix applied"}' > ../$OUTPUT_FILE
            ;;
        "build")
            echo "🏗️ Construyendo bundle de producción..."
            cd client && npm run build
            echo '{"status": "complete", "task": "build", "output": "dist/"}' > ../$OUTPUT_FILE
            ;;
        "orchestrator")
            echo "🌍 Validando integridad del proyecto..."
            node scripts/orchestrator.js
            echo '{"status": "complete", "task": "orchestrator"}' > $OUTPUT_FILE
            ;;
        *)
            echo "❌ Tarea desconocida: $task"
            echo '{"status": "error", "message": "Unknown task"}' > $OUTPUT_FILE
            ;;
    esac
}

# Detectar si estamos en modo interactivo o automático
if [ -z "$TASK_NAME" ]; then
    echo "📝 Uso: ./vscode_bridge.sh [audit|fix|build|orchestrator]"
    echo ""
    echo "Tareas disponibles:"
    echo "  audit        - Analizar código con ESLint"
    echo "  fix          - Auto-corregir problemas de ESLint"
    echo "  build        - Construir bundle de producción"
    echo "  orchestrator - Ejecutar verificación completa"
    exit 1
fi

# Ejecutar la tarea
execute_vscode_task $TASK_NAME

echo "✅ Tarea completada. Respuesta en: $OUTPUT_FILE"
cat $OUTPUT_FILE
