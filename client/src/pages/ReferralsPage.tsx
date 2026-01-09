import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Mail } from 'lucide-react';
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import { SEO } from "@/components/SEO";

const AssociatedServices = () => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <SEO
        title={t('associated_services.presentation_lp.hero_title')}
        description={t('associated_services.presentation_lp.hero_subtitle')}
      />

      <Navigation />

      {/* Main Container - Paper Style Background */}
      <div className="min-h-screen bg-[#F9F7F2] text-[#2C2C2C] font-sans selection:bg-[#D4AF37] selection:text-white pt-24 pb-20">

        <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-sm overflow-hidden border border-gray-100/50">

          {/* Header / Hero Section - Clean & Elegant */}
          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center border-b border-gray-100">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1A1A1A] mb-4 tracking-tight">
                {t('associated_services.presentation_lp.hero_title')}
              </h1>
              <p className="text-xl md:text-2xl text-[#D4AF37] font-medium font-serif italic">
                {t('associated_services.presentation_lp.hero_subtitle')}
              </p>
            </motion.div>
          </div>

          {/* Content Body - Copywriting Style */}
          <div className="px-8 py-12 md:px-16 md:py-16 space-y-12 leading-relaxed text-lg text-gray-700">

            {/* Family Section */}
            <section>
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6 flex items-center gap-3">
                {t('associated_services.presentation_lp.section_family.title')}
              </h2>
              <div className="space-y-6">
                <p className="font-medium text-xl text-gray-900">
                  {t('associated_services.presentation_lp.section_family.p1')}
                </p>
                <p>
                  {t('associated_services.presentation_lp.section_family.p2')}
                </p>
                <p className="italic border-l-4 border-[#D4AF37] pl-6 py-2 bg-gray-50 text-gray-800">
                  {t('associated_services.presentation_lp.section_family.p3')}
                </p>
              </div>
            </section>

            {/* Digital Space Section */}
            <section>
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">
                {t('associated_services.presentation_lp.section_space.title')}
              </h2>
              <div className="space-y-6">
                <p>{t('associated_services.presentation_lp.section_space.p1')}</p>
                <p>{t('associated_services.presentation_lp.section_space.p2')}</p>
                <div className="bg-[#1A1A1A] text-white p-6 rounded-lg shadow-lg text-center transform -rotate-1 hover:rotate-0 transition-transform duration-300">
                  <p className="font-bold text-xl tracking-wide">
                    {t('associated_services.presentation_lp.section_space.highlight')}
                  </p>
                </div>
              </div>
            </section>

            {/* Automation Section */}
            <section>
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">
                {t('associated_services.presentation_lp.section_auto.title')}
              </h2>
              <p className="mb-8">{t('associated_services.presentation_lp.section_auto.intro')}</p>

              <ul className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <li key={item} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className="bg-[#D4AF37]/10 p-2 rounded-full mt-1 shrink-0">
                      <Check className="w-5 h-5 text-[#D4AF37]" strokeWidth={3} />
                    </div>
                    <span className="text-gray-800 font-medium">
                      {t(`associated_services.presentation_lp.section_auto.list.${item}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Why Welux? */}
            <section className="bg-[#F9F7F2] -mx-8 md:-mx-16 px-8 md:px-16 py-12 my-12 border-y border-[#D4AF37]/20">
              <h2 className="font-serif text-3xl text-[#1A1A1A] mb-6">
                {t('associated_services.presentation_lp.section_why.title')}
              </h2>
              <p className="text-xl font-medium text-gray-800 leading-relaxed">
                {t('associated_services.presentation_lp.section_why.text')}
              </p>
            </section>

            {/* CTA Box */}
            <div className="text-center space-y-8 pt-8">
              <h3 className="font-serif text-4xl text-[#1A1A1A]">
                {t('associated_services.presentation_lp.cta_box.title')}
              </h3>
              <p className="text-xl text-gray-600">
                {t('associated_services.presentation_lp.cta_box.text')}
              </p>

              <a
                href="mailto:agentes@weluxevents.com"
                onClick={() => (window as any).gtag_report_conversion ? (window as any).gtag_report_conversion() : null}
                className="inline-flex items-center gap-3 bg-[#D4AF37] text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-[#B5952F] transition-all hover:scale-105 shadow-xl hover:shadow-[#D4AF37]/30 cursor-pointer"
              >
                {t('associated_services.presentation_lp.cta_box.button')}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Agents Section (New) */}
            <div className="mt-24 border-t-2 border-dashed border-gray-200 pt-16 text-center">
              <div className="inline-block p-4 bg-gray-50 rounded-full mb-6">
                <Mail className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-serif text-2xl text-gray-900 mb-3">
                {t('associated_services.presentation_lp.agents_section.title')}
              </h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {t('associated_services.presentation_lp.agents_section.desc')}
              </p>
              <a
                href="mailto:agentes@weluxevents.com"
                onClick={() => (window as any).gtag_report_conversion ? (window as any).gtag_report_conversion() : null}
                className="text-[#D4AF37] font-semibold hover:text-[#B5952F] underline decoration-2 underline-offset-4 cursor-pointer"
              >
                agentes@weluxevents.com
              </a>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AssociatedServices;
