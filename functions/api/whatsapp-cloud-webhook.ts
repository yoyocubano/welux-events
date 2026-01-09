
import { Env } from '../types';
import { WhatsAppGraphService } from '../services/whatsapp-graph';
import { CaptureService } from '../services/capture';

// --- Types for Cloud API Webhook ---
interface CloudAPIMessage {
    from: string;
    id: string;
    timestamp: string;
    text?: { body: string };
    type: string;
}

interface CloudAPIValue {
    messaging_product: string;
    metadata: { display_phone_number: string, phone_number_id: string };
    contacts?: { profile: { name: string }, wa_id: string }[];
    messages?: CloudAPIMessage[];
}

interface CloudAPIChange {
    value: CloudAPIValue;
    field: string;
}

interface CloudAPIEntry {
    id: string;
    changes: CloudAPIChange[];
}

interface CloudAPIWebhookBody {
    object: string;
    entry: CloudAPIEntry[];
}

// --- AI Logic (Reused from Rebeca) ---
async function getAIResponse(
    userMessage: string,
    customerName: string,
    env: Env
): Promise<string> {
    const systemPrompt = `Eres Rebeca, la asistente virtual de Welux Events respondiendo por WhatsApp.
    
    **Tu Misión:**
    Ayudar a los clientes a planificar eventos, con especial énfasis en fotografía y videografía.
    
    **Servicios Principales:**
    - Fotografía de bodas y eventos
    - Videografía cinematográfica 4K
    - Broadcasting en vivo
    
    **Estilo:**
    - Cálido, profesional y cercano.
    - Respuestas concisas.
    
    Si el usuario pregunta por "ofertas", menciona que tenemos promociones especiales este mes.`;

    try {
        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `${customerName} dice: ${userMessage}` }
                ],
                temperature: 0.7,
                max_tokens: 300,
            }),
        });

        if (!response.ok) throw new Error(`Deepseek API error: ${response.status}`);
        const data: any = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error getting AI response:', error);
        return 'Disculpa, tengo problemas técnicos momentáneos.';
    }
}

// --- Main Handler ---

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    // 1. Verification Request (GET)
    if (request.method === 'GET') {
        const url = new URL(request.url);
        const mode = url.searchParams.get('hub.mode');
        const token = url.searchParams.get('hub.verify_token');
        const challenge = url.searchParams.get('hub.challenge');

        if (mode === 'subscribe' && token === env.WHATSAPP_VERIFY_TOKEN) {
            return new Response(challenge, { status: 200 });
        }
        return new Response('Forbidden', { status: 403 });
    }

    // 2. Incoming Messages (POST)
    if (request.method === 'POST') {
        try {
            const body = await request.json() as CloudAPIWebhookBody;
            console.log('Webhook payload:', JSON.stringify(body, null, 2));

            if (body.object === 'whatsapp_business_account') {
                for (const entry of body.entry) {
                    for (const change of entry.changes) {
                        const value = change.value;

                        if (value.messages && value.messages.length > 0) {
                            const message = value.messages[0];
                            const senderId = message.from; // Phone number
                            const name = value.contacts?.[0]?.profile.name || 'Cliente';

                            // Initialize Graph Service
                            // NOTE: You must set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in your .env
                            const waService = new WhatsAppGraphService(env);

                            // Mark as read immediately
                            await waService.markAsRead(message.id);

                            if (message.type === 'text' && message.text) {
                                const userText = message.text.body;

                                // --- DEMO: Inherited Features from Jasper's Market ---

                                // Example: Trigger an "Offer" template if keyword is found
                                if (userText.toLowerCase().includes('oferta') || userText.toLowerCase().includes('descuento')) {
                                    // Note: This requires a template named "limited_time_offer" created in Meta Business Manager
                                    try {
                                        const expiry = Date.now() + (24 * 60 * 60 * 1000); // 24 hours
                                        await waService.sendLimitedTimeOffer(
                                            senderId,
                                            'limited_time_offer', // You must create this template in Meta
                                            'https://weluxevents.com/images/promo.jpg',
                                            'WELUX2026',
                                            expiry
                                        );
                                        // Also send a text explanation
                                        await waService.sendText(senderId, "¡Aquí tienes nuestra oferta especial limitada! 🎁");
                                    } catch (e) {
                                        console.error('Failed to send offer template:', e);
                                        await waService.sendText(senderId, "Tenemos ofertas disponibles, pero no pude enviarte el cupón digital. Pregúntame por detalles.");
                                    }
                                } else {
                                    // Normal Rebeca AI Flow
                                    const aiResponse = await getAIResponse(userText, name, env);

                                    // Analyze Lead (Async)
                                    // Note: adapt analyzeAndSaveLead to work with just params if needed, 
                                    // or import it if exported. For now, skipping for brevity of the demo.

                                    await waService.sendText(senderId, aiResponse);
                                }
                            }
                        }
                    }
                }
            }

            return new Response('EVENT_RECEIVED', { status: 200 });
        } catch (error) {
            console.error('Error processing webhook:', error);
            return new Response('Internal Server Error', { status: 500 });
        }
    }

    return new Response('Method not allowed', { status: 405 });
};
