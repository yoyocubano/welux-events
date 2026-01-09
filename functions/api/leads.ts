
import { createClient } from '@supabase/supabase-js';
import { Env } from '../types';

async function verify(token: string, secret: string): Promise<boolean> {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        const [header, payload, signature] = parts;
        const enc = new TextEncoder();
        const key = await crypto.subtle.importKey(
            "raw",
            enc.encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        );

        // Convert url-safe base64 back to normal base64 if needed, 
        // but typically verify() handles raw bytes. WebCrypto verify expects the signature as bytes and data as bytes.

        // Re-construct the data that was signed
        const data = enc.encode(`${header}.${payload}`);

        // Decode the signature from base64url
        const sigStr = signature.replace(/-/g, '+').replace(/_/g, '/').padEnd(signature.length + (4 - signature.length % 4) % 4, '=');
        const sigBytes = Uint8Array.from(atob(sigStr), c => c.charCodeAt(0));

        const isValid = await crypto.subtle.verify(
            "HMAC",
            key,
            sigBytes,
            data
        );

        return isValid;
    } catch (e) {
        return false;
    }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    // 1. Auth Check
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const MASTER_SECRET = env.ADMIN_SECRET || "lux_master_2026";

    // In dev mode "lux2026" is used as password, but token is signed with MASTER_SECRET anyway in auth.ts
    // However, if we are in local dev, maybe auth.ts used "lux_master_2026" default.

    const isValid = await verify(token, MASTER_SECRET);
    if (!isValid) {
        return new Response(JSON.stringify({ error: "Invalid Token" }), { status: 403 });
    }

    // 2. Fetch Data
    try {
        // HARDCODED FALLBACKS FOR ROBUSTNESS
        const sbUrl = env.SUPABASE_URL || "https://obijleonxnpsgpmqcdik.supabase.co";
        const sbKey = env.SUPABASE_SERVICE_ROLE_KEY || "sb_secret_9zNkK-PiTnUy3hnJId9pGw_RIpkR-p_";

        const supabase = createClient(sbUrl, sbKey);

        // --- AUTO-CLEANUP: Delete leads older than 10 days ---
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
        
        await supabase
            .from('client_inquiries')
            .delete()
            .lt('createdAt', tenDaysAgo.toISOString());
        // -----------------------------------------------------

        // Fetch leads sorted by newest first
        const { data, error } = await supabase
            .from('client_inquiries')
            .select('*')
            .order('createdAt', { ascending: false })
            .limit(100);

        if (error) throw error;

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
};
