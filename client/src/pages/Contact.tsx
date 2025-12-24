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
import { Mail, Phone, MapPin, Clock, Loader2, ShieldCheck, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function Contact() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Schema Definition
  // Form Schema Definition
  const contactSchema = z.object({
    name: z.string().min(2, { message: t("contact.form.validation.name_min") }),
    email: z.string().email({ message: t("contact.form.validation.email_invalid") }),
    phone: z.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/, { message: t("contact.form.validation.phone_invalid") }),
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
      location: "",
      budget: "",
      guestCount: "",
      serviceInterest: "",
      message: "",
      honeypot: ""
    }
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Spam Check: If honeypot is filled, silently reject (simulated success)
    if (data.honeypot) {
      console.log("Spam detected: Honeypot filled");
      toast.success(t("contact.form.success_title") || "Inquiry Sent!", {
        description: t("contact.form.success_desc") || "We have received your message and saved it to our database.",
      });
      return;
    }

    setIsSubmitting(true);

    // 1. Prepare Data Payload (Defined BEFORE usage)
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      event_type: data.eventType,
      event_date: data.eventDate || null,
      location: data.location || null,
      budget: data.budget || null,
      guest_count: data.guestCount ? parseInt(data.guestCount) : null,
      service_interest: data.serviceInterest || null,
      message: data.message || null
    };

    // Environment variables
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    try {
      // Create an array of promises
      const submissions = [];

      // 2. Client-Side Supabase Insert (Direct)
      // Replaces Netlify Function due to credit limits
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        // Initialize client dynamically to avoid global scope issues if vars are missing
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        submissions.push(
          supabase
            .from("inquiries")
            .insert([payload])
            .then(({ error }) => {
              if (error) throw error;
              return "Supabase Success";
            })
        );
      } else {
        console.warn("Supabase credentials missing (VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY)");
      }

      // 3. Secondary: Google Sheets (Optional/Backup)
      if (GOOGLE_SCRIPT_URL) {
        submissions.push(
          fetch(GOOGLE_SCRIPT_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          })
        );
      }

      // Execute all submissions
      if (submissions.length === 0) {
        console.warn("No submission endpoints configured.");
      } else {
        await Promise.all(submissions);
      }

      toast.success(t("contact.form.success_title") || "Inquiry Sent!", {
        description: t("contact.form.success_desc") || "We have received your message.",
      });

      form.reset();
    } catch (error) {
      console.error("Submission Error:", error);
      // Set root error for visual display
      form.setError("root", {
        type: "manual",
        message: t("contact.form.error_generic") || "Unable to send message. Please try again or contact us directly via email."
      });

      toast.error("Error sending message", {
        description: "Please check your internet connection or try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6">
            {t("contact.title")}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-background">
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
                      <p className="text-sm text-muted-foreground">info@weddingslux.com</p>
                      <p className="text-sm text-muted-foreground">bookings@weddingslux.com</p>
                      <a href="mailto:weddingeventslux@gmail.com" className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                        weddingeventslux@gmail.com
                      </a>
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
                      <p className="text-sm text-muted-foreground">+352 621 430 283</p>
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
                        Luxembourg City<br />
                        Luxembourg
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
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-border shadow-md">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-serif font-bold text-foreground">
                      {t("contact.form.title")}
                    </h2>
                    <ShieldCheck className="w-6 h-6 text-green-600/80 hidden sm:block" title="Secure Form" />
                  </div>

                  {/* Visual Error Message if Submission Fails */}
                  {form.formState.errors.root && (
                    <div className="error-message-global">
                      {form.formState.errors.root.message || "Failed to submit form. Please try again."}
                    </div>
                  )}

                  <form onSubmit={form.handleSubmit(onSubmit)} className="luxury-form" noValidate>
                    {/* Honeypot Field - Hidden */}
                    <input
                      type="text"
                      {...form.register("honeypot")}
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {/* Name */}
                    <div className="form-group">
                      <label htmlFor="name">{t("contact.form.name")} *</label>
                      <input
                        id="name"
                        type="text"
                        {...form.register("name")}
                        placeholder="John Doe"
                        className={form.formState.errors.name ? "error" : ""}
                      />
                      {form.formState.errors.name && (
                        <span className="error-message">{form.formState.errors.name.message}</span>
                      )}
                    </div>

                    {/* Email */}
                    <div className="form-group">
                      <label htmlFor="email">{t("contact.form.email")} *</label>
                      <input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder="john@example.com"
                        className={form.formState.errors.email ? "error" : ""}
                      />
                      {form.formState.errors.email && (
                        <span className="error-message">{form.formState.errors.email.message}</span>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="form-group">
                      <label htmlFor="phone">{t("contact.form.phone")} *</label>
                      <input
                        id="phone"
                        type="tel"
                        {...form.register("phone")}
                        placeholder="+352 123 456 789"
                        className={form.formState.errors.phone ? "error" : ""}
                      />
                      {form.formState.errors.phone && (
                        <span className="error-message">{form.formState.errors.phone.message}</span>
                      )}
                    </div>

                    {/* Event Date (User requested 'future date' validation) */}
                    <div className="form-group">
                      <label htmlFor="eventDate">{t("contact.form.date")} *</label>
                      <input
                        id="eventDate"
                        type="date"
                        {...form.register("eventDate")}
                        min={new Date().toISOString().split('T')[0]} // HTML5 validation for future dates
                        className={form.formState.errors.eventDate ? "error" : ""}
                      />
                      {form.formState.errors.eventDate && (
                        <span className="error-message">{form.formState.errors.eventDate.message}</span>
                      )}
                    </div>

                    {/* Event Type & Message */}
                    <div className="form-group">
                      <label htmlFor="eventType">{t("contact.form.event_type")} *</label>
                      <select
                        id="eventType"
                        {...form.register("eventType")}
                        className={form.formState.errors.eventType ? "error" : ""}
                      >
                        <option value="">{t("contact.form.select_event")}</option>
                        <option value="wedding">{t("contact.form.event_types.wedding")}</option>
                        <option value="corporate">{t("contact.form.event_types.corporate")}</option>
                        <option value="celebration">{t("contact.form.event_types.celebration")}</option>
                        <option value="engagement">{t("contact.form.event_types.engagement")}</option>
                        <option value="other">{t("contact.form.event_types.other")}</option>
                      </select>
                      {form.formState.errors.eventType && (
                        <span className="error-message">{form.formState.errors.eventType.message}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">{t("contact.form.message")} *</label>
                      <textarea
                        id="message"
                        {...form.register("message")}
                        rows={5}
                        placeholder={t("contact.form.placeholder_msg")}
                        className={form.formState.errors.message ? "error" : ""}
                      ></textarea>
                      {form.formState.errors.message && (
                        <span className="error-message">{form.formState.errors.message.message}</span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="submit-btn"
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
                    </button>

                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
                      <Lock className="w-3 h-3" />
                      <span>{t("contact.form.privacy_note")}</span>
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d82574.15944827707!2d6.0296741!3d49.6116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47954d69cf20a0e9%3A0x409ce34b3186e8d!2sLuxembourg!5e0!3m2!1sen!2s!4v1234567890"
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
              <strong>{t("contact.areas.primary")}</strong> Luxembourg City, Esch-sur-Alzette, Differdange, Dudelange, Ettelbruck, Diekirch, Wiltz, and surrounding municipalities
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
