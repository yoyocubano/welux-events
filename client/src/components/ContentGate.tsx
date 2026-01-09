import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Check, Copy, Facebook, Twitter, Linkedin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { submitInquiry } from '../lib/api';

// Custom WhatsApp Icon (Lucide doesn't have a standard brand icon for it)
const WhatsappIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
);

interface ContentGateModalProps {
    pageName: string;
    mode?: 'fixed' | 'absolute';
}

export function ContentGate({ pageName, mode = 'fixed' }: ContentGateModalProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newsletter, setNewsletter] = useState(true);
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });

    useEffect(() => {
        // Check if already unlocked
        const isUnlocked = localStorage.getItem('welux_gate_unlocked');
        if (!isUnlocked) {
            // Soft Gate: Allow viewing for 8 seconds before soft locking
            // This gives them time to "engage" before we ask for a commitment
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const unlockGate = () => {
        localStorage.setItem('welux_gate_unlocked', 'true');
        setIsOpen(false);
    };

    const handleShare = async (platform: 'whatsapp' | 'facebook' | 'twitter' | 'linkedin' | 'copy') => {
        const url = window.location.href;
        const pageTitle = document.title;
        // Enhanced share message with page context
        const text = `✨ ${pageTitle} - Unlock exclusive insights and premium content from Welux Events. Definitely worth a read! 🚀`;

        let shareUrl = '';
        switch (platform) {
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'copy':
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                unlockGate();
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            // Auto unlock on share - rewarding user for sharing
            setTimeout(unlockGate, 1000);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const newsletterMsg = newsletter
                ? "[NEWSLETTER: YES]"
                : "[NEWSLETTER: NO]";

            await submitInquiry({
                name: formData.name,
                email: formData.email,
                message: `${newsletterMsg} - Unlocked Page: ${pageName}`,
                eventType: 'Content Unlock',
                eventDate: new Date().toISOString()
            });

            unlockGate();

        } catch (error) {
            console.error("Gate Error:", error);
            // Fallback unlock to not block user
            unlockGate();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Determine positioning class based on mode
    const positionClass = mode === 'fixed' ? 'fixed inset-0' : 'absolute inset-0';

    return (
        <div className={`${positionClass} z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6 overflow-hidden`}>
            {/* Soft Blur Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-white/20 backdrop-blur-2xl transition-all duration-700"
            />

            <motion.div
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                className="relative w-full max-w-lg bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden border border-[#D4AF37]/30"
            >
                {/* Decorative Top Border */}
                <div className="h-1.5 w-full bg-gradient-to-r from-[#D4AF37] via-[#F8E79B] to-[#D4AF37]" />

                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-[#FAF8F3] rounded-full mb-4 shadow-sm border border-[#D4AF37]/20">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <motion.div
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    opacity: [0.8, 1, 0.8] 
                                }}
                                transition={{ 
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut" 
                                }}
                            >
                                <Lock className="w-8 h-8 text-[#D4AF37]" />
                            </motion.div>
                                </motion.div>
                            </motion.div>
                        </div>
                        <h2 className="text-2xl font-serif text-[#1a1a1a] mb-2">
                            {t('gate.read_more', 'Read More')}
                        </h2>
                        <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed">
                            {t('gate.unlock_desc_soft', 'Unlock this exclusive content by sharing or signing up.')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-xs uppercase tracking-wider text-gray-500 font-medium ml-1">
                                    {t('gate.name', 'Your Name')}
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-[#FAF8F3] border-transparent focus:border-[#D4AF37] focus:bg-white transition-all h-11"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-500 font-medium ml-1">
                                    {t('gate.email', 'Email')}
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="bg-[#FAF8F3] border-transparent focus:border-[#D4AF37] focus:bg-white transition-all h-11"
                                    placeholder="jane@example.com"
                                />
                            </div>
                        </div>

                        {/* Newsletter Toggle - Styled cleaner */}
                        <div
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#FAF8F3] cursor-pointer transition-colors group"
                            onClick={() => setNewsletter(!newsletter)}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newsletter ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-gray-300'}`}>
                                {newsletter && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors">
                                {t('gate.newsletter_label', 'Keep me updated with useful insights')}
                            </span>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 text-sm uppercase tracking-widest font-bold bg-[#1a1a1a] text-[#EAE6DF] hover:bg-black hover:scale-[1.01] transition-all shadow-xl"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <Unlock className="w-4 h-4 animate-spin" />
                                    {t('gate.unlocking', 'Unlocking...')}
                                </span>
                            ) : (
                                t('gate.submit', 'Unlock Content')
                            )}
                        </Button>
                    </form>

                    {/* Social Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-white/90 px-4 text-gray-400">{t('gate.share_label', 'Or Share to Unlock')}</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex justify-center items-center gap-4">
                        <button onClick={() => handleShare('whatsapp')} className="p-3 rounded-full bg-[#FAF8F3] text-gray-600 hover:text-[#25D366] hover:bg-green-50 transition-all hover:-translate-y-1">
                            <WhatsappIcon size={20} />
                        </button>
                        <button onClick={() => handleShare('facebook')} className="p-3 rounded-full bg-[#FAF8F3] text-gray-600 hover:text-[#1877F2] hover:bg-blue-50 transition-all hover:-translate-y-1">
                            <Facebook size={20} />
                        </button>
                        <button onClick={() => handleShare('twitter')} className="p-3 rounded-full bg-[#FAF8F3] text-gray-600 hover:text-[#1DA1F2] hover:bg-sky-50 transition-all hover:-translate-y-1">
                            <Twitter size={20} />
                        </button>
                        <button onClick={() => handleShare('linkedin')} className="p-3 rounded-full bg-[#FAF8F3] text-gray-600 hover:text-[#0A66C2] hover:bg-blue-50 transition-all hover:-translate-y-1">
                            <Linkedin size={20} />
                        </button>
                        <button onClick={() => handleShare('copy')} className="p-3 rounded-full bg-[#FAF8F3] text-gray-600 hover:text-[#D4AF37] hover:bg-yellow-50 transition-all hover:-translate-y-1 relative group">
                            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                            {copied && (
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-1 rounded shadow-sm">
                                    {t('gate.share_success', 'Copied!')}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
