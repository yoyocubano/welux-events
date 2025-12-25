#!/bin/bash

# Check if API Key is set
if [ -z "$GOOGLE_API_KEY" ]; then
  echo "Error: GOOGLE_API_KEY is not set."
  echo "Usage: export GOOGLE_API_KEY='your-key' && ./test_gemini_api.sh"
  exit 1
fi

echo "Testing Google Gemini API (gemini-1.5-flash)..."

curl \
  -H 'Content-Type: application/json' \
  -d '{ "contents": [{"parts":[{"text": "Hello, explain briefly what the Wedding Protocol of Luxembourg is, assuming you are The Sage."}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}"
