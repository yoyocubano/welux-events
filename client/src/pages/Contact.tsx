import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Loader2, ShieldCheck, Lock, Star } from "lucide-react";
import { ProtectedPhone } from "@/components/ProtectedPhone";
import { useTranslation } from "react-i18next";
import { SEO } from "@/components/SEO";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function Contact() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    show: boolean;
    type: 'success' | 'error' | '';
    message: string;
  }>({
    show: false,
    type: '',
    message: ''
  });

  // Form Schema Definition
  const contactSchema = z.object({
    name: z.string().min(2, { message: t("contact.form.validation.name_min") }),
    email: z.string().email({ message: t("contact.form.validation.email_invalid") }),
    // Updated Regex per use instruction for Lux phone: +352 123 456 789 (flexible spaces)
    phone: z.string().regex(/^(\+352|00352|352)?\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3}$/, { message: t("contact.form.validation.phone_invalid") }).or(z.literal("")),
    eventType: z.string().min(1, { message: t("contact.form.validation.event_type_required") }),
    eventDate: z.string().refine((date) => new Date(date) > new Date(), { message: t("contact.form.validation.future_date") }),
    message: z.string().min(10, { message: t("contact.form.validation.message_min") }),
    honeypot: z.string().optional()
  });

  type ContactFormValues = z.infer<typeof contactSchema>;

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      eventType: "",
      eventDate: "",
      message: "",
      honeypot: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // Use shared API utility
      const { submitInquiry } = await import("@/lib/api");
      const result = await submitInquiry(data);

      if (result.success) {
        // Meta Pixel Tracking
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "Contact");
        }

        setSubmitStatus({
          show: true,
          type: 'success',
          message: t("contact.form.success_desc") || "Message sent successfully! We will contact you soon."
        });
        form.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => setSubmitStatus({ show: false, type: '', message: '' }), 6000);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setSubmitStatus({
        show: true,
        type: 'error',
        message: t("contact.form.error_generic") || "Unable to send message."
      });
      setTimeout(() => setSubmitStatus({ show: false, type: '', message: '' }), 8000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEO
        title={t("contact.title")}
        description={t("contact.subtitle")}
      />
      <Navigation />

      {/* Banner de confirmación FIXED */}
      {submitStatus.show && (
        <div
          className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 
                      w-full max-w-md mx-4 px-6 py-4 rounded-lg shadow-2xl 
                      transition-all duration-500 ease-in-out
                      ${submitStatus.type === 'success'
              ? 'bg-green-50 border-2 border-green-500'
              : 'bg-red-50 border-2 border-red-500'}`}
          role="alert"
        >
          <div className="flex items-center gap-3">
            {submitStatus.type === 'success' ? (
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <p className={`font-medium ${submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {submitStatus.message}
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 min-h-[40vh] flex items-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60"
          >
            <source src="/videos/private-dinner.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-background/80" /> {/* Overlay for readability */}
        </div>

        <div className="container relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            {t("contact.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-background flex-grow">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.info.email")}</h3>
                      <p className="font-medium">info@weluxevents.com</p>
                      <p className="text-sm text-muted-foreground">bookings@weluxevents.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.info.phone")}</h3>
                      <ProtectedPhone showIcon={false} className="text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{t("contact.info.whatsapp")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.info.location")}</h3>
                      <p className="text-sm text-muted-foreground">
                        {t("contact.info.location_val")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.info.hours")}</h3>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {t("contact.info.hours_val")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Review / Rate Experience Card */}
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Star className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{t("contact.sidebar.review_title")}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {t("contact.sidebar.review_desc")}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs font-medium border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
                        onClick={() => window.open("https://www.google.com/search?q=welux+events+luxembourg+reviews", "_blank")}
                      >
                        {t("contact.sidebar.review_btn")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp QR Code */}
              <Card className="border-border overflow-hidden group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-4 text-[#D4AF37] text-sm uppercase tracking-widest">
                    {t("footer.scan_to_chat", "Scan to Chat")}
                  </h3>
                  <div className="relative w-40 h-40 mx-auto bg-white p-2 rounded-xl shadow-inner border border-gray-100">
                    <img
                      src="/whatsapp-qr.png"
                      alt="WhatsApp QR Code"
                      className="w-full h-full object-contain mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                    {/* Floating WhatsApp Icon */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 bg-[#25D366] rounded-full flex items-center justify-center shadow-md">
                        <Phone className="w-4 h-4 text-white fill-current" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    {t("contact.qr_hint", "Open Camera & Scan")}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-border shadow-md">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-serif font-bold text-foreground">
                      {t("contact.form.title")}
                    </h2>
                    <ShieldCheck className="w-6 h-6 text-green-600/80 hidden sm:block" />
                  </div>

                  {/* Visual Error Message if Submission Fails (Fallback) */}
                  {form.formState.errors.root && (
                    <div className="p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                      {form.formState.errors.root.message || "Failed to submit form."}
                    </div>
                  )}

                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="luxury-form"
                    noValidate
                    aria-labelledby="form-title"
                    name="contact"
                    method="POST"
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                  >
                    {/* Netlify Form Name Hidden Input */}
                    <input type="hidden" name="form-name" value="contact" />

                    {/* Netlify Honeypot Field - Hidden but accessible to bots */}
                    <p className="hidden">
                      <label>
                        Don’t fill this out if you're human: <input name="bot-field" />
                      </label>
                    </p>
                    {/* Honeypot Field - Hidden */}
                    <input
                      type="text"
                      {...form.register("honeypot")}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />

                    {/* Name */}
                    <div className="form-group">
                      <Label htmlFor="name" className="text-foreground font-medium mb-1.5 block">
                        {t("contact.form.name")} <span className="text-primary" aria-hidden="true">*</span>
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        {...form.register("name")}
                        placeholder={t("contact.form.placeholders.name")}
                        aria-invalid={!!form.formState.errors.name}
                        aria-describedby={form.formState.errors.name ? "name-error" : undefined}
                        className={form.formState.errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                      />
                      {form.formState.errors.name && (
                        <p id="name-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                          <span aria-hidden="true">⚠️</span> {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <Label htmlFor="email" className="text-foreground font-medium mb-1.5 block">
                        {t("contact.form.email")} <span className="text-primary" aria-hidden="true">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder={t("contact.form.placeholders.email")}
                        aria-invalid={!!form.formState.errors.email}
                        aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                        className={form.formState.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                      />
                      {form.formState.errors.email && (
                        <p id="email-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                          <span aria-hidden="true">⚠️</span> {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                      <Label htmlFor="phone" className="text-foreground font-medium mb-1.5 block">
                        {t("contact.form.phone")} <span className="text-primary" aria-hidden="true">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        {...form.register("phone")}
                        placeholder={t("contact.form.placeholders.phone")}
                        aria-invalid={!!form.formState.errors.phone}
                        aria-describedby={form.formState.errors.phone ? "phone-error" : undefined}
                        className={form.formState.errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                      />
                      {form.formState.errors.phone && (
                        <p id="phone-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                          <span aria-hidden="true">⚠️</span> {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Event Date */}
                    <div className="form-group">
                      <Label htmlFor="eventDate" className="text-foreground font-medium mb-1.5 block">
                        {t("contact.form.date")} <span className="text-primary" aria-hidden="true">*</span>
                      </Label>
                      <Input
                        id="eventDate"
                        type="date"
                        {...form.register("eventDate")}
                        min={new Date().toISOString().split('T')[0]}
                        aria-invalid={!!form.formState.errors.eventDate}
                        aria-describedby={form.formState.errors.eventDate ? "date-error" : undefined}
                        className={form.formState.errors.eventDate ? "border-red-500 focus-visible:ring-red-500" : ""}
                      />
                      {form.formState.errors.eventDate && (
                        <p id="date-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                          <span aria-hidden="true">⚠️</span> {form.formState.errors.eventDate.message}
                        </p>
                      )}
                    </div>

                    {/* Event Type */}
                    <div className="form-group">
                      <Label htmlFor="eventType" className="text-foreground font-medium mb-1.5 block">
                        {t("contact.form.event_type")} <span className="text-primary" aria-hidden="true">*</span>
                      </Label>
                      <div className="relative">
                        <select
                          id="eventType"
                          {...form.register("eventType")}
                          className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${form.formState.errors.eventType ? "border-red-500" : ""}`}
                          aria-invalid={!!form.formState.errors.eventType}
                          aria-describedby={form.formState.errors.eventType ? "type-error" : undefined}
                        >
                          <option value="">{t("contact.form.select_event")}</option>
                          <option value="wedding">{t("contact.form.event_types.wedding")}</option>
                          <option value="corporate">{t("contact.form.event_types.corporate")}</option>
                          <option value="celebration">{t("contact.form.event_types.celebration")}</option>
                          <option value="engagement">{t("contact.form.event_types.engagement")}</option>
                          <option value="technical">{t("contact.form.event_types.technical")}</option>
                          <option value="digital">{t("contact.form.event_types.digital")}</option>
                          <option value="other">{t("contact.form.event_types.other")}</option>
                        </select>
                      </div>
                      {form.formState.errors.eventType && (
                        <p id="type-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                          <span aria-hidden="true">⚠️</span> {form.formState.errors.eventType.message}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <div className="form-group">
                      <Label htmlFor="message" className="text-foreground font-medium mb-1.5 block">
                        {t("contact.form.message")} <span className="text-primary" aria-hidden="true">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        {...form.register("message")}
                        rows={5}
                        placeholder={t("contact.form.placeholder_msg")}
                        aria-invalid={!!form.formState.errors.message}
                        aria-describedby={form.formState.errors.message ? "message-error" : undefined}
                        className={form.formState.errors.message ? "border-red-500 focus-visible:ring-red-500" : ""}
                      />
                      {form.formState.errors.message && (
                        <p id="message-error" className="text-sm text-red-600 mt-1 flex items-center gap-1" role="alert">
                          <span aria-hidden="true">⚠️</span> {form.formState.errors.message.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full text-base font-semibold py-6 shadow-lg hover:shadow-xl transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {t("contact.form.sending")}
                        </span>
                      ) : (
                        t("contact.form.submit")
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4 bg-muted/20 p-2 rounded mt-4">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      <span>{t("contact.form.privacy_note")} <strong>SSL 256-bit encryption</strong>.</span>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              {t("contact.areas.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("contact.areas.subtitle")}
            </p>
          </div>
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg border border-border">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d82574.15944827707!2d6.0296741!3d49.6116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47954d69cf20a0e9!2sLuxembourg!5e0!3m2!1s${t("language_code", { defaultValue: "en" })}!2s!4v1234567890`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Luxembourg service area map"
            />
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>{t("contact.areas.primary")}</strong> {t("contact.areas.list")}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
