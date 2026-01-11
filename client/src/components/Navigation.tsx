import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/portfolio", label: t("nav.portfolio") },
    { href: "/services", label: t("nav.services") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF8F3] border-b border-[#E8E4DC]">
      <div className="container">
        <div className="flex items-center justify-between h-20 md:h-28">
          <Link href="/" className="flex flex-col items-center group cursor-pointer lg:pb-0">
            <div className="relative flex items-center justify-center overflow-hidden">
              {/* Logo actualizado con ajuste móvil/escritorio */}
              <img
                src="/logo-gold-new.png"
                alt="Welux Events"
                className="h-16 md:h-24 w-auto transition-all duration-300 group-hover:scale-105 object-contain drop-shadow-lg relative z-10"
              />
              {/* Logo Shine Effect */}
              <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 z-20 pointer-events-none" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.href)
                  ? "text-primary"
                  : "text-gray-800"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
            <Button
              asChild
              variant="default"
              size="sm"
              className="bg-gradient-to-r from-[#D4AF37] to-[#F4D03F] text-black hover:opacity-90 transition-opacity font-semibold"
            >
              <Link href="/contact">
                {t("hero.get_quote")}
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <LanguageSwitcher />
            <button
              className="p-2 text-gray-800 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {
          mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block py-2 text-base font-medium transition-colors hover:text-primary ${isActive(link.href)
                      ? "text-primary"
                      : "text-gray-800"
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  asChild
                  variant="default"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/contact">
                    {t("hero.get_quote")}
                  </Link>
                </Button>
              </div>
            </div>
          )
        }
      </div >
    </nav >
  );
}
