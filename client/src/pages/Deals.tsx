import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowUpRight, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";

import { ContentGate } from "@/components/ContentGate";

export default function Deals() {
    const { t } = useTranslation();
    const [deals, setDeals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            const res = await fetch("/api/content-items?section=deals");
            if (res.ok) {
                const data = await res.json();
                if (data && data.length > 0) {
                    setDeals(data);
                    setIsLoading(false);
                    return;
                }
            }
        } catch (e) {
            console.error("Failed to fetch deals", e);
        }

        // Fallback
        setDeals([
            {
                title: "Bridal Spa Day",
                subtitle: "Mondorf Domaine Thermal",
                badge_text: "15% OFF for Groups",
                image_url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop",
                link_url: "https://mondorf.lu"
            },
            {
                title: "Luxury Transport Package",
                subtitle: "VIP Limo Luxembourg",
                badge_text: "Free Champagne Upgrade",
                image_url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop",
                link_url: "#"
            },
            {
                title: "Venue Showcase Dinner",
                subtitle: "Sofitel Luxembourg Europe",
                badge_text: "Complimentary Tasting",
                image_url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049&auto=format&fit=crop",
                link_url: "#"
            },
            {
                title: "Designer Dress Rental",
                subtitle: "Bridal Chic",
                badge_text: "Access to 'Secret Sale'",
                image_url: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=2070&auto=format&fit=crop",
                link_url: "#"
            }
        ]);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#FAF8F3]">
            <ContentGate pageName="Deals" />
            <Link href="/">
                <button className="absolute top-6 left-6 z-50 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md border border-white/10 rounded-full p-3 md:px-6 md:py-2 flex items-center gap-2 transition-all group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden md:inline font-medium text-sm tracking-wide">MENU</span>
                </button>
            </Link>
            <SEO
                title={t("seo_pages.deals.title")}
                description={t("seo_pages.deals.desc")}
                keywords={["event deals luxembourg", "wedding discounts", "spa offers luxembourg", "bridal sale"]}
            />
            <div className="relative h-[40vh] overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="https://cdn.coverr.co/videos/coverr-hands-holding-a-gift-box-5346/1080p.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
                            {t("seo_pages.deals.title")}
                        </h1>
                        <p className="text-lg text-white/90 font-light tracking-wide max-w-2xl mx-auto">
                            {t("seo_pages.deals.subtitle")}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {deals.map((deal, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#E8E4DC] group hover:shadow-md transition-all"
                        >
                            <div className="relative aspect-[16/9] overflow-hidden">
                                <img
                                    src={deal.image_url}
                                    alt={deal.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {deal.badge_text && (
                                    <div className="absolute top-4 right-4 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                                        {deal.badge_text}
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="text-sm text-gray-500 mb-1">{deal.subtitle}</div>
                                <h3 className="text-xl font-serif mb-4 group-hover:text-primary transition-colors">{deal.title}</h3>
                                <a href={deal.link_url || "#"} className="inline-flex items-center gap-2 text-sm font-medium border-b border-black pb-0.5 hover:text-primary hover:border-primary transition-colors">
                                    View Offer <ArrowUpRight className="w-4 h-4" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
