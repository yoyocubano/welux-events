# Prompt Maestro para Generar la App de Administración

Copia y pega el siguiente bloque de texto en tu herramienta de IA preferida (ChatGPT, Claude, v0, etc.) o dáselo a un desarrollador para que inicie el proyecto con la arquitectura correcta.

---

### **Prompt para la IA:**

**Rol:**
Actúa como un **Arquitecto de Software Senior y Desarrollador Móvil Experto** especializado en **React Native (Expo)** y ecosistemas **Supabase**.

**Objetivo:**
Crear una aplicación móvil nativa ("Welux Admin App") que sirva como panel de control remoto para el sitio web existente "Welux Events". La app debe conectarse directamente a la base de datos **Supabase** que ya utiliza la web, asegurando una sincronización perfecta en tiempo real.

**Stack Tecnológico:**
1.  **Framework**: React Native con Expo (Managed Workflow) para facilitar el despliegue en iOS/Android.
2.  **Backend/DB**: Supabase (Cliente JS oficial `@supabase/supabase-js`).
3.  **UI Library**: React Native Paper o Tamagui (Estilo Premium/Minimalista).
4.  **Navegación**: React Navigation (Stack & Tab).

**Requisitos Funcionales (Pantallas):**

1.  **Login de Seguridad (Screen 1)**:
    *   No usar email/pass de usuarios.
    *   Usar un campo único para el **"Master Security Code"**.
    *   Validar este código contra la tabla `app_settings` (key: `master_security_code`) en Supabase.

2.  **Dashboard Principal (Screen 2)**:
    *   Resumen visual con tarjetas:
        *   "Leads Totales" (Count de tabla `leads`).
        *   "Estado del Streaming" (Lectura de tabla `app_settings` -> `stream_config`).
        *   Indicadores de salud del sistema (Dummy o ping a Supabase).

3.  **CRM de Leads (Screen 3)**:
    *   Lista scrolleable de clientes (tabla `leads`) ordenados por `created_at` descendente.
    *   Cada tarjeta debe mostrar: Nombre, Tipo de Evento, Fecha.
    *   Al tocar, expandir para ver el mensaje completo y datos de contacto.
    *   Incluir botón para "Llamar" o "Email" usando las APIs nativas del móvil (`Linking`).

4.  **Control de Streaming "Live" (Screen 4)**:
    *   Input de texto para pegar ID de YouTube o URL.
    *   Botón "Actualizar Transmisión".
    *   Al guardar, debe hacer UPDATE en la tabla `app_settings` donde `key = 'stream_config'`.
    *   *Importante*: Esto debe actualizar la web en tiempo real.

5.  **Gestor de Contenidos (Screen 5+)**:
    *   Un menú para seleccionar: Vlog, Jobs, Deals.
    *   CRUD Básico: Lista de items, formulario para Agregar/Editar título y descripción.

**Estilo Visual (UI/UX):**
*   **Tema**: "Lujo Moderno". Fondo blanco/crema (`#FAF8F3`), acentos en Dorado o Negro Profundo.
*   **Tipografía**: Serif para títulos (elegante), Sans-serif para datos.
*   **Animaciones**: Suaves transiciones entre pantallas.

**Instrucciones Paso a Paso para la Generación:**
1.  Dame primero la estructura de carpetas sugerida.
2.  Proporcióname el código para configurar el cliente de Supabase (`lib/supabase.js`) usando variables de entorno.
3.  Genera el `App.js` con la navegación configurada.
4.  Crea la pantalla de `LoginScreen` con la lógica de validación contra Supabase.
5.  Crea la pantalla `LeadsScreen` con el `FlatList` conectado a la base de datos.
6.  Crea la pantalla `StreamingScreen` con la lógica de actualización.

**Nota Crítica:**
El código debe ser robusto. Maneja los estados de carga (`isLoading`) y errores (`alert`). Asume que las tablas ya existen en Supabase.
