import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";

import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";



import { StrictMode, Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";
import "./lib/i18n"; // Ensure i18n is initialized before App

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={
          <div className="h-screen w-full flex items-center justify-center bg-[#FAF8F3]">
            <Spinner className="size-10 text-[#D4AF37] animate-spin" />
          </div>
        }>
          <App />
        </Suspense>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>
);
