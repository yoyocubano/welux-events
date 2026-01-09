import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { WhatsAppGateModal } from "./WhatsAppGateModal";
import { useContactGate } from "@/hooks/useContactGate";

export function WhatsAppButton() {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isUnlocked, unlock } = useContactGate();

    // Official WhatsApp Config
    const officialShortLink = "https://wa.me/message/7SOWOMDB24AUP1";

    if (isUnlocked) {
        return (
            <a
                href={officialShortLink}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1db954] transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4"
                aria-label="Contact on WhatsApp"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="font-semibold">{t("common.whatsapp")}</span>
            </a>
        );
    }

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-full shadow-lg hover:bg-[#1db954] transition-all duration-300 hover:scale-105 animate-in fade-in slide-in-from-bottom-4 cursor-pointer"
                aria-label="Contact on WhatsApp"
            >
                <MessageCircle className="w-6 h-6" />
                <span className="font-semibold">{t("common.whatsapp")}</span>
            </button>

            <WhatsAppGateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    unlock();
                    setIsModalOpen(false);
                }}
            />
        </>
    );
}
