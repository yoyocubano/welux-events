#!/bin/bash

echo "Enviando email de prueba 'Juan 3' a yoyocubano@gmail.com..."

response=$(curl -s -w "\n%{http_code}" -X POST https://weluxevents.com/api/debug-integrations \
  -H "Content-Type: application/json" \
  -d '{
    "test_email_recipient": "yoyocubano@gmail.com",
    "test_name": "Juan 3"
  }')

http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

echo ""
echo "HTTP Status: $http_code"
echo "Response:"
echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
echo ""

if [ "$http_code" = "200" ]; then
    echo "✅ Email enviado exitosamente!"
else
    echo "❌ Error al enviar email"
fi
