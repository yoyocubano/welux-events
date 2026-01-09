import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Testimonials from "@/components/Testimonials";
import { Camera, Video, Heart, Award, Users, MapPin, Radio } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";

export default function Home() {
  const { t } = useTranslation();

  const featuredProjects = [
    {
      id: 1,
      title: t("portfolio.projects.chateau.title"),
      description: t("portfolio.projects.chateau.desc"),
      location: t("portfolio.projects.chateau.location"),
      coverImageUrl: "/couple-balcony-luxury.png",
    },
    {
      id: 2,
      title: t("portfolio.projects.city.title"),
      description: t("portfolio.projects.city.desc"),
      location: t("portfolio.projects.city.location"),
      coverImageUrl: "/city-engagement.png",
    },
  ];

  const loadingProjects = false;

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Welux Events",
            "image": "https://weluxevents.com/og-image.jpg",
            "logo": "https://weluxevents.com/logo-gold-new.png",
            "url": "https://weluxevents.com",
            "telephone": "+352 621 430 283",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Luxembourg City",
              "addressCountry": "LU"
            },
            "description": "Quiet Luxury Wedding Planner & Event Photographer in Luxembourg. We specialize in high-end photography, cinematic videography, and live streaming for exclusive events and corporate gatherings.",
            "areaServed": "Luxembourg",
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 49.6116,
              "longitude": 6.1319
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
              ],
              "opens": "09:00",
              "closes": "18:00"
            },
            "sameAs": [
              "https://www.instagram.com/weluxevents",
              "https://www.facebook.com/share/17ymwsPfDK/?mibextid=wwXIfr",
              "https://youtube.com/@weluxevents?si=E5ahuprszYIr06Fx",
              "https://www.tiktok.com/@weluxevents",
              "https://linkedin.com/company/weluxevents"
            ],
            "priceRange": "$$$$"
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": t("schema.faq.q1"),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t("schema.faq.a1")
                }
              },
              {
                "@type": "Question",
                "name": t("schema.faq.q2"),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t("schema.faq.a2")
                }
              },
              {
                "@type": "Question",
                "name": t("schema.faq.q3"),
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": t("schema.faq.a3")
                }
              }
            ]
          }
        ]}
      />
      <Navigation />

      {/* Hero Section */}
      <section id="main-content" className="relative pt-20 min-h-screen flex items-center overflow-hidden">
        {/* Background Image with Overlay */}
        {/* Background Video with Overlay */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="/chateau-wedding.png"
          >
            <source src="/hero-luxury.mp4" type="video/mp4" />
            <img
              src="/chateau-wedding.png"
              alt="Luxury Event in Luxembourg Chateau"
              className="w-full h-full object-cover object-center"
              loading="eager"
              fetchPriority="high"
            />
          </video>
          <div className="absolute inset-0 bg-black/60" /> {/* Darker overlay for 'Quiet Luxury' contrast */}
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center text-white space-y-6 md:space-y-8 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-tight tracking-tight break-words hyphens-auto">
              {t('hero.title')}
              <span className="block text-xl sm:text-2xl md:text-4xl lg:text-5xl font-sans font-light mt-4 tracking-wider uppercase text-primary break-words">
                {t('hero.subtitle')}
              </span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light tracking-wide max-w-2xl mx-auto px-2">
              {t('hero.description')}
            </p>

            <div className="pt-8">
              <Link href="/contact">
                <button className="cta-primary-button">
                  {t('hero.cta_primary')}
                </button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="pt-12 flex flex-col items-center space-y-2 opacity-80">
              <span className="text-xs tracking-[0.2em] uppercase font-sans">{t('hero.trust_badge')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-12 md:py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {t('services.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up delay-200">
            <Card className="border-border hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl lg:text-2xl font-serif font-semibold mb-3 break-words hyphens-auto">{t('services.wedding.title')}</h3>
                <p className="text-muted-foreground">
                  {t('services.wedding.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow delay-100">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl lg:text-2xl font-serif font-semibold mb-3 break-words hyphens-auto">{t('services.video.title')}</h3>
                <p className="text-muted-foreground">
                  {t('services.video.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow delay-150">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Radio className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl lg:text-2xl font-serif font-semibold mb-3 break-words hyphens-auto">{t('services.broadcasting.title')}</h3>
                <p className="text-muted-foreground">
                  {t('services.broadcasting.desc')}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border hover:shadow-lg transition-shadow delay-200">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl lg:text-2xl font-serif font-semibold mb-3 break-words hyphens-auto">{t('services.full.title')}</h3>
                <p className="text-muted-foreground">
                  {t('services.full.desc')}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" size="lg" className="bg-transparent">
                {t('services.view_all')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Digital Services Teaser (SEO Boost) */}
      <section className="py-16 bg-[#1A1A1A] text-white overflow-hidden relative border-y border-[#333]">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <div className="text-left md:w-2/3 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold tracking-wider uppercase animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                {t('home.digital_teaser.badge')}
              </div>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-[#F4D03F] to-[#D4AF37]">
                {t('home.digital_teaser.title')}
              </h2>
              <p className="text-lg text-gray-400 max-w-xl border-l-[3px] border-[#D4AF37] pl-4">
                {t('home.digital_teaser.subtitle')}
              </p>
            </div>

            <div className="md:w-1/3 flex justify-center md:justify-end">
              <Link href="/digital-services">
                <Button
                  size="lg"
                  className="bg-[#D4AF37] hover:bg-[#B5952F] text-black font-semibold rounded-full px-8 py-6 h-auto shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all duration-300 transform hover:scale-105"
                >
                  {t('home.digital_teaser.button')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {t('featured.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('featured.subtitle')}
            </p>
          </div>

          {loadingProjects ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects?.slice(0, 6).map((project) => (
                <Link key={project.id} href="/portfolio">
                  <a className="group block">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden shadow-md">
                      <img
                        src={project.coverImageUrl}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.location && (
                      <p className="text-sm text-muted-foreground">{project.location}</p>
                    )}
                  </a>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/portfolio">
              <Button variant="default" size="lg">
                {t('featured.view_full')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-20 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              {t('why_choose.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('why_choose.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('why_choose.team.title')}</h3>
              <p className="text-muted-foreground">
                {t('why_choose.team.desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('why_choose.service.title')}</h3>
              <p className="text-muted-foreground">
                {t('why_choose.service.desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('why_choose.local.title')}</h3>
              <p className="text-muted-foreground">
                {t('why_choose.local.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('cta.subtitle')}
          </p>
          <Link href="/contact">
            <Button size="lg" variant="default" className="text-base">
              {t('cta.button')}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
