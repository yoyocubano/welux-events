export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    url: string;
    source: string;
    date_posted: string;
    description: string;
    category: string;
    is_verified?: boolean;
    metadata?: {
        translations?: Record<string, { title: string; location: string }>;
        requires_driver?: boolean;
    };
}

export const VERIFIED_JOBS: Job[] = [
    // Hôtellerie
    {
        id: "verified-h1",
        title: "Barman (H/F/X)",
        company: "Concept & Partners Sàrl",
        location: "Luxembourg",
        url: "https://jobboard.adem.lu",
        source: "VERIFICADO",
        is_verified: true,
        date_posted: "2026-01-12",
        description: "Servicio de barra en ambiente dinámico. Se requiere experiencia previa y buen trato al cliente.",
        category: "Hospitality"
    },
    {
        id: "verified-h2",
        title: "Réceptionniste en Hôtellerie",
        company: "LIP Luxembourg Sarl",
        location: "Luxembourg-Ville",
        url: "https://www.moovijob.com",
        source: "VERIFICADO",
        is_verified: true,
        date_posted: "2026-01-12",
        description: "Misión intérimaire. Requisito indispensable: Manejo del software OPERA.",
        category: "Hospitality"
    },
    {
        id: "verified-h3",
        title: "Commis de cuisine / Pâtisserie",
        company: "Hostellerie du Grünewald",
        location: "Dommeldange",
        url: "https://www.moovijob.com",
        source: "VERIFICADO",
        is_verified: true,
        date_posted: "2026-01-12",
        description: "Ayudante de cocina o pastelería para hotel de renombre.",
        category: "Hospitality"
    },
    // Nettoyage
    {
        id: "verified-n1",
        title: "Agent de propreté",
        company: "Onet Cleaning and Services",
        location: "Luxembourg",
        url: "tel:+3524047401",
        source: "VERIFICADO",
        is_verified: true,
        date_posted: "2026-01-12",
        description: "Se habla español y portugués en los equipos. No requiere francés avanzado.",
        category: "Construction" // Mapping to closest available category if needed, but Construction/Service
    },
    {
        id: "verified-n2",
        title: "Agent de Nettoyage Industriel",
        company: "Dussmann Service Luxembourg",
        location: "Windhof",
        url: "https://www.dussmann.lu",
        source: "VERIFICADO",
        is_verified: true,
        date_posted: "2026-01-12",
        description: "Puestos en Windhof. Turnos estables.",
        category: "Construction"
    },
    // Logistique
    {
        id: "verified-l1",
        title: "Warehouse Operative",
        company: "Amazon Luxembourg",
        location: "Luxembourg",
        url: "https://amazon.jobs/en/locations/luxembourg",
        source: "VERIFICADO",
        is_verified: true,
        date_posted: "2026-01-12",
        description: "Ambiente internacional (Inglés como idioma principal).",
        category: "Transport & Logistics"
    },
    {
        id: "verified-l2",
        title: "Chauffeur Manut Catering",
        company: "Luxair",
        location: "Airport Luxembourg",
        url: "https://www.moovijob.com",
        source: "VERIFICADO",
        is_verified: true,
        date_posted: "2026-01-12",
        description: "Carga y descarga de suministros de catering.",
        category: "Transport & Logistics"
    }
];
