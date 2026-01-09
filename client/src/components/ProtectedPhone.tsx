import { useState } from 'react';
import { Phone, Lock } from 'lucide-react';
import { useContactGate } from '@/hooks/useContactGate';
import { WhatsAppGateModal } from '@/components/WhatsAppGateModal';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

interface ProtectedPhoneProps {
    className?: string;
    showIcon?: boolean;
}

export function ProtectedPhone({ className, showIcon = true }: ProtectedPhoneProps) {
    const { isUnlocked, unlock } = useContactGate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { t } = useTranslation();

    const handleUnlock = () => {
        unlock();
        setIsModalOpen(false);
    };

    if (isUnlocked) {
        return (
            <a href="tel:+352621430283" className={cn("hover:text-primary transition-colors flex items-center gap-2", className)}>
                {showIcon && <Phone className="w-4 h-4" />}
                <span>+352 621 430 283</span>
            </a>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={cn(
                    "group relative flex items-center gap-2 cursor-pointer hover:text-primary transition-colors text-left",
                    className
                )}
                title={t('contact.unlock_phone', 'Complete form to reveal')}
            >
                {showIcon && <Phone className="w-4 h-4" />}
                <span className="font-mono tracking-wider">
                    +352 621 430 <span className="blur-[3px] select-none">283</span>
                </span>
                <Lock className="w-3 h-3 text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />

                {/* Tooltip */}
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {t('contact.click_to_reveal', 'Fill form to reveal')}
                </span>
            </button>

            <WhatsAppGateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleUnlock}
            />
        </>
    );
}
