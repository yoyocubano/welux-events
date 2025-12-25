import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    aspectRatio?: string; // e.g. "aspect-[4/3]"
}

export function OptimizedImage({
    src,
    alt,
    className,
    aspectRatio = "aspect-[4/3]",
    ...props
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setIsLoaded(true);
        img.onerror = () => setError(true);
    }, [src]);

    return (
        <div className={cn("relative overflow-hidden bg-muted", aspectRatio, className)}>
            {!isLoaded && !error && (
                <Skeleton className="absolute inset-0 w-full h-full animate-pulse bg-muted-foreground/20" />
            )}

            <img
                src={src}
                alt={alt}
                className={cn(
                    "w-full h-full object-cover transition-opacity duration-500 ease-in-out",
                    isLoaded ? "opacity-100" : "opacity-0"
                )}
                loading="lazy"
                {...props}
            />

            {error && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
                    <span className="text-xs">Image unavailable</span>
                </div>
            )}
        </div>
    );
}
