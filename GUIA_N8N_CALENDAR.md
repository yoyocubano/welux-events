# 📅 Guía de Integración: Google Calendar con n8n

Esta guía te permitirá crear automáticamente eventos en tu Google Calendar cada vez que alguien rellene el formulario de Contacto en la web, usando tu infraestructura actual de n8n.

---

## 🚀 Resumen del Flujo de Datos
1.  **Web (Contact.tsx)**: Usuario envía formulario con fecha (`eventDate`).
2.  **Backend (capture.ts)**: Recibe datos y envía Webhook JSON a n8n.
3.  **n8n (Tu Servidor)**: Recibe Webhook -> **Crea Evento en Calendar**.

---

## 🛠️ Paso 1: Preparar Credenciales de Google (Si no las tienes)

Para que n8n escriba en tu calendario, necesitas credenciales de OAuth2.

1.  Ve a [Google Cloud Console](https://console.cloud.google.com/).
2.  Asegúrate de que la **Google Calendar API** esté habilitada en tu proyecto.
3.  En **APIs & Services > Credentials**:
    *   Crea una credencial **OAuth 2.0 Client ID**.
    *   **Redirect URI** (Muy Importante): Copia la URL que te da n8n cuando creas una credencial de Google Calendar (suele ser `https://oauth.n8n.io/v2/scopes` o tu dominio propio si tienes n8n personalizado).
4.  Copia el **Client ID** y **Client Secret**.

---

## ⚙️ Paso 2: Configurar n8n

### 1. Nodo Webhook (Existente o Nuevo)
Usa el mismo nodo Webhook que ya tienes para notificaciones, o crea uno nuevo si prefieres separar lógicas.
*   **Method**: `POST`
*   **Path**: `/webhook/form-notification` (o el que estés usando).

### 2. Nodo Google Calendar
Añade un nodo **Google Calendar** después del Webhook.

*   **Action**: `Create an Event`
*   **Calendar**: Selecciona tu calendario principal (o pon el ID de uno específico).
*   **Start Time**: Arrastra el campo `eventDate` del JSON del Webhook.
    *   *Truco*: El formulario envía solo fecha (YYYY-MM-DD). Google pide fecha y hora. Usa una expresión en n8n:
        ```javascript
        {{ $json.eventDate }}T09:00:00
        ```
        (Esto creará el evento a las 9:00 AM del día solicitado).
*   **End Time**:
    ```javascript
    {{ $json.eventDate }}T10:00:00
    ```
*   **Summary (Título)**:
    ```javascript
    Inquiry: {{ $json.eventType }} - {{ $json.name }}
    ```
*   **Description**:
    ```javascript
    Cliente: {{ $json.name }}
    Email: {{ $json.email }}
    Tel: {{ $json.phone }}
    
    Mensaje:
    {{ $json.message }}
    ```

---

## 🧪 Paso 3: Test Real

1.  En n8n, haz clic en **"Execute Workflow"** (para escuchar).
2.  Ve a tu web (localhost o producción) -> Página de **Contacto**.
3.  Rellena el formulario seleccionando una **Fecha de Evento**.
4.  Envía el formulario.
5.  **Verifica**:
    *   ¿Apareció el JSON en n8n?
    *   ¿Se creó el evento en tu Google Calendar a las 9:00 AM de la fecha elegida?

---

## ⚠️ Nota sobre Fechas
El formulario web valida que la fecha sea futura. Si un usuario selecciona una fecha pasada (hackeando el form), Google Calendar podría rechazarla o crearla en el pasado. El código actual del frontend ya protege contra esto.
