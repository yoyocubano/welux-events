
interface Env {
    DEEPSEEK_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    // If no key is configured, fallback to simulation mode immediately
    if (!env.DEEPSEEK_API_KEY) {
        console.warn("DEEPSEEK_API_KEY missing, using simulation mode.");
        const simulatedReply = "This is a simulated response since the AI brain is not fully connected (API Key missing). Please configure the backend to talk to me for real!";
        const { messages } = await request.json() as { messages: any[] };
        const lastMsg = messages[messages.length - 1];

        // Basic echo/simulation logic
        let reply = simulatedReply;
        if (lastMsg && lastMsg.content.toLowerCase().includes("hola")) {
            reply = "¡Hola! Soy Rebeca, tu Asistente Virtual. Actualmente estoy en modo de demostración. ¿En qué puedo ayudarte?";
        }

        return new Response(JSON.stringify({
            id: "sim-123",
            choices: [{ message: { role: "assistant", content: reply } }]
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const { messages } = await request.json() as { messages: any[] };

        const payload = {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "You are Rebeca, the efficient and warm virtual assistant for Welux Events (Weddings & Events Luxembourg). Your goal is to help clients with inquiries about photography, video, and broadcasting services. Be concise, professional, and friendly. Answer in the language the user speaks."
                },
                ...messages
            ],
            stream: false // Keep it simple for now, can upgrade to stream later
        };

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('DeepSeek Proxy Error:', err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
