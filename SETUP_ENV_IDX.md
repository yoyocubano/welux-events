# 🛠️ Guía Rápida para Configurar tus Claves en IDX

Como Google IDX usa un entorno nuevo cada vez, necesitas crear el archivo `.env` manualmente.

## Paso 1: Crea el archivo
Ejecuta este comando en la terminal de IDX:
```bash
touch .env && code .env
```

## Paso 2: Copia y Pega este contenido
Copia el siguiente bloque y pégalo dentro del archivo `.env` que se acaba de abrir.
**IMPORTANTE:** rellena los espacios vacíos con tus claves reales que tienes en el archivo `MIS_CLAVES_SECRETAS.md`.

```ini
# --- CONFIGURACIÓN DEL CHATBOT Y BACKEND ---

# 1. Inteligencia Artificial (Rebeca AI)
# Copia aquí tu clave de DeepSeek (empieza por sk-...)
DEEPSEEK_API_KEY=

# 2. Base de Datos (Supabase)
# Copia aquí la URL de tu proyecto Supabase
SUPABASE_URL=

# Copia aquí la clave "service_role" (¡Cuidado! Esta es secreta, no la anon pública)
SUPABASE_SERVICE_ROLE_KEY=

# 3. Emails (Resend)
# Copia aquí tu API Key de Resend (empieza por re_...)
RESEND_API_KEY=

# 4. Google (Opcional)
GOOGLE_API_KEY=

# --- CONFIGURACIÓN FRONTEND (Vite) ---
VITE_SUPABASE_URL=https://obijleonxnpsgpmqcdik.supabase.co
# Copia aquí la clave "anon/public" de Supabase (empieza por ey...)
VITE_SUPABASE_ANON_KEY=
```

## Paso 3: Guardar y Reiniciar
1.  Presiona `Ctrl + S` (o `Cmd + S`) para guardar.
2.  Detén el servidor actual (Ctrl + C en la terminal).
3.  Vuelve a iniciarlo:
    ```bash
    npm run dev
    ```

¡Listo! Rebeca debería funcionar ahora.
