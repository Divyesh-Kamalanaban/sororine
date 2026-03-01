import React from 'react';

interface StatsCardProps {
  value: string;
  label: string;
  icon?: React.ReactNode;
  accentColor?: string;
}

export default function StatsCard({
  value,
  label,
  icon,
  accentColor = 'from-blue-500 to-purple-500',
}: StatsCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-lg sm:rounded-2xl p-3 sm:p-4 md:p-6 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300"
      style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
      }}
    >
      {/* Animated gradient background on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-xl"
        style={{
          background: `linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3))`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {icon && (
          <div className="mb-2 sm:mb-3 md:mb-4 text-xl sm:text-2xl md:text-3xl transform group-hover:scale-125 group-hover:-translate-y-2 transition-transform duration-300">
            {icon}
          </div>
        )}
        <div className={`text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r ${accentColor} bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300 inline-block`}>
          {value}
        </div>
        <p className="text-xs sm:text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
          {label}
        </p>
      </div>

      {/* Border accent */}
      <div className="absolute inset-0 rounded-lg sm:rounded-2xl border-2 border-transparent group-hover:border-white/10 transition-colors duration-300 pointer-events-none" />
    </div>
  );
}
