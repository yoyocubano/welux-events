
interface Env {
    DEEPSEEK_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    if (!env.DEEPSEEK_API_KEY) {
        return new Response(JSON.stringify({ error: 'API Key not configured' }), {
            status: 500,
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
