# INFORME DE TAREA 01: CONFIGURACIÓN INICIAL Y CREDENCIALES
## Asignado a: Junior Developer A (Infraestructura)

**Objetivo**: Establecer la conexión segura entre la App Móvil y el Backend existente (Supabase).

### Descripción Detallada:
El arquitecto ha creado la estructura base en `welux-admin-app/`. Tu misión es inyectar las credenciales reales para que la aplicación pueda "hablar" con la base de datos de producción.

### Pasos a Ejecutar:
1.  **Localizar Credenciales**:
    *   Ve al archivo `.env` o `functions/wrangler.toml` del proyecto web principal (`weluxevents/`).
    *   Copia la `SUPABASE_URL` y la `SUPABASE_ANON_KEY`.
2.  **Editar Archivo de Servicio**:
    *   Abre el archivo: `welux-admin-app/src/services/supabase.js`.
    *   En las líneas 7 y 8, encontrarás marcadores de posición ("REEMPLAZAR_CON...").
    *   Reemplázalos por los valores reales copiados en el paso 1.
3.  **Instalación de Dependencias**:
    *   Abre la terminal en la carpeta `welux-admin-app/`.
    *   Ejecuta el comando: `npm install`.
4.  **Verificación**:
    *   Ejecuta `npx expo start`.
    *   Confirma que la app inicia sin errores rojos en la consola.

---
**Idioma del Código**: JavaScript (React Native)
**Entrega Esperada**: Captura de pantalla de la terminal mostrando "Metro bundler started" y el archivo `supabase.js` con las claves pegadas correctamente.
