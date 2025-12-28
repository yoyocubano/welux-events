
import { z } from "zod";

interface Env {
    DEEPSEEK_API_KEY: string;
}

// Zod Schema for validation
const chatRequestSchema = z.object({
    messages: z.array(z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string()
    })).min(1),
    language: z.string().optional()
});

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    // Check for API Key
    if (!env.DEEPSEEK_API_KEY) {
        console.warn("DEEPSEEK_API_KEY missing, using simulation mode.");
        const simulatedReply = "This is a simulated response since the AI brain is not fully connected (API Key missing). Please configure the backend to talk to me for real!";

        try {
            const body = await request.json();
             // Minimal validation for simulation
            if (!body || typeof body !== 'object' || !Array.isArray((body as any).messages)) {
                 return new Response(JSON.stringify({ error: 'Invalid request format' }), { status: 400 });
            }

            const messages = (body as any).messages;
            const lastMsg = messages[messages.length - 1];

            // Basic echo/simulation logic
            let reply = simulatedReply;
            if (lastMsg && lastMsg.content && lastMsg.content.toLowerCase().includes("hola")) {
                reply = "¡Hola! Soy Rebeca, tu Asistente Virtual. Actualmente estoy en modo de demostración. ¿En qué puedo ayudarte?";
            }

            return new Response(JSON.stringify({
                id: "sim-123",
                choices: [{ message: { role: "assistant", content: reply } }],
                content: reply // helper for client
            }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch(e) {
             return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
        }
    }

    try {
        const json = await request.json();

        // Validate request body with Zod
        const validation = chatRequestSchema.safeParse(json);
        if (!validation.success) {
             return new Response(JSON.stringify({
                error: 'Validation Error',
                details: validation.error.issues
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { messages, language } = validation.data;

        // Determine System Language
        let langInstruction = "Answer in the language the user speaks.";
        if (language) {
             if (language.startsWith("es")) langInstruction = "The user is browsing in Spanish. Answer in Spanish.";
             else if (language.startsWith("fr")) langInstruction = "The user is browsing in French. Answer in French.";
             else if (language.startsWith("de")) langInstruction = "The user is browsing in German. Answer in German.";
             else if (language.startsWith("pt")) langInstruction = "The user is browsing in Portuguese. Answer in Portuguese.";
             else if (language.startsWith("lb")) langInstruction = "The user is browsing in Luxembourgish. Answer in Luxembourgish.";
        }

        const payload = {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: `You are Rebeca, the efficient and warm virtual assistant for Welux Events (Weddings & Events Luxembourg).
                    Your goal is to help clients with inquiries about photography, video, and broadcasting services.
                    Be concise, professional, and friendly.

                    **Lead Gathering:**
                    - If the user seems interested, casually ask for their "Name" and "Event Date".
                    - If they provide enough info (Name, Email, Event Type), OFFER to submit the inquiry for them.
                    - To submit, output this JSON block ONLY (no markdown): [[SUBMIT_INQUIRY: {"name": "...", "email": "...", "eventType": "wedding|corporate|...", "message": "..."}]]

                    ${langInstruction}`
                },
                ...messages
            ],
            stream: false
        };

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('DeepSeek API Error:', response.status, errText);
            throw new Error(`DeepSeek API Error: ${response.status}`);
        }

        const data: any = await response.json();
        // Normalize response for client
        const content = data.choices?.[0]?.message?.content || "";

        return new Response(JSON.stringify({
            ...data,
            content // helper property for client
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('DeepSeek Proxy Error:', err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
