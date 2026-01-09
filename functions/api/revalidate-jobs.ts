import { Env } from "../types";

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { env } = context;

    const zoneId = env.CLOUDFLARE_ZONE_ID;
    const apiToken = env.CLOUDFLARE_API_TOKEN;

    // Validate Config
    if (!zoneId || !apiToken) {
        return new Response(JSON.stringify({ error: "Missing Cloudflare Configuration" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        console.log("[Cache Purge] Triggered for Jobs page");

        // Call Cloudflare API to purge cache
        const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: [
                    "https://weluxevents.com/jobs",
                    "https://weluxevents.com/jobs/"
                ]
            })
        });

        const result: any = await response.json();

        if (!result.success) {
            console.error("[Cache Purge] Failed:", result.errors);
            return new Response(JSON.stringify({ success: false, errors: result.errors }), { status: 400 });
        }

        return new Response(JSON.stringify({ success: true, result }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error: any) {
        console.error("[Cache Purge] Exception:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
