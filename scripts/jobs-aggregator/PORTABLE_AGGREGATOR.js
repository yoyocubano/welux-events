/**
 * PORTABLE JOB AGGREGATOR (Luxembourg Focus)
 * 
 * Este script es una versión autocontenida diseñada para ser clonada
 * en otros proyectos. Solo requiere un archivo `.env` configurado.
 * 
 * Dependencias: npm install axios csv-parse fs-extra
 */

const axios = require('axios');
const { parse } = require('csv-parse');
const fs = require('fs-extra');
const path = require('path');

// 1. CONFIGURACIÓN (Usa .env o valores directos)
const CONFIG = {
    ADEM_DATASET_URL: 'https://data.public.lu/api/1/datasets/chiffres-cles-de-ladem/',
    EURES_BASE_URL: 'https://ec.europa.eu/eures/eures-searchengine/v2/search/job/consult',
    OUTPUT_FILE: 'jobs_aggregated.json'
};

// 2. UTILIDADES
function createJobObject(id, title, company, location, date, url, source) {
    return {
        id,
        title: title || 'Sin Título',
        company: company || 'Empresa No Especificada',
        location: location || 'Luxemburgo',
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        url: url || '#',
        source
    };
}

function deduplicateJobs(jobs) {
    const unique = new Map();
    jobs.forEach(job => {
        const finger = `${(job.title||'').toLowerCase().replace(/[^a-z]/g,'')}_${(job.company||'').toLowerCase().replace(/[^a-z]/g,'')}`;
        if (!unique.has(finger) || new Date(job.date) > new Date(unique.get(finger).date)) {
            unique.set(finger, job);
        }
    });
    return Array.from(unique.values());
}

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
