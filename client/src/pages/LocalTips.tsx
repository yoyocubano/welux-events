
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { MapPin, Coffee, Camera } from "lucide-react";
import { SEO } from "@/components/SEO";
import { ContentGate } from "@/components/ContentGate";

export default function LocalTips() {
    const { t } = useTranslation();
    const [tips, setTips] = useState<any[]>([]);

    useEffect(() => {
        fetchTips();
    }, []);

    const fetchTips = async () => {
        try {
            const res = await fetch("/api/content-items?section=tips");
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    setTips(data);
                    return;
                }
            }
        } catch (e) {
            console.error("Failed to fetch tips", e);
        }

        // Fallback default data
        setTips([
            {
                title: "Mullerthal: Little Switzerland",
                subtitle: "Nature",
                description: "Just 30 min from the city, this region offers stunning rock formations and waterfalls. The 'Schiessentümpel' bridge is a must-see photo spot.",
                image_url: "https://images.unsplash.com/photo-1628178652367-9d722237eb35?q=80&w=2670&auto=format&fit=crop",
                badge_text: "Top Choice"
            },
            {
                title: "The Grund at Night",
                subtitle: "Culture",
                description: "Take the elevator down to the Grund. It's a fairy tale village within the city. Perfect for a quiet evening walk by the Alzette river or a drink at 'Scott's Pub'.",
                image_url: "https://images.unsplash.com/photo-1549480376-793544ba8f72?q=80&w=2670&auto=format&fit=crop",
                badge_text: "Must Visit"
            },
            {
                title: "Vianden Castle via Chairlift",
                subtitle: "Sightseeing",
                description: "Victor Hugo lived here for a reason. Take the chairlift up for the best view of the castle and the valley. It's one of the largest fortified castles west of the Rhine.",
                image_url: "https://images.unsplash.com/photo-1579768656112-9c1a53238622?q=80&w=2670&auto=format&fit=crop",
                badge_text: "History"
            },
            {
                title: "Moselle Wine Route",
                subtitle: "Gastronomy",
                description: "Drive route 10 along the Moselle river. Stop in Remich or Grevenmacher for a 'Crémant' tasting. The cooperative cellars offer great value.",
                image_url: "https://images.unsplash.com/photo-1569931727783-a1c6a2e4fe58?q=80&w=2670&auto=format&fit=crop",
                badge_text: "Wine"
            },
            {
                title: "Mudam & Dräi Eechelen",
                subtitle: "Art & History",
                description: "Visit the modern Mudam museum and the historic Fort Thüngen (Dräi Eechelen) right next door. It's the perfect contrast of Luxembourg's 1000-year evolution.",
                image_url: "https://images.unsplash.com/photo-1596489379965-021946051515?q=80&w=2671&auto=format&fit=crop",
                badge_text: "Museums"
            },
            {
                title: "Schueberfouer (August)",
                subtitle: "Tradition",
                description: "If you're here in late summer, this massive funfair on Glacis is mandatory. Eat a 'Gromperekichelcher' (potato pancake) with apple sauce. Trust us.",
                image_url: "https://images.unsplash.com/photo-1533230408703-0c7ae70f2b38?q=80&w=2670&auto=format&fit=crop",
                badge_text: "Seasonal"
            }
        ]);
    };

    const getIcon = (category: string) => {
        if (!category) return <MapPin className="w-4 h-4" />;
        const cat = category.toLowerCase();
        if (cat.includes('nature') || cat.includes('sight')) return <Camera className="w-4 h-4" />;
        if (cat.includes('food') || cat.includes('gastro') || cat.includes('drink')) return <Coffee className="w-4 h-4" />;
        return <MapPin className="w-4 h-4" />;
    };

    return (
        <div className="min-h-screen bg-[#FAF8F3] relative">
            <ContentGate pageName="Local Tips" mode="absolute" />
            <SEO
                title={t("seo_pages.tips.title")}
                description={t("seo_pages.tips.desc")}
                keywords="luxembourg travel tips, hidden gems luxembourg, local guide luxembourg"
            />

            <div className="relative h-[50vh] overflow-hidden">
                <div className="absolute inset-0 bg-black/30 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1518005068251-1d5756df444d?q=80&w=2648&auto=format&fit=crop"
                    alt="Luxembourg Hidden Gems"
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
                            {t("seo_pages.tips.title")}
                        </h1>
                        <p className="text-xl text-white/90 font-light tracking-wide max-w-2xl mx-auto">
                            {t("seo_pages.tips.subtitle")}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tips.map((tip, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-[#E8E4DC] overflow-hidden hover:shadow-lg transition-all group"
                        >
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <img
                                    src={tip.image_url}
                                    alt={tip.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                    {getIcon(tip.subtitle)} {tip.subtitle}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-serif mb-3 text-black group-hover:text-primary transition-colors">{tip.title}</h3>
                                <p className="text-gray-600 leading-relaxed font-light text-sm">{tip.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
