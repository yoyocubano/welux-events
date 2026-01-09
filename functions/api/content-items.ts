
import { createClient } from '@supabase/supabase-js';

export const onRequest = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);

    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    // Initialize Supabase (With Fallbacks)
    const supabaseUrl = env.SUPABASE_URL || "https://obijleonxnpsgpmqcdik.supabase.co";
    const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || "sb_secret_9zNkK-PiTnUy3hnJId9pGw_RIpkR-p_"; // Use Service Role for Admin Ops

    if (!supabaseUrl || !supabaseKey) {
        return new Response(JSON.stringify({ error: 'Missing Supabase config' }), { status: 500, headers: corsHeaders });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // --- GET: Fetch Items ---
    if (request.method === 'GET') {
        const section = url.searchParams.get('section');

        let query = supabase
            .from('content_items')
            .select('*')
            .order('created_at', { ascending: false });

        if (section) {
            query = query.eq('section', section);
        }

        const { data, error } = await query;

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
        }

        return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // --- AUTH CHECK FOR MUTATIONS ---
    const authHeader = request.headers.get('Authorization');
    // Basic check - in production you verify the JWT signature.
    // Assuming client sends "Bearer <token>"
    if (!authHeader) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
    }

    // --- POST: Create Item ---
    if (request.method === 'POST') {
        try {
            const body = await request.json();
            const { section, title, subtitle, description, image_url, link_url, badge_text } = body;

            const { data, error } = await supabase
                .from('content_items')
                .insert([{ section, title, subtitle, description, image_url, link_url, badge_text }])
                .select();

            if (error) throw error;

            return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
        }
    }

    // --- DELETE: Remove Item ---
    if (request.method === 'DELETE') {
        const id = url.searchParams.get('id');
        if (!id) return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400, headers: corsHeaders });

        const { error } = await supabase
            .from('content_items')
            .delete()
            .eq('id', id);

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
        }

        return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: corsHeaders });
};
