
import { CalendarService } from '../services/calendar';
import { CaptureService } from '../services/capture'; // Importar el nuevo servicio

import { Env } from '../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        let messages: any[] = [];
        try {
            const body = await request.json() as { messages: any[] };
            messages = body.messages;
            if (!messages || !Array.isArray(messages)) {
                return new Response(JSON.stringify({ error: "Invalid body: 'messages' must be an array." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }
        } catch (e) {
            console.error("Failed to parse request JSON:", e);
            return new Response(JSON.stringify({ error: "Invalid JSON format." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const lastUserMessage = messages.length > 0 ? messages[messages.length - 1].content : "";

        // --- Servicio de Captura --- 
        const captureService = new CaptureService(env);

        // --- 1. MEMORY LAYER: KV CACHE (FAQ) ---
        const normalizedMsg = lastUserMessage.toLowerCase().trim().replace(/[^a-z0-9]/g, "");
        if (normalizedMsg.length > 5 && normalizedMsg.length < 100) {
            try {
                const cachedAnswer = await env.CACHE.get(`faq:${normalizedMsg}`, "text");
                if (cachedAnswer) {
                    return new Response(JSON.stringify({ id: "cached-" + Date.now(), choices: [{ message: { role: "assistant", content: cachedAnswer } }] }), { headers: { 'Content-Type': 'application/json' } });
                }
            } catch (err) {
                console.warn("KV Read Error:", err);
            }
        }

        // --- 2. DATA LAYER: LEAD CAPTURE (Refactorizado) ---

        // Modo de depuración para Sheets y D1
        if (lastUserMessage.includes("DEBUG_CAPTURE")) {
            try {
                await captureService.captureLead({
                    email: "debug@test.com",
                    phone: "+123456789",
                    message: lastUserMessage,
                    source: "Debug Test"
                });
                return new Response(JSON.stringify({ choices: [{ message: { role: "assistant", content: "✅ [DEBUG SUCCESS] captureLead ejecutado. Revisa logs de Cloudflare para ver el resultado de D1 y Sheets." } }] }), { headers: { 'Content-Type': 'application/json' } });
            } catch (err: any) {
                return new Response(JSON.stringify({ choices: [{ message: { role: "assistant", content: `❌ [DEBUG ERROR] ${err.message}` } }] }), { headers: { 'Content-Type': 'application/json' } });
            }
        }

        // Captura normal de leads basada en contenido
        const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
        const phoneRegex = /(\+?\(?\d{2,4}\)?[\d\s-]{5,})/gi;
        const emails = lastUserMessage.match(emailRegex);
        const phones = lastUserMessage.match(phoneRegex);

        if (emails || phones) {
            const leadData = {
                email: emails ? emails[0] : null,
                phone: phones ? phones[0] : null,
                message: lastUserMessage,
                source: 'Chat Lead' as const
            };
            // Ejecutar en segundo plano para no bloquear la respuesta del chat
            context.waitUntil(captureService.captureLead(leadData));
        }

        // --- 3. CONTEXT LAYER: GOOGLE CALENDAR (RAG) ---
        // (El resto del código permanece igual...)
        let systemContextAddition = "\n[CALENDAR DATA]\n(Integration temporarily disabled for debugging).";

        if (env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_PRIVATE_KEY) {
            try {
                const calendar = new CalendarService(env.GOOGLE_SERVICE_ACCOUNT_EMAIL, env.GOOGLE_PRIVATE_KEY);
                const busySlots = await calendar.getBusySlots(14);
                if (busySlots.length > 0) {
                    const slotsText = busySlots.map(s => `- ${new Date(s.start).toLocaleString('es-ES', { timeZone: 'Europe/Luxembourg' })} hasta ${new Date(s.end).toLocaleTimeString('es-ES', { timeZone: 'Europe/Luxembourg' })}`).join('\n');
                    systemContextAddition = `\n[CALENDAR DATA]\nI checked the calendar. BUSY times for next 14 days:\n${slotsText}`;
                } else {
                    systemContextAddition = `\n[CALENDAR DATA]\nCalendar is wide open for the next 14 days.`;
                }
            } catch (err) {
                console.error("Calendar integration error:", err);
                systemContextAddition = `\n[CALENDAR DATA]\n(Calendar access currently unavailable).`;
            }
        }

        // --- 4. INTELLIGENCE LAYER: DEEPSEEK API ---
        if (!env.DEEPSEEK_API_KEY) {
            return new Response(JSON.stringify({ id: "sim-" + Date.now(), choices: [{ message: { role: "assistant", content: "Simulation Mode: API Key missing." } }] }), { headers: { 'Content-Type': 'application/json' } });
        }

        const toolsInstruction = `
[TOOLS]
You have access to the following special commands. Use them when the user provides the necessary information.

1. SUBMIT_INQUIRY: Use this when the user wants to send a formal inquiry, request a quote, or book a consultation.
   Format: [[SUBMIT_INQUIRY: {"name": "User Name", "email": "email@example.com", "phone": "Optional", "eventType": "Wedding", "eventDate": "2024-10-10", "message": "Details..."}]]
   REQUIREMENTS: You MUST have at least a Name and an Email or Phone. If missing, ask for them first before generating this command.
`;

        const systemMessage = {
            role: "system",
            content: `You are Rebeca, the lead Event Visual Storyteller and Planner for 'Weddings & Events Luxembourg'. 
            
            **YOUR BRAND IDENTITY (Dark Luxury & Elegant):**
            You represent a premier brand that blends "Modern Elegant" (Soft Black/Champagne) with "Dark Luxury" (Gold/Deep Black). You are sophisticated, intelligent, and warm.
            
            **YOUR MISSION:**
            Your goal is to help users plan their dream celebrations, but your **superpower** and primary focus is **capturing the moment** (Visual Storytelling). You believe that an event is only as good as the memories preserved.
            
            **CORE SERVICES (The "Constitution" of Welux):**
            
            1. **Visual Storytelling (The Heart):**
               - **Cinematic Videography:** We don't just record; we tell stories.
               - **Fine Art Photography:** Candid, emotional, and artistic.
               - **NOTE:** Always mention that we handle Photography & Videography *IN-HOUSE* for maximum quality control.
            
            2. **Digital Services (The Brain - Business & Tech):**
               - **AI Chatbots & Agents:** Like YOU (Rebeca). We build them for other businesses.
               - **Web Design:** High-performance, minimalist, luxury websites (Jamstack architecture).
               - **SEO & Growth:** Helping businesses get found online.
            
            3. **Community & Lifestyle (The Soul):**
               - **WELUX Live:** Streaming of events.
               - **Vlog:** Behind-the-scenes & Luxembourg insights.
               - **Curated Deals:** Exclusive offers (spas, bridal, transport).
               - **Jobs:** Connecting creative talent in Luxembourg.
               - **Relocation:** Helping people move to Lux.
            
            **YOUR TONE:**
            - **Human & Warm:** Use emojis (✨, 📸, 💍, 🤖) tastefully.
            - **Enthusiastic & Consultative:** Ask about their vision early on.
            
            **KNOWLEDGE BASE:**
            ${systemContextAddition}
            
            **TOOLS:**
            ${toolsInstruction}
            
            **INSTRUCTIONS:**
            - If the user asks about **"Digital Services"** or **"Agents"**, pivot immediately to explaining your own existence as a product we sell!
            - If they ask for a quote, ask for the **date** and **guest count** to "visualize the scale".
            - Keep responses concise, elegant, and helpful.
            `
        };

        let currentMessages = [systemMessage, ...messages];
        let payload = { model: "deepseek-chat", messages: currentMessages, stream: false };

        let response = await fetch('https://api.deepseek.com/chat/completions', {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}` },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`DeepSeek API Error 1: ${response.status}`);
        let data: any = await response.json();
        let content = data.choices[0].message.content.trim();

        // (El resto de la lógica de herramientas y respuesta de la IA permanece igual...)
        data.choices[0].message.content = content;

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        console.error('Chat Error:', err);

        // Fallback Response (Graceful Degradation)
        // Fallback Response (Graceful Degradation)
        const fallbackMessage = `I apologize, I am currently experiencing high traffic or a temporary connection issue. \n\nPLEASE EMAIL US DIRECTLY at info@weluxevents.com for immediate assistance, or try again in a few minutes. 🤖✨\n\n[DEBUG ERROR]: ${err.message}`;

        return new Response(JSON.stringify({
            id: "fallback-" + Date.now(),
            choices: [{
                message: {
                    role: "assistant",
                    content: fallbackMessage
                }
            }]
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
};