import { createClient } from '@supabase/supabase-js';
import { Env } from '../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;

    try {
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
        const { data, error } = await supabase.from('app_settings').select('*');

        if (error) throw error;

        // Transform array to object { key: value }
        const settings: Record<string, any> = {};
        if (data) {
            data.forEach((item: any) => {
                settings[item.key] = item.value;
            });
        }

        return new Response(JSON.stringify(settings), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        console.error("Get Settings Error:", err);
        return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), { status: 500 });
    }
};
