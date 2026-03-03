"use client";

import { useEffect, useState } from 'react';
import SidebarComponent from '@/components/Sidebar';
import { Bell, MapPin, Clock, AlertTriangle, ShieldCheck, Info, Loader2 } from 'lucide-react';

export default function AlertsPage() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/incidents?limit=50');
            if (res.ok) {
                const data = await res.json();
                const parsed = data.map((inc: any) => ({
                    ...inc,
                    timestamp: new Date(inc.timestamp)
                })).sort((a: any, b: any) => b.timestamp - a.timestamp);
                setIncidents(parsed);
            }
        } catch (error) {
            console.error("Failed to fetch alerts", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    return (
        <div className="flex min-h-screen bg-[#050509] text-white">
            <SidebarComponent />

            <main className="flex-1 md:pl-64 w-full flex flex-col">
                <div className="p-4 md:p-8 border-b border-white/10 bg-[#050509]/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold">Safety Alerts</h1>
                            <p className="text-gray-400 text-sm">Real-time threat monitoring feed</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Live</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-8 flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4">
                            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                            <p className="text-sm text-gray-400">Scanning network for updates...</p>
                        </div>
                    ) : incidents.length > 0 ? (
                        <div className="max-w-4xl mx-auto space-y-4">
                            {incidents.map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`p-5 rounded-xl border transition-all ${alert.category === 'DANGER' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/10'}`}
                                >
                                    <div className="flex items-start gap-5">
                                        <div className={`p-3 rounded-lg ${alert.category === 'DANGER' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                            {alert.category === 'DANGER' ? <AlertTriangle size={24} /> : <Info size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${alert.category === 'DANGER' ? 'border-red-500/30 text-red-500' : 'border-blue-500/30 text-blue-500'}`}>
                                                        {alert.category}
                                                    </span>
                                                    <span className="text-[10px] text-gray-500 font-mono">ID: {alert.id.slice(-6)}</span>
                                                </div>
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Clock size={12} />
                                                    {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold mb-2">{alert.description || "Unidentified Incident"}</h3>
                                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <MapPin size={12} className="text-blue-500" />
                                                    {alert.location || "Coordinates Pending"}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                                                    <ShieldCheck size={14} className="text-green-500" />
                                                    Verified
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-center opacity-50">
                            <ShieldCheck size={48} className="text-green-500/20 mb-4" />
                            <p className="text-lg font-bold">Systems Clear</p>
                            <p className="text-sm">No active threats detected in your vicinity.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
