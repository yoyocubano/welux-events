const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { parse } = require('node-html-parser'); // Lightweight and fast for scraping
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const CONFIG = {
    ADEM_USER: process.env.ADEM_USER || 'yucolaguilar@gmail.com',
    ADEM_PASS: process.env.ADEM_PASS || '55846607.Cu',
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
};

async function runPrivateTunnel() {
    console.log('🚀 Iniciando Túnel Privado ADEM...');
    
    // 1. Login to get Session Cookie
    const searchUrl = 'https://jobboard.adem.lu/search';
    const loginUrl = 'https://jobboard.adem.lu/login?c=1';
    
    // In a real Node environment, we use a cookie jar
    const { wrapper } = require('axios-cookiejar-support');
    const { CookieJar } = require('tough-cookie');
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar, withCredentials: true }));

    try {
        console.log('🔑 Autenticando en ADEM...');
        const loginData = new URLSearchParams();
        loginData.append('username', CONFIG.ADEM_USER);
        loginData.append('password', CONFIG.ADEM_PASS);
        
        await client.post(loginUrl, loginData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        console.log('✅ Login exitoso. Iniciando búsqueda...');
        
        // 2. Initialize Search (Force search to get SearchID)
        console.log('🔎 Inicializando búsqueda con parámetros precisos...');
        const searchParams = new URLSearchParams();
        searchParams.append('action', 'search');
        searchParams.append('listing_type[equal]', 'Job');
        searchParams.append('quick_search', 'true');
        searchParams.append('adem_diff_public_search[multi_like][]', '94200'); // Default filter found in trace
        
        // Use GET as found in the trace for search-results
        const searchResponse = await client.get(`https://jobboard.adem.lu/search-results-jobs/?${searchParams.toString()}`);

        // The URL of the final response contains the searchId
        let finalUrl = searchResponse.request.res.responseUrl || '';
        console.log('📍 URL Final tras búsqueda:', finalUrl);
        
        let searchIdMatch = finalUrl.match(/searchId=([^&]+)/);
        const searchId = searchIdMatch ? searchIdMatch[1] : null;

        if (!searchId) {
            console.error('❌ No se pudo obtener el SearchID. ¿Login fallido?');
            return;
        }

        console.log(`✅ SearchID obtenido: ${searchId}. Extrayendo ofertas...`);
        
        let allJobs = [];
        // Extract 3 pages (60 jobs) for the first sync
        for (let page = 1; page <= 3; page++) {
            console.log(`📄 Procesando página ${page}...`);
            const ajaxUrl = `https://jobboard.adem.lu/ajax/?action=request_for_listings&listing_type[equal]=Job&searchId=${searchId}&provider=&page=${page}`;
            const response = await client.get(ajaxUrl);
            
            // The response is an HTML fragment inside a JSON
            const htmlFragment = response.data.html;
            const root = parse(htmlFragment);
            const items = root.querySelectorAll('.listing-item');

            items.forEach(item => {
                const titleEl = item.querySelector('a[href*="/display-job/"]');
                if (!titleEl) return;

                const text = item.text;
                const companyMatch = text.match(/Employeur:\s*([^\n]+)/);
                const locationMatch = text.match(/Commune:\s*([^\n]+)/);

                allJobs.push({
                    id: titleEl.getAttribute('href').split('/').pop(),
                    title: titleEl.text.trim(),
                    company: companyMatch ? companyMatch[1].trim() : 'N/A',
                    location: locationMatch ? locationMatch[1].trim() : 'Luxembourg',
                    url: `https://jobboard.adem.lu${titleEl.getAttribute('href')}`,
                    source: 'ADEM (Privado)',
                    date: new Date().toISOString()
                });
            });
        }

        console.log(`✨ Total extraído: ${allJobs.length} ofertas privadas.`);

        // 3. Sync with Supabase
        if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_SERVICE_ROLE_KEY) {
            const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE_KEY);
            console.log('📤 Sincronizando con Supabase...');
            
            const supabaseItems = allJobs.map(job => ({
                section: 'jobs',
                title: job.title,
                subtitle: job.company,
                description: job.location,
                link_url: job.url,
                badge_text: `ADEM Privado | ${new Date().toLocaleDateString()}`,
                created_at: new Date().toISOString()
            }));

            const { error } = await supabase.from('content_items').upsert(supabaseItems, { onConflict: 'link_url' });
            if (error) console.error('Error en Supabase:', error.message);
            else console.log('✅ Base de datos actualizada con ofertas privadas.');
        }

    } catch (error) {
        console.error('❌ Error en el túnel:', error.message);
    }
}

// To run this script, you need: npm install axios axios-cookiejar-support tough-cookie node-html-parser
runPrivateTunnel();
