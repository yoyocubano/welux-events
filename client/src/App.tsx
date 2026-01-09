import { Suspense, lazy } from "react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import ChatWidget from "@/components/ChatWidget";
import CookieBanner from "@/components/CookieBanner";
import { Toaster } from "@/components/ui/sonner";
import "@/lib/i18n"; // Initializes the internationalization library.
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Spinner } from "@/components/ui/spinner";
import { GlobalErrorMonitor } from "@/components/GlobalErrorMonitor";
import { MetaPixelTracker } from "@/components/MetaPixelTracker";

/**
 * Main Application Component (App.tsx)
 *
 * This is the root component of the React application. It sets up the global context providers,
 * defines the routing structure, and integrates persistent UI elements like the ChatWidget.
 */

// --- Page Components (Lazy Loaded) ---
// Pages are lazy-loaded to improve initial application load times. 
// The code for each page is only fetched when the user navigates to it.
const Home = lazy(() => import("./pages/Home"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Protocol = lazy(() => import("./pages/Protocol"));
const Contact = lazy(() => import("./pages/Contact"));
const ImageInventory = lazy(() => import("./pages/ImageInventory"));
const Privacy = lazy(() => import("./pages/Privacy"));
const ImageRights = lazy(() => import("./pages/ImageRights"));
const Live = lazy(() => import("./pages/Live"));
const NotFound = lazy(() => import("./pages/NotFound"));
const StreamingWindow = lazy(() => import("./pages/StreamingWindow"));
const Vlog = lazy(() => import("./pages/Vlog"));
const Deals = lazy(() => import("./pages/Deals"));
const Tools = lazy(() => import("./pages/Tools"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Nightlife = lazy(() => import("./pages/Nightlife"));
const LocalTips = lazy(() => import("./pages/LocalTips"));
const Relocation = lazy(() => import("./pages/Relocation"));
const Admin = lazy(() => import("./pages/Admin"));
const AssociatedServices = lazy(() => import("./pages/AssociatedServices"));
const ReferralsPage = lazy(() => import("./pages/ReferralsPage"));

/**
 * A fallback component to display while lazy-loaded pages are being fetched.
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh] w-full">
      <Spinner className="size-8 text-primary/60 animate-spin" />
    </div>
  );
}

/**
 * The main router for the application.
 * It uses `wouter` for handling navigation and `Suspense` for managing the loading state of lazy-loaded pages.
 */
import { useLocation } from "wouter";
import { useEffect as useReactEffect } from "react";

function Router() {
  const [, setLocation] = useLocation();

  useReactEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Secret Admin Shortcut: Cmd+Shift+L (Mac) or Ctrl+Shift+L (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        // Magic login - Owner only
        window.location.href = "/admin?magic=lux";
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Switch>
        {/* Main application routes */}
        <Route path={"/"} component={Home} />
        <Route path={"/portfolio"} component={Portfolio} />
        <Route path={"/services"} component={Services} />
        <Route path={"/about"} component={About} />
        <Route path={"/protocol"} component={Protocol} />
        <Route path={"/contact"} component={Contact} />
        <Route path={"/images"} component={ImageInventory} />
        <Route path={"/live"} component={Live} />
        <Route path={"/privacy"} component={Privacy} />
        <Route path={"/image-rights"} component={ImageRights} />


        {/* SEO Landing Pages */}
        <Route path={"/streaming"} component={StreamingWindow} />
        <Route path={"/vlog"} component={Vlog} />
        <Route path={"/deals"} component={Deals} />
        <Route path={"/tools"} component={Tools} />
        <Route path={"/jobs"} component={Jobs} />
        <Route path={"/nightlife"} component={Nightlife} />
        <Route path={"/tips"} component={LocalTips} />
        <Route path={"/relocation"} component={Relocation} />
        <Route path={"/digital-services"} component={AssociatedServices} />
        <Route path={"/services/digital"} component={ReferralsPage} />
        <Route path={"/admin"} component={Admin} />

        {/* A catch-all route that renders the NotFound page for any unhandled paths. */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

/**
 * The root `App` component.
 * This component wraps the entire application with necessary context providers
 * and renders the main layout structure.
 */
function App() {
  return (
    // ErrorBoundary catches runtime errors in the component tree to prevent a full app crash.
    <ErrorBoundary>
      {/* ThemeProvider manages the application's theme (e.g., light/dark mode). */}
      <ThemeProvider defaultTheme="light">
        {/* TooltipProvider enables the use of tooltips throughout the application. */}
        <TooltipProvider>
          {/* Accessibility feature: allows keyboard users to skip to the main content. */}
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground">
            Skip to main content
          </a>

          {/* Toaster is used for displaying toast notifications. */}
          <Toaster />

          {/* The application's main router. */}
          <MetaPixelTracker />
          <Router />

          {/* Persistent UI elements that appear on all pages. */}
          <WhatsAppButton />
          <ChatWidget />
          <CookieBanner />

          {/* AI Debugging Tool */}
          <GlobalErrorMonitor />

        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
