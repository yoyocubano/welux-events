# Hoja de Ruta: Transformando a "Rebeca AI" en una Experiencia de Chat tipo WhatsApp

## Introducción

Este documento es una guía estratégica para implementar funcionalidades avanzadas en nuestro chatbot "Rebeca AI". Las características aquí descritas están inspiradas en las soluciones de experiencia de usuario que hacen de WhatsApp una plataforma de mensajería fluida, intuitiva e inigualable.

El objetivo es elevar la interacción con "Rebeca AI" a un nuevo estándar, aumentando la satisfacción del usuario y la sensación de estar manteniendo una conversación natural y humana. Cada funcionalidad se presenta con su descripción y un plan de implementación técnico.

---

## I. Funcionalidades Clave de Experiencia de Usuario

### 1. Indicadores de Presencia en Tiempo Real ("Escribiendo...")

-   **Descripción:** Muestra una notificación visual (`Rebeca está escribiendo...`) mientras la IA está procesando y generando una respuesta. Esto reduce la incertidumbre del usuario, confirma que su mensaje ha sido recibido y gestiona las expectativas de tiempo de respuesta.
-   **Plan de Implementación:**
    1.  **Frontend:** Utilizar el estado `isLoading` que ya existe en el componente `AIChatBox`.
    2.  **UI:** Cuando `isLoading` sea `true`, renderizar un componente específico que imite un bocadillo de chat con el avatar de la IA, una animación (spinner o puntos pulsantes) y el texto indicador.
    3.  **Real-time (Avanzado):** Para una precisión total, la API podría devolver un evento inicial de "procesando" y luego transmitir la respuesta final. Esto requeriría una infraestructura de WebSockets.

### 2. Confirmación de Estado del Mensaje (Doble Check)

-   **Descripción:** Proporcionar al usuario una confirmación visual del estado de su mensaje: enviado (`✓`), recibido por el servidor (`✓✓`), y procesado por la IA (podría ser un `✓✓` azul).
-   **Plan de Implementación:**
    1.  **Backend:** La API de envío de mensajes debe devolver estados claros. Por ejemplo, una respuesta `202 Accepted` al recibir el mensaje y, si se usan WebSockets, un evento de "procesado" posterior.
    2.  **Frontend:** En el objeto de cada mensaje del usuario, añadir una propiedad `status` (`sending`, `sent`, `delivered`, `read`).
    3.  **UI:** Renderizar diferentes iconos junto a la hora del mensaje basados en esta propiedad `status`. Actualizar el estado del mensaje cuando se reciba la confirmación del backend.

### 3. Respuestas Contextuales (Reply)

-   **Descripción:** Permitir al usuario seleccionar un mensaje específico (suyo o de la IA) y responder directamente a él. La respuesta se muestra con un pequeño extracto del mensaje original, manteniendo el contexto.
-   **Plan de Implementación:**
    1.  **UI:** Al pasar el ratón sobre un mensaje, mostrar un botón de "responder".
    2.  **Frontend:** Al hacer clic, se almacena el mensaje a responder en el estado de la aplicación. Mostrar una vista previa del mensaje citado encima del área de texto.
    3.  **API:** Al enviar el mensaje, incluir un objeto `quotedMessage` con el ID y contenido del mensaje original. La IA debe ser instruida (a través del prompt del sistema) para que entienda y utilice este contexto en su respuesta.

### 4. Reacciones a Mensajes (Emojis)

-   **Descripción:** Permitir al usuario reaccionar a los mensajes de la IA con un conjunto de emojis (👍, ❤️, 😂, 👎). Esto ofrece una forma rápida de dar feedback sin escribir.
-   **Plan de Implementación:**
    1.  **UI:** Al pasar el ratón sobre un mensaje de la IA, mostrar un pequeño menú de emojis.
    2.  **Frontend:** Al hacer clic en un emoji, la reacción se guarda localmente. Se podría enviar esta información al backend para análisis de sentimientos o satisfacción del usuario.
    3.  **Backend (Opcional):** Crear un endpoint para registrar las reacciones a los mensajes, asociándolas con el ID del mensaje.

### 5. Scroll Infinito con Virtualización

-   **Descripción:** Asegurar que el chat funcione de manera fluida incluso con cientos o miles de mensajes. En lugar de renderizar todos los mensajes a la vez, solo se renderizan los que son visibles en la pantalla.
-   **Plan de Implementación:**
    1.  **Librería:** Integrar una librería de virtualización como `react-window` o `react-virtualized`.
    2.  **Frontend:** Envolver la lista de mensajes con el componente de virtualización. Este se encargará de calcular qué "items" (mensajes) deben estar en el DOM en cada momento, manteniendo un rendimiento óptimo.

### 6. Persistencia del Chat Local (Historial)

-   **Descripción:** Guardar el historial de la conversación en el navegador. Si el usuario recarga la página, el chat no se pierde.
-   **Plan de Implementación:**
    1.  **Frontend:** Utilizar `localStorage` del navegador.
    2.  **Lógica:** Cada vez que el array `messages` se actualice (al enviar o recibir un mensaje), guardar la versión más reciente en `localStorage` como una cadena JSON (`JSON.stringify`).
    3.  **Inicialización:** Al cargar el componente de chat, comprobar si existe un historial en `localStorage`. Si es así, cargarlo y usarlo como estado inicial (`JSON.parse`).

### 7. Mensajes de Voz

