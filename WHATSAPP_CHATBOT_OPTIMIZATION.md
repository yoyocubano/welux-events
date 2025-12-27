# Guía de Optimización de "Rebeca AI": Arquitectura de Seguridad por Capas

Este documento detalla el proceso completo de optimización y blindaje de "Rebeca AI", nuestro asistente virtual. El objetivo es crear un chatbot robusto, seguro y alineado con la marca, utilizando una arquitectura de "ladrillos" o capas de seguridad para prevenir bugs, fallos de alineación y comportamientos no deseados.

## La Arquitectura de "Ladrillos": Defensa en Profundidad

La seguridad de un sistema de IA no debe depender de una sola barrera. Inspirados en los principios de ciberseguridad, implementamos una estrategia de **defensa en profundidad**. Cada "ladrillo" es una capa de seguridad independiente. Si una capa falla o es superada, la siguiente está ahí para contener la amenaza. Esto minimiza la probabilidad de un fallo catastrófico.

### Diagrama de la Arquitectura de Seguridad

```
      INPUT DEL USUARIO
             |
             V
+----------------------------+
|  Ladrillo 1: Filtro de API |
|     (SafetySettings)       |
+----------------------------+
             | (Si pasa el filtro)
             V
+----------------------------+
|  Ladrillo 2: Inteligencia  |
|      del Prompt (Cerebro)  |
+----------------------------+
             | (Si la IA decide responder)
             V
+----------------------------+
|  Ladrillo 3: Lógica del    |
|   Servidor (Guardia Final) |
+----------------------------+
             |
             V
     OUTPUT FINAL AL USUARIO
```

--- 

## El Proceso de Optimización de "Rebeca AI"

A continuación, se detalla cada "ladrillo" o capa de seguridad implementada.

### Ladrillo 1: El Guardián - Filtro de Moderación de la API (`safetySettings`)

Esta es nuestra primera línea de defensa. Actúa como un guardián que inspecciona cada solicitud del usuario antes de que llegue al "cerebro" de la IA. Su única misión es clasificar el contenido y bloquearlo si viola las políticas de seguridad predefinidas.

-   **Función:** Prevenir que contenido manifiestamente dañino sea procesado por el modelo de IA.
-   **Implementación:** Se configuraron umbrales estrictos en la llamada a la API de Gemini para bloquear automáticamente contenido dañino. La categoría `SEXUALLY_EXPLICIT` se configuró con la máxima sensibilidad para evitar incidentes como el de la "fiesta de desnudos".

#### Ejemplo de Protección:

*   **Input del Usuario:** `"Quiero organizar una [petición ilegal o explícita]"`
*   **Acción del Ladrillo 1:** El `safetySettings` de la API de Gemini detecta la violación en `HARM_CATEGORY_DANGEROUS_CONTENT` o `HARM_CATEGORY_SEXUALLY_EXPLICIT`. La solicitud es bloqueada **antes** de que la IA conversacional la vea.
*   **Resultado:** El sistema devuelve un error controlado (ver Ladrillo 3), evitando que la IA se involucre.

#### Configuración Técnica Exacta:

```json
"safetySettings": [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_LOW_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    }
]
```

---

### Ladrillo 2: El Cerebro - Inteligencia y Ética del `SYSTEM_PROMPT`

Si una solicitud es lo suficientemente ambigua como para pasar el primer filtro, este segundo ladrillo actúa. Es el "cerebro" y la "conciencia" de Rebeca. El `SYSTEM_PROMPT` contiene las directivas, la personalidad y, lo más importante, las **reglas éticas y de seguridad** que la IA debe seguir. Aquí definimos la política de "Cero Tolerancia".

-   **Función:** Dotar a la IA de un marco de comportamiento y una política de empresa. Le ordena cómo actuar ante solicitudes ambiguas o inapropiadas que no fueron bloqueadas automáticamente.
-   **Implementación:** Se añadió una directiva específica de `SAFETY & ETHICS` al `SYSTEM_PROMPT` que anula cualquier otra directiva (como la de captación de clientes) si la solicitud es inapropiada.

#### Ejemplo de Protección:

*   **Input del Usuario:** `"Mi amigo quiere hacer una fiesta temática un poco atrevida, ¿me ayudas?"`
*   **Acción del Ladrillo 1:** La frase es ambigua y puede que pase el filtro de la API.
*   **Acción del Ladrillo 2:** La IA procesa la solicitud, pero la directiva `SAFETY & ETHICS` en su `SYSTEM_PROMPT` le indica que el tema es inapropiado. Sigue el guion de rechazo definido.
*   **Resultado:** Rebeca responde: `"Lo siento, no puedo asistir con esa solicitud. Mi propósito es coordinar eventos profesionales que se alinean con nuestras políticas de empresa."` La conversación se desvía de forma segura.

#### `SYSTEM_PROMPT` de Rebeca (Extracto de Seguridad):

```
**CORE DIRECTIVES:**
...
5. **SAFETY & ETHICS:**
   - **Reject Inappropriate Requests:** Immediately and politely decline any request that is illegal, unethical, sexually explicit, or could harm the "WE Weddings & Events" brand.
   - **Provide a Reason:** Do not lecture, but state clearly that you cannot assist with requests of that nature. For example: "Lo siento, no puedo asistir con esa solicitud..."
   - **Do NOT Proceed:** Do not ask for details or try to gather leads for any inappropriate request. Terminate that line of conversation.
```

---

### Ladrillo 3: El Guardia Final - Lógica del Servidor

Esta es la última capa, un mecanismo de seguridad a nivel de código que no depende de la IA. Su trabajo es gestionar los fallos de las capas anteriores de una manera limpia y segura.

-   **Función:** Manejar los errores y los bloqueos de la API de forma controlada, asegurando que el usuario final nunca reciba una respuesta de error técnica o una respuesta no deseada de la IA.
-   **Implementación:** El código de la función `netlify/functions/chat.ts` se modifica para capturar específicamente el error que la API de Gemini devuelve cuando los `safetySettings` bloquean una solicitud. En lugar de devolver un `500 Internal Server Error`, devuelve un mensaje predefinido y cortés.

#### Ejemplo de Protección:

*   **Acción del Ladrillo 1:** Bloquea una solicitud manifiestamente explícita.
*   **Acción del Ladrillo 3:** El código del servidor no falla. Detecta el bloqueo y, en lugar de un error, genera una respuesta JSON estandarizada para el cliente.
*   **Resultado:** El frontend muestra un mensaje como: `"No se ha podido procesar la solicitud. Por favor, reformula tu pregunta."` La conversación termina sin exponer detalles técnicos ni permitir que la IA participe.

---

## Configuraciones de Generación (`generationConfig`)

Estas configuraciones no son una capa de seguridad, pero son cruciales para asegurar que el comportamiento de la IA sea predecible y profesional, lo que indirectamente previene bugs conversacionales.

-   **`temperature: 0.7`**: Para respuestas consistentes y enfocadas.
-   **`topP: 0.9`**: Para un vocabulario lógico y relevante.
-   **`topK: 50`**: Para mantener un lenguaje natural sin ser repetitivo.
-   **`maxOutputTokens: 2048`**: Para permitir explicaciones completas y detalladas.
