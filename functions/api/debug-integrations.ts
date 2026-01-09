
import { createClient } from '@supabase/supabase-js';
import { SheetsService } from '../services/sheets';
import { Resend } from 'resend';

import { Env } from '../types';

interface StatusReport {
    service: string;
    status: 'PASS' | 'FAIL' | 'SKIPPED';
    message: string;
    details?: any;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const { env } = context;
    const report: StatusReport[] = [];

    // --- 1. Test Supabase Integration ---
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseKey = env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        report.push({ service: 'Supabase', status: 'SKIPPED', message: 'SUPABASE_URL or SUPABASE_ANON_KEY are not set.' });
    } else {
        try {
            const supabase = createClient(supabaseUrl, supabaseKey);
            // Intentar una operación de solo lectura simple y segura
            const { error } = await supabase.from('client_inquiries').select('id').limit(1);
            if (error) {
                throw new Error(error.message);
            }
            report.push({ service: 'Supabase', status: 'PASS', message: 'Successfully connected and queried a table.' });
        } catch (e: any) {
            report.push({ service: 'Supabase', status: 'FAIL', message: 'Failed to connect or query.', details: e.message });
        }
    }

    // --- 2. Test Google Sheets Integration ---
    const googleEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const googleKey = env.GOOGLE_PRIVATE_KEY;
    const sheetId = env.GOOGLE_SHEET_ID;

    if (!googleEmail || !googleKey || !sheetId) {
        report.push({ service: 'Google Sheets', status: 'SKIPPED', message: 'One or more Google environment variables are not set.' });
    } else {
        try {
            // Clave privada a menudo viene con \n literales, hay que reemplazarlos.
            const formattedKey = googleKey.replace(/\\n/g, '\n');
            const sheets = new SheetsService(googleEmail, formattedKey, sheetId);
            const success = await sheets.appendRow([
                new Date().toISOString(),
                'Health Check',
                'diagnostic@system.test',
                'N/A',
                'This is an automated test row from the debug-integrations endpoint.'
            ]);

            if (!success) {
                // Si appendRow devuelve false, puede ser un error dentro de la librería que ya se logueó.
                throw new Error('appendRow returned false. Check Cloudflare logs for potential details from within the SheetsService.');
            }
            report.push({ service: 'Google Sheets', status: 'PASS', message: 'Successfully authenticated and appended a test row.' });
        } catch (e: any) {
            report.push({
                service: 'Google Sheets',
                status: 'FAIL',
                message: 'Failed to initialize service or append row.',
                details: {
                    errorMessage: e.message,
                    tip: "Common issues: 1) GOOGLE_PRIVATE_KEY needs \\n converted to newlines. 2) Google Sheet ID is wrong. 3) Service account doesn't have Editor permissions on the Sheet."
                }
            });
        }
    }

    // --- 3. Test Resend (Email) Integration ---
    const resendKey = env.RESEND_API_KEY;
    if (!resendKey) {
        report.push({ service: 'Resend (Email)', status: 'FAIL', message: 'RESEND_API_KEY is missing in Cloudflare Env Vars.' });
    } else {
        try {
            const resend = new Resend(resendKey);
            const { data, error } = await resend.emails.send({
                from: 'Welux Events <info@weluxevents.com>',
                to: ['yucolaguilar@gmail.com'], // Hardcoded for diagnostic safety
                subject: 'Diagnostic Test: Integration Debugger',
                html: '<p>If you see this, Resend is working correctly!</p>'
            });

            if (error) {
                throw new Error(error.message);
            }
            report.push({ service: 'Resend (Email)', status: 'PASS', message: 'Email sent successfully via API (New Key Active).' });
        } catch (e: any) {
            report.push({
                service: 'Resend (Email)',
                status: 'FAIL',
                message: 'Failed to send test email.',
                details: e.message
            });
        }
    }

    // --- Final Response ---
    const overallStatus = report.every(r => r.status === 'PASS' || r.status === 'SKIPPED') ? 200 : 500;

    return new Response(JSON.stringify(report, null, 2), {
        status: overallStatus,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' }
    });
};