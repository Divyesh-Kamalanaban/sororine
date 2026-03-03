"use client";

import { useEffect, useState, useMemo } from 'react';
import { Trash2, MapPin, Calendar, Search, Filter, Eye, AlertTriangle, ChevronDown, Clock } from 'lucide-react';
import IncidentDetailsModal from '@/components/IncidentDetailsModal';
import Sidebar from '@/components/Sidebar';

export default function ReportsPage() {
    const [incidents, setIncidents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedIncident, setSelectedIncident] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);

    // Filters
    const [showLast24h, setShowLast24h] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Helper function to check if report can be deleted
    const canDeleteReport = (incident: any) => {
        if (incident.userId !== userId) return false;
        const now = new Date();
        const createdAt = new Date(incident.timestamp);
        const hoursDifference = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        return hoursDifference <= 24;
    };

    const handleDeleteReport = async (incidentId: number) => {
        if (!confirm("Are you sure you want to delete this report? This action cannot be undone.")) {
            return;
        }

        setDeletingId(incidentId);
        try {
            const res = await fetch(`/api/incidents?id=${incidentId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-id': userId || ''
                }
            });

            if (res.ok) {
                setIncidents(incidents.filter(inc => inc.id !== incidentId));
            } else {
                const data = await res.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Failed to delete report", error);
            alert("Failed to delete report. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    // Get current user ID
    useEffect(() => {
        const uid = localStorage.getItem('sororine_user_id') || localStorage.getItem('safety_user_id');
        setUserId(uid);
    }, []);

    const fetchIncidents = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/incidents?limit=1000');
            if (res.ok) {
                const data = await res.json();
                // Ensure dates are parsed correctly
                const parsed = data.map((inc: any) => ({
                    ...inc,
                    timestamp: new Date(inc.timestamp),
                }));
                setIncidents(parsed);
            }
        } catch (error) {
            console.error("Failed to fetch incidents", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    // Derived State for Categories
    const categories = useMemo(() => {
        const cats = new Set(incidents.map(i => i.category || "Uncategorized"));
        return ["All", ...Array.from(cats)];
    }, [incidents]);

    // Filtering Logic
    const filteredIncidents = useMemo(() => {
        return incidents.filter(inc => {
            // 1. Search
            const matchesSearch =
                (inc.category && inc.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (inc.description && inc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (inc.location && inc.location.toLowerCase().includes(searchQuery.toLowerCase()));

            // 2. Time Filter (Last 24h)
            const matchesTime = showLast24h
                ? (new Date().getTime() - inc.timestamp.getTime()) < 24 * 60 * 60 * 1000
                : true;

            // 3. Category Filter
            const matchesCategory = selectedCategory === "All" || inc.category === selectedCategory;

            return matchesSearch && matchesTime && matchesCategory;
        });
    }, [incidents, searchQuery, showLast24h, selectedCategory]);

    return (
        <div className="flex bg-next-gen text-white min-h-screen">
            <Sidebar />

            <main className="pl-0 transition-all duration-500 w-full min-h-screen flex flex-col relative z-0 pt-16 md:pt-0">

                {/* Header */}
                <div className="h-auto md:h-24 border-b border-white/5 flex flex-col md:flex-row items-center px-6 md:px-10 justify-between sticky top-0 bg-white/2 backdrop-blur-[60px] z-40 gap-6 py-6 md:py-0">
                    <div className="flex items-center gap-4 w-full md:w-auto mt-10 md:mt-0 animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="bg-primary/10 p-3 rounded-2xl text-primary border border-primary/20">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tighter">Incident Reports</h1>
                            <p className="text-white/40 text-xs font-medium uppercase tracking-[0.2em]">Global Safety Feed</p>
                        </div>
                    </div>

                    {/* Filters & Search Toolbar */}
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto animate-in fade-in slide-in-from-right-4 duration-500">

                        {/* Search */}
                        <div className="relative flex-grow md:flex-grow-0 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="text"
                                placeholder="Search safety database..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-white w-full md:w-72 transition-all font-light"
                            />
                        </div>

                        {/* Last 24h Toggle */}
                        <button
                            onClick={() => setShowLast24h(!showLast24h)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border transition-all ${showLast24h
                                ? "bg-primary text-black border-primary shadow-[0_10px_20px_rgba(148,185,255,0.2)]"
                                : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 active:scale-95"
                                }`}
                        >
                            <Clock size={16} />
                            <span>Last 24h</span>
                        </button>

                        {/* Category Dropdown */}
                        <div className="relative group">
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm font-bold text-white/80 hover:bg-white/10 cursor-pointer transition-all active:scale-95 min-w-40 justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter size={16} className="text-accent" />
                                    <span>{selectedCategory === "All" ? "Filter Type" : selectedCategory}</span>
                                </div>
                                <ChevronDown size={16} className="text-white/30" />
                            </div>

                            <div className="absolute right-0 top-full mt-3 w-56 glass-card rounded-2xl p-2 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-200">
                                {categories.map(cat => (
                                    <div
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className={`px-4 py-3 text-sm rounded-xl cursor-pointer transition-colors ${selectedCategory === cat ? "bg-primary text-black font-bold" : "text-white/60 hover:bg-white/5 hover:text-white"}`}
                                    >
                                        {cat}
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-10 flex-1 reveal-on-scroll stagger-1">
                    <div className="glass-card rounded-4xl overflow-hidden border border-white/5 shadow-2xl">
                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-sm text-white/50">
                                <thead className="bg-white/2 text-white/40 font-bold uppercase text-[10px] tracking-widest border-b border-white/5">
                                    <tr>
                                        <th className="px-8 py-6">Evidence</th>
                                        <th className="px-8 py-6">Category</th>
                                        <th className="px-8 py-6">Location</th>
                                        <th className="px-8 py-6">Full Address</th>
                                        <th className="px-8 py-6">Date & Time</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-20 text-center">
                                                <div className="flex flex-col items-center gap-4">
                                                    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-white/30 font-bold uppercase tracking-widest text-xs">Accessing Database...</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : filteredIncidents.length > 0 ? (
                                        filteredIncidents.map((incident, idx) => (
                                            <tr key={incident.id} className="hover:bg-white/3 transition-all group reveal-on-scroll" style={{ animationDelay: `${idx * 50}ms` }}>
                                                <td className="px-8 py-5">
                                                    {incident.imageUrl ? (
                                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                                            <img src={incident.imageUrl} alt="Thumb" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                        </div>
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 border border-white/5">
                                                            <Eye size={20} />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="flex items-center gap-3 text-white font-bold tracking-tight">
                                                        <span className={`w-2.5 h-2.5 rounded-full shadow-lg ${incident.category === 'Harassment' ? 'bg-red-500 shadow-red-500/20' :
                                                            incident.category === 'Theft' ? 'bg-orange-500 shadow-orange-500/20' :
                                                                'bg-primary shadow-primary/20'
                                                            }`}></span>
                                                        {incident.category}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-2 text-xs font-mono text-white/30 bg-white/5 px-3 py-1.5 rounded-full w-fit">
                                                        <MapPin size={12} className="text-primary" />
                                                        {incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 max-w-xs truncate text-white/60 font-medium" title={incident.location}>
                                                    {incident.location || "N/A"}
                                                </td>
                                                <td className="px-8 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-white/80 font-bold">
                                                            <Calendar size={14} className="text-white/30" />
                                                            {new Date(incident.timestamp).toLocaleDateString()}
                                                        </div>
                                                        <div className="text-[11px] text-white/30 pl-6 uppercase tracking-wider font-bold">
                                                            {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <div className="flex items-center justify-end gap-3">
                                                        <button
                                                            onClick={() => setSelectedIncident(incident)}
                                                            className="p-3 bg-white/5 hover:bg-primary hover:text-black rounded-xl text-white/40 transition-all active:scale-95 border border-white/5"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        {canDeleteReport(incident) && (
                                                            <button
                                                                onClick={() => handleDeleteReport(incident.id)}
                                                                disabled={deletingId === incident.id}
                                                                className="p-3 bg-red-500/5 hover:bg-red-500 text-white rounded-xl transition-all active:scale-95 border border-red-500/20 disabled:opacity-30"
                                                                title="Delete Report"
                                                            >
                                                                {deletingId === incident.id ? (
                                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                ) : (
                                                                    <Trash2 size={18} />
                                                                )}
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-8 py-32 text-center text-white/20 font-bold uppercase tracking-widest text-xs">
                                                No intelligence matches your query.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View */}
                        <div className="md:hidden divide-y divide-white/5">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                        <span>Loading reports...</span>
                                    </div>
                                </div>
                            ) : filteredIncidents.length > 0 ? (
                                filteredIncidents.map((incident) => (
                                    <div key={incident.id} className="p-4 hover:bg-white/5 transition-colors" onClick={() => setSelectedIncident(incident)}>
                                        <div className="flex items-start gap-3 mb-3">
                                            {incident.imageUrl ? (
                                                <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                                    <img src={incident.imageUrl} alt="Thumb" className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center text-gray-600 flex-shrink-0">
                                                    <Eye size={20} />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 mb-1 ${incident.category === 'Harassment' ? 'text-red-400 border-red-500/20' :
                                                        incident.category === 'Theft' ? 'text-orange-400 border-orange-500/20' :
                                                            'text-blue-400 border-blue-500/20'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${incident.category === 'Harassment' ? 'bg-red-500' :
                                                            incident.category === 'Theft' ? 'bg-orange-500' :
                                                                'bg-blue-500'
                                                            }`}></span>
                                                        {incident.category}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(incident.timestamp).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className="text-gray-300 text-sm font-medium truncate mb-0.5">
                                                    {incident.location || "Location N/A"}
                                                </div>
                                                <div className="text-gray-500 text-xs truncate">
                                                    {incident.description || "No description"}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-white/5">
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(incident.timestamp).toLocaleTimeString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="text-primary hover:text-primary/80 font-medium flex items-center gap-1" onClick={(e) => { e.stopPropagation(); setSelectedIncident(incident); }}>
                                                    View Details <Eye size={12} />
                                                </button>
                                                {canDeleteReport(incident) && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteReport(incident.id); }}
                                                        disabled={deletingId === incident.id}
                                                        className="text-red-400 hover:text-red-300 font-medium flex items-center gap-1 disabled:opacity-50"
                                                    >
                                                        {deletingId === incident.id ? (
                                                            <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Trash2 size={12} />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No reports found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details Modal (Reused) */}
                <IncidentDetailsModal
                    incident={selectedIncident}
                    onClose={() => setSelectedIncident(null)}
                    onDelete={() => {
                        setSelectedIncident(null);
                        fetchIncidents();
                    }}
                    currentUserId={userId || undefined}
                />
            </main>
        </div>
    );
}
