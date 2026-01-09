
export const generateEventPlannerSchema = (language = 'en') => {
    // Base URL constants for easy updates
    const BASE_URL = 'https://weluxevents.com';
    const LOGO_URL = `${BASE_URL}/logo-gold-new.png`;

    // Knowledge Graph / Identity
    return {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'EventPlanner',
                '@id': `${BASE_URL}/#organization`,
                name: 'Welux Events',
                url: BASE_URL,
                logo: {
                    '@type': 'ImageObject',
                    url: LOGO_URL,
                    width: 192,
                    height: 192
                },
                image: {
                    '@type': 'ImageObject',
                    url: `${BASE_URL}/corp-woman.png`
                },
                description: 'Quiet Luxury Event Planning & Audiovisual Production in Luxembourg.',
                foundingDate: '2019',
                addrres: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Luxembourg',
                    addressCountry: 'LU'
                },
                sameAs: [
                    'https://www.instagram.com/weluxevents',
                    'https://www.linkedin.com/company/welux-events',
                    'https://www.wikidata.org/wiki/Q1842' // Luxembourg City linkage for local relevance
                ],
                areaServed: {
                    '@type': 'City',
                    name: 'Luxembourg',
                    '@id': 'https://www.wikidata.org/wiki/Q1842'
                },
                priceRange: '$$$$',
                openingHoursSpecification: {
                    '@type': 'OpeningHoursSpecification',
                    dayOfWeek: [
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday'
                    ],
                    opens: '09:00',
                    closes: '18:00'
                },
                hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: 'Event Services',
                    itemListElement: [
                        {
                            '@type': 'Offer',
                            itemOffered: {
                                '@type': 'Service',
                                name: 'Luxury Wedding Photography'
                            }
                        },
                        {
                            '@type': 'Offer',
                            itemOffered: {
                                '@type': 'Service',
                                name: 'Cinematographic Event Video'
                            }
                        },
                        {
                            '@type': 'Offer',
                            itemOffered: {
                                '@type': 'Service',
                                name: 'Live Broadcasting'
                            }
                        }
                    ]
                }
            },
            {
                '@type': 'WebSite',
                '@id': `${BASE_URL}/#website`,
                url: BASE_URL,
                name: 'Welux Events',
                publisher: {
                    '@id': `${BASE_URL}/#organization`
                },
                inLanguage: ['en', 'fr', 'de', 'lb', 'es', 'pt']
            }
        ]
    };
};
