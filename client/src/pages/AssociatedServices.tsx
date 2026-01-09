import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { Check, Star, ArrowRight, Zap, Users, Mail, Globe, Clock, ShieldCheck, ShoppingCart, Share2, Search, MessageSquare, Smartphone, Brain, Rocket, Trophy, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function AssociatedServices() {
  const { t, i18n } = useTranslation();
  const isSpanish = i18n.language.startsWith('es');

  const services = [
    {
      icon: <Globe className="w-8 h-8 text-[#D4AF37]" />,
      title: t("associated_services.web_design.title"),
      desc: t("associated_services.web_design.desc"),
      color: "bg-white/5 border-white/10"
    },
    {
      icon: <ShoppingCart className="w-8 h-8 text-[#D4AF37]" />,
      title: t("associated_services.shopify.title"),
      desc: t("associated_services.shopify.desc"),
      color: "bg-white/5 border-white/10"
    },
    {
      icon: <Share2 className="w-8 h-8 text-[#D4AF37]" />,
      title: t("associated_services.social_media.title"),
      desc: t("associated_services.social_media.desc"),
      color: "bg-white/5 border-white/10"
    },
    {
      icon: <Search className="w-8 h-8 text-[#D4AF37]" />,
      title: t("associated_services.seo.title"),
      desc: t("associated_services.seo.desc"),
      color: "bg-white/5 border-white/10"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0A0A0A] text-white selection:bg-[#D4AF37] selection:text-black">
      <SEO
        title={t("associated_services.presentation_lp.hero_title")}
        description={t("associated_services.presentation_lp.hero_subtitle")}
      />
      <Navigation />

      {/* Hero Section - Premium & Warmer */}
      <section className="pt-40 pb-20 relative overflow-hidden flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37]/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
        </div>

        <div className="container relative z-10 text-center max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block px-4 py-1 rounded-full border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-black tracking-[0.2em] uppercase mb-8 bg-[#D4AF37]/5 backdrop-blur-md">
              {t("associated_services.title")}
            </span>
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
              {t("associated_services.presentation_lp.hero_title")}
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 font-light mb-12 max-w-3xl mx-auto italic opacity-80">
              {t("associated_services.presentation_lp.hero_subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                size="lg"
                className="bg-[#D4AF37] hover:bg-[#B5952F] text-black font-black px-12 py-8 rounded-full transition-all text-xl shadow-2xl shadow-[#D4AF37]/20 hover:scale-105"
                onClick={() => window.location.href = '#contact'}
              >
                {t("associated_services.cta.button")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Family Section - The Personal Connection */}
      <section className="py-32 bg-[#0F0F0F] relative">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 group"
            >
              <img 
                src="https://images.unsplash.com/photo-1543269664-56d93c1b41a6?auto=format&fit=crop&q=80&w=1200" 
                alt="Welux Family Business" 
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-10 left-10">
                <p className="text-[#D4AF37] text-4xl font-serif">" {isSpanish ? 'De familia a familia' : 'From family to family'} "</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-black text-[#D4AF37]">
                {t("associated_services.presentation_lp.section_family.title")}
              </h2>
              <div className="space-y-6 text-xl text-gray-400 leading-relaxed font-light">
                <p className="text-white font-medium text-2xl">
                  {t("associated_services.presentation_lp.section_family.p1")}
                </p>
                <p>
                  {t("associated_services.presentation_lp.section_family.p2")}
                </p>
                <p>
                  {t("associated_services.presentation_lp.section_family.p3")}
                </p>
              </div>
              <div className="pt-4 flex items-center space-x-4 border-l-2 border-[#D4AF37] pl-6 italic text-[#D4AF37]/80">
                <Heart size={20} />
                <span>{isSpanish ? 'Cuidamos tu negocio como el nuestro.' : 'We care for your business like our own.'}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Digital Space Section - The Engine */}
      <section className="py-32 bg-black border-y border-white/5">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              {t("associated_services.presentation_lp.section_space.title")}
            </h2>
            <div className="max-w-3xl mx-auto text-xl text-gray-400 space-y-4">
              <p>{t("associated_services.presentation_lp.section_space.p1")}</p>
              <p>{t("associated_services.presentation_lp.section_space.p2")}</p>
            </div>
          </motion.div>

          {/* New Bento Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10 }}
                className={`p-8 rounded-3xl border border-white/5 bg-[#0F0F0F] hover:border-[#D4AF37]/30 transition-all duration-500`}
              >
                <div className="mb-6 p-4 rounded-2xl bg-[#D4AF37]/10 w-fit">{service.icon}</div>
                <h3 className="text-2xl font-black mb-4 group-hover:text-[#D4AF37] transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-500 leading-relaxed font-light">
                  {service.desc}
                </p>
              </motion.div>
            ))}

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-4 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] rounded-3xl p-1 px-8 py-6 text-center"
            >
              <p className="text-black text-2xl md:text-3xl font-black uppercase tracking-tighter">
                {t("associated_services.presentation_lp.section_space.highlight")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Automation Section - The Smart Part */}
      <section className="py-32 bg-[#0F0F0F] relative overflow-hidden">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-[#D4AF37] mb-8">
                {t("associated_services.presentation_lp.section_auto.title")}
              </h2>
              <p className="text-xl text-gray-300 mb-12">
                {t("associated_services.presentation_lp.section_auto.intro")}
              </p>
              
              <div className="space-y-6">
                {['1', '2', '3'].map((key) => (
                  <div key={key} className="flex gap-6 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-black">
                      {key}
                    </div>
                    <p className="text-lg text-gray-400 pt-1">
                      {t(`associated_services.presentation_lp.section_auto.list.${key}`)}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute inset-0 bg-[#D4AF37]/5 blur-3xl rounded-full" />
              <div className="relative bg-black rounded-[40px] border border-white/10 p-4 shadow-2xl overflow-hidden aspect-[9/16] max-w-[320px] mx-auto">
                {/* Chat Simulation Content */}
                <div className="h-full flex flex-col pt-12 px-4 space-y-6">
                   <div className="flex flex-col items-center mb-8">
                     <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center mb-2">
                       <Brain className="text-[#D4AF37]" size={32} />
                     </div>
                     <span className="text-[#D4AF37] font-black text-sm uppercase tracking-widest">WELUX AI</span>
                   </div>
                   
                   <div className="space-y-4">
                     <div className="bg-blue-600 self-end rounded-2xl rounded-tr-sm p-4 text-sm font-medium ml-8">
                       {t('associated_services.chatbot.simulation.msg_1')}
                     </div>
                     <div className="bg-[#1A1A1A] self-start rounded-2xl rounded-tl-sm p-4 text-sm text-gray-300 mr-8 border border-white/5 shadow-xl">
                       {t('associated_services.chatbot.simulation.msg_2')}
                     </div>
                     <div className="bg-blue-600 self-end rounded-2xl rounded-tr-sm p-4 text-sm font-medium ml-8">
                       {t('associated_services.chatbot.simulation.msg_3')}
                     </div>
                     <div className="bg-[#1A1A1A] self-start rounded-2xl rounded-tl-sm p-4 text-sm text-gray-300 mr-8 border border-white/5 shadow-xl">
                       {t('associated_services.chatbot.simulation.msg_4')}
                     </div>
                   </div>

                   <div className="mt-auto pb-4">
                      <div className="h-10 rounded-full bg-white/5 border border-white/10 px-4 flex items-center text-xs text-gray-500 italic">
                        {isSpanish ? 'Escribiendo respuesta inteligente...' : 'Typing smart response...'}
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section className="py-32 bg-black overflow-hidden">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="bg-gradient-to-br from-[#0F0F0F] to-black p-12 md:p-20 rounded-[40px] border border-[#D4AF37]/20 text-center relative"
          >
             <div className="absolute top-0 right-0 p-10 opacity-10">
               <Trophy size={100} className="text-[#D4AF37]" />
             </div>
             
             <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                {t("associated_services.presentation_lp.agents_section.title")}
             </h2>
             <p className="text-[#D4AF37] text-2xl font-bold mb-8 italic">
                {t("associated_services.presentation_lp.agents_section.subtitle")}
             </p>
             <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-12 font-light">
                {t("associated_services.presentation_lp.agents_section.desc")}
             </p>
             
             <div className="flex flex-col items-center space-y-6">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 font-black px-12 py-8 rounded-full transition-all text-xl hover:scale-105"
                  onClick={() => window.location.href = `mailto:agentes@weluxevents.com`}
                >
                  <Mail className="mr-3" />
                  {t("associated_services.presentation_lp.agents_section.contact_btn")}
                </Button>
                <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
                  {t("associated_services.presentation_lp.agents_section.email_text")}
                </p>
             </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section id="contact" className="py-40 text-center bg-black">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Zap className="w-16 h-16 text-[#D4AF37] mx-auto mb-10 animate-pulse" />
            <h2 className="text-5xl md:text-7xl font-black mb-12">
              {t("associated_services.cta.contact_us")}
            </h2>
            <div className="flex flex-col items-center space-y-8">
              <Button
                size="lg"
                className="bg-[#D4AF37] text-black hover:bg-[#B5952F] font-black text-2xl px-16 py-10 h-auto rounded-full group"
                onClick={() => window.location.href = 'mailto:info@weluxevents.com'}
              >
                {t("associated_services.cta.button")}
                <ArrowRight className="ml-4 w-8 h-8 group-hover:translate-x-3 transition-transform" />
              </Button>
              <div className="px-6 py-2 rounded-full border border-red-500/30 text-red-500 text-xs font-black tracking-widest">
                {t("associated_services.cta.limit_offer")} • {t("associated_services.cta.lower_prices")}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

