import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Eye, Save, Lock, LayoutGrid, Radio, Briefcase, ShoppingBag, MapPin, Lightbulb, Coffee, ArrowLeft, Check, Users, Activity, RefreshCw, Calendar, Terminal, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { ContentManager } from "@/components/admin/ContentManager";

const AICreditBalance = () => {
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // Use the key available in environment or fallback (ensure to secure this in backend for real prod)
    const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || "sk-ee8de57e3144456aa0b13285ada8c0eb"; 

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await fetch("https://api.deepseek.com/user/balance", {
                    headers: { "Authorization": `Bearer ${API_KEY}` }
                });
                const data = await response.json();
                if (data.balance_infos && data.balance_infos.length > 0) {
                    setBalance(parseFloat(data.balance_infos[0].total_balance));
                }
            } catch (error) {
                console.error("Error fetching AI balance:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBalance();
        const interval = setInterval(fetchBalance, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [API_KEY]);

    if (isLoading) return <div className="px-4 py-2 animate-pulse bg-gray-200 rounded-lg h-10 w-32"></div>;

    const isExhausted = balance !== null && balance <= 0;
    const isLow = balance !== null && balance <= 0.50;
    const percentage = balance !== null ? Math.min(Math.max((balance / 5.0) * 100, 0), 100) : 0; // Assume $5 target

    return (
        <a
            href="https://platform.deepseek.com/top_up"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg shadow hover:bg-slate-800 transition-all group cursor-pointer max-w-[200px]"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className={`w-3 h-3 ${isExhausted ? 'text-red-500' : 'text-amber-500'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-amber-400 transition-colors">AI Credits</span>
                </div>
                {isExhausted && <AlertCircle className="w-3 h-3 text-red-500 animate-pulse" />}
            </div>

            <div className="flex items-end gap-1">
                <span className={`text-base font-bold ${isExhausted ? 'text-red-500' : 'text-white'}`}>
                    ${balance?.toFixed(2) || "0.00"}
                </span>
                <span className="text-[9px] text-slate-500 font-medium mb-1">USD</span>
            </div>

            <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden mt-1">
                <div
                    className={`h-full transition-all duration-1000 ${isExhausted ? 'bg-red-600' : isLow ? 'bg-orange-500' : 'bg-amber-500'}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </a>
    );
};

export default function Admin() {
    const { t } = useTranslation();
    const [accessCode, setAccessCode] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [masterCode, setMasterCode] = useState("");
    const [isResetting, setIsResetting] = useState(false);

    // Navigation State
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [systemStatus, setSystemStatus] = useState<any>({}); // State for Health Dashboard

    useEffect(() => {
        // 🔮 Magic Shortcut Check
        const params = new URLSearchParams(window.location.search);
        if (params.get("magic") === "lux" || params.get("login") === "true") {
            // AUTO-LOGIN VIA AUTH API
            handleMagicLogin();
        } else {
            // CHECK EXISTING SESSION
            const token = localStorage.getItem('welux_admin_token');
            if (token) {
                setIsAuthenticated(true);
                // Optional: Validate token validity with an API call if needed, 
                // but for basic gating this is sufficient for now.
            }
        }

        if (isAuthenticated) {
            fetchSettings();
            fetchSystemStatus(); // Fetch health status on login
        }
    }, [isAuthenticated]);

    // Fetch System Health Status
    const fetchSystemStatus = async () => {
        try {
            const res = await fetch("/api/system-status");
            if (res.ok) {
                const data = await res.json();
                setSystemStatus(data);
            }
        } catch (e) {
            console.error("Status check failed");
        }
    };
    const [channelId, setChannelId] = useState("");
    const [broadcasts, setBroadcasts] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [streamPlatform, setStreamPlatform] = useState("youtube");
    const [customCode, setCustomCode] = useState("");
    const [vlogTitle, setVlogTitle] = useState("");
    const [vlogCategory, setVlogCategory] = useState("");
    const [vlogImage, setVlogImage] = useState("");

    // Stats State
    const [ytStats, setYtStats] = useState<any>(null);
    const [leads, setLeads] = useState<any[]>([]);

    useEffect(() => {
        // 🔮 Magic Shortcut Check
        const params = new URLSearchParams(window.location.search);
        if (params.get("magic") === "lux" || params.get("login") === "true") {
            // AUTO-LOGIN VIA AUTH API
            handleMagicLogin();
        } else {
            // CHECK EXISTING SESSION
            const token = localStorage.getItem('welux_admin_token');
            if (token) {
                setIsAuthenticated(true);
                // Optional: Validate token validity with an API call if needed, 
                // but for basic gating this is sufficient for now.
            }
        }

        if (isAuthenticated) {
            fetchSettings();
        }
    }, [isAuthenticated]);

    // Fetch YouTube Stats automatically when ID is present and we are on streaming tab
    useEffect(() => {
        if (activeSection === 'streaming' && streamPlatform === 'youtube' && channelId && !channelId.startsWith('UC')) {
            fetchYouTubeStats();
        }
        if (activeSection === 'leads') {
            fetchLeads();
        }
    }, [activeSection, streamPlatform, channelId]);

    const fetchLeads = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('welux_admin_token');
            const res = await fetch("/api/leads", {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            } else {
                toast.error("Failed to load leads");
            }
        } catch (e) {
            console.error("Leads error", e);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchYouTubeStats = async () => {
        if (!channelId) return;
        try {
            const res = await fetch(`/api/youtube-status?videoId=${channelId}`);
            if (res.ok) {
                const data = await res.json();
                setYtStats(data);
            } else {
                setYtStats(null);
            }
        } catch (e) {
            console.error("Failed to fetch YT stats");
        }
    };

    const handleMagicLogin = async () => {
        // Auto-login logic for development/magic link
        // We reuse the login function with the dev password
        setAccessCode("lux2026");
        await performLogin("lux2026");
        toast.success("⚡ Magic Login Active!");
    };

    const performLogin = async (password: string) => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('welux_admin_token', data.token); // Store JWT
                setIsAuthenticated(true);
            } else {
                toast.error("Invalid Access Code");
            }
        } catch (e) {
            toast.error("Login failed");
        } finally {
            setIsLoading(false);
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await performLogin(accessCode);
    };

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/get-settings");
            if (res.ok) {
                const data = await res.json();
                setChannelId(data.youtube_channel_id || "");

                // Convert JSON Array to Simple Text for Admin View
                const broadcastsData = data.upcoming_broadcasts || [];
                if (Array.isArray(broadcastsData)) {
                    const textFormat = broadcastsData.map((b: any) => `${b.date || ''} - ${b.title || ''}`).join('\n');
                    setBroadcasts(textFormat);
                } else {
                    setBroadcasts("");
                }

                setStreamPlatform(data.stream_platform || "youtube");
                setCustomCode(data.custom_embed_code || "");
            }
        } catch (error) {
            console.error("Error fetching settings", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!masterCode) {
            toast.error("Master Security Code is required to change password.");
            return;
        }
        if (!confirm("Are you sure? You will be logged out.")) return;

        setIsLoading(true);
        try {
            // Use reset-password endpoint which enforces Master Code
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ master_code: masterCode, new_password: newPassword })
            });

            if (res.ok) {
                toast.success("Password Updated! Please log in.");
                setAccessCode("");
                setMasterCode("");
                setIsAuthenticated(false);
            } else {
                const err = await res.json();
                toast.error(err.error || "Failed to update password.");
            }
        } catch (error) {
            toast.error("An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        if (!masterCode || !newPassword) {
            toast.error("Please fill in all fields");
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ master_code: masterCode, new_password: newPassword })
            });

            if (res.ok) {
                toast.success("Password Reset Successfully! Log in now.");
                setIsResetting(false);
                setAccessCode("");
            } else {
                const err = await res.json();
                toast.error(err.error || "Invalid Master Code");
            }
        } catch (error) {
            toast.error("Reset failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveStreaming = async () => {
        setIsLoading(true);
        try {
            // Extract ID if it's a full URL (in case UI didn't catch it)
            let cleanId = channelId;
            if (cleanId.includes("youtube.com") || cleanId.includes("youtu.be")) {
                const videoMatch = cleanId.match(/(?:v=|youtu\.be\/|\/embed\/|\/live\/)([\w-]{11})/);
                const channelMatch = cleanId.match(/channel\/([\w-]+)/);
                if (videoMatch) cleanId = videoMatch[1];
                else if (channelMatch) cleanId = channelMatch[1];
            }

            // Convert Simple Text back to JSON Array
            const lines = broadcasts.split('\n');
            const parsedBroadcasts = lines.map(line => {
                const parts = line.split('-');
                if (parts.length > 1) {
                    const date = parts.shift()?.trim();
                    const title = parts.join('-').trim();
                    return { date, title };
                }
                return { date: "", title: line.trim() }; // Fallback if no separator
            }).filter(item => item.title.length > 0); // Remove empty lines

            const res = await fetch("/api/update-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    youtube_channel_id: cleanId,
                    stream_platform: streamPlatform,
                    custom_embed_code: customCode,
                    upcoming_broadcasts: parsedBroadcasts,
                    access_code: accessCode
                })
            });

            if (res.ok) {
                toast.success("Streaming settings saved!");
            } else {
                const errData = await res.json().catch(() => ({}));
                toast.error(`Failed to save: ${errData.error || "Unknown error"}`);
            }
        } catch (error) {
            toast.error("Error saving settings.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveVlog = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/vlog-posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: vlogTitle,
                    category: vlogCategory,
                    image_url: vlogImage,
                    access_code: accessCode
                })
            });

            if (res.ok) {
                toast.success("Vlog post published!");
                setVlogTitle("");
                setVlogCategory("");
                setVlogImage("");
            } else {
                toast.error("Failed to publish.");
            }
        } catch (error) {
            toast.error("Error publishing vlog.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                <Card className="w-full max-w-md shadow-xl border-t-4 border-yellow-400">
                    <CardHeader>
                        <CardTitle className="text-center font-serif text-2xl">
                            {isResetting ? "Recover Password" : "Admin Access"}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {isResetting
                                ? "Enter Master Code to reset admin password."
                                : "Welux Events Management"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!isResetting ? (
                            <div className="space-y-4">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Access Code</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                type="password"
                                                value={accessCode}
                                                onChange={(e) => setAccessCode(e.target.value)}
                                                className="pl-9"
                                                placeholder="Enter admin password..."
                                            />
                                        </div>
                                    </div>
                                    <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white">Enter Dashboard</Button>
                                </form>
                                <button
                                    onClick={() => setIsResetting(true)}
                                    className="text-xs text-gray-400 hover:text-gray-600 underline w-full text-center"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Input
                                        type="password"
                                        placeholder="Master Security Code"
                                        value={masterCode}
                                        onChange={(e) => setMasterCode(e.target.value)}
                                    />
                                    <Input
                                        type="password"
                                        placeholder="New Admin Password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <Button onClick={handleResetPassword} className="w-full bg-orange-600 hover:bg-orange-700 text-white">Reset Password</Button>
                                <button
                                    onClick={() => setIsResetting(false)}
                                    className="text-xs text-gray-500 hover:text-gray-900 w-full text-center"
                                >
                                    Back to Login
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Module Selection Logic
    const renderContent = () => {
        if (!activeSection) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500">

                    {/* SYSTEM HEALTH - New Module */}
                    <Card className="col-span-1 md:col-span-2 lg:col-span-3 border-l-4 border-emerald-500 bg-emerald-50/30">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <div className="relative">
                                        <span className="w-3 h-3 bg-emerald-500 rounded-full block animate-pulse"></span>
                                        <span className="w-3 h-3 bg-emerald-500 rounded-full block absolute top-0 left-0 animate-ping opacity-75"></span>
                                    </div>
                                    System Health Monitor
                                </CardTitle>
                                <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => fetchSystemStatus()}>
                                    Refresh
                                </Button>
                            </div>
                            <CardDescription>Real-time operational status of all subsystems</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-4 md:gap-8">
                                {/* Database */}
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-full ${systemStatus.supabase ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {systemStatus.supabase ? <Check className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border-2 border-red-500" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Database</span>
                                        <span className={`text-sm font-semibold ${systemStatus.supabase ? 'text-green-700' : 'text-red-600'}`}>
                                            {systemStatus.supabase ? 'Operational' : 'Disconnect'}
                                        </span>
                                    </div>
                                </div>

                                {/* AI Service */}
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-full ${systemStatus.ai_service ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {systemStatus.ai_service ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">AI Brain</span>
                                        <span className={`text-sm font-semibold ${systemStatus.ai_service ? 'text-green-700' : 'text-yellow-600'}`}>
                                            {systemStatus.ai_service ? 'Active' : 'Unconfigured'}
                                        </span>
                                    </div>
                                </div>

                                {/* Email Service */}
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-full ${systemStatus.email_service ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                        {systemStatus.email_service ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Email System</span>
                                        <span className={`text-sm font-semibold ${systemStatus.email_service ? 'text-green-700' : 'text-yellow-600'}`}>
                                            {systemStatus.email_service ? 'Ready' : 'Pending Keys'}
                                        </span>
                                    </div>
                                </div>

                                {/* Env */}
                                <div className="flex items-center gap-2 ml-auto">
                                    <span className="text-xs px-2 py-1 bg-gray-200 rounded text-gray-600 font-mono uppercase">
                                        {systemStatus.environment || 'Loading...'}
                                    </span>
                                    {/* AI Credit Balance Injection */}
                                    <div className="ml-4">
                                        <AICreditBalance />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Supervision (Detailed View) */}
                    <Card
                        className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-t-4 border-indigo-500 hover:-translate-y-1"
                        onClick={() => setActiveSection('supervision')}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                    <Activity className="w-6 h-6 text-indigo-600" />
                                </div>
                                <span>Supervisión Total</span>
                            </CardTitle>
                            <CardDescription>
                                Advanced diagnostics, latency checks, and logs.
                            </CardDescription>
                        </CardHeader>
                    </Card>


                    {/* LEADS & CRM - New Module */}
                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-indigo-500 group col-span-1 md:col-span-2 lg:col-span-3"
                        onClick={() => setActiveSection('leads')}
                    >
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>Client Leads (CRM)</CardTitle>
                                <CardDescription>View form submissions and inquiries ({leads.length})</CardDescription>
                            </div>
                            <div className="ml-auto text-2xl font-bold text-gray-300 group-hover:text-indigo-600 transition-colors">
                                {leads.length}
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Streaming Module */}
                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-red-500 group"
                        onClick={() => setActiveSection('streaming')}
                    >
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-red-100 text-red-600 rounded-full group-hover:scale-110 transition-transform">
                                <Radio className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>Streaming & TV</CardTitle>
                                <CardDescription>Manage Live & Broadcasts</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Vlog Module */}
                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-green-500 group"
                        onClick={() => setActiveSection('vlog')}
                    >
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-full group-hover:scale-110 transition-transform">
                                <LayoutGrid className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>Vlog / Blog</CardTitle>
                                <CardDescription>Publish Articles</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Jobs Module */}
                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-blue-500 group"
                        onClick={() => setActiveSection('jobs')}
                    >
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-full group-hover:scale-110 transition-transform">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>Jobs & Careers</CardTitle>
                                <CardDescription>Manage Job Listings</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Deals Module */}
                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-pink-500 group"
                        onClick={() => setActiveSection('deals')}
                    >
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-pink-100 text-pink-600 rounded-full group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>Deals & Offers</CardTitle>
                                <CardDescription>Manage Discounts</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Services */}
                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-purple-500 group"
                        onClick={() => setActiveSection('services')}
                    >
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-full group-hover:scale-110 transition-transform">
                                <Lightbulb className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>Services</CardTitle>
                                <CardDescription>Manage Service Portfolio</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Local Tips */}
                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-orange-500 group"
                        onClick={() => setActiveSection('tips')}
                    >
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-full group-hover:scale-110 transition-transform">
                                <Coffee className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>Local Tips</CardTitle>
                                <CardDescription>Restaurants & Hidden Gems</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Security */}
                    <Card
                        className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-gray-500 group col-span-1 md:col-span-2 lg:col-span-3"
                        onClick={() => setActiveSection('security')}
                    >
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-3 bg-gray-100 text-gray-600 rounded-full group-hover:scale-110 transition-transform">
                                <Lock className="w-6 h-6" />
                            </div>
                            <div>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>Change Password</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                </div>
            );
        }

        // Render Active Section
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() => setActiveSection(null)}
                    className="mb-4 pl-0 hover:pl-2 transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>

                {activeSection === 'leads' && (
                    <Card className="animate-in slide-in-from-right-8 duration-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="w-6 h-6 text-indigo-600" />
                                Client Inquiries CRM
                            </CardTitle>
                            <CardDescription>Most recent form submissions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto rounded-md border">
                                <div className="min-w-full inline-block align-middle">
                                    <div className="border-b bg-gray-50 p-3 grid grid-cols-12 gap-4 font-medium text-xs text-gray-500 uppercase tracking-wider">
                                        <div className="col-span-2">Date</div>
                                        <div className="col-span-2">Name</div>
                                        <div className="col-span-3">Email/Phone</div>
                                        <div className="col-span-2">Type</div>
                                        <div className="col-span-3">Message</div>
                                    </div>
                                    <div className="divide-y divide-gray-100 bg-white">
                                        {leads.length === 0 ? (
                                            <div className="p-8 text-center text-gray-500 text-sm">No leads found yet.</div>
                                        ) : (
                                            leads.map((lead: any) => (
                                                <div key={lead.id} className="grid grid-cols-12 gap-4 p-3 text-sm hover:bg-gray-50 transition-colors items-center">
                                                    <div className="col-span-2 text-gray-500 text-xs">
                                                        {new Date(lead.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="col-span-2 font-medium truncate" title={lead.name}>
                                                        {lead.name}
                                                    </div>
                                                    <div className="col-span-3 flex flex-col text-xs text-gray-600">
                                                        <span className="truncate" title={lead.email}>{lead.email}</span>
                                                        <span className="text-gray-400">{lead.phone}</span>
                                                    </div>
                                                    <div className="col-span-2">
                                                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                                                            {lead.eventType}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-3 text-gray-600 text-xs line-clamp-2" title={lead.message}>
                                                        {lead.message}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeSection === 'streaming' && (
                    <div className="grid gap-8 animate-in slide-in-from-right-8 duration-500">
                        {/* YouTube Channel Config */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Radio className="w-5 h-5 text-red-600" />
                                    Stream Configuration
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex gap-4 p-1 bg-gray-100 rounded-lg w-fit">
                                    <button
                                        onClick={() => setStreamPlatform("youtube")}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${streamPlatform === 'youtube' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        YouTube
                                    </button>
                                    <button
                                        onClick={() => setStreamPlatform("custom")}
                                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${streamPlatform === 'custom' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-900'}`}
                                    >
                                        Custom Embed
                                    </button>
                                </div>

                                {streamPlatform === 'youtube' ? (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Channel ID / Video ID (or paste full link)</label>
                                        <Input
                                            value={channelId}
                                            onChange={(e) => {
                                                let val = e.target.value;
                                                // Auto-extract ID if full URL is pasted
                                                if (val.includes("youtube.com") || val.includes("youtu.be")) {
                                                    const videoMatch = val.match(/(?:v=|youtu\.be\/|\/embed\/|\/live\/)([\w-]{11})/);
                                                    const channelMatch = val.match(/channel\/([\w-]+)/);
                                                    if (videoMatch) val = videoMatch[1];
                                                    else if (channelMatch) val = channelMatch[1];
                                                }
                                                setChannelId(val);
                                            }}
                                            placeholder="Paste ID (UC...) or Full YouTube Link"
                                        />
                                        <p className="text-xs text-gray-500">
                                            Tip: You can paste a full YouTube URL like 'https://www.youtube.com/watch?v=...' and we'll extract the ID automatically.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Embed Code</label>
                                        <Textarea
                                            value={customCode}
                                            onChange={(e) => setCustomCode(e.target.value)}
                                            className="font-mono text-xs min-h-[100px]"
                                            placeholder='<iframe src="..." ...></iframe>'
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* LIVE PREVIEW - Added for verification */}
                        <Card className="border-t-4 border-red-500 shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-gray-600" />
                                    Live Preview Verification
                                </CardTitle>
                                <CardDescription>
                                    Check exactly what users see on the main site.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video w-full bg-black rounded-lg overflow-hidden border border-gray-200 shadow-inner">
                                    {streamPlatform === 'custom' ? (
                                        <div
                                            className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full"
                                            dangerouslySetInnerHTML={{ __html: customCode }}
                                        />
                                    ) : (
                                        channelId ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={channelId.startsWith("UC")
                                                    ? `https://www.youtube.com/embed/live_stream?channel=${channelId}`
                                                    : `https://www.youtube.com/embed/${channelId}?autoplay=0`}
                                                title="Live Preview"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="w-full h-full"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                                                Enter an ID to see preview
                                            </div>
                                        )
                                    )}

                                    {/* Supervision (New) */}
                                    {/* This button seems misplaced here based on the original request context.
                                        If it's meant to be a dashboard navigation button, it should be with other Card components.
                                        If it's related to the preview, its styling and placement are unusual.
                                        Assuming the instruction meant to add it as a new dashboard card,
                                        but following the exact placement from the provided snippet.
                                    */}
                                    <Button
                                        variant={activeSection === 'supervision' ? "secondary" : "ghost"}
                                        className="w-full justify-start gap-2"
                                        onClick={() => setActiveSection('supervision')}
                                    >
                                        <Activity className="w-4 h-4" />
                                        Supervisión
                                    </Button>

                                    {/* Real-time Stats Overlay */}
                                    {streamPlatform === 'youtube' && ytStats && (
                                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white p-2 rounded-lg text-xs border border-white/20 shadow-xl z-20">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className={`w-2 h-2 rounded-full ${ytStats.status === 'live' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                                <span className="font-bold uppercase tracking-wider">{ytStats.status || 'OFFLINE'}</span>
                                            </div>
                                            <div className="space-y-0.5">
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-gray-400">Viewers:</span>
                                                    <span className="font-mono">{ytStats.viewers || 0}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span className="text-gray-400">Likes:</span>
                                                    <span className="font-mono">{ytStats.likes || 0}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-2 flex justify-between items-center text-xs text-center text-gray-400">
                                    <span>Direct simulation of main player.</span>
                                    {streamPlatform === 'youtube' && (
                                        <button onClick={fetchYouTubeStats} className="flex items-center gap-1 hover:text-gray-900">
                                            <Eye className="w-3 h-3" /> Update Stats
                                        </button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Broadcasts Schedule</CardTitle>
                                <CardDescription>Simple List (One event per line)</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <label className="text-sm font-medium">Format: Date - Title</label>
                                <Textarea
                                    value={broadcasts}
                                    onChange={(e) => setBroadcasts(e.target.value)}
                                    className="font-mono text-sm min-h-[200px]"
                                    placeholder={`Jan 15 - Wedding Gala\nJan 22 - Live Interview`}
                                />
                                <div className="border-t pt-4 flex justify-end">
                                    <Button onClick={handleSaveStreaming} disabled={isLoading} className="bg-red-600 hover:bg-red-700">Save Schedule</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeSection === 'vlog' && (
                    <ContentManager
                        section="vlog"
                        title="Vlog & News"
                        labels={{
                            title: "Article Title",
                            subtitle: "Category (e.g. Trends)",
                            description: "Summary / Short Content",
                            badge: "Date Label (e.g. Today)"
                        }}
                    />
                )}

                {activeSection === 'jobs' && (
                    <ContentManager
                        section="jobs"
                        title="Jobs"
                        labels={{ title: "Job Title", subtitle: "Type (Contract/Freelance)", description: "Location / Details", badge: "Posted Date" }}
                    />
                )}

                {activeSection === 'deals' && (
                    <ContentManager
                        section="deals"
                        title="Deals"
                        labels={{ title: "Offer Title", subtitle: "Partner Name", description: "Terms", badge: "Discount (%)" }}
                    />
                )}

                {activeSection === 'services' && (
                    <ContentManager
                        section="services"
                        title="Services"
                        labels={{ title: "Service Name", subtitle: "Category", description: "Description", badge: "Key Feature" }}
                    />
                )}

                {activeSection === 'tips' && (
                    <ContentManager
                        section="tips"
                        title="Local Tips"
                        labels={{ title: "Place Name", subtitle: "Type (Restaurant/Bar)", description: "Review / Description", badge: "Rating or Price" }}
                    />
                )}

                {activeSection === 'security' && (
                    <Card className="border-red-500 border-l-4">
                        <CardHeader>
                            <CardTitle>Change Owner Password</CardTitle>
                            <CardDescription>
                                Require <strong>Master Security Code</strong> to authorize.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">New Password</label>
                                <Input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-red-600">Master Security Code</label>
                                <Input
                                    type="password"
                                    value={masterCode}
                                    onChange={(e) => setMasterCode(e.target.value)}
                                    placeholder="Required for authorization"
                                />
                            </div>
                            <Button variant="destructive" onClick={handleUpdatePassword} disabled={!newPassword || !masterCode}>
                                Update Password
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {activeSection === 'supervision' && (
                    <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-gray-800">Centro de Supervisión</h2>
                                <p className="text-gray-500">Diagnóstico avanzado del sistema en tiempo real.</p>
                            </div>
                            <Button onClick={fetchSystemStatus} variant="outline" className="gap-2">
                                <RefreshCw className="w-4 h-4" /> Ejecutar Diagnóstico
                            </Button>
                        </div>

                        {/* 1. System Matrix (Detailed Service Status) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="border-t-4 border-blue-500 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Activity className="w-5 h-5 text-blue-500" />
                                        Matriz de Servicios
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {systemStatus?.services ? (
                                            systemStatus.services.map((svc: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-2 h-2 rounded-full ${svc.status === 'operational' || svc.status === 'ready' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                                                        <div>
                                                            <p className="font-semibold text-sm">{svc.name}</p>
                                                            <p className="text-xs text-gray-500">{svc.details || svc.error || 'No details'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`px-2 py-1 text-xs font-bold rounded ${svc.status === 'operational' || svc.status === 'ready' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {svc.status.toUpperCase()}
                                                        </span>
                                                        {svc.latency && <p className="text-xs text-gray-400 mt-1">{svc.latency}</p>}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-4 text-gray-400">Sin datos de diagnóstico.</div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* 2. Business Heartbeat (Almanaque Check) */}
                            <Card className="border-t-4 border-purple-500 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-purple-500" />
                                        Pulso del Negocio (Almanaque)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 bg-purple-50 rounded-xl text-center">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Leads</p>
                                            <p className="text-3xl font-bold text-purple-700">{systemStatus?.business?.total_leads || 0}</p>
                                        </div>
                                        <div className="p-4 bg-purple-50 rounded-xl text-center">
                                            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Sistema Calendario</p>
                                            <p className={`text-lg font-bold ${systemStatus?.business?.calendar_system === 'operational' ? 'text-green-600' : 'text-gray-400'}`}>
                                                {systemStatus?.business?.calendar_system === 'operational' ? 'ACTIVO' : 'EN ESPERA'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Última Interacción Registrada</h4>
                                        <div className="flex items-start gap-4">
                                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">Solicitud de Cliente</p>
                                                <p className="text-xs text-gray-500">
                                                    {systemStatus?.business?.last_lead
                                                        ? new Date(systemStatus.business.last_lead).toLocaleString()
                                                        : "No hay registros recientes"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 3. API Latency & Environment */}
                        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Terminal className="w-5 h-5 text-green-400" />
                                Logs del Sistema
                            </h3>
                            <div className="font-mono text-sm space-y-2 text-green-300">
                                <p>root@welux-admin:~$ check_status --verbose</p>
                                <p>{`> Environment: ${systemStatus?.environment || 'unknown'}`}</p>
                                <p>{`> Global API Latency: ${systemStatus?.latency_ms || 0}ms`}</p>
                                <p>{`> Database Connection: ${systemStatus?.supabase ? 'ESTABLISHED' : 'FAILED'}`}</p>
                                <p>{`> AI Engine Override: ${systemStatus?.ai_service ? 'ENABLED' : 'DISABLED'}`}</p>
                                <p className="animate-pulse">{"> System Monitoring Active..."}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 transition-colors duration-500">
            <div className="container max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-500 mt-1">Manage your website content seamlessly</p>
                    </div>
                    <Button variant="outline" onClick={() => {
                        setIsAuthenticated(false);
                        localStorage.removeItem('welux_admin_token');
                        setAccessCode("");
                    }}>Logout</Button>
                </div>

                {renderContent()}
            </div>
        </div>
    );
}
