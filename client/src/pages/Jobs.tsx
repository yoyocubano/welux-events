import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Briefcase, MapPin, Search, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";


// Initialize Supabase (Hardcoded key to fix Cloudflare Env Var issue)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://obijleonxnpsgpmqcdik.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9iaWpsZW9ueG5wc2dwbXFjZGlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzNjM4NjEsImV4cCI6MjA4MTkzOTg2MX0.lTr2Px0wbwdTzww9NJAV4at6qh_85K6z_kGand2IvqU";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    url: string;
    source: string;
    date_posted: string;
    description: string;
}

export default function Jobs() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            setLoading(true);
            try {
                // Fetch from Supabase 'content_items' table where section is 'jobs'
                const { data, error } = await supabase
                    .from('content_items')
                    .select('*')
                    .eq('section', 'jobs');

                if (error) {
                    console.error("Error fetching jobs from Supabase:", error);
                    setJobs([]);
                } else {
                    // Map content_items to Job interface
                    const mappedJobs: Job[] = (data as any[]).map(item => ({
                        id: item.id,
                        title: item.title,
                        company: item.subtitle,
                        location: item.description,
                        url: item.link_url,
                        source: item.badge_text ? item.badge_text.split('|')[0].trim() : "Unknown",
                        date_posted: item.created_at,
                        description: "" // content_items doesn't have a specific long description, using title/description
                    }));

                    // Sort: Luxembourg first, then by date
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

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <SEO
                title="Career Opportunities | Welux Events"
                description="Encuentra las mejores ofertas de trabajo en Luxemburgo. Agregador oficial de ADEM y oportunidades privadas."
                keywords={["jobs luxembourg", "trabajo luxemburgo", "adem jobs", "ofertas empleo"]}
            />
            <div className="min-h-screen bg-[#FAF8F3] relative">
                <Link href="/">
                    <button className="absolute top-6 left-6 z-50 bg-white/80 hover:bg-white text-black backdrop-blur-md border border-black/5 rounded-full p-3 md:px-6 md:py-2 flex items-center gap-2 transition-all shadow-sm group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden md:inline font-medium text-sm tracking-wide">MENU</span>
                    </button>
                </Link>

                <div className="container mx-auto px-4 py-20">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">
                            Career Opportunities
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Descubre vacantes exclusivas en el mercado de Luxemburgo. Conectamos talento con oportunidades en eventos, corporativo y más.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-xl mx-auto mb-16 flex gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                placeholder="Buscar por cargo, empresa o ubicación..."
                                className="pl-10 h-12 bg-white border-gray-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button className="h-12 bg-[#D4AF37] hover:bg-[#B5952F] text-white px-8">
                            {t("common.search", "Buscar")}
                        </Button>
                    </div>

                    {/* Job List */}
                    {loading ? (
                        <div className="text-center py-20 text-gray-500">
                            <div className="animate-pulse flex flex-col items-center">
                                <div className="h-4 w-48 bg-gray-200 rounded mb-4"></div>
                                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 max-w-4xl mx-auto">
                            {filteredJobs.length > 0 ? (
                                filteredJobs.map((job) => (
                                    <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                            <div className="flex-grow">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-[#D4AF37] transition-colors">
                                                        {job.title}
                                                    </h3>
                                                    {job.location.toLowerCase().includes("luxembourg") && (
                                                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-tight">Luxembourg</span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
                                                    <span className="flex items-center gap-1">
                                                        <Briefcase className="w-4 h-4" />
                                                        {job.company}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {job.location}
                                                    </span>
                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {job.source}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 line-clamp-2">
                                                    {job.description || `Oportunidad publicada vía ${job.source}. Haz clic en aplicar para ver los requisitos completos y datos de contacto.`}
                                                </p>
                                            </div>
                                            <a
                                                href={job.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full md:w-auto inline-flex items-center justify-center h-10 px-6 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shrink-0"
                                            >
                                                Aplicar
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                                    <p className="text-gray-500">
                                        No se encontraron ofertas activas en este momento. <br />
                                        <span className="text-sm">Prueba ejecutando el "Job Aggregator" desde el Admin para actualizar los datos.</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Attribution */}
                    <div className="text-center mt-12 text-xs text-gray-400">
                        Powered by ADEM, EURES & Private Collaborations
                    </div>
                </div>
            </div>
        </>
    );
}
