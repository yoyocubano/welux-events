
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";

import { ContentGate } from "@/components/ContentGate";

export default function Live() {
    const { t } = useTranslation();

    // Dynamic Channel ID & Platform Validation
    const [channelId, setChannelId] = useState<string>("");
    const [streamType, setStreamType] = useState<"youtube" | "custom">("youtube");
    const [customCode, setCustomCode] = useState<string>("");

    useEffect(() => {
        fetch('/api/get-settings')
            .then(res => res.json())
            .then(data => {
                const id = data.youtube_channel_id;
                setStreamType(data.stream_platform || "youtube");
                setCustomCode(data.custom_embed_code || "");

                // Ensure ID is a clean string, remove quotes if double-encoded
                if (id) {
                    setChannelId(id.replace(/"/g, ''));
                } else {
                    setChannelId("UC_YOUR_CHANNEL_ID_HERE"); // fallback
                }
            })
            .catch(err => {
                console.error("Failed to load settings", err);
                setChannelId("UC_YOUR_CHANNEL_ID_HERE");
            });
    }, []);

    return (
        <div className="min-h-screen flex flex-col font-sans bg-black text-white relative">
            <ContentGate pageName="Live Stream" mode="absolute" />
            <SEO
                title={t("seo_pages.streaming.title")}
                description={t("seo_pages.streaming.desc")}
            />
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-12 relative overflow-hidden">
                <div className="container relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/50 rounded-full bg-red-500/10 backdrop-blur-sm mb-6 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span className="text-red-500 text-sm font-bold tracking-wider uppercase">
                            LIVE NOW
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                        {t("seo_pages.streaming.title")}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
                        {t("seo_pages.streaming.desc")}
                    </p>
                </div>
            </section>

            {/* Main Streaming Area */}
            <section className="flex-grow pb-24">
                <div className="container max-w-6xl">
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900">
                        {/* 
                            Universal Player Logic:
                        */}
                        {streamType === 'custom' ? (
                            <div
                                className="absolute inset-0 w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                                dangerouslySetInnerHTML={{ __html: customCode }}
                            />
                        ) : (
                            <iframe
                                width="100%"
                                height="100%"
                                src={channelId.startsWith("UC")
                                    ? `https://www.youtube.com/embed/live_stream?channel=${channelId}`
                                    : `https://www.youtube.com/embed/${channelId}?autoplay=1&mute=0`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="absolute inset-0"
                            ></iframe>
                        )}
                    </div>
                </div>

                <div className="mt-8 grid md:grid-cols-3 gap-8 text-gray-300">
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-2xl font-serif font-semibold text-white">About this Broadcast</h2>
                        <p>
                            Welcome to our live transmission. Here you can witness our events, weddings, and special productions in real-time.
                            Experience the emotion as it happens.
                        </p>
                    </div>
                    <div className="space-y-4 p-6 bg-white/5 rounded-xl border border-white/10">
                        <h3 className="text-lg font-semibold text-white">Stream Info</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Status:</span>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span className="text-green-400 font-bold">Signal Active</span>
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span>Platform:</span>
                                <span>YouTube Live</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
