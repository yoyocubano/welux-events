/**
 * PORTABLE JOB AGGREGATOR (Luxembourg Focus)
 * 
 * Este script es una versión autocontenida diseñada para ser clonada
 * en otros proyectos. Solo requiere un archivo `.env` configurado.
 * 
 * Dependencias: npm install axios csv-parse fs-extra
 */

const axios = require('axios');
const fs = require('fs-extra');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const CONFIG = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADEM_USER: process.env.ADEM_USER,
    ADEM_PASS: process.env.ADEM_PASS
};

/**
 * Portable Job Aggregator Lux
 * This script is designed to be standalone. 
 * It fetches from open sources and can be extended for private ADEM access.
 */

async function fetchPublicAdem() {
    console.log('📡 Fetching ADEM Public Data...');
    // Simplified fetch logic for portability
    try {
        const res = await axios.get('https://data.public.lu/api/1/datasets/chiffres-cles-de-ladem/');
        // Logic to extract CSV and map...
        return []; // Returning empty for brevity in portable version
    } catch (e) {
        return [];
    }
}

async function syncToSupabase(jobs) {
    if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_SERVICE_ROLE_KEY) {
        console.log('⚠️ Skipping Supabase sync (Missing Config)');
        return;
    }

    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE_KEY);
    console.log(`📤 Syncing ${jobs.length} jobs to Supabase (Table: content_items)...`);

    // Manual Upsert Logic (No unique constraint required)
    const urls = jobs.map(j => j.link_url);
    await supabase.from('content_items').delete().in('link_url', urls);

    const items = jobs.map(job => ({
        section: 'jobs',
        title: job.title,
        subtitle: job.company || 'ADEM / Empresa Privada',
        description: job.location,
        link_url: job.link_url,
        badge_text: `Publicado: ${new Date().toLocaleDateString()}`,
        created_at: new Date().toISOString()
    }));

    const { error } = await supabase.from('content_items').insert(items);
    if (error) console.error('❌ Sync Error:', error.message);
    else console.log('✅ Sync Successful.');
}

async function run() {
    console.log('🚀 Starting Portable Aggregator...');
    const jobs = await fetchPublicAdem();
    
    // NOTE: For ADEM Private Access (4,000+ jobs), use the 'private-tunnel.js' script
    // which handles the authenticated session with ADEM_USER and ADEM_PASS.

    if (jobs.length > 0) {
        await syncToSupabase(jobs);
    }
    console.log('🏁 Process Finished.');
}

run();
        if (!unique.has(finger) || new Date(job.date) > new Date(unique.get(finger).date)) {
            unique.set(finger, job);
        }
    });

// 3. FUENTES
async function fetchAdemJobs() {
    try {
        const info = await axios.get(CONFIG.ADEM_DATASET_URL);
        const csv = info.data.resources.find(r => r.format === 'csv' && r.title.toLowerCase().includes('skills'));
        if (!csv) return [];

        const res = await axios({ method: 'get', url: csv.url, responseType: 'stream' });
        const records = [];
        const parser = res.data.pipe(parse({ columns: true, delimiter: ',', to: 50 }));

        for await (const row of parser) {
            records.push(createJobObject(
                row.vacancy_id, 
                row.occupation_label, 
                'ADEM / Empresa Privada', 
                'Luxemburgo', 
                null, 
                'https://adem.public.lu/fr/jobboard.html', 
                'ADEM'
            ));
        }
        return records;
    } catch (e) { return []; }
}

// 4. ORQUESTADOR
async function main() {
    console.log('--- Iniciando Agregador Portátil ---');
    const all = await Promise.all([fetchAdemJobs()]);
    const unified = deduplicateJobs(all.flat());
    
    await fs.writeJson(CONFIG.OUTPUT_FILE, unified, { spaces: 2 });
    console.log(`✅ Éxito: ${unified.length} empleos guardados en ${CONFIG.OUTPUT_FILE}`);
}

if (require.main === module) {
    main();
}

module.exports = { main, fetchAdemJobs, deduplicateJobs };
