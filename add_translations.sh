#!/bin/bash

# Script to add associated_services translations to all language files

# Spanish
cat >> "client/public/locales/es/translation.json.tmp" << 'EOF'
    },
    "associated_services": {
        "title": "Servicios Digitales",
        "subtitle": "Más allá de eventos: Diseño Web, Redes Sociales y Chatbots IA para elevar tu marca.",
        "intro": "Extendemos nuestra precisión y creatividad más allá de los eventos. Desde diseño web hasta chatbots inteligentes, ayudamos a las empresas a destacar en el mundo digital.",
        "web_design": {
            "title": "Diseño y Desarrollo Web",
            "desc": "Sitios web personalizados que reflejan la esencia de tu marca con diseño moderno y rendimiento óptimo."
        },
        "shopify": {
            "title": "E-commerce (Shopify)",
            "desc": "Tiendas online completas listas para vender. Desde la configuración hasta la optimización, nos encargamos de todo."
        },
        "social_media": {
            "title": "Gestión de Redes Sociales",
            "desc": "Contenido estratégico que conecta con tu audiencia y construye comunidades auténticas."
        },
        "seo": {
            "title": "SEO y Marketing Digital",
            "desc": "Hazte encontrar por quienes importan. Estrategias que aumentan tu visibilidad y conversiones."
        },
        "chatbot": {
            "badge": "PRODUCTO ESTRELLA",
            "title": "Chatbot IA para WhatsApp",
            "desc": "Automatiza tu atención al cliente con un asistente inteligente que aprende de tu negocio y responde 24/7.",
            "whatsapp_integration": {
                "title": "Integración WhatsApp",
                "desc": "Conexión directa a la app favorita de tus clientes."
            },
            "smart_ai": {
                "title": "Cerebro IA Inteligente",
                "desc": "Aprende de tu base de datos para responder como un experto."
            }
        },
        "cta": {
            "contact_us": "Solicitar Información",
            "limit_offer": "OFERTA LIMITADA",
            "lower_prices": "Precios Más Bajos del Año",
            "button": "Obtener Mi Cotización Ahora"
        }
    },
    "inquiry": {
EOF

# French
cat >> "client/public/locales/fr/translation.json.tmp" << 'EOF'
    },
    "associated_services": {
        "title": "Services Numériques",
        "subtitle": "Au-delà des événements : Conception Web, Réseaux Sociaux et Chatbots IA pour élever votre marque.",
        "intro": "Nous étendons notre précision et notre créativité au-delà des événements. De la conception web aux chatbots intelligents, nous aidons les entreprises à se démarquer dans le monde numérique.",
        "web_design": {
            "title": "Conception et Développement Web",
            "desc": "Sites web personnalisés qui reflètent l'essence de votre marque avec un design moderne et des performances optimales."
        },
        "shopify": {
            "title": "E-commerce (Shopify)",
            "desc": "Boutiques en ligne complètes prêtes à vendre. De la configuration à l'optimisation, nous nous occupons de tout."
        },
        "social_media": {
            "title": "Gestion des Réseaux Sociaux",
            "desc": "Contenu stratégique qui connecte avec votre audience et construit des communautés authentiques."
        },
        "seo": {
            "title": "SEO et Marketing Digital",
            "desc": "Soyez trouvé par ceux qui comptent. Stratégies qui augmentent votre visibilité et vos conversions."
        },
        "chatbot": {
            "badge": "PRODUIT VEDETTE",
            "title": "Chatbot IA pour WhatsApp",
            "desc": "Automatisez votre service client avec un assistant intelligent qui apprend de votre entreprise et répond 24/7.",
            "whatsapp_integration": {
                "title": "Intégration WhatsApp",
                "desc": "Connexion directe à l'application préférée de vos clients."
            },
            "smart_ai": {
                "title": "Cerveau IA Intelligent",
                "desc": "Apprend de votre base de données pour répondre comme un expert."
            }
        },
        "cta": {
            "contact_us": "Demander des Informations",
            "limit_offer": "OFFRE LIMITÉE",
            "lower_prices": "Prix les Plus Bas de l'Année",
            "button": "Obtenir Mon Devis Maintenant"
        }
    },
    "inquiry": {
EOF

echo "Translation templates created successfully!"
