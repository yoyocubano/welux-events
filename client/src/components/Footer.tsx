import { Link } from "wouter";
import { useState } from "react";
import { Camera, Mail, MapPin, Instagram, Facebook, Youtube, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ProtectedPhone } from "./ProtectedPhone";

export default function Footer() {
  const { t } = useTranslation();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#FAF8F3] border-t border-[#E8E4DC]">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="group inline-block">
              <img
                src="/logo-gold-new.png"
                alt="WELUX"
                className="h-20 md:h-24 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">{t("footer.quick_links")}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/portfolio" className="text-sm text-gray-700 hover:text-primary transition-colors">
                  {t("nav.portfolio")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  {t("nav.services")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  {t("nav.about")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  {t("nav.contact")}
                </Link>
              </li>
              <li>
                <Link href="/services/digital" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  {t("footer.referrals")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  {t("footer.legal")}
                </Link>
              </li>
              <li>
                <Link href="/image-rights" className="text-sm text-gray-600 hover:text-primary transition-colors">
                  {t("footer.image_rights")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">{t("footer.contact")}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <a href="mailto:info@weluxevents.com" className="hover:text-primary transition-colors">info@weluxevents.com</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <ProtectedPhone className="mt-0.5" />
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                <button
                  onClick={() => setIsCalendarOpen(true)}
                  className="text-left hover:text-[#D4AF37] hover:underline decoration-dotted underline-offset-4 transition-all cursor-pointer"
                >
                  {t("contact.info.location_val") || "Luxembourg City (By Appointment Only)"}
                </button>
              </li>
            </ul>
          </div>

          {/* Discover (New SEO Section) - Two Column Layout */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">{t("footer.discover")}</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { href: "/live", label: "direct" },
                { href: "/protocol", label: "protocole" },
                { href: "/streaming", label: "streaming" },
                { href: "/vlog", label: "vlog" },
                { href: "/deals", label: "deals" },
                { href: "/tools", label: "tools" },
                { href: "/jobs", label: "jobs" },
                { href: "/nightlife", label: "nightlife" },
                { href: "/tips", label: "tips" },
                { href: "/relocation", label: "relocation" }
              ].map((link) => (
                <Link key={link.href} href={link.href} className="text-sm text-gray-600 hover:text-primary transition-colors">
                  {t(`seo_pages.links.${link.label}`)}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">{t("footer.follow_us")}</h3>
            <div className="flex gap-4 flex-wrap">
              <a
                href="https://www.instagram.com/weluxevents?igsh=YW1zMzJnbnM4ajAw&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/weluxevents"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="X (Twitter)"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/share/17ymwsPfDK/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com/@weluxevents?si=E5ahuprszYIr06Fx"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href="https://www.tiktok.com/@weluxevents?_r=1&_t=ZN-92UWTZaVNlm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="TikTok"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v4a9 9 0 0 1-9-9v12c0 1.1.9 2 2 2z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/weluxevents"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-300 text-center text-sm text-gray-700">
          <p>© 2014 - {currentYear} {t("brand.name")}. {t("footer.rights")}</p>
        </div>
      </div>

      {/* Booking Calendar Modal */}
      <BookingModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />
    </footer>
  );
}

// Simple Booking Modal Component (Internal)
function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 relative">

        {/* Header */}
        <div className="bg-[#D4AF37] p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <h3 className="text-2xl font-serif font-bold">{t("footer.booking_modal.title")}</h3>
          <p className="opacity-90 text-sm mt-1">{t("footer.booking_modal.subtitle")}</p>
        </div>

        {/* Content - Simulating Calendar/Action */}
        <div className="p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-[#FAF8F3] rounded-full flex items-center justify-center mx-auto mb-2">
            <MapPin className="w-8 h-8 text-[#D4AF37]" />
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-xl text-gray-900">{t("footer.booking_modal.attention")}</h4>
            <p className="text-gray-600">
              {t("footer.booking_modal.desc")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-3">
            <a
              href="https://calendly.com/weluxevents"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#D4AF37] hover:bg-[#B5952F] text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              {t("footer.booking_modal.btn_calendar")}
            </a>

            <Link href="/contact" onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors">
              {t("footer.booking_modal.btn_message")}
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            {t("footer.booking_modal.note")}
          </p>
        </div>
      </div>
    </div>
  );
}
