
import { SheetsService } from './sheets';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

import { Env } from '../types';

export interface LeadData {
    name?: string | null; // Name es opcional, puede venir del formulario pero no del chat
    email: string | null;
    phone: string | null;
    message: string;
    source: 'Chat Lead' | 'Form Inquiry' | 'Debug Test' | 'WhatsApp Bot 🤖';
    eventType?: string | null;
    eventDate?: string | null;
}

export class CaptureService {
    private env: Env;
    private supabase: SupabaseClient | null = null;
    private resend: Resend | null = null;

    constructor(env: Env) {
        this.env = env;
        if (env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY) {
            // Note: services usually use SERVICE_ROLE_KEY for admin tasks, but debug used ANON_KEY.
            // Let's stick to what passed in Env. Env has SUPABASE_SERVICE_ROLE_KEY.
            // But debug-integrations used SUPABASE_ANON_KEY.
            // Let's check compat.
            this.supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
        }
        if (env.RESEND_API_KEY) {
            this.resend = new Resend(env.RESEND_API_KEY);
        }
    }

    async captureLead(data: LeadData): Promise<void> {
        const createdAt = new Date().toISOString();

        const results = await Promise.allSettled([
            this.saveToD1(data, createdAt),
            this.saveToSheets(data, createdAt),
            this.saveToSupabase(data, createdAt), // <-- NUEVO
            this.sendEmailNotification(data), // <-- EMAIL
            this.sendToN8n(data) // <-- WHATSAPP (n8n)
        ]);

        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                const destination = ['D1 Database', 'Google Sheets', 'Supabase', 'Email'][index];
                console.error(`Failed to save lead to ${destination}:`, result.reason);
            }
        });
    }

    private async saveToD1(data: LeadData, createdAt: string): Promise<void> {
        if (!this.env.DB) return;
        try {
            await this.env.DB.prepare(
                "INSERT INTO client_inquiries (name, email, phone, eventType, eventDate, status, createdAt, source) VALUES (?, ?, ?, ?, ?, 'new', ?, ?)"
            ).bind(
                data.name || "Unknown",
                data.email,
                data.phone,
                data.eventType || 'general',
                data.eventDate || null,
                createdAt,
                data.source
            ).run();
            console.log("Successfully saved lead to D1.");
        } catch (e) {
            throw new Error(`D1 Error: ${e instanceof Error ? e.message : String(e)}`);
        }
    }

    private async saveToSheets(data: LeadData, createdAt: string): Promise<void> {
        const { GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID } = this.env;
        if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_SHEET_ID) return;

        try {
            const sheets = new SheetsService(GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID);
            const fullMessage = `Name: ${data.name || 'N/A'}, Msg: ${data.message}`;
            const success = await sheets.appendRow([createdAt, data.source, data.email || "", data.phone || "", fullMessage]);
            if (!success) {
                throw new Error("appendRow returned false. Check SheetsService logs.");
            }
            console.log("Successfully saved lead to Google Sheets.");
        } catch (err) {
            throw new Error(`Sheets Capture Error: ${err instanceof Error ? err.message : String(err)}`);
        }
    }

    // NUEVO MÉTODO PARA SUPABASE
    private async saveToSupabase(data: LeadData, createdAt: string): Promise<void> {
        if (!this.supabase) return; // Si Supabase no está configurado, no hacemos nada.

        try {
            const { error } = await this.supabase.from('client_inquiries').insert({
                name: data.name || "Unknown",
                email: data.email,
                phone: data.phone,
                eventType: data.eventType || 'general',
                eventDate: data.eventDate,
                message: data.message,
                source: data.source,
                createdAt: createdAt
            });

            if (error) {
                throw new Error(error.message);
            }
            console.log("Successfully saved lead to Supabase.");
        } catch (e) {
            throw new Error(`Supabase Error: ${e instanceof Error ? e.message : String(e)}`);
        }
    }

    private async sendEmailNotification(data: LeadData): Promise<void> {
        if (!this.resend) {
            console.warn("Resend not initialized, skipping email.");
            return;
        }

        if (!(this.env as any).LEAD_NOTIFICATION_EMAIL) {
            console.warn("LEAD_NOTIFICATION_EMAIL not set, skipping email.");
            return;
        }

        try {
            await this.resend.emails.send({
                from: 'Welux Events <info@weluxevents.com>',
                to: [(this.env as any).LEAD_NOTIFICATION_EMAIL],
                subject: `New Lead: ${data.source} - ${data.name || 'Unknown'}`,
                html: `
                    <h1>New Lead Captured</h1>
                    <p><strong>Source:</strong> ${data.source}</p>
                    <p><strong>Name:</strong> ${data.name || 'N/A'}</p>
                    <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${data.phone || 'N/A'}</p>
                    <p><strong>Event Type:</strong> ${data.eventType || 'N/A'}</p>
                    <p><strong>Event Date:</strong> ${data.eventDate || 'N/A'}</p>
                    <hr/>
                    <p><strong>Message:</strong></p>
                    <p>${data.message}</p>
                `
            });
            console.log("Successfully sent email notification to yucolaguilar@gmail.com");
        } catch (e) {
            throw new Error(`Resend Error: ${e instanceof Error ? e.message : String(e)}`);
        }
    }

    private async sendToN8n(data: LeadData): Promise<void> {
        // Use environment variable only
        const n8nUrl = this.env.N8N_WEBHOOK_URL;

        if (!n8nUrl) {
            console.warn("N8N_WEBHOOK_URL not set. Skipping WhatsApp notification.");
            return;
        }

        try {
            const response = await fetch(n8nUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                console.warn(`n8n Webhook returned ${response.status}`);
            } else {
                console.log("Successfully sent lead to n8n (WhatsApp Notification).");
            }
        } catch (e) {
            // Non-blocking error
            console.error("Failed to send to n8n:", e);
        }
    }
}
