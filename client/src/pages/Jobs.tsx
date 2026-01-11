import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Briefcase, MapPin, Search, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    url: string;
    source: string;
    date_posted: string;
    description: string;
    category: string;
    metadata?: {
        translations?: Record<string, { title: string; location: string }>;
        requires_driver?: boolean;
    };
}

const getCategories = (t: any) => [
    { id: "all", label: t("jobs.categories.all", "Todas"), icon: "📋" },
    { id: "IT & Technology", label: t("jobs.categories.it", "IT & Tech"), icon: "💻" },
    { id: "Healthcare", label: t("jobs.categories.healthcare", "Salud"), icon: "🏥" },
    { id: "Construction", label: t("jobs.categories.construction", "Construcción"), icon: "🏗️" },
    { id: "Sales & Retail", label: t("jobs.categories.sales", "Ventas"), icon: "🛍️" },
    { id: "Hospitality", label: t("jobs.categories.hospitality", "Hostelería"), icon: "🍽️" },
    { id: "Transport & Logistics", label: t("jobs.categories.transport", "Logística"), icon: "🚛" },
    { id: "Finance & Accounting", label: t("jobs.categories.finance", "Finanzas"), icon: "💰" },
];

export default function Jobs() {
    const { t, i18n } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [hideDriverJobs, setHideDriverJobs] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('content_items')
                    .select('*')
                    .eq('section', 'jobs');

                if (error) {
                    console.error("Error fetching jobs:", error);
                    setJobs([]);
                } else {
                    const mappedJobs: Job[] = (data as any[]).map(item => ({
                        id: item.id,
                        title: item.title,
                        company: item.subtitle,
                        location: item.description,
                        url: item.link_url,
                        source: item.metadata?.source || "ADEM",
                        date_posted: item.created_at,
                        description: "",
                        category: item.badge_text || "Other",
                        metadata: item.metadata
                    }));

                    const sortedJobs = mappedJobs.sort((a, b) => {
                        const aIsLux = a.location.toLowerCase().includes("luxembourg");
                        const bIsLux = b.location.toLowerCase().includes("luxembourg");
                        if (aIsLux && !bIsLux) return -1;
                        if (!aIsLux && bIsLux) return 1;
                        return new Date(b.date_posted).getTime() - new Date(a.date_posted).getTime();
                    });

                    setJobs(sortedJobs);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchJobs();
    }, []);

    const getTranslatedContent = (job: Job) => {
        const lang = i18n.language.split('-')[0]; // Handle cases like 'en-US'
        // Normalize 'lu' to 'lb' for Luxembourgish if necessary, 
        // though backend now uses 'lb'.
        const targetLang = lang === 'lu' ? 'lb' : lang;
        const translations = job.metadata?.translations;
        
        if (translations && translations[targetLang]) {
            return {
                title: translations[targetLang].title || job.title,
                location: translations[targetLang].location || job.location
            };
        }
        return { title: job.title, location: job.location };
    };

    const filteredJobs = jobs.filter(job => {
        const { title, location } = getTranslatedContent(job);
        const matchesSearch = 
            title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === "all" || job.category === selectedCategory;
        const matchesDriverFilter = !hideDriverJobs || !job.metadata?.requires_driver;
        
        return matchesSearch && matchesCategory && matchesDriverFilter;
    });

    return (
        <>
            <SEO
                title="Career Opportunities | Welux Events"
                description="Encuentra las mejores ofertas de trabajo en Luxemburgo. Categorización inteligente y traducciones automáticas."
                keywords={["jobs luxembourg", "trabajo luxemburgo", "adem jobs", "ofertas empleo"]}
            />
            <div className="min-h-screen bg-[#FAF8F3] relative pb-20">
                <Link href="/">
                    <button className="absolute top-6 left-6 z-50 bg-white/80 hover:bg-white text-black backdrop-blur-md border border-black/5 rounded-full p-3 md:px-6 md:py-2 flex items-center gap-2 transition-all shadow-sm group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden md:inline font-medium text-sm tracking-wide">{t("jobs.menu", "MENU")}</span>
                    </button>
                </Link>

                <div className="container mx-auto px-4 py-20">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
                            {t("nav.jobs", "Career Opportunities")}
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            {t("jobs.description", "Explora vacantes por sector. Todas las ofertas se traducen automáticamente para facilitar tu búsqueda.")}
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder={t("jobs.search_placeholder", "Puesto, empresa o ciudad...")}
                                className="pl-10 h-12 bg-white border-gray-200 shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mb-16 max-w-4xl mx-auto">
                        {getCategories(t).map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all border flex items-center gap-2 ${
                                    selectedCategory === cat.id 
                                    ? "bg-gray-900 text-white border-gray-900 shadow-md transform scale-105" 
                                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                }`}
                            >
                                <span>{cat.icon}</span>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-center mb-12">
                        <label className="inline-flex items-center cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={hideDriverJobs}
                                onChange={(e) => setHideDriverJobs(e.target.checked)}
                            />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                            <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-black transition-colors">
                                🚫 {t("jobs.hide_driver", "Ocultar empleos que requieren carnet de conducir")}
                            </span>
                        </label>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-gray-500">
                             <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
                                {[1,2,3].map(i => (
                                    <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
                                ))}
                             </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 max-w-4xl mx-auto">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => {
                                    const { title, location } = getTranslatedContent(job);
                                    return (
                                        <div key={job.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                                <div className="flex-grow">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#D4AF37] transition-colors leading-tight">
                                                            {title}
                                                        </h3>
                                                        {location.toLowerCase().includes("luxembourg") && (
                                                            <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded-sm uppercase tracking-tighter">LUX</span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
                                                        <span className="flex items-center gap-1 font-medium text-gray-700">
                                                            <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                                                            {job.company}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4" />
                                                            {location}
                                                        </span>
                                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                            {job.source}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                                                            {getCategories(t).find(c => c.id === job.category)?.label || job.category}
                                                        </span>
                                                        {job.metadata?.requires_driver && (
                                                            <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-600 rounded-full border border-gray-200 flex items-center gap-1">
                                                                🪪 {t("jobs.driver_required", "Carnet Requerido")}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                                    <a
                                                        href={job.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-full md:w-auto inline-flex items-center justify-center h-10 px-8 rounded-lg bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-all shadow-sm active:scale-95"
                                                    >
                                                        {t("common.apply", "Apply")}
                                                    </a>
                                                    <span className="text-[10px] text-gray-400 font-mono">
                                                        {new Date(job.date_posted).toLocaleDateString(i18n.language)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                                    <div className="text-4xl mb-4">🔍</div>
                                    <p className="text-gray-500 font-medium">
                                        {t("jobs.no_results", "No se encontraron ofertas en esta categoría.")} <br />
                                        <span className="text-sm font-normal">{t("jobs.no_results_hint", "Intenta cambiar el sector o buscar otros términos.")}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Attribution */}
                    <div className="text-center mt-12 text-xs text-gray-400">
                        {t("jobs.powered_by", "Powered by ADEM, EURES & Private Collaborations")}
                    </div>
                </div>
            </div>
        </>
    );
}