-   **Descripción:** Añadir un botón de micrófono que permita al usuario grabar un mensaje de voz, que se transcribe a texto y se envía al chatbot.
-   **Plan de Implementación:**
    1.  **Frontend (Captura):** Usar la `MediaRecorder` API del navegador para grabar audio desde el micrófono.
    2.  **Backend (Transcripción):** Enviar el archivo de audio (blob) a un nuevo endpoint. Este endpoint usará un servicio de transcripción de voz a texto (como Google Speech-to-Text, OpenAI Whisper).
    3.  **Flujo:** Una vez transcrito, el texto se envía al endpoint principal de la IA como si el usuario lo hubiera escrito.

### 8. Compartir Multimedia y Archivos

-   **Descripción:** Permitir a los usuarios subir imágenes o documentos. La IA podría analizar el contenido (si es una imagen) o simplemente confirmar la recepción.
-   **Plan de Implementación:**
    1.  **UI:** Añadir un botón de "adjuntar" (`<input type="file">`).
    2.  **Backend (Almacenamiento):** Subir el archivo a un servicio de almacenamiento en la nube (como Cloudinary o AWS S3).
    3.  **API:** Enviar la URL del archivo subido a la IA. Para el análisis de imágenes (Visión), se necesitaría un modelo multimodal como Gemini Pro Vision.

### 9. Búsqueda Rápida en el Chat

-   **Descripción:** Añadir una barra de búsqueda que permita al usuario encontrar rápidamente mensajes pasados que contengan una palabra o frase específica.
-   **Plan de Implementación:**
    1.  **UI:** Añadir un icono de búsqueda que revele un campo de texto.
    2.  **Frontend:** Implementar la lógica de búsqueda en el cliente. Al escribir en el campo, filtrar el array `messages` para mostrar solo aquellos que coincidan. Se puede resaltar el texto coincidente. Para historiales muy largos, la búsqueda podría delegarse a un backend.

### 10. Notificaciones Interactivas

-   **Descripción:** Si la pestaña del chat está en segundo plano, el usuario recibe una notificación del sistema cuando la IA responde. Estas notificaciones pueden incluir botones de respuesta rápida.
-   **Plan de Implementación:**
    1.  **Service Workers:** Implementar un Service Worker para gestionar la lógica de las notificaciones push.
    2.  **Push API:** Usar la Push API del navegador para mostrar notificaciones. Esto requiere que el usuario otorgue permiso.
    3.  **Backend:** El servidor necesitaría un servicio de notificaciones (como Firebase Cloud Messaging) para "despertar" al Service Worker y enviarle el contenido de la notificación.

---

## II. Funcionalidades Avanzadas de Escritura

### 11. Edición de Mensajes Enviados

-   **Descripción:** Permitir al usuario corregir un mensaje después de haberlo enviado.
-   **Plan de Implementación:** No es muy aplicable a un chatbot, ya que la IA responde instantáneamente. Sin embargo, si se implementara, requeriría que la IA pudiera manejar una "corrección" de un turno anterior.

### 12. Formato de Texto (Negrita, Cursiva, etc.)

-   **Descripción:** Permitir que tanto el usuario como la IA usen Markdown simple (`*negrita*`, `_cursiva_`, \`\`\`código\`\`\`, `- listas`) para dar formato a los mensajes.
-   **Plan de Implementación:**
    1.  **Frontend:** Usar una librería como `react-markdown` o `marked` para renderizar el contenido de los mensajes. Esto convierte el texto Markdown a HTML seguro. `Streamdown`, que ya usamos, soporta esto.
    2.  **IA:** Asegurarse de que la IA esté instruida para usar Markdown en sus respuestas para mejorar la legibilidad.

### 13. "Eliminar para todos"

-   **Descripción:** Permitir al usuario eliminar un mensaje que envió.
-   **Plan de Implementación:**
    1.  **Frontend:** El mensaje se elimina del estado local.
    2.  **API:** Se envía una solicitud al backend para invalidar ese turno de la conversación, de modo que la IA no lo use en el contexto futuro. El mensaje se podría marcar como `deleted: true`.

### 14. Sugerencias de Emojis y GIFs

-   **Descripción:** Mientras el usuario escribe, sugerir emojis o GIFs relevantes.
-   **Plan de Implementación:**
    1.  **UI:** Integrar un selector de emojis/GIFs en el área de entrada.
    2.  **API (GIFs):** Usar la API de servicios como Giphy para buscar GIFs basados en lo que el usuario escribe.

### 15. Borradores de Mensajes (Drafts)

-   **Descripción:** Si un usuario empieza a escribir un mensaje y se va, el texto permanece en el campo de entrada para cuando regrese.
-   **Plan de Implementación:**
    1.  **Frontend:** Similar a la persistencia del chat, pero para el campo de texto.
    2.  **Lógica:** Usar `localStorage` o `sessionStorage` para guardar el contenido del `input` cada vez que cambia. Al cargar el componente, rellenar el `input` con el borrador guardado.

### 16. Menciones con "@"

-   **Descripción:** En un chat grupal, usar `@` para notificar a alguien.
-   **Plan de Implementación:** No es directamente aplicable a un chat 1-a-1 con una IA, pero el concepto podría adaptarse para invocar "habilidades" o "personalidades" especiales de la IA (ej: `@Rebeca modo-experto`).

### 17. Corrector Ortográfico y Autocorrección

-   **Descripción:** Asistir al usuario con la ortografía.
-   **Plan de Implementación:**
    1.  **Nativo:** Aprovechar el atributo `spellCheck="true"` en el `<textarea>`, que utiliza el corrector ortográfico nativo del navegador/SO. Esta es la solución más simple y efectiva.
    2.  **Avanzado:** Integrar una librería de JavaScript para sugerencias más avanzadas si fuera necesario.
