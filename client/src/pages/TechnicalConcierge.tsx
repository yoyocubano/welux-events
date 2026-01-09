
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Wrench, Zap, CheckCircle2, ArrowRight } from "lucide-react";

export default function TechnicalConcierge() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen flex flex-col font-sans bg-black text-white">
            <SEO
                title="Technical Concierge - Welux Events"
                description="Premium handyman and technical support services for your events and home."
            />
            <Navigation />

            {/* Hero Section */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0" />
                <div
                    className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581092921461-eab62e97a783?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"
                />

                <div className="container relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/30 rounded-full bg-[#D4AF37]/10 backdrop-blur-sm mb-8">
                        <Wrench className="w-4 h-4 text-[#D4AF37]" />
                        <span className="text-[#D4AF37] text-sm font-bold tracking-wider uppercase">
                            {t('technical_concierge.hero.new_service', 'New Service')}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-white">
                        {t('technical_concierge.hero.title', 'Technical Concierge')}
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        {t('technical_concierge.hero.description', 'The invisible hands that keep your world running. From event setups to emergency fixes, we handle the technical so you can enjoy the moment.')}
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-[#D4AF37] text-black hover:bg-[#b5952f] transition-colors font-semibold">
                            {t('technical_concierge.hero.cta', 'Book a Technician')} <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-24 bg-white/5 border-t border-white/10">
                <div className="container">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                <Zap className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                            <h3 className="text-xl font-bold font-serif text-[#D4AF37]">{t('technical_concierge.features.response.title', 'Rapid Response')}</h3>
                            <p className="text-gray-400">
                                {t('technical_concierge.features.response.desc', 'Emergency technical support when you need it most. We solve problems before your guests even notice.')}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                            <h3 className="text-xl font-bold font-serif text-[#D4AF37]">{t('technical_concierge.features.setup.title', 'Setup & Teardown')}</h3>
                            <p className="text-gray-400">
                                {t('technical_concierge.features.setup.desc', 'Professional installation of lighting, sound, and decor structures. Precise, safe, and invisible.')}
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                                <Wrench className="w-6 h-6 text-[#D4AF37]" />
                            </div>
                            <h3 className="text-xl font-bold font-serif">{t('technical_concierge.features.maintenance.title', 'Maintenance')}</h3>
                            <p className="text-gray-400">
                                {t('technical_concierge.features.maintenance.desc', 'Ongoing care for your equipment and venues. Perfection is in the details we maintain.')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
