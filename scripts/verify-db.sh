#!/bin/bash

echo "🔍 Verificando estado de la base de datos D1 (Cloudflare)..."
echo "---------------------------------------------------------"

# 1. Listar tablas para confirmar que 'leads' existe
echo "📋 Listando tablas en 'welux-events-db'..."
npx wrangler d1 list-tables welux-events-db --remote

echo "---------------------------------------------------------"
echo "✅ Si ves 'leads' en la lista de arriba, ¡todo está correcto!"
echo "🚀 Si no, ejecuta: npm run db:setup"
