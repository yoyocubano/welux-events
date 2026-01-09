#!/bin/bash

# Protocolo de Liberación Agéntica 2026
# Este script propaga los 'superpoderes' de Welux Events a otros proyectos hermanos.

TARGETS=("../nuevaappadmin" "../welux-admin-app" "../luxelectro web" "../../akamara_sarl")

echo "🚀 Iniciando Protocolo de Inyección Agéntica en proyectos hermanos..."

for target in "${TARGETS[@]}"; do
    if [ -d "$target" ]; then
        echo "⚡️ Inyectando en: $target"
        
        # Crear estructura
        mkdir -p "$target/.agent"
        mkdir -p "$target/scripts"
        mkdir -p "$target/.vscode"
        mkdir -p "$target/.idx"
        
        # Copiar ADN (Cerebro base y Manifiesto)
        cp -R .agent/knowledge "$target/.agent/"
        cp -R .agent/resources "$target/.agent/"
        cp .agent/BRAIN.md "$target/.agent/BRAIN.md"
        cp .agent/OMNI_CONTEXT.md "$target/.agent/OMNI_CONTEXT.md"
        cp .cursorrules "$target/.cursorrules"
        
        # Copiar Músculos (Orquestador)
        cp scripts/orchestrator.js "$target/scripts/orchestrator.js"
        
        # Configurar VS Code
        cp .vscode/extensions.json "$target/.vscode/extensions.json"
        cp .vscode/settings.json "$target/.vscode/settings.json"
        
        # Configurar IDX (Google IDE)
        cp .idx/dev.nix "$target/.idx/dev.nix"
        
        echo "✅ Proyecto $target ha sido dotado de superpoderes."
    else
        echo "⏭️  Saltando $target (Directorio no encontrado)."
    fi
done

echo "⚙️  Propagación completada. Todos tus 'colegas' ahora comparten el mismo nivel de inteligencia."
