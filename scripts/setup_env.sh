#!/bin/bash

# WELUX EVENTS - QUICK START ENV SETUP
# Run this to initialize your environment (Agent or Human)

echo "🛠️  Initializing Agentic Environment..."

# 1. Check for GH Auth
if command -v gh &> /dev/null; then
    if gh auth status &> /dev/null; then
        echo "✅ GitHub CLI: Authenticated"
    else
        echo "⚠️  GitHub CLI: Not authenticated. Run 'gh auth login'"
    fi
else
    echo "⚠️  GitHub CLI (gh) not found. Verify dev.nix packages."
fi

# 2. Check for Ripgrep
if command -v rg &> /dev/null; then
    echo "✅ Ripgrep (rg): Installed"
else
    echo "⚠️  Ripgrep (rg) not found."
fi

# 3. Install Dependencies
if [ -d "client" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
else
    echo "❌ Client directory not found!"
fi

# 4. Final Integrity Check
echo "🔍 Running Orchestrator..."
node scripts/orchestrator.js

echo "✨ Environment Ready. Go forth and build."
