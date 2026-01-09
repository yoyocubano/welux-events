import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from "react-i18next";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
    keywords?: string[] | string;
    schema?: any; // Add support for JSON-LD schema
}

/**
 * SEO Component based on best practices from 'joshbuchea/HEAD'.
 * Handles standard meta tags, Open Graph (Facebook/WhatsApp), and Twitter cards.
 */
export const SEO: React.FC<SEOProps> = ({
    title,
    description,
    image,
    url,
    type = 'website',
    keywords,
    schema
}) => {
    const { t, i18n } = useTranslation();
    const siteTitle = 'Welux Events';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || t('hero.description') || 'Quiet Luxury Event Planning in Luxembourg.';
    const metaImage = image || 'https://weluxevents.com/og-image-default.jpg';
    const metaUrl = url || 'https://weluxevents.com';
    const currentLang = i18n.language || 'en';

    // Map i18next language to Open Graph locale format
    const localeMap: Record<string, string> = {
        'en': 'en_US',
        'fr': 'fr_FR',
        'es': 'es_ES',
        'de': 'de_DE',
        'pt': 'pt_PT',
        'lb': 'lb_LU'
    };
    const ogLocale = localeMap[currentLang] || 'en_US';

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {keywords && (
                <meta
                    name="keywords"
                    content={Array.isArray(keywords) ? keywords.join(', ') : keywords}
                />
            )}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#000000" />

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:locale" content={ogLocale} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />

            {/* Canonical */}
            <link rel="canonical" href={metaUrl} />

            {/* JSON-LD Schema Rendering */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};
