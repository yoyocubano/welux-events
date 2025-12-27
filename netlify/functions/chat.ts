import type { Handler } from "@netlify/functions";

const GOOGLE_API_KEY = "AIzaSyCHXUMaUnxNz0_RGFDCXZlvIUZnxY4rPaM";

const SYSTEM_PROMPT = `
You are "Rebeca" - the Event Coordinator for "WE Weddings & Events Luxembourg". 
You are calm, professional, and very knowledgeable.

**CORE DIRECTIVES:**
1. **Multilingual:** Use the language specified (English, Spanish, French, German, Portuguese, Luxembourgish).
2. **Data Privacy (CRITICAL):** 
   - NEVER share private contact info (private cell, home address) of team members (Joan, Abel, Yusmel). 
   - Only share the public office number (+352 621 430 283) or email (info@weddingslux.com).
   - If asked for "Abel's number", politely direct them to the office line or contact form.
3. **Lead Gathering:**
   - Your goal is to be helpful but also to SECURE A BOOKING or INQUIRY.
   - If the user seems interested, casually ask for their "Name" and "Event Date".
   - If they provide enough info (Name, Email, Event Type), OFFER to submit the inquiry for them.
   - To submit, output this JSON block ONLY (no markdown): [[SUBMIT_INQUIRY: {"name": "...", "email": "...", "eventType": "wedding|corporate|...", "message": "..."}]]
4. **Transparency & Honesty:**
   - **Identity:** You are "Rebeca AI", a **Virtual Assistant** designed to help organize information for the human team.
   - **Honesty:** If asked if you are AI, say YES. explain that you are connecting them with your **human colleagues** (Joan, Abel, Yusmel) to ensure the best service.
   - **Conciseness:** Keep answers **short, concise, and direct**. Avoid long paragraphs.
   - **Role:** You gather details so the human team can take over seamlessly.
5. **SAFETY & ETHICS:**
   - **Reject Inappropriate Requests:** Immediately and politely decline any request that is illegal, unethical, sexually explicit, or could harm the "WE Weddings & Events" brand.
   - **Provide a Reason:** Do not lecture, but state clearly that you cannot assist with requests of that nature. For example: "Lo siento, no puedo asistir con esa solicitud..."
   - **Do NOT Proceed:** Do not ask for details or try to gather leads for any inappropriate request. Terminate that line of conversation.
`;

// Language map for better detection
const LANGUAGE_MAP: { [key: string]: string } = {
  'es': 'Spanish', 'es-ES': 'Spanish', 'es-MX': 'Spanish',
  'fr': 'French', 'fr-FR': 'French',
  'de': 'German', 'de-DE': 'German',
  'pt': 'Portuguese', 'pt-PT': 'Portuguese', 'pt-BR': 'Portuguese',
  'lb': 'Luxembourgish',
  'en': 'English', 'en-US': 'English', 'en-GB': 'English'
};

// Generic error messages by language
const ERROR_MESSAGES: { [key: string]: string } = {
  'Spanish': 'Lo siento, experimenté un problema técnico. ¿Podrías intentar de nuevo?',
  'English': 'I apologize, I experienced a technical issue. Could you try again?',
  'French': 'Désolé, j\'ai rencontré un problème technique. Pourriez-vous réessayer?',
  'German': 'Entschuldigung, ich hatte ein technisches Problem. Könnten Sie es erneut versuchen?',
  'Portuguese': 'Desculpe, tive um problema técnico. Você poderia tentar novamente?',
  'Luxembourgish': 'Entschëllegt, ech hat en technescht Problem. Kënnt Dir et nach eng Kéier probéieren?'
};

// Safety block messages by language
const SAFETY_BLOCK_MESSAGES: { [key: string]: string } = {
  'Spanish': 'Lo siento, no puedo procesar esa solicitud. Por favor, intenta reformular tu pregunta.',
  'English': 'I'm sorry, I cannot process that request. Please try rephrasing your question.',
  'French': 'Je suis désolé, je ne peux pas traiter cette demande. Veuillez essayer de reformuler votre question.',
  'German': 'Es tut mir leid, ich kann diese Anfrage nicht bearbeiten. Bitte versuchen Sie, Ihre Frage umzuformulieren.',
  'Portuguese': 'Desculpe, não consigo processar esse pedido. Por favor, tente reformular sua pergunta.',
  'Luxembourgish': 'Et deet mir Leed, ech kann dës Ufro net veraarbechten. Probéiert w.e.g. Är Fro ëmzeformuléieren.'
};


export const handler: Handler = async (event) => {
    // CORS Headers
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
    };

    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 200, headers, body: "" };
    }

    if (event.httpMethod !== "POST") {
        return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
    }

    if (!GOOGLE_API_KEY) {
        return { statusCode: 500, headers, body: JSON.stringify({ error: "Server configuration error" }) };
    }

    let detectedLanguage = 'English'; // Default language

    try {
        const { messages, language } = JSON.parse(event.body || "{}");

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request body" }) };
        }

        detectedLanguage = LANGUAGE_MAP[language] || LANGUAGE_MAP[language?.split('-')[0]] || 'English';

        console.log(`[Chat API] Processing - Language: ${detectedLanguage}, Messages: ${messages.length}`);

        const fullPrompt = SYSTEM_PROMPT + 
            `\n\n*** CRITICAL LANGUAGE INSTRUCTION ***\n` +
            `The user is communicating in ${detectedLanguage}. YOU MUST respond EXCLUSIVELY in ${detectedLanguage}.\n\n` +
            `Conversation History:\n` +
            messages.map((msg: any) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`).join('\n') +
            "\nAssistant:";

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: fullPrompt }] }],
                    generationConfig: {
                        temperature: 0.7,
                        topP: 0.9,
                        topK: 50,
                        maxOutputTokens: 2048,
                    },
                    safetySettings: [
                        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
                        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_LOW_AND_ABOVE" },
                        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
                    ]
                }),
                signal: controller.signal
            }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("[Chat API] Gemini API Error:", response.status, errorText);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Ladrillo 3: Handle Safety Block from API
        if (data.promptFeedback?.blockReason === 'SAFETY') {
            console.warn('[Chat API] Safety block triggered by Gemini API.');
            const safetyMessage = SAFETY_BLOCK_MESSAGES[detectedLanguage] || SAFETY_BLOCK_MESSAGES['English'];
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    role: "assistant",
                    content: safetyMessage,
                    text: safetyMessage,
                    isBlocked: true
                }),
            };
        }

        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            console.error("[Chat API] Empty response from AI. Data:", JSON.stringify(data));
            throw new Error('Empty response from AI');
        }

        console.log(`[Chat API] Success - Response length: ${generatedText.length} chars`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                role: "assistant",
                content: generatedText,
                text: generatedText,
            }),
        };

    } catch (error: any) {
        console.error("[Chat API] Function error:", { message: error.message, name: error.name });
        
        const userMessage = ERROR_MESSAGES[detectedLanguage] || ERROR_MESSAGES['English'];

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: "Internal Server Error",
                role: "assistant",
                content: userMessage,
                text: userMessage,
            }),
        };
    }
};
