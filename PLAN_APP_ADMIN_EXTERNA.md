# Plan de Arquitectura: App Externa de Administración (Welux Events)

Este documento detalla la estructura y pautas para desarrollar una **App Nativa/Externa** que controle el sitio web de Welux Events.

## ⚠️ Nota Crítica de Integración
**Estado Actual**: Tu web (`weluxevents.com`) funciona con **Supabase** (Base de datos y Auth).
**Tu Solicitud**: Usar **Firebase** y Stitch.

### El Reto de la Vinculación
Para que la app sea "perfectamente vinculable" (es decir, que si cambias algo en la App, aparezca en la Web al instante), la App **debe hablar con la misma base de datos que la Web**.

Si usas Firebase para la App, tendrás dos bases de datos separadas (Supabase vs Firebase).
**Recomendación de Oro**: Aunque uses herramientas de construcción móvil, **conecta la App directamente a Supabase**. Supabase tiene SDKs excelentes para iOS, Android, Flutter y React Native. Esto garantiza sincronización en tiempo real sin escribir código de sincronización complejo.

---

## 1. Estructura del Proyecto (App Móvil)

Independientemente de la tecnología (Swift, Flutter, React Native), organiza tu código así para reflejar el panel web:

```text
/src
  /api
    - supabaseClient.js  (¡Vital! Tu puente con la Web)
    - authService.js     (Gestión de sesiones)
  
  /components
    /Shared              (Botones, Cards, Inputs estilo "Welux")
    /Dashboard
      - StatCard.js      (Para métricas rápidas)
      - StatusBadge.js   (Online/Offline indicadores)

  /screens
    - LoginScreen.js     (Debe usar el mismo "Master Code" que la web)
    - HomeScreen.js      (Resumen: Leads hoy, Estado del sistema)
    - LeadsScreen.js     (Lista de clientes CRM)
    - StreamingScreen.js (Control remoto de TV/YouTube)
    - ContentScreen.js   (Selector: Vlog, Jobs, Deals)
    - SecurityScreen.js  (Botón de pánico / Cambio de pass)

  /utils
    - formatters.js      (Formateo de fechas y moneda)
    - constants.js       (IDs de categorías)
```

## 2. Pautas de Desarrollo (Guidelines)

### A. Autenticación Unificada
*   **No crees usuarios nuevos en Firebase** si no es necesario.
*   Usa el mismo **"Master Security Code"** que ya definiste en la web (`lux_master_2026`).
*   La App debe enviar este código al endpoint `/api/verify-admin` o validarlo contra la tabla `app_settings` de Supabase.

### B. Gestión de Datos (El "Espejo")
La App no debe tener datos propios; debe ser un "espejo" de la Web.
1.  **Lectura**: Al abrir `LeadsScreen`, la App hace un `supabase.from('leads').select('*')`.
2.  **Escritura**: Al editar un "Deal" en la App, hace `supabase.from('content_items').update(...)`.
*Resultado*: El usuario en la web ve el cambio en milisegundos.

### C. Módulo de Streaming (Control Remoto)
*   **Función**: Convierte tu móvil en un control remoto para la sección "Live" de la web.
*   **Acción**: Un input en la App para pegar el Link de YouTube.
*   **Backend**: Al guardar, la App actualiza la tabla `app_settings` -> `stream_config`.
*   **Efecto Web**: La web detecta el cambio en tiempo real y actualiza el reproductor automáticamente.

### D. Notificaciones Push (Mejora Móvil)
Esta es la gran ventaja de tener una App.
*   Configura un **Webhook** en Supabase.
*   Cuando entre un nuevo Lead (INSERT en tabla `leads`), Supabase dispara una función.
*   Esa función envía una notificación a tu App: *"¡Nuevo cliente para Boda! (Juan Pérez)"*.

## 3. Seguridad
*   **Reglas RLS (Row Level Security)**: Asegúrate de que, aunque la App tenga las claves, solo permita escribir si el usuario se ha autenticado con el Código Maestro.
*   **Nunca guardes el Master Code en texto plano** en el código fuente de la App.

---
*Este plan asegura que tu App no sea una isla aislada, sino el centro de comando real de tu ecosistema Welux.*
