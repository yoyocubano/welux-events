import { Star, Quote, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function Testimonials() {
    const { t } = useTranslation();

    // Datos dinámicos desde i18n
    const testimonials = [
        {
            id: 1,
            name: t("testimonials.1.author"),
            role: t("testimonials.1.role"),
            content: t("testimonials.1.text"),
            rating: 5,
            image: "/testimonial-sophie-v2.png"
        },
        {
            id: 2,
            name: t("testimonials.2.author"),
            role: t("testimonials.2.role"),
            content: t("testimonials.2.text"),
            rating: 5,
            image: "/couple-balcony-luxury.png"
        },
        {
            id: 3,
            name: t("testimonials.3.author"),
            role: t("testimonials.3.role"),
            content: t("testimonials.3.text"),
            rating: 5,
            image: "/city-engagement.png"
        }
    ];

    const stats = [
        { label: t("testimonials.stats.weddings"), value: "150+" },
        { label: t("testimonials.stats.clients"), value: "98%" },
        { label: t("testimonials.stats.rating"), value: "5.0 ★" }
    ];

    return (
        <section className="py-24 bg-stone-50" id="testimonials">
            <div className="container mx-auto px-4">
                {/* Header de la sección */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
                        <Star className="w-4 h-4 fill-primary" />
                        <span className="tracking-wide uppercase">{t("testimonials.badge")}</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-6">
                        {t("testimonials.title")}
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        {t("testimonials.subtitle")}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 border-y border-stone-200 py-12">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2 font-serif">{stat.value}</div>
                            <div className="text-gray-600 uppercase tracking-wider text-sm font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {testimonials.map((testimonial) => (
                        <a
                            key={testimonial.id}
                            href={testimonial.id === 1 ? "https://www.trustpilot.com/evaluate/weddingseventslux.com" : "https://g.page/r/weddingseventslux/review"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                        >
                            <Card className="h-full border-none shadow-lg group-hover:shadow-2xl group-hover:-translate-y-1 transition-all duration-300 bg-white overflow-hidden cursor-pointer relative">
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                                <CardContent className="p-8 relative">
                                    <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10 group-hover:text-primary/20 transition-colors" />

                                    {/* Rating */}
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                                        ))}
                                    </div>

                                    {/* Content */}
                                    <p className="text-gray-700 italic mb-8 leading-relaxed group-hover:text-gray-900 transition-colors">
                                        "{testimonial.content}"
                                    </p>

                                    {/* Author */}
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            loading="lazy"
                                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors"
                                        />
                                        <div>
                                            <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                            <p className="text-sm text-primary font-medium">{testimonial.role}</p>
                                        </div>
                                    </div>

                                    {/* Link Hint */}
                                    <div className="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                                        {t("common.read_review", "Read Review")} <CheckCircle className="w-3 h-3" />
                                    </div>
                                </CardContent>
                            </Card>
                        </a>
                    ))}
                </div>

                {/* Leave a Review Section - Visual Hook */}
                <div className="max-w-4xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-8">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-8 flex items-center justify-center gap-3">
                        <span className="w-12 h-[1px] bg-[#D4AF37]"></span>
                        {t("testimonials.leave_review_title", "Share Your Experience")}
                        <span className="w-12 h-[1px] bg-[#D4AF37]"></span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Google Review Button */}
                        <a
                            href="https://g.page/r/CUD9Zcl46legEAE/review"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-[#D4AF37]/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" alt="Google" className="w-6 h-6 object-contain" />
                                </div>
                                <span className="font-semibold text-gray-800 group-hover:text-[#4285F4] transition-colors">Google Reviews</span>
                                <div className="flex text-[#F4B400] text-sm">★★★★★</div>
                            </div>
                        </a>


                        {/* Trustpilot Review Button */}
                        <a
                            href="https://www.trustpilot.com/evaluate/weddingseventslux.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-[#00b67a]/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100">
                                    <img src="/images/trustpilot-logo.svg" alt="Trustpilot" className="w-24 h-8 object-contain" />
                                </div>
                                <span className="sr-only">Trustpilot</span>
                                <div className="text-xs text-gray-400 group-hover:text-gray-600">Top Rated</div>
                            </div>
                        </a>

                        {/* Editus.lu Review Button */}
                        <a
                            href="https://www.editus.lu/en/search?q=Welux+Events"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative overflow-hidden bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-[#E4002B]/50 transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative z-10 flex flex-col items-center gap-3">
                                <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100">
                                    <img src="/images/editus-logo.svg" alt="Editus.lu" className="w-24 h-8 object-contain" />
                                </div>
                                <span className="sr-only">Editus.lu</span>
                                <div className="text-xs text-gray-400 group-hover:text-gray-600">Local Verified</div>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Trust Badges / Client Logos */}
                <div className="text-center opacity-70 scale-90">
                    <div className="flex flex-wrap justify-center items-center gap-12 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="text-xl font-serif font-bold text-gray-400 cursor-default">VOGUE</div>
                        <div className="text-xl font-serif font-bold text-gray-400 cursor-default">BRIDES</div>
                        <div className="text-xl font-serif font-bold text-gray-400 cursor-default">MyWed</div>
                        <div className="text-xl font-serif font-bold text-gray-400 cursor-default">Fearless</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
