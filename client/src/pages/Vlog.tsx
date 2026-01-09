import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";

import { ContentGate } from "@/components/ContentGate";

export default function Vlog() {
    const { t } = useTranslation();

    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/content-items?section=vlog')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setPosts(data);
                } else {
                    // Fallback to static if empty or error
                    setPosts([
                        {
                            title: "2026 Trend Report: Immersive Weddings",
                            category: "Trends",
                            image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
                            published_at: "Jan 03, 2025"
                        },
                        {
                            title: "Sustainability is the New Luxury",
                            category: "Eco-Chic",
                            image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2070&auto=format&fit=crop",
                            published_at: "Dec 15, 2024"
                        }
                    ]);
                }
            })
            .catch(() => {
                // Keep static defaults on error
            });
    }, []);

    return (
        <div className="min-h-screen bg-[#FAF8F3] relative">
            <ContentGate pageName="Vlog" mode="absolute" />
            <SEO
                title={t("seo_pages.vlog.title")}
                description={t("seo_pages.vlog.desc")}
                keywords="wedding trends 2026, luxembourg event vlog, event planning tips, photographer vlog"
            />
            <div className="relative h-[50vh] overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
                    alt="Vlog Background"
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
                            {t("seo_pages.vlog.title")}
                        </h1>
                        <p className="text-xl text-white/90 font-light tracking-wide max-w-2xl mx-auto">
                            {t("seo_pages.vlog.subtitle")}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container py-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {posts.map((post, i) => (
                        <a
                            key={i}
                            href={post.link_url || "#"}
                            target={post.link_url ? "_blank" : undefined}
                            rel="noreferrer"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all h-full flex flex-col"
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={post.image_url || post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <span className="text-xs font-medium tracking-wider text-primary uppercase mb-2">{post.subtitle || post.category}</span>
                                    <h3 className="text-xl font-serif mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                                    {post.description && (
                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                                            {post.description}
                                        </p>
                                    )}
                                    <div className="flex items-center justify-between text-sm text-gray-400 mt-auto pt-4 border-t border-gray-100">
                                        <span>{post.badge_text || new Date(post.created_at).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-primary font-medium">
                                            Read <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
