
import { createClient } from '@supabase/supabase-js';
import { Env } from '../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body: any = await request.json();
        const { master_code, new_password } = body;

        if (!master_code || !new_password) {
            return new Response(JSON.stringify({ error: "Missing Master Code or New Password" }), { status: 400 });
        }

        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        // 1. Fetch the stored Master Security Code
        const { data, error } = await supabase
            .from('app_settings')
            .select('value')
            .eq('key', 'master_security_code')
            .single();

        if (error || !data) {
            // Fallback if not yet set in DB, use default hardcoded for safety during migration
            // In production, this should always be in DB.
            if (String(master_code) !== "lux_master_2026") {
                return new Response(JSON.stringify({ error: "Invalid Master Security Code" }), { status: 401 });
            }
        } else {
            // Verify against DB value
            // Remove quotes if jsonb stored them
            const storedMaster = String(data.value).replace(/['"]+/g, '').trim();
            const providedMaster = String(master_code).trim();

            if (storedMaster !== providedMaster) {
                return new Response(JSON.stringify({ error: "Invalid Master Security Code" }), { status: 401 });
            }
        }

        // 2. Update the Admin Access Code
        const { error: updateError } = await supabase
            .from('app_settings')
            .upsert({ key: 'admin_access_code', value: new_password });

        if (updateError) throw updateError;

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
