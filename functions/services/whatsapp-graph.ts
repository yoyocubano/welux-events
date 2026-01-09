
import { Env } from '../types';

export interface InteractiveButton {
    id: string;
    title: string;
}

export interface CarouselCard {
    headerImage: string;
    bodyText: string;
    buttons: InteractiveButton[];
}

export class WhatsAppGraphService {
    private accessToken: string;
    private phoneNumberId: string;
    private version: string = 'v23.0'; // Based on your screenshot

    constructor(env: Env) {
        if (!env.WHATSAPP_ACCESS_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
            throw new Error('Missing WhatsApp Cloud API credentials in environment variables.');
        }
        this.accessToken = env.WHATSAPP_ACCESS_TOKEN;
        this.phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID;
    }

    private async callApi(endpoint: string, method: string, body?: any) {
        const url = `https://graph.facebook.com/${this.version}/${this.phoneNumberId}/${endpoint}`;

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!response.ok) {
                const errorData = await response.json() as any;
                console.error('WhatsApp Cloud API Error:', JSON.stringify(errorData, null, 2));
                throw new Error(`WhatsApp API Error: ${errorData.error?.message || response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Network error calling WhatsApp API:', error);
            throw error;
        }
    }

    async markAsRead(messageId: string) {
        try {
            await this.callApi('messages', 'POST', {
                messaging_product: "whatsapp",
                status: "read",
                message_id: messageId,
            });
        } catch (e) {
            // Non-critical, just log
            console.warn('Failed to mark message as read:', e);
        }
    }

    async sendText(to: string, text: string, previewUrl: boolean = false) {
        return this.callApi('messages', 'POST', {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "text",
            text: {
                body: text,
                preview_url: previewUrl
            }
        });
    }

    async sendInteractiveReply(to: string, bodyText: string, buttons: InteractiveButton[]) {
        return this.callApi('messages', 'POST', {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "interactive",
            interactive: {
                type: "button",
                body: { text: bodyText },
                action: {
                    buttons: buttons.map(btn => ({
                        type: "reply",
                        reply: {
                            id: btn.id,
                            title: btn.title
                        }
                    }))
                }
            }
        });
    }

    // Function to send a product-like carousel (simulated using templates or multi-product messages)
    // Note: True carousels are 'templates'. This uses the 'template' format referenced in Jasper's Market.
    async sendCarouselTemplate(to: string, templateName: string, language: string = 'es', cards: { image: string, index: number }[]) {
        // Jasper's Market example uses a specific template structure for carousels
        const components = [
            {
                type: "carousel",
                cards: cards.map(c => ({
                    card_index: c.index,
                    components: [
                        {
                            type: "header",
                            parameters: [
                                {
                                    type: "image",
                                    image: { link: c.image }
                                }
                            ]
                        }
                    ]
                }))
            }
        ];

        return this.callApi('messages', 'POST', {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "template",
            template: {
                name: templateName,
                language: { code: language },
                components
            }
        });
    }

    // "Limited Time Offer" - Uses a template with specific parameters
    async sendLimitedTimeOffer(to: string, templateName: string, imageLink: string, offerCode: string, expiryMs: number) {
        return this.callApi('messages', 'POST', {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to,
            type: "template",
            template: {
                name: templateName,
                language: { code: 'es' }, // Default to Spanish as per user context
                components: [
                    {
                        type: "header",
                        parameters: [
                            {
                                type: "image",
                                image: { link: imageLink }
                            }
                        ]
                    },
                    {
                        type: "limited_time_offer",
                        parameters: [
                            {
                                type: "limited_time_offer",
                                limited_time_offer: {
                                    expiration_time_ms: expiryMs
                                }
                            }
                        ]
                    },
                    {
                        type: "button",
                        sub_type: "copy_code",
                        index: 0,
                        parameters: [
                            {
                                type: "coupon_code",
                                coupon_code: offerCode
                            }
                        ]
                    }
                ]
            }
        });
    }
}
