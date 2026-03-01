'use client';

import Link from 'next/link';
import { Shield, AlertCircle, Users, Map, Zap } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import EnhancedGlobe from '@/components/EnhancedGlobe';

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight ? window.scrollY / scrollHeight : 0;
      setScrollProgress(progress);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="w-full bg-black text-white font-sans scroll-smooth overflow-x-hidden">
      {/* Enhanced 3D Globe Background */}
      <EnhancedGlobe scrollProgress={scrollProgress} />

      {/* Navigation Header */}
      <header className="fixed w-full top-0 z-50 backdrop-blur-sm bg-black/20 border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-slate-400 to-slate-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block text-sm sm:text-lg font-light tracking-wide text-white">
              Sororine
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-sm text-white/60 hover:text-white transition-colors font-light">Features</a>
            <a href="#capabilities" className="text-sm text-white/60 hover:text-white transition-colors font-light">How It Works</a>
            <a href="#vision" className="text-sm text-white/60 hover:text-white transition-colors font-light">Vision</a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden sm:block px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-light text-white/70 hover:text-white border border-white/20 rounded-md transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-3 py-1.5 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-light bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors border border-slate-600/50"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-20 text-center px-4 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light mb-4 sm:mb-6 text-white leading-tight">
            Safety Starts
            <br />
            <span className="text-slate-400 font-extralight">With Connection</span>
          </h1>

          <p className="text-sm sm:text-base text-white/60 mb-8 sm:mb-12 font-light leading-relaxed max-w-xl mx-auto">
            A community-powered platform designed for women's safety. Real-time alerts, intelligent response, and trusted support.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              href="/register"
              className="px-6 sm:px-8 py-3 sm:py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-light rounded-lg transition-colors border border-slate-600/50"
            >
              Get Started
            </Link>
            <Link
              href="#features"
              className="px-6 sm:px-8 py-3 sm:py-3.5 border border-white/20 text-white/80 hover:text-white font-light rounded-lg transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
          <svg className="w-5 h-5 text-white/40 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-16 sm:py-24 px-4 bg-white/2.5 border-y border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-3 tracking-tight">Core Features</h2>
            <p className="text-white/50 text-sm sm:text-base font-light">Essential tools for community safety</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              { icon: AlertCircle, title: 'Real-Time Alerts', desc: 'Instant notifications about incidents nearby' },
              { icon: Zap, title: 'Emergency SOS', desc: 'One-tap alert to trusted contacts' },
              { icon: Users, title: 'Community', desc: 'Connect with helpers and volunteers' },
              { icon: Map, title: 'Smart Mapping', desc: 'Safe routes and incident tracking' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="p-6 sm:p-8 rounded-lg border border-white/5 bg-white/1 hover:border-white/10 transition-colors group">
                  <Icon className="w-5 h-5 text-slate-400 mb-4 group-hover:text-slate-300 transition-colors" />
                  <h3 className="text-lg sm:text-xl font-light text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/50 font-light">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="capabilities" className="relative py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-light text-white mb-3 tracking-tight">How It Works</h2>
            <p className="text-white/50 text-sm sm:text-base font-light">Simple, fast, effective response</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { step: 1, title: 'Report', desc: 'Share incident details' },
              { step: 2, title: 'Alert', desc: 'Community notified instantly' },
              { step: 3, title: 'Respond', desc: 'Helpers mobilize quickly' },
              { step: 4, title: 'Support', desc: 'Follow-up and care' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-xs sm:text-sm font-light text-white/40 mb-3">Step {item.step}</div>
                <h4 className="text-lg sm:text-xl font-light text-white mb-2">{item.title}</h4>
                <p className="text-xs sm:text-sm text-white/50 font-light">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-16 sm:py-24 px-4 bg-white/1.5 border-y border-white/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: '250K+', label: 'Lives Protected' },
              { value: '85K+', label: 'Active Users' },
              { value: '92%', label: 'Response Rate' },
              { value: '180+', label: 'Cities Covered' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-4xl font-light text-slate-300 mb-2">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/50 font-light">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section id="vision" className="relative py-16 sm:py-24 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl sm:text-5xl font-light text-white mb-6 sm:mb-8 leading-tight">
            Every woman deserves to feel <span className="text-slate-400">safe</span>
          </h2>
          <p className="text-sm sm:text-base text-white/60 mb-8 sm:mb-12 font-light leading-relaxed">
            We're building a world where technology and community work together to create safer environments. Where every voice matters, and every person has someone to turn to.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3.5 bg-slate-700 hover:bg-slate-600 text-white font-light rounded-lg transition-colors border border-slate-600/50"
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 sm:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-light text-white">Sororine</span>
              </div>
              <p className="text-xs text-white/50 font-light">Community safety platform</p>
            </div>
            <div>
              <h4 className="text-xs font-light text-white/70 mb-3 uppercase tracking-wide">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-xs text-white/50 hover:text-white/70 font-light transition">Features</a></li>
                <li><a href="#capabilities" className="text-xs text-white/50 hover:text-white/70 font-light transition">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-light text-white/70 mb-3 uppercase tracking-wide">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-white/50 hover:text-white/70 font-light transition">Privacy</a></li>
                <li><a href="#" className="text-xs text-white/50 hover:text-white/70 font-light transition">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-light text-white/70 mb-3 uppercase tracking-wide">Contact</h4>
              <ul className="space-y-2">
                <li><a href="mailto:support@sororine.com" className="text-xs text-white/50 hover:text-white/70 font-light transition">support@sororine.com</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 text-center">
            <p className="text-xs text-white/40 font-light">© 2026 Sororine. Building safer communities.</p>
          </div>
        </div>
      </footer>

      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 bg-slate-600 z-50 transition-all duration-200"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </div>
  );
}
