import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Play, ArrowLeft, ArrowRight } from "lucide-react"; // Added ArrowRight, kept Play as it's used later
import ChatWidget from "@/components/ChatWidget";
import { SEO } from "@/components/SEO";

import { ContentGate } from "@/components/ContentGate";

export default function StreamingWindow() {
  const { t } = useTranslation();
  const [broadcasts, setBroadcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/get-settings')
      .then(res => res.json())
      .then(data => {
        const list = data.upcoming_broadcasts;
        if (Array.isArray(list)) {
          setBroadcasts(list);
        } else if (typeof list === 'string') {
          try {
            setBroadcasts(JSON.parse(list));
          } catch (e) { console.error("Parse error", e) }
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F3] relative">
      <ContentGate pageName="Streaming Page" mode="absolute" />
      <Link href="/">
        <button className="absolute top-6 left-6 z-50 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md border border-white/10 rounded-full p-3 md:px-6 md:py-2 flex items-center gap-2 transition-all group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden md:inline font-medium text-sm tracking-wide">MENU</span>
        </button>
      </Link>
      <SEO
        title={t("seo_pages.streaming.title")}
        description={t("seo_pages.streaming.desc")}
        keywords="live streaming luxembourg, welux events live, broadcasting services, wedding stream luxembourg"
      />
      <div className="relative h-[60vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://cdn.coverr.co/videos/coverr-recording-in-a-studio-5343/1080p.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">
              {t("seo_pages.streaming.title")}
            </h1>
            <p className="text-xl text-white/90 font-light tracking-wide max-w-2xl mx-auto">
              {t("seo_pages.streaming.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container py-24">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-sm border border-[#E8E4DC]">
          <div className="aspect-video bg-black/5 rounded-lg flex items-center justify-center mb-8 relative group cursor-pointer overflow-hidden">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <Play className="w-20 h-20 text-white opacity-90 group-hover:scale-110 transition-transform" />
            <p className="absolute bottom-8 text-white font-medium tracking-wide">Live Stream Offline - Check Schedule</p>
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gray-600 mb-8">{t("seo_pages.streaming.desc")}</p>

            <div className="text-left max-w-md mx-auto bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-serif text-lg mb-4 text-center">Upcoming Broadcasts</h3>
              <ul className="space-y-3 text-sm">
                {broadcasts.length > 0 ? (
                  broadcasts.map((item, idx) => (
                    <li key={idx} className="flex justify-between border-b pb-2 last:border-0">
                      <span className="font-semibold text-primary">{item.date}</span>
                      <span>{item.title}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-400 italic">No upcoming broadcasts scheduled.</li>
                )}
              </ul>
            </div>

            <button onClick={() => window.dispatchEvent(new CustomEvent('open-chat-widget'))} className="bg-primary text-black px-8 py-3 rounded-full hover:bg-primary/90 transition-colors font-medium">
              Get Reminders on WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
