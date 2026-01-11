import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function FeatureSection() {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: t("process.step1.title", "Consultation"),
      description: t("process.step1.desc", "We meet to understand your vision and specific requirements."),
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: t("process.step2.title", "Planning"),
      description: t("process.step2.desc", "Our team creates a detailed roadmap and creative concept."),
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: t("process.step3.title", "Execution"),
      description: t("process.step3.desc", "We bring the event to life with precision and passion."),
      image: "https://images.unsplash.com/photo-1505373877841-8d43f7d63f73?auto=format&fit=crop&q=80&w=1000",
    },
    {
      title: t("process.step4.title", "Delivery"),
      description: t("process.step4.desc", "You receive the final edited media and memories."),
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=1000",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full py-20 lg:py-40 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          
          {/* Left Side: Steps */}
          <div className="space-y-8 lg:space-y-12 w-full">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-5xl font-serif font-bold tracking-tight">
                {t("process.title", "Our Process")}
              </h2>
              <p className="text-muted-foreground text-lg">
                {t("process.subtitle", "From concept to reality, we handle every detail.")}
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={cn(
                    "group relative pl-8 cursor-pointer transition-all duration-300",
                    activeStep === index ? "opacity-100" : "opacity-40 hover:opacity-70"
                  )}
                  onClick={() => setActiveStep(index)}
                >
                  {/* Progress Line */}
                  {/* Progress Line with Sparkle */}
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-border overflow-hidden">
                    {activeStep === index && (
                       <motion.div
                         layoutId="active-glow"
                         className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary via-white to-primary opacity-80 blur-[2px]"
                         initial={{ height: "0%" }}
                         animate={{ height: "100%" }}
                         transition={{ duration: 5, ease: "linear" }}
                       />
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold font-serif mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Image Carousel */}
          <div className="relative aspect-square lg:aspect-[4/5] w-full overflow-hidden rounded-2xl bg-secondary/20 shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeStep}
                src={steps[activeStep].image}
                alt={steps[activeStep].title}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white z-10">
               <p className="text-sm font-medium uppercase tracking-widest opacity-80 mb-1">
                 Step 0{activeStep + 1}
               </p>
               <h4 className="text-2xl font-serif font-bold">
                 {steps[activeStep].title}
               </h4>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
