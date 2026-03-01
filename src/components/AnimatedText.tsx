'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'hero' | 'section' | 'text';
}

export default function AnimatedText({
  children,
  className = '',
  delay = 0,
  variant = 'text',
}: AnimatedTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const baseClasses = {
    hero: 'text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight',
    section: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold',
    text: 'text-sm sm:text-base md:text-lg',
  };

  return (
    <div
      ref={textRef}
      className={`${baseClasses[variant]} ${className} ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10'
      } transition-all duration-1000 ease-out`}
    >
      {children}
    </div>
  );
}
