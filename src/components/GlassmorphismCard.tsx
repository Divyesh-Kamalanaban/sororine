import React, { useState } from 'react';

interface GlassmorphismCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient?: string;
  className?: string;
}

export default function GlassmorphismCard({
  icon,
  title,
  description,
  gradient = 'from-blue-500/20 to-purple-500/20',
  className = '',
}: GlassmorphismCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({
      x: (x / rect.width - 0.5) * 2,
      y: (y / rect.height - 0.5) * 2,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 backdrop-blur-xl border border-white/10 transition-all duration-300 group cursor-pointer ${className}`}
      style={{
        background: `linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)`,
        transform: isHovering
          ? `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      }}
    >
      {/* Gradient overlay that intensifies on hover */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, rgba(59, 130, 246, 0.2), transparent)`,
        }}
      />

      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(168, 85, 247, 0.3))`,
          filter: 'blur(8px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-3 sm:mb-4 transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
          {description}
        </p>
      </div>

      {/* Shine effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
        style={{
          backgroundImage: `linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 255, 255, 0.1) 50%,
            transparent 70%
          )`,
          backgroundSize: '200% 200%',
          backgroundPosition: isHovering ? '0% 0%' : '100% 100%',
          transition: 'background-position 0.6s ease',
        }}
      />
    </div>
  );
}
