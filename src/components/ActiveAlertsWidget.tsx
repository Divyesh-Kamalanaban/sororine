import React from 'react';
import { Activity } from 'lucide-react';

interface ActiveAlertsWidgetProps {
    count: number;
    compact?: boolean;
}

export default function ActiveAlertsWidget({ count, compact }: ActiveAlertsWidgetProps) {
    if (compact) {
        return (
            <div className="glass-card p-4 rounded-xl flex items-center gap-4 min-w-36">
                <div className="bg-white/5 px-2 py-1 rounded text-xs font-mono text-blue-400 border border-blue-500/20">
                    24h
                </div>
                <div className="flex flex-col">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Alerts</p>
                    <h3 className="text-xl font-black tracking-tighter text-white">
                        {count}
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 rounded-2xl w-full max-w-72">
            <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-500/10 p-2.5 rounded-xl">
                    <Activity className="text-blue-500 w-6 h-6" />
                </div>
                <div className="bg-white/5 px-3 py-1 rounded-lg text-xs font-mono text-blue-400 border border-blue-500/20">
                    24h
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-black">Active Alerts</p>
                <h3 className="text-5xl font-black tracking-tighter text-white">
                    {count}
                </h3>
            </div>
        </div>
    );
}
