import { createClient } from '@supabase/supabase-js';
import { Env } from '../types';

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    try {
        const body: any = await request.json();
        const { youtube_channel_id, upcoming_broadcasts } = body;
        const providedCode = (body.access_code || "").replace(/['"]+/g, '').trim();

        // Simple auth check
        if (providedCode !== "lux2026") {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        // HARDCODED FALLBACKS FOR ROBUSTNESS
        const sbUrl = env.SUPABASE_URL || "https://obijleonxnpsgpmqcdik.supabase.co";
        const sbKey = env.SUPABASE_SERVICE_ROLE_KEY || "sb_secret_9zNkK-PiTnUy3hnJId9pGw_RIpkR-p_";

        const supabase = createClient(sbUrl, sbKey);

        // Upsert Channel ID
        if (youtube_channel_id !== undefined) {
            const { error } = await supabase.from('app_settings').upsert({ key: 'youtube_channel_id', value: youtube_channel_id });
            if (error) throw error;
        }

        // Upsert Stream Platform
        if (body.stream_platform !== undefined) {
            const { error } = await supabase.from('app_settings').upsert({ key: 'stream_platform', value: body.stream_platform });
            if (error) throw error;
        }

        // Upsert Custom Embed Code
        if (body.custom_embed_code !== undefined) {
            const { error } = await supabase.from('app_settings').upsert({ key: 'custom_embed_code', value: body.custom_embed_code });
            if (error) throw error;
        }

        // Upsert Broadcasts
        if (upcoming_broadcasts !== undefined) {
            const { error } = await supabase.from('app_settings').upsert({ key: 'upcoming_broadcasts', value: upcoming_broadcasts });
            if (error) throw error;
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        console.error("Update Settings Error:", err);
        return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), { status: 500 });
    }
};
