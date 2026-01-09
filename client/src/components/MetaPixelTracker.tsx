import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * MetaPixelTracker
 * Tracks PageView events on route changes for Single Page Applications.
 * Ensure the base Meta Pixel script is loaded in index.html for this to work.
 */
export function MetaPixelTracker() {
    const [location] = useLocation();

    useEffect(() => {
        // Check if fbq is available (loaded by index.html script)
        if (typeof window !== "undefined" && (window as any).fbq) {
            (window as any).fbq("track", "PageView");
        }
    }, [location]);

    return null; // This component handles side effects only
}
