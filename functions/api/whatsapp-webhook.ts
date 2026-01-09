import { Env } from '../types';
import crypto from 'crypto';

interface WhatsAppMessage {
    From: string;        // Phone number with whatsapp: prefix
    To: string;          // Your WhatsApp number
    Body: string;        // Message content
    ProfileName: string; // Customer name
    MessageSid: string;  // Unique message ID
    NumMedia?: string;   // Number of media attachments
}

interface TwilioResponse {
    message: string;
    success: boolean;
}

/**
 * Verify Twilio signature to ensure request authenticity
 */
function verifyTwilioSignature(
    signature: string | null,
    authToken: string,
    url: string,
    params: Record<string, string>
): boolean {
    if (!signature) return false;

    // Sort params alphabetically and concatenate
    const data = url + Object.keys(params)
        .sort()
        .map(key => `${key}${params[key]}`)
        .join('');

    // Create HMAC SHA1 signature
    const hmac = crypto.createHmac('sha1', authToken);
    const expectedSignature = hmac.update(data).digest('base64');

    return signature === expectedSignature;
}

/**
 * Get AI response from Deepseek
 */
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
- Paquetes completos (foto + video)

**Tu Tono en WhatsApp:**
- Cálido y cercano (es WhatsApp, no email formal)
- Usa emojis ocasionalmente (✨, 📸, 💍, 🎥)
- Respuestas CORTAS (WhatsApp es conversacional)
- Haz preguntas para entender mejor sus necesidades

**Importante:**
- Si preguntan por precios, menciona que depende del paquete y fecha
- Si muestran interés serio, pide: nombre completo, fecha del evento, tipo de evento
- Siempre ofrece agendar una llamada o videollamada
- Menciona que pueden ver el portfolio en weluxevents.com

**Ejemplo de respuesta:**
"¡Hola! 👋 Me encantaría ayudarte con la fotografía de tu boda. ¿Ya tienes fecha? Así puedo darte info más específica 📸"

Responde de forma natural y conversacional.`;

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

        if (!response.ok) {
            throw new Error(`Deepseek API error: ${response.status}`);
        }

        const data: any = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error getting AI response:', error);
        return 'Disculpa, tengo problemas técnicos en este momento. ¿Puedes escribirnos a info@weluxevents.com? 🙏';
    }
}

/**
 * Save conversation to Supabase
 */
async function saveConversation(
    message: WhatsAppMessage,
    aiResponse: string,
    env: Env
): Promise<void> {
    try {
        const supabaseUrl = env.SUPABASE_URL;
        const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

        await fetch(`${supabaseUrl}/rest/v1/whatsapp_conversations`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey || '',
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal',
            } as any,
            body: JSON.stringify({
                phone_number: message.From.replace('whatsapp:', ''),
                customer_name: message.ProfileName,
                customer_message: message.Body,
                ai_response: aiResponse,
                message_sid: message.MessageSid,
                created_at: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error('Error saving conversation:', error);
        // Don't fail the request if saving fails
    }
}

/**
 * Detect if message indicates lead interest
 */
function isLead(message: string): boolean {
    const leadKeywords = [
        'precio', 'cotiza', 'presupuesto', 'costo', 'cuanto',
        'boda', 'evento', 'fecha', 'reservar', 'contratar',
        'disponibilidad', 'paquete', 'servicio'
    ];

    const lowerMessage = message.toLowerCase();
    return leadKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Main webhook handler
 */
export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    // Only accept POST requests
    if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    try {
        // Parse form data from Twilio
        const formData = await request.formData();
        const params: Record<string, string> = {};

        formData.forEach((value, key) => {
            params[key] = value.toString();
        });

        const message: WhatsAppMessage = {
            From: params.From || '',
            To: params.To || '',
            Body: params.Body || '',
            ProfileName: params.ProfileName || 'Cliente',
            MessageSid: params.MessageSid || '',
            NumMedia: params.NumMedia,
        };

        // Verify Twilio signature (Disabled for debugging)
        // const signature = request.headers.get('X-Twilio-Signature');
        // const url = new URL(request.url).toString();

        // if (env.TWILIO_AUTH_TOKEN && !verifyTwilioSignature(signature, env.TWILIO_AUTH_TOKEN, url, params)) {
        //     console.error('Invalid Twilio signature');
        //     return new Response('Unauthorized', { status: 401 });
        // }

        // Get AI response
        const aiResponse = await getAIResponse(
            message.Body,
            message.ProfileName,
            env
        );

        // Save and Analyze concurrently
        const savePromise = saveConversation(message, aiResponse, env);
        const analysisPromise = analyzeAndSaveLead(message, aiResponse, env);

        // Wait for background tasks without blocking response
        context.waitUntil(Promise.all([savePromise, analysisPromise]));

        // Return TwiML response
        const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${aiResponse}</Message>
</Response>`;

        return new Response(twiml, {
            headers: {
                'Content-Type': 'text/xml',
            },
        });

    } catch (error) {
        console.error('WhatsApp webhook error:', error);

        // Return friendly error message
        const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Disculpa, tengo problemas técnicos. Por favor escribe a info@weluxevents.com 🙏</Message>
</Response>`;

        return new Response(errorTwiml, {
            status: 500,
            headers: {
                'Content-Type': 'text/xml',
            },
        });
    }
}

/**
 * Analyze conversation to find Lead Data and save if relevant
 */
async function analyzeAndSaveLead(
    message: WhatsAppMessage,
    aiContext: string,
    env: Env
): Promise<void> {
    try {
        const extractionPrompt = `
        Analiza el siguiente mensaje de WhatsApp y extrae datos estructurados.
        Mensaje: "${message.Body}"
        Contexto IA: "${aiContext}"
        
        Devuelve SOLO un objeto JSON:
        {
            "name": "Nombre o null",
            "event_date": "YYYY-MM-DD o null",
            "event_type": "boda, corporate, etc o null",
            "email": "Email o null",
            "is_relevant": true/false
        }
        `;

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: extractionPrompt }],
                temperature: 0.1,
                response_format: { type: 'json_object' }
            }),
        });

        if (!response.ok) return;

        const raw: any = await response.json();
        const content = raw.choices[0].message.content;
        const extracted = JSON.parse(content);

        if (extracted.is_relevant && (extracted.email || extracted.name || extracted.event_date)) {
            console.log('Lead Data Detected:', extracted);

            // Use CaptureService to sync to ALL destinations (Supabase, Sheets, D1, Email)
            const { CaptureService } = await import('../services/capture');
            const captureService = new CaptureService(env);

            await captureService.captureLead({
                name: extracted.name || message.ProfileName,
                email: extracted.email || null,
                phone: message.From.replace('whatsapp:', ''),
                eventType: extracted.event_type || 'General Inquiry',
                eventDate: extracted.event_date || null,
                message: `[Bot Extracted]: ${message.Body}`,
                source: 'WhatsApp Bot 🤖'
            });
        }
    } catch (e) {
        console.error('Error extracting lead data:', e);
        // Fail silently to not affect main flow
    }
}
