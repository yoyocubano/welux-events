#!/bin/bash

# Load secrets from a local .env file if it exists (for local use)
if [ -f .env ]; then
  export $(cat .env | xargs)
fi

# Check for required variables
if [ -z "$CLOUDFLARE_ZONE_ID" ] || [ -z "$CLOUDFLARE_API_TOKEN" ]; then
  echo "❌ Error: Missing CLOUDFLARE_ZONE_ID or CLOUDFLARE_API_TOKEN."
  echo "Usage: CLOUDFLARE_ZONE_ID=... CLOUDFLARE_API_TOKEN=... ./purge-cache.sh"
  exit 1
fi

echo "🧹 Purging Cloudflare Cache for Zone ID: $CLOUDFLARE_ZONE_ID..."

response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
     -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}')

success=$(echo $response | grep '"success":true')

if [ -n "$success" ]; then
  echo "✅ Cache Purged Successfully!"
else
  echo "❌ Failed to Purge Cache."
  echo "Response: $response"
  exit 1
fi
