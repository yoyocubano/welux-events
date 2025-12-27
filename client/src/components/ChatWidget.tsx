
import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";

// --- Types ---\ninterface Message {
    role: "user" | "assistant";
    content: string;
    timestamp?: string; // Display time (e.g. "10:30")
    date?: string; // ISO Date for sorting/dividers
    status?: "sent" | "delivered" | "read";
}

// --- Theme Constants (Dark Luxury) ---
const THEME = {
    primary: "#D4AF37", // Gold
    bg: "bg-[#0F0F0F]", // Deep Black
    surface: "bg-[#141414]", // Slightly Lighter Black
    userBubble: "bg-[#005c4b] text-[#E9EDEF]", // WhatsApp Dark Green
    botBubble: "bg-[#202c33] text-[#E9EDEF]", // WhatsApp Dark Gray
    dateBadge: "bg-[#1f2c34] text-[#8696a0] shadow-sm", // Date divider
};

// --- Sound Effects (Web Audio API) ---
const playSound = (type: "send" | "receive") => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === "send") {
            osc.frequency.setValueAtTime(800, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } else {
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        }
    } catch (e) {
        console.error("Audio play failed", e);
    }
};

export default function ChatWidget() {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(() => {
        try {
            const saved = localStorage.getItem("rebeca_chat_history");
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to load chat history", e);
            return [];
        }
    });

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            localStorage.setItem("rebeca_chat_history", JSON.stringify(messages));
        } catch (e) {
            console.error("Failed to save chat history", e);
        }
    }, [messages]);

    useEffect(() => {
        if (messages.length === 0 && isOpen) {
            setIsLoading(true);
            const timer = setTimeout(() => {
                setMessages([
                    {
                        role: "assistant",
                        content: t("chat.greeting"),
                        timestamp: getCurrentTime(),
                    },
                ]);
                setIsLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [isOpen, t, messages.length]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            document.body.style.position = "fixed";
            document.body.style.width = "100%";
        } else {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.position = "";
            document.body.style.width = "";
        };
    }, [isOpen]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading]);

    const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const getISODate = () => new Date().toISOString();

    const formatDateDivider = (dateStr?: string) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return t("chat.today", "Today");
        if (date.toDateString() === yesterday.toDateString()) return t("chat.yesterday", "Yesterday");
        return date.toLocaleDateString();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg: Message = {
            role: "user",
            content: inputValue,
            timestamp: getCurrentTime(),
            date: getISODate(),
            status: "sent",
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue("");
        setIsLoading(true);
        playSound("send");

        const msgIndex = messages.length;
        setTimeout(() => {
            setMessages((prev) =>
                prev.map((m, i) => (i === msgIndex && m.role === "user" ? { ...m, status: "delivered" } : m))
            );
        }, 800);

        try {
            const apiMessages = [...messages, userMsg]
                .filter((m) => !m.content.startsWith("[[SUBMIT"))
                .map((m) => ({ role: m.role, content: m.content }));

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: apiMessages,
                    language: i18n.language || "en",
                }),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error("Network error");

            const data = await response.json();
            const assistantText = data.content || t("chat.connecting");

            setMessages((prev) =>
                prev.map((m, i) => (i === msgIndex && m.role === "user" ? { ...m, status: "read" } : m))
            );

            const typingSpeed = Math.min(Math.max(assistantText.length * 20, 1500), 4000);

            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: assistantText,
                        timestamp: getCurrentTime(),
                        date: getISODate(),
                    },
                ]);
                setIsLoading(false);
                playSound("receive");
            }, typingSpeed);
        } catch (error) {
            console.error("Chat error:", error);
            setIsLoading(false);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: t("chat.error"),
                    timestamp: getCurrentTime(),
                },
            ]);
        } finally {
            setTimeout(() => {
                const input = document.querySelector(\'input[name="chat-input"]\') as HTMLInputElement;
                if (input && window.matchMedia("(min-width: 768px)").matches) input.focus();
            }, 100);
        }
    };
    
    const MessageStatus = ({ status }: { status?: "sent" | "delivered" | "read" }) => {
        if (!status) return null;
        const color = status === "read" ? "#53bdeb" : "currentColor";

        return (
            <span className="ml-1 flex items-center" title={status}>
                {status === "sent" && (
                    <svg viewBox="0 0 16 15" width="11" height="11" fill="none" className="block relative top-[1px]">
                        <path d="M15.01 3.316l-7.38 7.38c-.4.4-.88.59-1.36.59-.49 0-.98-.2-1.36-.59L1.48 7.3c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0l2.05 2.06 6.02-6.03c.79-.78 2.06-.78 2.84 0 .78.79.78 2.05-.21 2.81z" fill="currentColor" fillOpacity="0.5" />
                    </svg>
                )}
                {(status === "delivered" || status === "read") && (
                    <div className="flex relative top-[1px]">
                        <svg viewBox="0 0 16 15" width="11" height="11" fill="none" className="block -mr-[5px]">
                            <path d="M15.01 3.316l-7.38 7.38c-.4.4-.88.59-1.36.59-.49 0-.98-.2-1.36-.59L1.48 7.3c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0l2.05 2.06 6.02-6.03c.79-.78 2.06-.78 2.84 0 .78.79.78 2.05-.21 2.81z" fill={color} fillOpacity={status === "read" ? 1 : 0.6} />
                        </svg>
                        <svg viewBox="0 0 16 15" width="11" height="11" fill="none" className="block">
                            <path d="M15.01 3.316l-7.38 7.38c-.4.4-.88.59-1.36.59-.49 0-.98-.2-1.36-.59L1.48 7.3c-.78-.78-.78-2.05 0-2.83.78-.78 2.05-.78 2.83 0l2.05 2.06 6.02-6.03c.79-.78 2.06-.78 2.84 0 .78.79.78 2.05-.21 2.81z" fill={color} fillOpacity={status === "read" ? 1 : 0.6} />
                        </svg>
                    </div>
                )}
            </span>
        );
    };

    const TypingIndicator = () => (
        <div className="flex gap-1.5 p-4 bg-[#2A2A2A] rounded-[24px] rounded-tl-sm w-fit animate-in fade-in slide-in-from-left-2 items-center h-[42px] border border-white/5 shadow-md">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
        </div>
    );
    
    return (
        <>
            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[99]"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300 inset-0 sm:inset-auto sm:bottom-[50%] sm:translate-y-[50%] sm:right-8 origin-bottom-right">
                        <Card className={`w-full h-full sm:w-[500px] sm:h-[90vh] md:w-[550px] flex flex-col shadow-chat-pro border border-[#D4AF37]/20 bg-[#0b141a] overflow-hidden rounded-none sm:rounded-[26px]`}>
                            <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                                style={{ backgroundImage: "url(\'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png\')" }}
                            />
                            <div className="p-4 py-5 shrink-0 flex justify-between items-center border-b border-white/5 bg-[#141414]/90 backdrop-blur-sm">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8a7224] flex items-center justify-center border-2 border-[#141414] shadow-md">
                                            <span className="text-sm font-bold text-black font-sans">AI</span>
                                        </div>
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#141414] rounded-full shadow-[0_0_8px_#22c55e]\"></span>
                                    </div>
                                    <div>
                                        <h3 className="font-sans font-bold text-white text-base tracking-tight">Rebeca AI</h3>
                                        <p className="text-[11px] text-[#D4AF37] uppercase tracking-wider font-medium\">Concierge</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full w-8 h-8 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div
                                className="chat-messages-area flex-1 overflow-y-auto overflow-x-hidden p-4 flex flex-col"
                            >
                                {messages.map((msg, idx) => {
                                    const isUser = msg.role === "user";
                                    const prevMsg = messages[idx - 1];
                                    const showDateDivider = !prevMsg || (msg.date && prevMsg.date && new Date(msg.date).toDateString() !== new Date(prevMsg.date).toDateString());

                                    return (
                                        <React.Fragment key={idx}>
                                            {showDateDivider && (
                                                <div className="flex justify-center my-4">
                                                    <span className={`${THEME.dateBadge} text-[11px] font-medium px-3 py-1.5 rounded-lg uppercase tracking-wide opacity-90`}>
                                                        {formatDateDivider(msg.date || new Date().toISOString())}
                                                    </span>
                                                </div>
                                            )}
                                            <div
                                                className={`flex w-full mb-4 ${isUser ? \'justify-end\' : \'justify-start\'}`}
                                            >
                                                <div className={`flex gap-3 max-w-[85%] ${isUser ? \'flex-row-reverse\' : \'flex-row\'}`}>
                                                    {!isUser && (
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8a7224] flex items-center justify-center shrink-0 shadow-md border border-white/5 select-none text-[10px] font-bold text-black font-sans mt-1">
                                                            AI
                                                        </div>
                                                    )}
                                                    <div className={\`flex flex-col ${isUser ? 'items-end' : 'items-start'}\`}>
                                                        <div
                                                            className={`px-4 py-2 text-[14.5px] leading-relaxed shadow-sm break-words border-none
                                                            ${isUser
                                                                    ? `${THEME.userBubble} rounded-bl-lg rounded-tl-lg rounded-tr-none rounded-br-lg`
                                                                    : `${THEME.botBubble} rounded-bl-none rounded-tl-lg rounded-tr-lg rounded-br-lg`
                                                                }
                                                        \`}
                                                            style={{
                                                                wordBreak: \'break-word\',
                                                                overflowWrap: \'anywhere\',
                                                                hyphens: \'auto\'
                                                            }}
                                                        >
                                                            <ReactMarkdown
                                                                className="prose prose-invert max-w-none"
                                                                components={{
                                                                    a: ({ node, ...props }) => (
                                                                        <a {...props} className="break-all underline" />
                                                                    ),
                                                                    p: ({ node, ...props }) => (
                                                                        <p {...props} style={{ margin: 0, wordBreak: \'break-word\' }} />
                                                                    )
                                                                }}
                                                            >
                                                                {msg.content}
                                                            </ReactMarkdown>
                                                        </div>
                                                        {(!messages[idx + 1] || messages[idx + 1].role !== msg.role) && (
                                                            <div className={`flex items-center gap-1 mt-1 select-none ${isUser ? \'mr-1 flex-row justify-end\' : \'ml-1 flex-row text-gray-600\'}`}>
                                                                <span className="text-[10px] opacity-70">
                                                                    {msg.timestamp}
                                                                </span>
                                                                {isUser && <MessageStatus status={msg.status} />}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })}

                                {isLoading && (
                                    <div className="flex justify-start mt-6">
                                        <div className="flex gap-3 items-end">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8a7224] flex items-center justify-center shrink-0 border border-white/5 text-[10px] font-bold text-black font-sans">
                                                AI
                                            </div>
                                            <TypingIndicator />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-4 bg-[#141414] border-t border-white/10 shrink-0">
                                <form onSubmit={handleSubmit} className="flex gap-2 relative items-center">
                                    <Input
                                        name="chat-input"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder={t("chat.placeholder", "Type a message...")}
                                        className="flex-1 bg-[#222] border-none rounded-full px-5 h-12 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#D4AF37]/50 transition-all font-light"
                                        disabled={isLoading}
                                        autoComplete="off"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className={`rounded-full h-11 w-11 shrink-0 transition-all active:scale-95 ${inputValue.trim() ? \'bg-[#D4AF37] hover:bg-[#b5952f] text-black shadow-lg shadow-[#D4AF37]/20\' : \'bg-[#2A2A2A] text-gray-500\'}`}
                                        disabled={isLoading || !inputValue.trim()}
                                    >
                                        <Send className="w-5 h-5 ml-0.5" />
                                    </Button>
                                </form>
                            </div>
                        </Card>
                    </div>
                </>
            )}

            <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[100] animate-in zoom-in duration-300">
                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    size="lg"
                    className="h-16 w-16 rounded-full shadow-[0_4px_25px_rgba(212,175,55,0.3)] hover:scale-110 hover:shadow-[0_8px_35px_rgba(212,175,55,0.4)] transition-all duration-300 bg-gradient-to-tr from-[#D4AF37] to-[#b5952f] text-black border border-white/20"
                >
                    {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-8 h-8 stroke-[1.5]" />}
                </Button>
            </div>
        </>
    );
}
