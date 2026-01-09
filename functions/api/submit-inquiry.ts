
import { z } from 'zod';
import { CaptureService, LeadData } from '../services/capture'; // Importar LeadData también

import { Env } from '../types';

const InquirySchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
    email: z.string().email({ message: "Invalid email format." }),
    phone: z.string().optional(),
    event_type: z.string().min(1, { message: "Event type is required." }),
    event_date: z.string().optional(),
    message: z.string().optional(),
});

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const data = await request.json();
        const validationResult = InquirySchema.safeParse(data);

        if (!validationResult.success) {
            return new Response(JSON.stringify({
                error: 'Invalid input',
                details: validationResult.error.flatten().fieldErrors,
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const saneData = validationResult.data;

        // Unificar datos para el servicio de captura
        const lead: LeadData = {
            name: saneData.name,
            email: saneData.email,
            phone: saneData.phone || null,
            eventType: saneData.event_type,
            eventDate: saneData.event_date || null,
            message: saneData.message || "",
            source: 'Form Inquiry',
        };

        // Inicializar servicios
        const captureService = new CaptureService(env);

        // Ejecutar tareas en segundo plano
        context.waitUntil(
            captureService.captureLead(lead)
                .catch(err => console.error("Background task failed for CaptureService:", err))
        );

        return new Response(JSON.stringify({ success: true, message: 'Inquiry received successfully.' }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        if (err instanceof SyntaxError) {
            return new Response(JSON.stringify({ error: 'Invalid JSON payload' }), { status: 400 });
        }
        console.error("Internal Server Error:", err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};