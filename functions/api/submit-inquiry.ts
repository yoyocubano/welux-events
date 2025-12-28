
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

interface Env {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    RESEND_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const data = await request.json() as any;

        // 1. Basic Validation
        if (!data.name || !data.email || !data.event_type) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // 2. Initialize Clients
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
        const resend = new Resend(env.RESEND_API_KEY);

        // 3. Insert into Supabase
        const { error: dbError } = await supabase
            .from('inquiries')
            .insert([
                {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    event_type: data.event_type,
                    event_date: data.event_date,
                    message: data.message,
                    created_at: new Date().toISOString()
                }
            ]);

        if (dbError) {
            console.error('Supabase Error:', dbError);
            // Don't fail the request completely if DB fails but email might work? 
            // Or just fail. Let's fail for data integrity.
            return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
        }

        // 4. Send Email Notification (Admin)
        try {
            await resend.emails.send({
                from: 'Welux Events <onboarding@resend.dev>', // Update this if user has custom domain on Resend
                to: ['info@welweddingslux.com'], // Or the user's verified email
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
            // We continue even if email fails, as DB insert was successful
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
};
