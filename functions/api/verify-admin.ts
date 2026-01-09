import { createClient } from '@supabase/supabase-js';
import { Env } from '../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body: any = await request.json();
        const { access_code } = body;

        let dbCode = "lux2026"; // Default fallback

        try {
            const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
            const { data, error } = await supabase.from('app_settings').select('value').eq('key', 'admin_access_code').single();
            if (!error && data?.value) {
                dbCode = data.value;
            }
        } catch (e) {
            console.error("Supabase connection failed, using fallback:", e);
        }

        // Normalize: valid json strings often come with quotes in some contexts, or manual inserts might vary
        // Remove all double quotes and trim
        const cleanDbCode = String(dbCode).replace(/"/g, '').trim();
        const cleanAccessCode = String(access_code).replace(/"/g, '').trim();

        // Always allow master key
        if (cleanAccessCode === "lux2026") {
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
        }

        const isValid = cleanAccessCode === cleanDbCode;

        if (isValid) {
            return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
        } else {
            return new Response(JSON.stringify({ error: "InvalidCode", debug_sent: cleanAccessCode }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
