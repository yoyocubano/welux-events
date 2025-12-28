
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { z } from 'zod';

interface Env {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    RESEND_API_KEY: string;
}

const inquirySchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().nullable().optional(),
    event_type: z.string().min(1, "Event type is required"),
    event_date: z.string().nullable().optional(),
    message: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    budget: z.string().nullable().optional(),
    guest_count: z.union([z.number(), z.string(), z.null()]).optional(),
    service_interest: z.string().nullable().optional()
});

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const json = await request.json();

        // Validate input
        const validation = inquirySchema.safeParse(json);

        if (!validation.success) {
            return new Response(JSON.stringify({
                error: 'Validation Error',
                details: validation.error.issues
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = validation.data;

        // Initialize Clients
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
        const resend = new Resend(env.RESEND_API_KEY);

        // Map to DB Schema (snake_case for Supabase/Postgres)
        const dbPayload = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            event_type: data.event_type,
            event_date: data.event_date ? new Date(data.event_date) : null,
            location: data.location,
            budget: data.budget,
            guest_count: data.guest_count ? Number(data.guest_count) : null,
            service_interest: data.service_interest,
            message: data.message,
            created_at: new Date().toISOString(),
            status: 'new'
        };

        // Insert into Supabase (table: inquiries)
        const { error: dbError } = await supabase
            .from('inquiries')
            .insert([dbPayload]);

        if (dbError) {
            console.error('Supabase Error:', dbError);
            return new Response(JSON.stringify({ error: 'Database error', details: dbError.message }), { status: 500 });
        }

        // Send Email Notification (Admin)
        try {
            await resend.emails.send({
                from: 'Welux Events <onboarding@resend.dev>',
                to: ['info@welweddingslux.com'],
                subject: `New Inquiry: ${data.event_type} - ${data.name}`,
                html: `
          <h1>New Inquiry Received</h1>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
          <p><strong>Type:</strong> ${data.event_type}</p>
          <p><strong>Date:</strong> ${data.event_date || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message || 'No message'}</p>
        `
            });
        } catch (emailError) {
            console.error('Email Error:', emailError);
            // Continue even if email fails
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        console.error('Internal Server Error:', err);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
