import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Copy, X } from "lucide-react";

export function GlobalErrorMonitor() {
    const [lastError, setLastError] = useState<string | null>(null);

    // Keyboard Shortcut for Quick Health Check (Ctrl+Shift+S)
    useEffect(() => {
        const handleKeyDown = async (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.code === "KeyS") {
                e.preventDefault();
                toast.promise(
                    fetch("/api/system-status").then(async (res) => {
                        if (!res.ok) throw new Error("Status Check Failed");
                        return res.json();
                    }),
                    {
                        loading: "🏥 Running System Health Check...",
                        success: (data: any) => {
                            const db = data.supabase ? "✅ DB" : "❌ DB";
                            const ai = data.ai_service ? "✅ AI" : "⚠️ AI";
                            const email = data.email_service ? "✅ Mail" : "⚠️ Mail";
                            return `System Status: ${db} | ${ai} | ${email}`;
                        },
                        error: "❌ Health Check Failed"
                    }
                );
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Existing error handling logic...
    useEffect(() => {
        const handleError = (event: ErrorEvent) => {
            const msg = `[Global Error] ${event.message} at ${event.filename}:${event.lineno}`;
            setLastError(msg);
        };

        const handleRejection = (event: PromiseRejectionEvent) => {
            let reason = event.reason;
            if (reason instanceof Error) reason = reason.message;
            if (typeof reason === 'object') reason = JSON.stringify(reason);

            const msg = `[Promise Rejection] ${reason}`;
            setLastError(msg);
        };

        // Standard Window Error Fallback
        window.onerror = (message, source, lineno, colno, error) => {
            const msg = `[Window Error] ${message} at ${source}:${lineno}:${colno}`;
            setLastError(msg);
            return false;
        };

        // Intercept Console Error
        const originalConsoleError = console.error;
        console.error = (...args) => {
            originalConsoleError.apply(console, args);
            // Convert args to string
            const msg = args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ');

            // Only capture relevant errors (ignore React warnings)
            if (!msg.includes("Warning:") && !msg.includes("[HM R]") && !msg.includes("Captured by Monitor")) {
                // Formatting for Error objects
                const formattedArgs = args.map(a => {
                    if (a instanceof Error) return `${a.message}\n${a.stack}`;
                    if (typeof a === 'object') return JSON.stringify(a);
                    return String(a);
                }).join(' ');
                
                setLastError(`[Console Error] ${formattedArgs}`);
            }
        };

        window.addEventListener('error', handleError);
        window.addEventListener('unhandledrejection', handleRejection);

        return () => {
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleRejection);
            console.error = originalConsoleError; // Restore
        };
    }, []);

    if (!lastError) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(lastError);
        toast.info("Error copied! Paste it to your editor.");
    };

    return (
        <div className="fixed bottom-4 left-4 right-4 md:right-auto md:w-[400px] z-[9999] bg-red-950 text-red-50 p-4 rounded-lg shadow-2xl border border-red-500 animate-in slide-in-from-bottom-5">
            <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 mt-1 shrink-0" />
                <div className="flex-1 overflow-hidden">
                    <h3 className="font-bold text-sm mb-1 text-red-200 uppercase tracking-wider">System Error Detected</h3>
                    <p className="text-xs font-mono break-all opacity-90 leading-relaxed max-h-20 overflow-y-auto">
                        {lastError}
                    </p>
                </div>
                <button onClick={() => setLastError(null)} className="text-red-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <button
                onClick={copyToClipboard}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-red-900 hover:bg-red-800 text-white py-2 rounded text-xs font-bold transition-colors uppercase tracking-wide"
            >
                <Copy className="w-3 h-3" /> COPY FOR MY EDITOR
            </button>
        </div>
    );
}
