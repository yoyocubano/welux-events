export interface Env {
    DEEPSEEK_API_KEY?: string;
    DB: D1Database;
    CACHE: KVNamespace;
    GOOGLE_SERVICE_ACCOUNT_EMAIL?: string;
    GOOGLE_PRIVATE_KEY?: string;
    GOOGLE_SHEET_ID?: string;
    RESEND_API_KEY?: string;
    SUPABASE_URL?: string;
    SUPABASE_SERVICE_ROLE_KEY?: string;
    SUPABASE_ANON_KEY?: string;
    TWILIO_AUTH_TOKEN?: string;
    N8N_WEBHOOK_URL?: string;
    WHATSAPP_ACCESS_TOKEN?: string;
    WHATSAPP_PHONE_NUMBER_ID?: string;
    WHATSAPP_VERIFY_TOKEN?: string;
    CLOUDFLARE_API_TOKEN?: string;
    CLOUDFLARE_ZONE_ID?: string;
}
