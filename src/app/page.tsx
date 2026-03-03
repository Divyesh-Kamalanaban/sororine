'use client';

import Link from 'next/link';
import { Shield, AlertCircle, Users, Map, Zap, Menu, X } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import EnhancedGlobe from '@/components/EnhancedGlobe';

export default function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight ? window.scrollY / scrollHeight : 0;
      setScrollProgress(progress);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full text-white font-garet scroll-smooth overflow-x-hidden selection:bg-blue-500/30 tracking-tighter">
      {/* Enhanced 3D Globe Background */}
      <EnhancedGlobe scrollProgress={scrollProgress} />

      {/* Next-Gen Floating Navbar */}
      <div className="fixed top-8 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl z-50 px-4">
        <header className="backdrop-blur-3xl bg-white/[0.04] border border-white/10 rounded-full transition-all duration-500 shadow-[0_15px_60px_rgba(0,0,0,0.5)] hover:border-white/20">
          <div className="container mx-auto px-6 md:px-10 py-4 md:py-5 flex justify-between items-center">
            {/* Logo - Centered Branding */}
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity relative z-50">
              <span className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] lowercase">
                sororine.
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-14 absolute left-1/2 -translate-x-1/2">
              <a href="#features" className="text-xs tracking-[0.3em] uppercase text-white/70 hover:text-white transition-all font-medium hover:tracking-[0.4em]">Features</a>
              <a href="#capabilities" className="text-xs tracking-[0.3em] uppercase text-white/70 hover:text-white transition-all font-medium hover:tracking-[0.4em]">Workflow</a>
              <a href="#vision" className="text-xs tracking-[0.3em] uppercase text-white/70 hover:text-white transition-all font-medium hover:tracking-[0.4em]">Vision</a>
            </nav>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-4 md:gap-6">
              <Link
                href="/login"
                className="hidden sm:block text-xs uppercase tracking-[0.2em] font-medium text-white/70 hover:text-white transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="px-6 md:px-8 py-2.5 md:py-3 text-[10px] md:text-xs uppercase tracking-[0.2em] font-semibold bg-[#94b9ff]/10 hover:bg-[#94b9ff]/20 text-[#94b9ff] rounded-full transition-all border border-[#94b9ff]/20 shadow-[0_0_40px_rgba(148,185,255,0.1)]"
              >
                Dashboard
              </Link>
              <button
                className="lg:hidden p-2 text-white/80 hover:text-white relative z-50 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        <div className={`fixed mt-6 left-0 right-0 bg-[#141414]/98 backdrop-blur-3xl z-40 rounded-[2.5rem] border border-white/10 transition-all duration-500 lg:hidden overflow-hidden ${isMenuOpen ? 'max-h-100 opacity-100 py-12' : 'max-h-0 opacity-0 pointer-events-none p-0'}`}>
          <div className="flex flex-col items-center justify-center gap-10 px-10">
            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-2xl tracking-[0.4em] uppercase text-white font-light">Features</a>
            <a href="#capabilities" onClick={() => setIsMenuOpen(false)} className="text-2xl tracking-[0.4em] uppercase text-white font-light">Workflow</a>
            <a href="#vision" onClick={() => setIsMenuOpen(false)} className="text-2xl tracking-[0.4em] uppercase text-white font-light">Vision</a>
            <hr className="w-16 border-white/10" />
            <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-base tracking-[0.2em] uppercase text-white/70 font-light">Sign In</Link>
          </div>
        </div>
      </div>

      {/* Hero Section - Elevated and Centered */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-40 px-6">
        <div
          className="relative z-20 text-center max-w-5xl mx-auto transition-all duration-100 ease-out"
          style={{ transform: !isMobile ? `translateY(${scrollProgress * -60}px)` : 'none' }}
        >
          <div className="inline-block px-6 py-2 mb-8 md:mb-12 rounded-full border border-[#94b9ff]/30 bg-[#94b9ff]/10 backdrop-blur-xl animate-fade-in">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.5em] text-[#94b9ff] font-semibold whitespace-nowrap">Global Safety Network</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-[8rem] font-bold mb-10 md:mb-14 text-white leading-[1.15] tracking-tighter animate-fade-in drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] pb-4">
            Safety Starts
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] italic font-medium p-1 md:p-4">With Connection</span>
          </h1>

          <p className="text-lg md:text-2xl text-white/80 mb-12 md:mb-20 font-light leading-relaxed max-w-2xl mx-auto tracking-wide px-4 opacity-90">
            A community-powered platform redefining security through real-time human intelligence and trusted support.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5 md:gap-8 animate-zoom-in">
            <Link
              href="/register"
              className="px-12 md:px-16 py-4 md:py-5 bg-white text-black hover:bg-[#cdffd8] text-sm md:text-base font-bold rounded-full transition-all shadow-[0_15px_50px_rgba(255,255,255,0.15)] hover:scale-105 active:scale-95"
            >
              Join the Network
            </Link>
            <Link
              href="#features"
              className="px-12 md:px-16 py-4 md:py-5 border border-white/20 text-white hover:text-white hover:bg-white/10 text-sm md:text-base font-medium rounded-full transition-all backdrop-blur-xl shadow-[0_0_30px_rgba(255,255,255,0.05)] hover:scale-105 active:scale-95"
            >
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Standardized Centering */}
      <section id="features" className="relative py-32 md:py-48 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-24 md:mb-40">
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tighter">Core Infrastructure</h2>
            <div className="h-1 w-24 md:w-32 bg-gradient-to-r from-transparent via-[#94b9ff]/50 to-transparent mx-auto rounded-full" />
            <p className="mt-12 text-white/80 text-lg md:text-xl font-light max-w-3xl mx-auto tracking-wide leading-relaxed">Standardized protocols for mission-critical urban intelligence and distributed assistance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
            {[
              { icon: AlertCircle, title: 'Real-Time Intelligence', desc: 'Contextual notifications driven by verified community reports and AI analysis for immediate awareness.' },
              { icon: Zap, title: 'Ultra-Fast SOS', desc: 'One-tap emergency broadcast with sub-second latency to your trusted circle and nearest responders.' },
              { icon: Users, title: 'Distributed Support', desc: 'Decentralized responder network bridging the gap between SOS triggers and physical assistance.' },
              { icon: Map, title: 'SafeRoute AI', desc: 'Predictive pathfinding that prioritizes high-visibility, lower-risk urban pathways in real-time.' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="p-10 md:p-16 rounded-4xl border border-white/10 bg-white/5 backdrop-blur-3xl hover:bg-white/10 hover:border-[#94b9ff]/30 transition-all group overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#94b9ff]/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-[#94b9ff]/20 transition-colors" />
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-[#94b9ff]/10 flex items-center justify-center mb-10 md:mb-14 border border-[#94b9ff]/10 group-hover:bg-[#94b9ff]/20 transition-all group-hover:scale-110">
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-[#94b9ff]" />
                  </div>
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-6 md:mb-8 tracking-tight">{feature.title}</h3>
                  <p className="text-base md:text-xl text-white/80 font-light leading-relaxed tracking-wide">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Workflow - High Impact */}
      <section id="capabilities" className="relative py-32 md:py-48 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="mb-32 md:mb-48">
            <h2 className="text-4xl md:text-7xl font-bold text-white mb-8 tracking-tighter">The Ecosystem</h2>
            <div className="h-1 w-24 md:w-32 bg-gradient-to-r from-transparent via-[#94b9ff]/50 to-transparent mx-auto rounded-full" />
            <p className="mt-12 text-white/80 text-lg md:text-xl font-light max-w-3xl mx-auto tracking-wide leading-relaxed">A seamless integration of human response and machine intelligence designed for total protection.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 md:gap-20">
            {[
              { step: '01', title: 'Collect', desc: 'Active monitoring and seamless incident reporting' },
              { step: '02', title: 'Verify', desc: 'Multi-point validation for high-trust alerts' },
              { step: '03', title: 'Mobilize', desc: 'Targeted dispatch of nearest trusted responders' },
              { step: '04', title: 'Assist', desc: 'End-to-end support until safety is confirmed' },
            ].map((item, i) => (
              <div key={i} className="relative group p-6">
                <div className="text-6xl md:text-8xl font-bold text-white/5 mb-8 md:mb-12 group-hover:text-[#94b9ff]/10 transition-colors tracking-tighter">{item.step}</div>
                <h4 className="text-lg md:text-2xl font-bold text-white mb-4 md:mb-6 tracking-[0.2em] uppercase">{item.title}</h4>
                <p className="text-sm md:text-base text-white/80 font-light leading-relaxed tracking-widest">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values / Mission - Replacing fake stats */}
      <section className="relative py-24 md:py-40 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 p-10 md:p-20 rounded-4xl border border-white/10 bg-black/40 backdrop-blur-3xl relative overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#94b9ff]/5 to-transparent pointer-events-none" />
            {[
              { title: 'Privacy First', label: 'Zero-knowledge architecture ensuring your identity and data remain yours alone.' },
              { title: 'Peer Verified', label: 'A trust-based network where every alert is validated by the community, for the community.' },
              { title: 'Always Free', label: 'Safety is a right, not a privilege. Sororine will always remain free for those who need it most.' },
            ].map((value, i) => (
              <div key={i} className="text-center md:text-left group relative z-10 border-b md:border-b-0 md:border-r border-white/10 last:border-0 pb-8 md:pb-0 md:pr-8 last:pr-0">
                <div className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] mb-4 md:mb-6 tracking-tighter">{value.title}</div>
                <div className="text-sm md:text-base text-white/70 font-light leading-relaxed tracking-wide">{value.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Vision - Immersive */}
      <section id="vision" className="relative py-32 md:py-56 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl md:text-[6.5rem] font-bold text-white mb-14 md:mb-24 leading-[1] tracking-tighter">
            A future anchored in <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] italic font-semibold p-1 md:p-4">collective care</span>
          </h2>
          <p className="text-xl md:text-3xl text-white/80 mb-20 md:mb-32 font-light leading-relaxed tracking-wide px-4 leading-normal">
            We're architecting a paradigm shift where technology serves as the connective tissue for human empathy, creating an invisible safety net across every city, for everyone.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-14 md:px-24 py-5 md:py-7 bg-gradient-to-r from-[#cdffd8]/10 to-[#94b9ff]/20 hover:from-[#cdffd8]/20 hover:to-[#94b9ff]/30 text-white text-sm md:text-lg font-bold rounded-full transition-all border border-white/20 shadow-[0_0_80px_rgba(148,185,255,0.2)] hover:scale-105 active:scale-95"
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      {/* Personalized Developer Footer */}
      <footer className="border-t border-white/10 py-24 md:py-32 px-6 bg-black/60 backdrop-blur-3xl mt-20">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex flex-col items-center gap-6">
            {/* Minimal Logo */}
            {/* <div className="flex items-center">
              <span className="text-2xl md:text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] lowercase">sororine.</span>
            </div> */}

            {/* Personalized Credits & Links */}
            <div className="space-y-8">
              <h4 className="text-4xl md:text-4xl font-bold text-white tracking-tighter">
                Developed by Divyesh.
              </h4>

              <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                <a
                  href="https://linkedin.com/in/divyesh-kamalanaban"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/70 hover:text-white transition-all font-medium hover:tracking-[0.4em]"
                >
                  LinkedIn
                </a>
                <a
                  href="https://divyesh.is-a.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/70 hover:text-white transition-all font-medium hover:tracking-[0.4em]"
                >
                  Website
                </a>
                <a
                  href="https://github.com/Divyesh-Kamalanaban"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/70 hover:text-white transition-all font-medium hover:tracking-[0.4em]"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* High-Precision Scroll Progress - Next-Gen Style */}
      <div
        className="fixed top-0 left-0 h-1 md:h-1.5 bg-gradient-to-r from-[#cdffd8] to-[#94b9ff] z-70 transition-all duration-300 pointer-events-none shadow-[0_0_20px_rgba(148,185,255,0.4)]"
        style={{ width: `${scrollProgress * 100}%` }}
      />
    </div>
  );
}
