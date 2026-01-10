# Jobs Aggregator Lux 🇱🇺

Este sistema automatiza la recolección de ofertas de trabajo en Luxemburgo desde fuentes públicas y privadas.

## Contenido del Paquete
- `jobs-aggregator.js`: Agregador principal (Público: ADEM Open Data, EURES, Randstad).
- `private-tunnel.js`: Script de autenticación y extracción del portal privado de ADEM (4,000+ ofertas).
- `browser-bridge.js`: Puente de sincronización para datos extraídos mediante navegador.
- `PORTABLE_AGGREGATOR.js`: Versión simplificada y autocontenida para otros entornos.

## Configuración
Crea un archivo `.env` en la raíz con:
```env
SUPABASE_URL=tu_url
SUPABASE_SERVICE_ROLE_KEY=tu_key
ADEM_USER=tu_email
ADEM_PASS=tu_password
```

## Guías para IA
- `AI_TEACHER.md`: Guía técnica de arquitectura.
- `BOOTSTRAP_AI.md`: Prompt de inicio rápido para nuevas instancias de IA.

## Uso
Para una sincronización completa:
1. Asegúrate de tener las dependencias: `npm install` en esta carpeta.
2. Ejecuta `node jobs-aggregator.js`.
3. Para ofertas privadas, usa el flujo del `browser-bridge`.
