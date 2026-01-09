import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { Check, Star, ArrowRight, Zap, Users, Mail, Globe, Clock, ShieldCheck, ShoppingCart, Share2, Search, MessageSquare, Smartphone, Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function AssociatedServices() {
  const { t } = useTranslation();

  const services = [
    {
      icon: <Globe className="w-8 h-8 text-blue-400" />,
      title: t("associated_services.web_design.title"),
      desc: t("associated_services.web_design.desc"),
      color: "bg-blue-500/10 border-blue-500/20"
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-green-400" />,
      title: t("associated_services.shopify.title"),
      desc: t("associated_services.shopify.desc"),
      color: "bg-green-500/10 border-green-500/20"
    },
    {
      icon: <Share2 className="w-8 h-8 text-pink-400" />,
      title: t("associated_services.social_media.title"),
      desc: t("associated_services.social_media.desc"),
      color: "bg-pink-500/10 border-pink-500/20"
    },
    {
      icon: <Search className="w-8 h-8 text-purple-400" />,
      title: t("associated_services.seo.title"),
      desc: t("associated_services.seo.desc"),
      color: "bg-purple-500/10 border-purple-500/20"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-black text-white">
      <SEO
        title={t("associated_services.title")}
        description={t("associated_services.subtitle")}
      />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-t from-purple-900/20 to-transparent" />

        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full border border-[#D4AF37]/50 text-[#D4AF37] text-sm tracking-widest uppercase mb-6 bg-[#D4AF37]/10 backdrop-blur-sm">
              {t("associated_services.title")}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400">
              {t("associated_services.subtitle")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t("associated_services.intro")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className="bg-[#D4AF37] hover:bg-[#B5952F] text-black font-bold px-8 py-4 rounded-full transition-all hover:scale-105"
              >
                {t("associated_services.cta.button")}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid (Bento Style) */}
      <section className="py-20 bg-gray-900/50">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-2xl border backdrop-blur-sm hover:bg-white/5 transition-colors ${service.color} border-white/5`}
              >
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chatbot Section (Star Product) */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/10 to-black" />
        <div className="container max-w-5xl mx-auto px-4 relative z-10">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-3xl p-8 md:p-16 overflow-hidden relative">

            {/* Glow effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-blue-400 font-bold tracking-widest text-sm uppercase mb-2 block">
                  {t("associated_services.chatbot.badge")}
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  {t("associated_services.chatbot.title")}
                </h2>
                <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                  {t("associated_services.chatbot.desc")}
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-green-500/10 p-3 rounded-lg h-fit">
                      <MessageSquare className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{t("associated_services.chatbot.whatsapp_integration.title")}</h4>
                      <p className="text-sm text-gray-500">{t("associated_services.chatbot.whatsapp_integration.desc")}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-purple-500/10 p-3 rounded-lg h-fit">
                      <Brain className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{t("associated_services.chatbot.smart_ai.title")}</h4>
                      <p className="text-sm text-gray-500">{t("associated_services.chatbot.smart_ai.desc")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative h-[400px] bg-black/50 rounded-2xl border border-white/5 flex items-center justify-center p-8">
                {/* Simulated Chat Interface */}
                <div className="w-full max-w-xs space-y-4">
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm p-3 text-sm max-w-[80%]">
                      {t('associated_services.chatbot.simulation.msg_1')}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-gray-200 rounded-2xl rounded-tl-sm p-3 text-sm max-w-[90%] shadow-lg">
                      <span className="text-xs text-gray-500 block mb-1">Welux AI</span>
                      {t('associated_services.chatbot.simulation.msg_2')}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm p-3 text-sm max-w-[80%]">
                      {t('associated_services.chatbot.simulation.msg_3')}
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-gray-800 text-gray-200 rounded-2xl rounded-tl-sm p-3 text-sm max-w-[90%] shadow-lg">
                      <span className="text-xs text-gray-500 block mb-1">Welux AI</span>
                      {t('associated_services.chatbot.simulation.msg_4')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">
            {t("associated_services.cta.contact_us")}
          </h2>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 font-bold text-lg px-10 py-6 h-auto rounded-full"
            onClick={() => window.location.href = 'mailto:info@weluxevents.com'}
          >
            <Zap className="w-5 h-5 mr-2" />
            {t("associated_services.cta.button")}
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
