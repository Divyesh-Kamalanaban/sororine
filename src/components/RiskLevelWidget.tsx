import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface RiskLevelWidgetProps {
    level: string;
    score: number;
    compact?: boolean;
}

export default function RiskLevelWidget({ level, score, compact }: RiskLevelWidgetProps) {
    const getRiskColor = (l: string) => {
        switch (l) {
            case 'LOW': return 'text-green-500';
            case 'MODERATE': return 'text-amber-500';
            case 'HIGH': return 'text-orange-500';
            case 'CRITICAL': return 'text-red-500';
            default: return 'text-blue-500';
        }
    };

    if (compact) {
        return (
            <div className="glass-card p-4 rounded-xl flex items-center gap-4 min-w-36">
                <div className="bg-white/5 px-2 py-1 rounded text-xs font-mono text-green-500 border border-green-500/20">
                    {score.toFixed(1)}
                </div>
                <div className="flex flex-col">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Risk Level</p>
                    <h3 className={`text-xl font-black tracking-tighter ${getRiskColor(level)}`}>
                        {level}
                    </h3>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-card p-6 rounded-2xl w-full max-w-72">
            <div className="flex justify-between items-start mb-6">
                <div className="bg-green-500/10 p-2.5 rounded-xl">
                    <ShieldCheck className="text-green-500 w-6 h-6" />
                </div>
                <div className="bg-white/5 px-3 py-1 rounded-lg text-xs font-mono text-green-500 border border-green-500/20">
                    {score.toFixed(1)}
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-black">Current Risk</p>
                <h3 className={`text-4xl md:text-5xl font-black tracking-tighter leading-tight shrink-0 ${getRiskColor(level)}`}>
                    {level}
                </h3>
            </div>
        </div>
    );
}
