import React from 'react';
import { MapPin, Activity } from 'lucide-react';

interface Incident {
    id: string;
    category: string;
    description?: string;
    timestamp: Date;
    location?: string;
}

interface RecentActivityWidgetProps {
    incidents: Incident[];
}

export default function RecentActivityWidget({ incidents }: RecentActivityWidgetProps) {
    return (
        <div className="glass-card p-5 rounded-2xl w-full max-w-[320px] max-h-40 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-gray-500" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Recent Activity</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {incidents.length > 0 ? (
                    incidents.slice(0, 3).map((incident) => (
                        <div key={incident.id} className="flex gap-3 items-start">
                            <div className="mt-1 w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                <MapPin size={12} className="text-red-500" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[13px] font-bold text-white leading-none capitalize">
                                    {incident.category.toLowerCase()}
                                </p>
                                <p className="text-[11px] text-gray-400 line-clamp-1">
                                    {incident.description || 'Detecting...'}
                                </p>
                                <p className="text-[10px] text-gray-600 font-mono">
                                    {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase()}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-xs text-gray-600 italic py-2">No recent activity detected.</div>
                )}
            </div>
        </div>
    );
}
