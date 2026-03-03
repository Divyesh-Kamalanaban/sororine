"use client";

import { useEffect, useState, useCallback } from 'react';
import { User, Phone, LogOut, Loader2, RefreshCw, MapPin, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Risk Context State
    const [riskLoading, setRiskLoading] = useState(false);
    const [riskContext, setRiskContext] = useState({
        region: "Unknown",
        score: 0,
        level: "Unknown",
        factors: {} as any
    });
    const [locationStatus, setLocationStatus] = useState<string>("");

    const fetchRiskByCoords = useCallback(async (lat: number, lng: number, statusMessage: string) => {
        setRiskLoading(true);
        setLocationStatus(statusMessage);
        try {
            const riskRes = await fetch(`/api/risk-data?lat=${lat}&lng=${lng}`);
            if (riskRes.ok) {
                const riskData = await riskRes.json();
                setRiskContext({
                    region: riskData.meta?.detectedState || "Unknown Region",
                    score: riskData.score || 0,
                    level: riskData.level || "Unknown",
                    factors: riskData.factors || {}
                });
                setLocationStatus("Updated");
            } else {
                setLocationStatus("Failed to fetch data");
            }
        } catch (e) {
            console.error("Risk fetch error", e);
            setLocationStatus("Connection error");
        } finally {
            setRiskLoading(false);
        }
    }, []);

    // Fetch User Profile & Initial Risk Data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userRes = await fetch('/api/auth/me');
                if (userRes.ok) {
                    const data = await userRes.json();
                    setUser(data.user);

                    // Use stored location if available
                    if (data.user?.location?.lat && data.user?.location?.lng) {
                        fetchRiskByCoords(data.user.location.lat, data.user.location.lng, "Using last known location");
                    } else {
                        setLocationStatus("Location unknown");
                    }
                }
            } catch (error) {
                console.error("Failed to load user", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [fetchRiskByCoords]);

    // Manual Refresh (High Accuracy)
    const handleRefresh = useCallback(async () => {
        setRiskLoading(true);
        setLocationStatus("Locating...");

        if (!navigator.geolocation) {
            setLocationStatus("Geolocation not supported");
            setRiskLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // Update Risk Data
                fetchRiskByCoords(latitude, longitude, "Analyzing risk...");

                // Optionally update stored location (though map page usually does this)
                if (user?.id) {
                    fetch('/api/users/location', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: user.id /* storedId/session logic needed? api/auth/me returns id */, lat: latitude, lng: longitude })
                    }).catch(console.error);
                }

            },
            (err) => {
                console.error("Geolocation error", err);
                let errorMessage = "Location check failed";
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        errorMessage = "Permission denied. Enable in settings.";
                        break;
                    case err.POSITION_UNAVAILABLE:
                        errorMessage = "Location unavailable. Check GPS.";
                        break;
                    case err.TIMEOUT:
                        errorMessage = "Request timed out.";
                        break;
                }
                setLocationStatus(errorMessage);
                setRiskLoading(false);
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    }, [fetchRiskByCoords, user]);

    // Auto-refresh if permission is granted or prompts
    useEffect(() => {
        if (typeof navigator !== 'undefined' && 'permissions' in navigator) {
            navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
                if (result.state === 'granted' || result.state === 'prompt') {
                    handleRefresh();
                } else if (result.state === 'denied') {
                    setLocationStatus("Permission denied. Enable in browser.");
                }

                result.onchange = () => {
                    if (result.state === 'granted' || result.state === 'prompt') {
                        handleRefresh();
                    }
                };
            });
        }
    }, [handleRefresh]);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <div className="flex min-h-screen bg-transparent text-white">
            <Sidebar />

            <main className="flex-1 w-full p-4 md:p-8 pt-20 md:pt-10 overflow-x-hidden">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">Account Settings</h1>
                        <p className="text-white/50 text-base md:text-lg">Manage your digital identity and situational safety parameters.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Profile Section */}
                        <div className="glass-card p-8 space-y-8 animate-in fade-in slide-in-from-left-6 duration-700 delay-100">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <User size={24} className="text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-black tracking-tight">Personal Identity</h2>
                            </div>

                            {loading ? (
                                <div className="flex items-center justify-center py-16">
                                    <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                </div>
                            ) : user ? (
                                <div className="space-y-6">
                                    <div className="group transition-all">
                                        <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-black mb-2 px-1">Full Legal Name</p>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/20 transition-all">
                                            <p className="text-xl font-bold tracking-tight text-white/90">{user.name}</p>
                                        </div>
                                    </div>

                                    <div className="group transition-all">
                                        <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-black mb-2 px-1">Verified Email</p>
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:border-white/20 transition-all">
                                            <p className="text-lg font-mono text-white/70">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="group transition-all">
                                        <p className="text-xs text-red-500/60 uppercase tracking-[0.2em] font-black mb-2 px-1 flex items-center gap-2">
                                            <Phone size={14} /> Emergency Contact
                                        </p>
                                        <div className="p-5 bg-red-500/5 rounded-2xl border border-red-500/10 group-hover:border-red-500/30 transition-all">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xl font-black text-red-400 tracking-tight">{user.emergencyContactName || "Guardian Not Configured"}</p>
                                                <p className="text-sm text-red-500/50 font-mono font-bold">{user.emergencyContactNumber || "+00 0000-0000"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="w-full py-4 mt-8 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl flex items-center justify-center gap-3 transition-all border border-red-600/20 text-sm font-black uppercase tracking-widest shadow-lg shadow-red-950/20 active:scale-[0.98]"
                                    >
                                        <LogOut size={18} />
                                        Authorize Logout
                                    </button>
                                </div>
                            ) : null}
                        </div>

                        {/* Security/Risk Section */}
                        <div className="glass-card p-8 space-y-8 animate-in fade-in slide-in-from-right-6 duration-700 delay-200">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="bg-green-500/10 p-3 rounded-2xl border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                                        <ShieldCheck size={24} className="text-green-400" />
                                    </div>
                                    <h2 className="text-2xl font-black tracking-tight">Safety Context</h2>
                                </div>
                                <button
                                    onClick={handleRefresh}
                                    disabled={riskLoading}
                                    className="p-3 hover:bg-white/10 rounded-2xl transition-all text-white/60 hover:text-white disabled:opacity-30 border border-transparent hover:border-white/10 active:scale-90"
                                    title="Refresh Risk Analysis"
                                >
                                    <RefreshCw size={22} className={cn(riskLoading && "animate-spin")} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center text-center gap-2">
                                    <div className="bg-blue-500/10 p-3 rounded-full mb-2">
                                        <MapPin size={24} className="text-blue-500" />
                                    </div>
                                    <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-black">Current Sector</p>
                                    <p className="text-3xl font-black tracking-tighter text-white">
                                        {riskLoading ? "Scanning..." : riskContext.region}
                                    </p>
                                </div>

                                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center text-center gap-4">
                                    <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-black">Safety Quotient</p>
                                    <div className={`px-8 py-4 rounded-2xl text-2xl font-black tracking-tighter shadow-2xl ${riskContext.level === 'CRITICAL' ? 'bg-red-500/20 text-red-500 shadow-red-500/10 border border-red-500/20' :
                                        riskContext.level === 'HIGH' ? 'bg-orange-500/20 text-orange-500 shadow-orange-500/10 border border-orange-500/20' :
                                            'bg-green-500/20 text-green-500 shadow-green-500/10 border border-green-500/20'
                                        }`}>
                                        {riskLoading ? "ANALYZING..." : riskContext.level}
                                    </div>

                                    <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                        <div
                                            className={cn(
                                                "h-full transition-all duration-1000",
                                                riskContext.level === 'CRITICAL' ? 'bg-red-500 w-[90%]' :
                                                    riskContext.level === 'HIGH' ? 'bg-orange-500 w-[65%]' : 'bg-green-500 w-[20%]'
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 text-center">
                                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                        <div className={cn("w-2 h-2 rounded-full", riskLoading ? "bg-blue-500 animate-pulse" : "bg-green-500")} />
                                        <p className="text-[10px] text-white/60 uppercase tracking-widest font-black">
                                            {locationStatus || "System Operational"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
