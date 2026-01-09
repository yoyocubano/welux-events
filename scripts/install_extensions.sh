#!/bin/bash

# Welux Events - VS Code Extensions Installer
# This script installs useful extensions for the project.

echo "🚀 Installing Recommended VS Code Extensions..."

# Check if 'code' command is available
if ! command -v code &> /dev/null; then
    echo "❌ 'code' command not found. Please install VS Code CLI."
    echo "   (Open VS Code -> Cmd+Shift+P -> 'Shell Command: Install 'code' command in PATH')"
    exit 1
fi

extensions=(
    "dsznajder.es7-react-js-snippets" # React Snippets
    "bradlc.vscode-tailwindcss"       # Tailwind CSS
    "esbenp.prettier-vscode"          # Prettier
    "dbaeumer.vscode-eslint"          # ESLint
    "lokalise.i18n-ally"              # i18n Ally (Translations)
    "github.vscode-github-actions"    # GitHub Actions
    "yoavbls.pretty-ts-errors"        # Better TS Errors
    "tamasfe.even-better-toml"        # TOML support (for wrangler.toml)
)

for ext in "${extensions[@]}"; do
    echo "Installing $ext..."
    code --install-extension "$ext" --force
done

echo "✅ All extensions installed! Please restart VS Code."
