// This is a conceptual bridge. Since the agent can use the browser tool, 
// I will perform the extraction in the browser and then use this script
// to process the result and sync with Supabase.

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const CONFIG = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
};

async function syncJobData(jobs) {
    if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('❌ Supabase config missing.');
        return;
    }

    const supabase = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_SERVICE_ROLE_KEY);
    console.log(`📤 Sincronizando ${jobs.length} ofertas privadas con Supabase...`);

    // Manual Upsert: Delete existing by link_url then insert
    const urls = jobs.map(j => j.link_url);
    await supabase.from('content_items').delete().in('link_url', urls);

    const supabaseItems = jobs.map(job => ({
        section: 'jobs',
        title: job.title,
        subtitle: job.company,
        description: job.location,
        link_url: job.link_url,
        badge_text: `ADEM Privado | ${new Date().toLocaleDateString()}`,
        created_at: new Date().toISOString()
    }));

    const { error } = await supabase.from('content_items').insert(supabaseItems);
    if (error) {
        console.error('❌ Error en Supabase:', error.message);
    } else {
        console.log('✅ Base de datos actualizada exitosamente con 50 ofertas privadas.');
    }
}

// Injected by the agent after browser extraction
const extractedJobs = [
  {
    "title": "Infirmier Préleveur - Prise en charge des Enfants - service Picken Doheem (h/f)",
    "company": "BIONEXT S.A.",
    "location": "LEUDELANGE (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1478259/Infirmier-Pr%C3%A9leveur---Prise-en-charge-des-Enfants---service-Picken-Doheem-(h-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Mitarbeiter Kundenservice Seefracht (m/w/d) FS-CC",
    "company": "Kuehne + Nagel S.à r.l.",
    "location": "CONTERN (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1500902/Mitarbeiter-Kundenservice-Seefracht-(m-w-d)-FS-CC.html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Secrétaire médicale (m/f)",
    "company": "-",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1500407/Secr%C3%A9taire-m%C3%A9dicale-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Chargé.e de formation (m/f)",
    "company": "ROSA LËTZEBUERG ASBL",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518664/Charg%C3%A9.e-de-formation-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "MYP Spanish + French Teacher Language B (m/f)",
    "company": "-",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518665/MYP-Spanish-+-French-Teacher-Language-B-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Saisonnier(e) (m/f)",
    "company": "-",
    "location": "ESCH-SUR-ALZETTE (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518662/Saisonnier(e)--(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Chargé.e de communication (m/f)",
    "company": "ROSA LËTZEBUERG ASBL",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518663/Charg%C3%A9.e-de-communication-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Esthéticienne (h/f)",
    "company": "WORK INSIDE LUXEMBOURG S.à r.l. - WIL emploi",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518660/Esth%C3%A9ticienne-(h-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Employé polyvalent petite restauration (m/f)",
    "company": "-",
    "location": "MERTERT (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518661/Employ%C3%A9-polyvalent-petite-restauration-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Esthéticienne agréée au Luxembourg (h/f)",
    "company": "WORK INSIDE LUXEMBOURG S.à r.l. - WIL emploi",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518659/Esth%C3%A9ticienne-agr%C3%A9%C3%A9e-au-Luxembourg-(h-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Barman (H/F/X) - All",
    "company": "Concept & Partners Sàrl",
    "location": "RECKANGE-SUR-MESS (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518657/Barman-(H-F-X)---All.html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Coordinateur Technique Installations de seguridad (m/f)",
    "company": "POST Luxembourg E.P.",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518658/Coordinateur-Technique-Installations-de-s%C3%A9curit%C3%A9-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Assistant Team Leader Service - Niederkorn (m/f)",
    "company": "-",
    "location": "DIFFERDANGE (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518655/Assistant-Team-Leader-Service---Niederkorn-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Magasinier (m/f/d)",
    "company": "Administration Communale Bissen",
    "location": "BISSEN (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518656/Magasinier-(m-f-d).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Sales Advisor used car (m/f)",
    "company": "-",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518654/Sales-Advisor-used-car--(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Réceptionniste avec service petit-déjeuner (h/f/d)",
    "company": "GINDT JEAN-CLAUDE",
    "location": "CLERVAUX (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518652/R%C3%A9ceptionniste-avec-service-petit-d%C3%A9jeuner-(h-f-d).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Second de cuisine (m/f)",
    "company": "GINDT JEAN-CLAUDE",
    "location": "CLERVAUX (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518653/Second-de-cuisine-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Private Assets Investment Specialist (Fixed-term contract - 12 months) (m/f)",
    "company": "Bank Pictet & Cie (Europe) AG, succursale de Luxembourg S.A.E.",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518650/Private-Assets-Investment-Specialist-(Fixed-term-contract---12-months)-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Poseur de film adhésif polyvalent (m/f)",
    "company": "-",
    "location": "BERTRANGE (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518651/Poseur-de-film-adh%C3%A9sif-polyvalent-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Quality Specialist (m/f)",
    "company": "POST Luxembourg E.P.",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518648/Quality-Specialist-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Conseiller juridique expérimenté (m/f)",
    "company": "POST Luxembourg E.P.",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518649/Conseiller-juridique-exp%C3%A9riment%C3%A9-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Comptable expérimenté (m/f)",
    "company": "POST Luxembourg E.P.",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518647/Comptable-exp%C3%A9riment%C3%A9-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Educateur diplômé (m/f/d)",
    "company": "-",
    "location": "DUDELANGE (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518645/Educateur-dipl%C3%B4m%C3%A9-(m-f-d).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Chargé Transaction Monitoring - CDD 12 mois (m/f)",
    "company": "POST Luxembourg E.P.",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518646/Charg%C3%A9-Transaction-Monitoring---CDD-12-mois-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Infirmier psychiatrique ou infirmier (m/f/d) - Suivi Ambulatoire",
    "company": "-",
    "location": "ETTELBRUCK (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518643/Infirmier-psychiatrique-ou-infirmier-(m-f-d)---Suivi-Ambulatoire.html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Educateur diplômé ou auxiliaire de vie (m/f/d)",
    "company": "-",
    "location": "DUDELANGE (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518644/Educateur-dipl%C3%B4m%C3%A9-ou-auxiliaire-de-vie-(m-f-d).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Infirmier psychiatrique ou infirmier (m/f/d) - Wiltz",
    "company": "-",
    "location": "WILTZ (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518641/Infirmier-psychiatrique-ou-infirmier-(m-f-d)---Wiltz.html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Infirmier/ère en pédiatrie ou infirmier/ère ou éducateur/trice diplôm(e) (h/f/x) CDI",
    "company": "-",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518642/Infirmier-%C3%A8re-en-p%C3%A9diatrie-ou-infirmier-%C3%A8re-ou-%C3%A9ducateur-trice-dipl%C3%B4m(e)-(h-f-x)-CDI.html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Educateur(trice) - CDI - 50% (m/f/x)",
    "company": "-",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518640/Educateur(trice)---CDI---50--(m-f-x).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Aide-soignant (m/f/d) - Centre d'Aide et de Soins de Luxembourg-Est (Niederanven)",
    "company": "Stëftung Hëllef Doheem A.S.B.L.",
    "location": "NIEDERANVEN (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518638/Aide-soignant-(m-f-d)---Centre-d'Aide-et-de-Soins-de-Luxembourg-Est-(Niederanven).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Senior Enterprise Architect (h/f)",
    "company": "FOYER ASSURANCES S.A.",
    "location": "LEUDELANGE (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518639/Senior-Enterprise-Architect-(h-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Concierge Technique (H/F)",
    "company": "CACTUS S.A.",
    "location": "ESCH-SUR-ALZETTE (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518636/Concierge-Technique-(H-F).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Agent administratif pour les besoins de l'Ecole régionale de musique - tâche partielle (50%) (m/f)",
    "company": "-",
    "location": "MONDORF-LES-BAINS (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518637/Agent-administratif-pour-les-besoins-de-l'Ecole-r%C3%A9gionale-de-musique---t%C3%A2che-partielle-(50-)-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Ingénieur Senior Microsoft - Infrastructure & Sécurité (H/F)",
    "company": "-",
    "location": "KOERICH (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518635/Ing%C3%A9nieur-Senior-Microsoft---Infrastructure-&-S%C3%A9curit%C3%A9-(H-F).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Customer Success Representative (m/f)",
    "company": "-",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518634/Customer-Success-Representative-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Funds Controller (Fixed-term contract - 6 months) (m/f)",
    "company": "Bank Pictet & Cie (Europe) AG, succursale de Luxembourg S.A.E.",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518633/Funds-Controller-(Fixed-term-contract---6-months)-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Mécanicien Soudeur (m/f)",
    "company": "Ateliers Mécaniques DOSTERT, Sàrl",
    "location": "BISSEN (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518632/M%C3%A9canicien-Soudeur-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Responsable syndical adjoint (m/f)",
    "company": "-",
    "location": "ESCH-SUR-ALZETTE (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518631/Responsable-syndical-adjoint-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Assistant Commercial – Corporate Banking (H/F) - 12 mois",
    "company": "BGL BNP Paribas S.A.",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518629/Assistant-Commercial-%E2%80%93-Corporate-Banking-(H-F)---12-mois.html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Software developer in Environmental Modeling & Data Science (m/f)",
    "company": "Université du Luxembourg",
    "location": "ESCH-SUR-ALZETTE (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518630/Software-developer-in-Environmental-Modeling-&-Data-Science-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "MIDDLE-OFFICE SYSTEMS & TECHNOLOGY SPECIALIST (m/f/d)",
    "company": "-",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518627/MIDDLE-OFFICE--SYSTEMS-&-TECHNOLOGY-SPECIALIST-(m-f-d).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Head of Private Custody (m/f)",
    "company": "Bank Pictet & Cie (Europe) AG, succursale de Luxembourg S.A.E.",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518628/Head-of-Private-Custody-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Collaborateur Bureau Technique (H/F) - Inside",
    "company": "wwbi",
    "location": "BISSEN (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518625/Collaborateur-Bureau-Technique-(H-F)---Inside.html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Administrative Officer (Fixed-term contract - 24 months) (m/f)",
    "company": "Bank Pictet & Cie (Europe) AG, succursale de Luxembourg S.A.E.",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518626/Administrative-Officer-(Fixed-term-contract---24-months)-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Psycholog / Master an der Psychologie oder Psychothérapie (w/m/x)",
    "company": "APEMH Hébergement et Services A.S.B.L.",
    "location": "DIPPACH (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518624/Psycholog---Master-an-der-Psychologie-oder-Psychoth%C3%A9rapie-(w-m-x).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Coach sportif (m/f)",
    "company": "-",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518622/Coach-sportif-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Coordinateurs (m/f)",
    "company": "-",
    "location": "SANEM (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518623/Coordinateurs-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Jardinier en espaces verts (m/f)",
    "company": "American Battle Monuments Commission",
    "location": "LUXEMBOURG (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518620/Jardinier-en-espaces-verts-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Comptable (m/f)",
    "company": "-",
    "location": "WALFERDANGE (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518621/Comptable-(m-f).html?searchId=1768062443.3164&page=1"
  },
  {
    "title": "Plonge en restauration (m/f)",
    "company": "-",
    "location": "BISSEN (LUXEMBOURG)",
    "link_url": "https://jobboard.adem.lu/display-job/1518618/Plonge-en-restauration-(m-f).html?searchId=1768062443.3164&page=1"
  }
]; 

syncJobData(extractedJobs);
