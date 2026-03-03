"use client";

import { useEffect, useState } from 'react';
import { Sidebar } from 'lucide-react';
import SidebarComponent from '@/components/Sidebar';
import { Calendar, MapPin, Search, AlertTriangle, Eye, Clock, Loader2 } from 'lucide-react';

export default function HistoryPage() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/incidents?limit=100');
            if (res.ok) {
                const data = await res.json();
                const parsed = data.map((inc: any) => ({
                    ...inc,
                    timestamp: new Date(inc.timestamp),
                    createdAt: new Date(inc.createdAt)
                }));
                setIncidents(parsed);
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const filteredIncidents = incidents.filter(inc =>
        inc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inc.description && inc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (inc.location && inc.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="flex min-h-screen bg-transparent text-white">
            <SidebarComponent />

            <main className="flex-1 w-full flex flex-col pt-16 md:pt-0">
                <div className="p-4 md:p-8 border-b border-white/5 bg-white/2 backdrop-blur-[60px] sticky top-0 z-40">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">SafeRoute History</h1>
                            <p className="text-gray-400 text-sm">Full activity log of reports and alerts</p>
                        </div>

                        <div className="relative w-full md:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Filter history..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-lg bg-white/5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 md:p-8 flex-1">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : filteredIncidents.length > 0 ? (
                        <div className="space-y-4">
                            {filteredIncidents.map((incident) => (
                                <div
                                    key={incident.id}
                                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg ${incident.category === 'DANGER' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                <AlertTriangle size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold">{incident.category}</h3>
                                                    <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                                                        {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-gray-300 text-sm mb-2">{incident.description || "No description provided."}</p>
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={12} className="text-blue-500" />
                                                        {incident.location || "Coordinates Locked"}
                                                    </span>
                                                    <span className="flex items-center gap-1 font-mono">
                                                        <Calendar size={12} className="text-gray-400" />
                                                        {new Date(incident.timestamp).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-colors border border-white/5 flex items-center gap-2 justify-center">
                                            <Eye size={14} /> View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-500 text-center">
                            <Clock size={48} className="text-gray-700 mb-4" />
                            <p className="font-medium text-lg text-gray-400">Timeline Empty</p>
                            <p className="text-sm">No reported activity found in this region.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
