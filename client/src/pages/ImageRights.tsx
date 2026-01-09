import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { SEO } from "@/components/SEO";
import { Shield, Camera, FileCheck } from "lucide-react";

export default function ImageRights() {
    const { t } = useTranslation();

    return (
        <div className="min-h-screen bg-[#FAF8F3] pt-20">
            <SEO
                title={t("image_rights.seo_title")}
                description={t("image_rights.seo_desc")}
                keywords="image rights, photography policy, welux events legal, gdpr images"
            />

            <div className="container py-12 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
                            {t("image_rights.title")}
                        </h1>
                        <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                    </div>

                    <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-12">
                        {/* Section 1: General Policy */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-primary">
                                <Camera className="w-6 h-6" />
                                <h2 className="text-2xl font-serif font-bold text-gray-800">{t("image_rights.photo_policy.title")}</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {t("image_rights.photo_policy.desc")}
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-600">
                                <li>{t("image_rights.photo_policy.list.1")}</li>
                                <li>{t("image_rights.photo_policy.list.2")}</li>
                                <li>{t("image_rights.photo_policy.list.3")}</li>
                            </ul>
                        </section>

                        {/* Section 2: Privacy */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-primary">
                                <Shield className="w-6 h-6" />
                                <h2 className="text-2xl font-serif font-bold text-gray-800">{t("image_rights.privacy.title")}</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {t("image_rights.privacy.desc_1")}
                            </p>
                            <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-gray-300">
                                {t("image_rights.privacy.removal_text")} <a href="mailto:info@weluxevents.com" className="text-primary font-medium hover:underline">info@weluxevents.com</a>.
                            </p>
                        </section>

                        {/* Section 3: Copyright */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-3 text-primary">
                                <FileCheck className="w-6 h-6" />
                                <h2 className="text-2xl font-serif font-bold text-gray-800">{t("image_rights.copyright.title")}</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {t("image_rights.copyright.desc", { year: new Date().getFullYear() })}
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
