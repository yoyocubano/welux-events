import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Moon, Music, Wine, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";

import { ContentGate } from "@/components/ContentGate";

export default function Nightlife() {
    const { t } = useTranslation();

    const spots = [
        {
            name: "HITCH",
            type: "Dinner & Dance",
            desc: "Where Limpertsberg meets the party. Great food that turns into a club vibe with live DJs on weekends. The place to see and be seen.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=1920&auto=format&fit=crop",
            icon: <Wine className="w-4 h-4" />
        },
        {
            name: "Melusina",
            type: "Nightclub",
            desc: "An institution in Clausen for decades. Known for its 'Afterwork' parties on Wednesdays and big club nights. Essential Luxembourg nightlife history.",
            image: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2670&auto=format&fit=crop",
            icon: <Music className="w-4 h-4" />
        },
        {
            name: "L'Observatoire (Sofitel)",
            type: "Skybar",
            desc: "The best view in town. Located on the 8th floor, overlooking the Pétrusse valley and the old city. Sophisticated cocktails, higher price point, worth it.",
            image: "https://images.unsplash.com/photo-1536257745686-29cb7fe88478?q=80&w=2669&auto=format&fit=crop",
            icon: <Moon className="w-4 h-4" />
        },
        {
            name: "De Gudde Wëllen",
            type: "Alternative & Live",
            desc: "Located in the Grund, it's the spot for indie music, craft beers, and a relaxed, cool crowd. Great terrace in the summer.",
            image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1920&auto=format&fit=crop",
            icon: <Music className="w-4 h-4" />
        },
        {
            name: "Gotham",
            type: "Premium Club",
            desc: "Dark, moody, and exclusive. If you're looking for bottle service and a high-energy urban vibe in the city center, this is it.",
            image: "https://images.unsplash.com/photo-1572116469696-958721272607?q=80&w=2574&auto=format&fit=crop",
            icon: <Wine className="w-4 h-4" />
        },
        {
            name: "Urban Bar",
            type: "City Center Hub",
            desc: "The meeting point. Located right next to the Grand Ducal Palace. Famous for its crowded terrace and legendary cocktails. Always busy.",
            image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1920&auto=format&fit=crop",
            icon: <Wine className="w-4 h-4" />
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <ContentGate pageName="Nightlife" />
            <Link href="/">
                <button className="absolute top-6 left-6 z-50 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 rounded-full p-3 md:px-6 md:py-2 flex items-center gap-2 transition-all group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden md:inline font-medium text-sm tracking-wide">MENU</span>
                </button>
            </Link>
            <SEO
                title={t("seo_pages.nightlife.title")}
                description={t("seo_pages.nightlife.desc")}
                keywords="nightlife luxembourg, best bars luxembourg, nightclubs luxembourg, luxury lounge"
            />
            <div className="relative h-[60vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                <img
                    src="https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=2670&auto=format&fit=crop"
                    alt="Nightlife"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center text-center px-4 z-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-5xl md:text-7xl font-serif mb-6 text-primary tracking-tighter">
                            {t("seo_pages.nightlife.title")}
                        </h1>
                        <p className="text-xl text-gray-300 font-light tracking-wide max-w-2xl mx-auto">
                            {t("seo_pages.nightlife.subtitle")}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {spots.map((spot, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="group cursor-pointer"
                        >
                            <div className="aspect-[3/4] overflow-hidden rounded-sm mb-6 relative">
                                <img
                                    src={spot.image}
                                    alt={spot.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
                                    {spot.icon} {spot.type}
                                </div>
                            </div>
                            <h3 className="text-2xl font-serif mb-2 group-hover:text-primary transition-colors">{spot.name}</h3>
                            <p className="text-gray-400 text-sm font-light leading-relaxed">{spot.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
