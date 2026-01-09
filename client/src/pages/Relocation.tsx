import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";

import { ContentGate } from "@/components/ContentGate";

export default function Relocation() {
    const { t } = useTranslation();

    const steps = [
        {
            title: "Housing Market Reality",
            desc: "The market is competitive. Expect to pay €1,600-€2,500 for a 1-bedroom apartment in the city. Agency fees are typically 1 month rent + VAT. Tip: Look in the 'South' or 'North' for better value if you don't mind a commute."
        },
        {
            title: "Mandatory Registration",
            desc: "You must declare your arrival at your local 'Commune' (Bierger-Center in the city) within 8 days. You'll need your passport and housing contract. This is the key to getting your tax card and social security."
        },
        {
            title: "Banking & Finance",
            desc: "Opening a bank account requires proof of residence. Major banks like Spuerkeess, BGL BNP Paribas, and ING are expat-friendly. Luxembourg is a Triple-A economy, so your money is safe here."
        },
        {
            title: "Transport is Free",
            desc: "Since 2020, all public transport (trains, trams, and buses) is 100% free nationwide. Download the 'Mobiliteit.lu' app to navigate the network like a pro."
        },
        {
            title: "Healthcare System (CNS)",
            desc: "The Caisse Nationale de Santé (CNS) covers most medical costs. You choose your doctor freely. Visits are paid upfront and reimbursed later (usually 88%)."
        },
        {
            title: "Language Landscape",
            desc: "Luxembourg is multilingual. French is the dominant daily language, English is the corporate standard, and Luxembourgish is the heart of the culture. A 'Moien' (Hello) goes a long way."
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAF8F3] relative">
            <ContentGate pageName="Relocation" mode="absolute" />
            <Link href="/">
                <button className="absolute top-6 left-6 z-50 bg-black/30 hover:bg-black/50 text-white backdrop-blur-md border border-white/10 rounded-full p-3 md:px-6 md:py-2 flex items-center gap-2 transition-all group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="hidden md:inline font-medium text-sm tracking-wide">MENU</span>
                </button>
            </Link>
            <SEO
                title={t("seo_pages.relocation.title")}
                description={t("seo_pages.relocation.desc")}
                keywords="moving to luxembourg guide, relocation tips luxembourg, housing luxembourg, luxembourg expat guide"
            />
            <div className="relative h-[50vh] overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover grayscale"
                >
                    <source src="https://cdn.coverr.co/videos/coverr-walking-in-a-city-5341/1080p.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl"
                    >
                        <h1 className="text-4xl md:text-5xl font-serif text-white mb-6">
                            {t("seo_pages.relocation.title")}
                        </h1>
                        <p className="text-xl text-white/90 font-light tracking-wide max-w-2xl mx-auto">
                            {t("seo_pages.relocation.subtitle")}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container py-24 max-w-4xl">
                <div className="space-y-12">
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="flex gap-6 items-start"
                        >
                            <div className="mt-1">
                                <CheckCircle2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-serif mb-2">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 bg-white p-8 md:p-12 rounded-lg border border-[#E8E4DC] text-center">
                    <h3 className="text-2xl font-serif mb-4">Planning an Event in Luxembourg?</h3>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">Once you're settled, we'd love to help you celebrate your new chapter.</p>
                    <a href="/contact" className="inline-block bg-primary text-black px-8 py-3 rounded-full hover:bg-primary/90 transition-colors font-medium">
                        Get in Touch
                    </a>
                </div>
            </div>
        </div>
    );
}
