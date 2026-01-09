import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ExternalLink, Wrench, CheckCircle2, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ContentGate } from "@/components/ContentGate";

export default function Tools() {
    const { t } = useTranslation();

    const tools = [
        {
            title: "The 'No-Surprise' Budget Sheet",
            desc: "Don't let hidden costs ruin the party. Our master spreadsheet tracks every cent. (Excel/Numbers)",
            category: "Finance",
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2622&auto=format&fit=crop",
            icon: <CheckCircle2 className="w-4 h-4" />
        },
        {
            title: "12-Month Wedding Timeline",
            desc: "The exact roadmap we use for our clients. Know exactly what to book and when.",
            category: "Planning",
            image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop",
            icon: <CheckCircle2 className="w-4 h-4" />
        },
        {
            title: "The Guest List Manager",
            desc: "Track RSVPs, dietary restrictions, and table assignments in one place.",
            category: "Organization",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2669&auto=format&fit=crop",
            icon: <CheckCircle2 className="w-4 h-4" />
        },
        {
            title: "Vendor Vetting Checklist",
            desc: "The 20 questions you MUST ask before hiring a caterer or photographer.",
            category: "Pro Tips",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2670&auto=format&fit=crop",
            icon: <CheckCircle2 className="w-4 h-4" />
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAF8F3] relative">
            <ContentGate pageName="Tools" mode="absolute" />
            <Link href="/">
                <button className="absolute top-6 left-6 z-50 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md border border-white/10 rounded-full p-3 md:px-6 md:py-2 flex items-center gap-2 transition-all group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden md:inline font-medium text-sm tracking-wide">MENU</span>
                </button>
            </Link>
            <SEO
                title={t("seo_pages.tools.title")}
                description={t("seo_pages.tools.desc")}
                keywords="wedding planning tools, budget calculator event, guest list manager free"
            />

            <div className="relative h-[50vh] overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop"
                    alt="Planning Tools"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
                            {t("seo_pages.tools.title")}
                        </h1>
                        <p className="text-xl text-white/90 font-light tracking-wide max-w-2xl mx-auto">
                            {t("seo_pages.tools.subtitle")}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {tools.map((tool, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#E8E4DC] hover:shadow-lg transition-all group cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="md:w-2/5 relative h-48 md:h-auto overflow-hidden">
                                    <img
                                        src={tool.image}
                                        alt={tool.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors" />
                                </div>
                                <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{tool.category}</span>
                                        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                                    </div>
                                    <h3 className="text-xl font-serif mb-3 group-hover:text-primary transition-colors">{tool.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{tool.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
