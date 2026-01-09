import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { submitInquiry } from '../lib/api';

interface WhatsAppGateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function WhatsAppGateModal({ isOpen, onClose, onSuccess }: WhatsAppGateModalProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Send data to backend (Capture System) - Trigger Rebuild
            await submitInquiry({
                ...formData,
                eventType: 'WhatsApp Request',
                eventDate: new Date().toISOString()
            });

            // 2. Unlock global state
            if (onSuccess) onSuccess();

            // 3. Redirect to WhatsApp Bot
            window.open("https://wa.me/message/7SOWOMDB24AUP1", '_blank');

            onClose();
        } catch (error) {
            console.error(error);
            alert('Error saving your details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-[#0F1115] border border-[#C2A46D]/30 rounded-xl p-6 shadow-2xl"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="mx-auto w-12 h-12 bg-[#25D366]/20 rounded-full flex items-center justify-center mb-3 text-[#25D366]">
                                <MessageCircle size={24} />
                            </div>
                            <h2 className="text-xl font-marketing font-semibold text-[#EAE6DF] mb-1">
                                {t('contact.whatsapp_gate_title', 'Start WhatsApp Chat')}
                            </h2>
                            <p className="text-sm text-gray-400">
                                {t('contact.whatsapp_gate_subtitle', 'Please introduce yourself properly to connect with our team immediately.')}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    name="name"
                                    placeholder={t('contact.form_name', 'Full Name')}
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#C2A46D]/50"
                                />
                            </div>
                            <div>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder={t('contact.form_email', 'Email Address')}
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#C2A46D]/50"
                                />
                            </div>
                            <div>
                                <Input
                                    name="phone"
                                    type="tel"
                                    placeholder={t('contact.form_phone', 'Phone Number')}
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#C2A46D]/50"
                                />
                            </div>
                            <div>
                                <Textarea
                                    name="message"
                                    placeholder={t('contact.form_message', 'How can we help you?')}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#C2A46D]/50 h-24"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-medium"
                            >
                                {loading ? 'Connecting...' : (
                                    <span className="flex items-center gap-2">
                                        {t('contact.whatsapp_continue', 'Continue to WhatsApp')}
                                        <Send size={16} />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
