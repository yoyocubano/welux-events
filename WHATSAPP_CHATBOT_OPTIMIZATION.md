# Guía de Optimización y Seguridad para Chatbots con Gemini API

Este documento detalla la teoría detrás de las políticas de moderación de plataformas como WhatsApp y el proceso de optimización aplicado a "Rebeca AI" para crear un asistente virtual seguro, profesional y alineado con la marca.

## 1. La Teoría: ¿Por Qué WhatsApp No Usa IA Conversacional Directa para Moderación?

La seguridad en plataformas como WhatsApp no se basa en un solo filtro de IA, sino en un **ecosistema de moderación de múltiples capas**. Confiar únicamente en una IA conversacional para interactuar con contenido potencialmente dañino es arriesgado.

La estrategia de WhatsApp se basa en:

1.  **Políticas de Uso Aceptable (AUP):** Antes de usar la API de WhatsApp Business, los negocios firman un contrato que prohíbe explícitamente el uso de la plataforma para fines ilegales, fraudulentos o sexualmente explícitos. La violación de este contrato es la primera y más importante línea de defensa.
2.  **Moderación Centrada en el "Actor", no en el "Contenido":** WhatsApp no solo analiza *qué* se dice, sino *quién* lo dice. Utiliza IA para detectar patrones de comportamiento sospechosos (ej: una cuenta creada hace una hora y bloqueada por 200 usuarios) para identificar y banear a los actores maliciosos.
3.  **Reportes de Usuario como Herramienta Clave:** La comunidad es fundamental. Cuando un usuario reporta un chat, una copia de los mensajes recientes se envía a moderadores **humanos** para su revisión. Esto proporciona un contexto que ninguna IA puede igualar y es la principal fuente para tomar medidas.
4.  **Consecuencias Reales:** La violación de las políticas no resulta en un simple mensaje de error. Conduce a la **suspensión y baneo permanente de la plataforma**, lo que supone un fuerte desincentivo económico y operativo.

En resumen, WhatsApp no previene el contenido inapropiado mejorando la IA conversacional, sino creando una infraestructura robusta que desincentiva y castiga el mal comportamiento a nivel de plataforma.

## 2. Proceso de Optimización de "Rebeca AI"

El proceso para mejorar a "Rebeca AI" se realizó en dos fases iterativas tras identificar un fallo de alineación.

### Fase 1: Optimización Inicial de Precisión y Contexto

-   **Problema Identificado:** Las respuestas iniciales del modelo podían ser demasiado creativas o aleatorias, desviándose del objetivo de negocio.
-   **Solución Aplicada:**
    1.  **Ajuste de `generationConfig`:** Se redujo la `temperature` a `0.7` y se ajustó `topP` a `0.9` para obtener respuestas más predecibles y enfocadas.
    2.  **Ampliación de `maxOutputTokens`:** Se aumentó a `2048` para permitir respuestas más completas sin cortes abruptos.
    3.  **Implementación de `safetySettings` Básicos:** Se añadió una primera capa de filtros de seguridad con un umbral de `BLOCK_MEDIUM_AND_ABOVE`.

### Fase 2: Implementación de una Estrategia de "Cero Tolerancia"

-   **Problema Identificado:** Se detectó que el chatbot, al recibir una solicitud inapropiada ("fiesta de desnudos"), intentaba seguir su directiva de captación de clientes en lugar de rechazar la solicitud.
-   **Solución Aplicada (Defensa en Profundidad):**
    1.  **Refuerzo de la Directiva del Sistema (`SYSTEM_PROMPT`):** Se añadió una nueva directiva de **"SEGURIDAD Y ÉTICA"** que ordena explícitamente a la IA rechazar cualquier solicitud ilegal, no ética o sexualmente explícita, anteponiendo esta regla a la de captación de clientes.
    2.  **Endurecimiento del Filtro de la API:** Se aumentó la sensibilidad del `safetySettings` para la categoría `HARM_CATEGORY_SEXUALLY_EXPLICIT` a `BLOCK_LOW_AND_ABOVE`, creando una barrera técnica más estricta.
    3.  **Lógica del Servidor (Simulación de Baneo):** Se planeó modificar el código del servidor para que, al detectar un bloqueo por parte de la API, devuelva un mensaje final que termine la conversación, simulando una acción definitiva.

## 3. Configuraciones Técnicas Aplicadas

Las siguientes configuraciones en `netlify/functions/chat.ts` reflejan el estado final y optimizado del chatbot.

### `generationConfig`

-   **`temperature: 0.7`**: Reduce la aleatoriedad para respuestas más consistentes.
-   **`topP: 0.9`**: Asegura que el modelo elija palabras de un conjunto lógico y probable.
-   **`topK: 50`**: Ofrece un vocabulario suficientemente amplio para sonar natural.
-   **`maxOutputTokens: 2048`**: Permite respuestas largas y detalladas.
-   **`candidateCount: 1`**: Optimiza la latencia al solicitar una única respuesta.

### `safetySettings`

Se configuró un umbral estricto para las categorías más relevantes, especialmente para contenido sexualmente explícito.

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

## 4. Comparación: IA Conversacional vs. Filtro de Moderación

Ambos son tipos de IA, pero su propósito es diferente.

| Característica | IA Conversacional (Ej: "Rebeca AI") | Filtro de Moderación (Ej: `safetySettings`) |
| :--- | :--- | :--- |
| **Objetivo** | Entender, dialogar, generar texto y completar tareas. | Clasificar contenido en categorías predefinidas (spam, odio, etc.) y bloquearlo. |
| **Funcionamiento**| Es generativo. Crea respuestas basadas en un contexto. | Es un clasificador. No genera texto, solo lo etiqueta y lo filtra. |
| **Complejidad** | Muy alta. Debe entender el lenguaje, el contexto y la intención. | Relativamente baja. Está entrenado para una tarea específica de clasificación. |
| **Rol en Seguridad**| Segunda línea de defensa. Actúa si el filtro falla, usando sus instrucciones para responder adecuadamente. | Primera línea de defensa. Impide que el contenido dañino llegue al modelo conversacional. |

## 5. Recomendaciones y Mejores Prácticas

1.  **Nunca Confíes en una Sola Capa:** La seguridad robusta proviene de la "defensa en profundidad". Combina filtros de API, instrucciones claras en el prompt y lógica en tu servidor.
2.  **El Prompt es tu Política de Empresa:** Usa el `SYSTEM_PROMPT` para definir explícitamente qué debe y **NO** debe hacer la IA. Incluye una política de ética y seguridad con directivas claras.
3.  **Usa los Filtros de Seguridad Nativos:** Activa y configura siempre los `safetySettings` que provee la API (en este caso, Gemini). Empieza con una configuración estricta y ajústala si es necesario.
4.  **Define un Comportamiento de Fallo:** Decide qué debe pasar cuando un filtro se activa. ¿Muestras un error genérico? ¿Un mensaje específico? La mejor opción es un mensaje cortés que no dé más información de la necesaria.
5.  **Prueba los Límites (Red Teaming):** Intenta activamente "romper" tu chatbot con solicitudes inapropiadas, ilegales o inesperadas para descubrir y corregir vulnerabilidades antes que tus usuarios.
