import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Award, Heart, Camera, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

import Team from "@/components/Team";

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={t("about.title")}
        description={t("about.p1")}
      />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground">
                {t("about.title")}
              </h1>
              <p className="text-lg text-muted-foreground">
                {t("about.p1")}
              </p>
              <p className="text-lg text-muted-foreground">
                {t("about.p2")}
              </p>
            </div>
            <div className="hidden lg:block relative h-[500px]">
              <div className="absolute inset-0 bg-primary/10 rounded-lg transform rotate-3 transition-transform hover:rotate-0"></div>
              <img
                src="/corp-meeting.png"
                alt="Strategic Event Planning"
                className="relative z-10 w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
              {t("about.values.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("about.values.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("about.values.passion.title")}</h3>
              <p className="text-muted-foreground">
                {t("about.values.passion.desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("about.values.excellence.title")}</h3>
              <p className="text-muted-foreground">
                {t("about.values.excellence.desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("about.values.creativity.title")}</h3>
              <p className="text-muted-foreground">
                {t("about.values.creativity.desc")}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("about.values.connection.title")}</h3>
              <p className="text-muted-foreground">
                {t("about.values.connection.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <Team />

      {/* Our Experience */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-serif font-bold text-foreground mb-4">
              {t("about.experience.title")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("about.experience.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-serif font-bold text-primary mb-2">{t("about.experience.years.value")}</div>
              <p className="text-lg text-foreground font-medium">{t("about.experience.years.label")}</p>
            </div>
            <div>
              <div className="text-5xl font-serif font-bold text-primary mb-2">{t("about.experience.events.value")}</div>
              <p className="text-lg text-foreground font-medium">{t("about.experience.events.label")}</p>
            </div>
            <div>
              <div className="text-5xl font-serif font-bold text-primary mb-2">{t("about.experience.satisfaction.value")}</div>
              <p className="text-lg text-foreground font-medium">{t("about.experience.satisfaction.label")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            {t("about.cta.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {t("about.cta.subtitle")}
          </p>
          <Link href="/contact">
            <Button size="lg" variant="default" className="text-base">
              {t("about.cta.button")}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
