const axios = require('axios');
const xml2js = require('xml2js');
const { parse } = require('csv-parse');
const fs = require('fs-extra');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// CONFIGURACIÓN DE APIS
const CONFIG = {
    EURES_API_KEY: process.env.EURES_API_KEY || 'TU_API_KEY_AQUI', 
    RANDSTAD_CLIENT_ID: process.env.RANDSTAD_CLIENT_ID || 'TU_CLIENT_ID_AQUI',
    OUTPUT_FILE: 'jobs.json',
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
};

// Inicializar Supabase
const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE_KEY);

/**
 * Traduce un lote de empleos usando la API de Deepseek
 */
async function translateBatch(jobs) {
    if (!process.env.DEEPSEEK_API_KEY) {
        console.warn('⚠️ DEEPSEEK_API_KEY no configurada. Saltando traducciones.');
        return jobs;
    }

    console.log(`🌐 Traduciendo ${jobs.length} empleos con Deepseek...`);

    for (let job of jobs) {
        try {
            const prompt = `Translate the following job info into English (en), Spanish (es), French (fr), German (de), Luxembourgish (lu), and Portuguese (pt).
            Job Title: "${job.title}"
            Location: "${job.location}"
            
            Return ONLY a JSON object with this structure:
            {
              "en": { "title": "...", "location": "..." },
              "es": { "title": "...", "location": "..." },
              "fr": { "title": "...", "location": "..." },
              "de": { "title": "...", "location": "..." },
              "lu": { "title": "...", "location": "..." },
              "pt": { "title": "...", "location": "..." }
            }`;

            const res = await axios.post('https://api.deepseek.com/chat/completions', {
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' }
            }, {
                headers: { 'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}` }
            });

            const translations = JSON.parse(res.data.choices[0].message.content);
            job.translations = translations;
            
            // Pausa breve para evitar límites de tasa
            await new Promise(r => setTimeout(r, 200));
        } catch (e) {
            console.error(`❌ Error traduciendo "${job.title}":`, e.message);
        }
    }
    return jobs;
}

/**
 * Categoriza una oferta basándose en palabras clave en el título
 */
function categorizeJob(title) {
    const t = (title || '').toLowerCase();
    
    if (t.includes('software') || t.includes('developer') || t.includes('it ') || t.includes('tech') || t.includes('data') || t.includes('informatique')) return 'IT & Technology';
    if (t.includes('infirmier') || t.includes('nurse') || t.includes('santé') || t.includes('médical') || t.includes('soins')) return 'Healthcare';
    if (t.includes('construction') || t.includes('bâtiment') || t.includes('ouvrier') || t.includes('maçon')) return 'Construction';
    if (t.includes('vente') || t.includes('sales') || t.includes('comercial')) return 'Sales & Retail';
    if (t.includes('cuisine') || t.includes('serveur') || t.includes('hotel') || t.includes('restaurante')) return 'Hospitality';
    if (t.includes('chauffeur') || t.includes('livreur') || t.includes('driver')) return 'Transport & Logistics';
    if (t.includes('comptable') || t.includes('finance') || t.includes('bank') || t.includes('banque')) return 'Finance & Accounting';
    
    return 'Other';
}

/**
 * Normaliza los datos al esquema de Welux
 */
const createJobObject = (id, title, company, location, date, url, source, contactInfo) => ({
    id: String(id),
    title: title || 'Sin título',
    company: company || 'Confidencial',
    location: location || 'Luxembourg',
    date: date || new Date().toISOString(),
    url: url || '',
    source: source,
    contactInfo: contactInfo || 'Ver detalles en el sitio oficial',
    category: categorizeJob(title),
    translations: {
        en: { title: '', location: '' },
        es: { title: '', location: '' },
        fr: { title: '', location: '' },
        de: { title: '', location: '' },
        lu: { title: '', location: '' },
        pt: { title: '', location: '' }
    }
});

/**
 * Elimina duplicados basándose en una huella digital única
 * y limpia strings para evitar fallos por espacios o mayúsculas.
 */
function deduplicateJobs(jobs) {
    const uniqueJobs = new Map();

    jobs.forEach(job => {
        // 1. Normalización de campos para la huella
        // Verificar que title y company existan antes de hacer replace
        const cleanTitle = (job.title || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const cleanCompany = (job.company || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // 2. Creamos la huella (Fingerprint)
        const fingerprint = `${cleanTitle}_${cleanCompany}`;

        if (!uniqueJobs.has(fingerprint)) {
            uniqueJobs.set(fingerprint, job);
        } else {
            // Opcional: Si ya existe, podrías comparar fechas y quedarte con la más reciente
            const existingJob = uniqueJobs.get(fingerprint);
            // Validar que date sea válido
            if (new Date(job.date) > new Date(existingJob.date)) {
                uniqueJobs.set(fingerprint, job);
            }
        }
    });

    return Array.from(uniqueJobs.values());
}


// --- 1. GOVJOBS.LU (RSS Not Available) ---
async function fetchGovJobs() {
    // GovJobs does not have a public RSS feed currently.
    // Ideally, we would scrape 'https://govjobs.public.lu/fr/postes-vacants.html' 
    // but that requires Puppeteer/Cheerio which is heavier.
    // For now, we rely on EURES/ADEM which often aggregate public jobs.
    console.log('--- GovJobs.lu: No RSS feed available. Skipping. ---');
    return [];
}

// --- 2. ADEM (data.public.lu - Open Data) ---
async function fetchAdemJobs() {
    console.log('--- Procesando ADEM (Open Data) ---');
    const datasetUrl = 'https://data.public.lu/api/1/datasets/chiffres-cles-de-ladem/';
    let records = [];

    try {
        const datasetInfo = await axios.get(datasetUrl);
        const resources = datasetInfo.data.resources || [];
        
        console.log(`Recursos encontrados: ${resources.map(r => `[${r.format}] ${r.title}`).join(', ')}`);

        // Prioritize 'skills' and 'vacancies' csv
        let csvResource = resources.find(r => 
           (r.format && r.format.toLowerCase() === 'csv') &&
           (r.title && r.title.toLowerCase().includes('skills'))
        );

        if (!csvResource) {
           csvResource = resources.find(r => r.format && r.format.toLowerCase() === 'csv');
        }

        if (csvResource) {
            console.log(`Descargando CSV (Stream): ${csvResource.url} (${csvResource.title})`);
            const response = await axios({
                method: 'get',
                url: csvResource.url,
                responseType: 'stream'
            });

            const parser = response.data.pipe(parse({
                columns: true,
                skip_empty_lines: true,
                delimiter: ',', // Updated to comma based on debug output
                relax_quotes: true,
                relax_column_count: true,
                to: 50 // Limit to 50 records for efficiency
            }));

            for await (const row of parser) {
                if (records.length === 0) {
                    console.log('Claves encontradas en CSV:', Object.keys(row));
                }
                // Map ADEM fields
                const title = row.occupation_label || row.romes_label || row.Label || row.Metier || row['Job Title'] || row.title || 'Offre ADEM';
                const id = row.vacancy_id || `adem-${records.length}`;
                const uniqueUrl = `https://adem.public.lu/fr/jobboard.html?ref=${id}`;
                
                records.push(createJobObject(
                    id,
                    title,
                    'ADEM / Empresa Privada',
                    'Luxembourg',
                    new Date().toISOString(),
                    uniqueUrl,
                    'ADEM',
                    `Ref: ${id} | Postular en JobBoard ADEM`
                ));
            }

        } else {
            console.warn("No se encontró recurso CSV en dataset ADEM");
        }
    } catch (error) {
        console.error('Error en ADEM (Stream):', error.message);
    }

    return records;
}

// --- 3. EURES / EPSO (API REST) ---
async function fetchEuresJobs() {
    try {
        console.log('--- Procesando EURES ---');
        
        // MOCK / DEMO STRATEGY
        if (CONFIG.EURES_API_KEY === 'TU_API_KEY_AQUI') {
            console.warn('EURES: Usando datos de simulación (Falta API Key)');
            return [
                createJobObject('eures-1', 'Architecte de Solutions', 'EU Commission', 'Luxembourg City', new Date(), 'https://ec.europa.eu/eures/', 'EURES'),
                createJobObject('eures-2', 'Translator (DE/FR)', 'Publications Office of the EU', 'Luxembourg', new Date(), 'https://ec.europa.eu/eures/', 'EURES')
            ];
        }

        const response = await axios.post('https://ec.europa.eu/eures/eures-searchengine/v2/search/job/consult', {
            dataSetCode: "EURES_Search",
            filters: [
                { facetCode: "LOCATION", facetValues: ["LU"] }
            ]
        }, {
            headers: { 'X-Subscription-Key': CONFIG.EURES_API_KEY }
        });

        // Adapt based on real API response
        const items = response.data.items || [];
        return items.map(item => createJobObject(
            item.header.handle,
            item.header.title,
            item.header.employer.name,
            'Luxembourg',
            item.header.publishedDate,
            item.header.url,
            'EURES'
        ));
    } catch (error) {
        console.error('Error en EURES:', error.message);
        return [];
    }
}

// --- 4. RANDSTAD LUXEMBOURG (Developer Portal) ---
async function fetchRandstadJobs() {
    try {
        console.log('--- Procesando Randstad LU ---');
        
        if (CONFIG.RANDSTAD_CLIENT_ID === 'TU_CLIENT_ID_AQUI') {
             // Mock
             return [
                createJobObject('rs-1', 'Event Manager', 'Lux Event SA', 'Esch-sur-Alzette', new Date(), 'https://www.randstad.lu', 'Randstad')
            ];
        }

        const response = await axios.get('https://api.randstad.com/v1/jobs', {
            params: {
                countryCode: 'LU',
                limit: 20
            },
            headers: { 'Authorization': `Bearer ${CONFIG.RANDSTAD_CLIENT_ID}` }
        });

        return response.data.map(job => createJobObject(
            job.jobId,
            job.title,
            job.clientName,
            job.city,
            job.postedDate,
            job.url,
            'Randstad'
        ));
    } catch (error) {
        console.error('Error en Randstad (Simulado por falta de Auth):', error.message);
        return [
            createJobObject('rs-1', 'Event Manager', 'Lux Event SA', 'Esch-sur-Alzette', new Date(), 'https://www.randstad.lu', 'Randstad'),
            createJobObject('rs-2', 'Senior Accountant', 'Finance Corp', 'Strassen', new Date(), 'https://www.randstad.lu', 'Randstad')
        ];
    }
}

// --- ORQUESTADOR PRINCIPAL ---
async function runAggregator() {
    console.log(`\n🚀 Iniciando Sync: ${new Date().toLocaleString()}`);
    
    // Ejecutar todas las fuentes en paralelo
    const results = await Promise.all([
        fetchGovJobs(),
        fetchAdemJobs(),
        fetchEuresJobs(),
        fetchRandstadJobs()
    ]);

    // Unificar arrays (flat)
    const rawJobs = results.flat();
    console.log(`📊 Total bruto encontrado: ${rawJobs.length} ofertas.`);

    // Deduplicar
        const cleanJobs = deduplicateJobs(rawJobs);
        console.log(`✨ Total tras deduplicación: ${cleanJobs.length} ofertas.`);

        // --- DEDUPLICACIÓN ADICIONAL POR URL (Para evitar errores de SQL) ---
        const jobsByUrl = new Map();
        cleanJobs.forEach(j => jobsByUrl.set(j.url, j));
        const finalJobs = Array.from(jobsByUrl.values());
        if (finalJobs.length !== cleanJobs.length) {
            console.log(`⚠️ Se filtraron ${cleanJobs.length - finalJobs.length} jobs adicionales con URLs duplicadas.`);
        }

    // 1. Guardar en JSON local (Backup/Debug)
    try {
        await fs.writeJson(path.join(__dirname, CONFIG.OUTPUT_FILE), finalJobs, { spaces: 2 });
        console.log(`✅ Archivo '${CONFIG.OUTPUT_FILE}' actualizado localmente.`);
    } catch (err) {
        console.error('Error guardando el archivo local:', err);
    }

    // 2. Sincronizar con Supabase
    if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Supabase credentials missing. Integration skipped.');
        return;
    }

    console.log('📤 Sincronizando con Supabase (tabla content_items)...');
    
    try {
        // 1. Obtener empleos actuales para saber qué insertar y qué actualizar
        const { data: existingItems, error: fetchError } = await supabase
            .from('content_items')
            .select('id, link_url')
            .eq('section', 'jobs');

        if (fetchError) throw fetchError;

        const urlToIdMap = new Map(existingItems.map(item => [item.link_url, item.id]));
        
        const toInsertRaw = [];
        const toUpdate = [];

        finalJobs.forEach(job => {
            const item = {
                section: 'jobs',
                title: job.title,
                subtitle: job.company,
                description: job.location,
                link_url: job.url,
                badge_text: job.category,
                metadata: {
                    source: job.source,
                    contact_info: job.contactInfo,
                    date: job.date,
                    translations: job.translations
                }
            };

            if (urlToIdMap.has(job.url)) {
                toUpdate.push({ id: urlToIdMap.get(job.url), ...item });
            } else {
                toInsertRaw.push(job);
            }
        });

        // 2. Solo traducir los NUEVOS para ahorrar API de Deepseek
        let toInsert = [];
        if (toInsertRaw.length > 0) {
            const translatedJobs = await translateBatch(toInsertRaw);
            toInsert = translatedJobs.map(job => ({
                section: 'jobs',
                title: job.title,
                subtitle: job.company,
                description: job.location,
                link_url: job.url,
                badge_text: job.category,
                metadata: {
                    source: job.source,
                    contact_info: job.contactInfo,
                    date: job.date,
                    translations: job.translations
                },
                created_at: new Date().toISOString()
            }));
        }

        // 3. Ejecutar inserciones
        if (toInsert.length > 0) {
            const { error: insError } = await supabase.from('content_items').insert(toInsert);
            if (insError) console.error('Error insertando:', insError.message);
            else console.log(`✅ Insertados ${toInsert.length} nuevos empleos (Categorizados y Traducidos).`);
        }

        // 3. Ejecutar actualizaciones
        if (toUpdate.length > 0) {
            const { error: updError } = await supabase.from('content_items').upsert(toUpdate);
            if (updError) console.error('Error actualizando:', updError.message);
            else console.log(`✅ Actualizados ${toUpdate.length} empleos existentes.`);
        }

        console.log(`✨ Sincronización finalizada.`);

    } catch (err) {
        console.error('❌ Error sincronizando con Supabase:', err.message);
    }
}

runAggregator();
