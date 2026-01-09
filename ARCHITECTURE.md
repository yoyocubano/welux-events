# Arquitectura del Backend y Flujo de Datos

Este documento describe la arquitectura del backend de la aplicación, centrándose en el flujo de captura de leads y las integraciones con servicios de terceros.

---

## 1. `CaptureService`: El Núcleo de la Lógica de Negocio

La pieza central de nuestra arquitectura es el `CaptureService`, ubicado en `functions/services/capture.ts`.

### Responsabilidades:

- **Centralizar la Captura de Datos**: Este servicio es el único responsable de recibir los datos de un lead y distribuirlos a todos los destinos configurados.
- **Orquestar Integraciones**: Gestiona el guardado de datos en múltiples sistemas de forma concurrente.
- **Manejo de Errores Resiliente**: Utiliza `Promise.allSettled` para asegurar que el fallo de una integración (por ejemplo, Google Sheets) no impida que las demás (D1, Supabase, etc.) tengan éxito. Cada fallo se registra de forma individual.

### Destinos de Datos Soportados:

1.  **Cloudflare D1**: Nuestra base de datos primaria para consultas rápidas.
2.  **Supabase**: Una base de datos PostgreSQL robusta que actúa como backup y para analíticas más complejas.
3.  **Google Sheets**: Para un acceso y visualización sencillos por parte del equipo no técnico.
4.  **Resend (Email)**: Envía una notificación por email al equipo de ventas de forma inmediata para cada nuevo lead capturado.

---

## 2. Flujo de Datos de un Lead

Independientemente del origen, todos los leads siguen este flujo estandarizado:

1.  **Punto de Entrada (Endpoint)**:
    -   **Formulario Web**: El endpoint `functions/api/submit-inquiry.ts` recibe los datos del formulario de contacto.
    -   **Chat (Futuro)**: El endpoint `functions/api/chat.ts` procesará los mensajes del chat.

2.  **Validación y Mapeo**:
    -   El endpoint de entrada valida los datos recibidos (usando `zod` para el formulario).
    -   Mapea los datos a la interfaz `LeadData`, un formato estandarizado que el `CaptureService` entiende.
    -   Se añade una `source` ('Form Inquiry', 'Chat Lead', etc.) para identificar el origen.

3.  **Ejecución Asíncrona con `waitUntil`**:
    -   El endpoint invoca a `captureService.captureLead(lead)` dentro de `context.waitUntil()`.
    -   Esto permite devolver una respuesta de éxito inmediata al usuario (mejorando la UX) mientras el proceso de guardado se ejecuta en segundo plano.

4.  **Distribución en `CaptureService`**:
    -   `captureLead` lanza simultáneamente las operaciones de guardado en D1, Supabase, Google Sheets y el envío de email con Resend.

---

## 3. Herramienta de Diagnóstico: `debug-integrations`

Para facilitar el mantenimiento y la depuración, se ha creado un endpoint de diagnóstico.

-   **URL**: `/api/debug-integrations`
-   **Método**: `GET`

### Funcionalidad:

Al acceder a esta URL, el sistema ejecuta una serie de pruebas de solo lectura para verificar el estado de cada integración externa:

-   **Supabase**: Intenta conectar y realizar una consulta simple (`select`).
-   **Google Sheets**: Intenta autenticar y añadir una fila de prueba identificada como 'Health Check'.
-   **Resend (Email)**: Intenta enviar un email de prueba a una dirección predefinida.

El resultado es un informe en formato JSON que muestra el estado (`PASS`, `FAIL`, `SKIPPED`) de cada servicio, con detalles sobre cualquier error encontrado. Esto permite diagnosticar rápidamente problemas con variables de entorno, permisos o conectividad de red.