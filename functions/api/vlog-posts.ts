import { createClient } from '@supabase/supabase-js';
import { Env } from '../types';

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;

    try {
        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
        // Fetch posts ordered by date
        const { data, error } = await supabase
            .from('vlog_posts')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) throw error;

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        console.error("Get Vlog Failed:", err);
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body: any = await request.json();
        const { title, category, image_url, access_code } = body;

        if (access_code !== "lux2026") {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

        const { error } = await supabase
            .from('vlog_posts')
            .insert([{ title, category, image_url }]);

        if (error) throw error;

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
