"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, User, Phone, HeartPulse, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        emergencyContactName: '',
        emergencyContactNumber: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');


        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-next-gen flex items-center justify-center p-4">
            <div className="w-full max-w-3xl relative z-10 animate-in fade-in zoom-in duration-500 py-10">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-10 hover:opacity-80 transition-opacity">
                        <span className="font-bold text-4xl tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-accent to-primary lowercase">
                            sororine.
                        </span>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tighter">Create Account</h1>
                    <p className="text-white/60 text-base md:text-lg font-light">Join the global safety network and protect your community.</p>
                </div>

                <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
                                {error}
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="md:col-span-2 text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.3em] -mb-3.75">Personal Data</div>

                            <div className="relative group">
                                <User className="absolute left-4 top-4 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-light"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Phone className="absolute left-4 top-4 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-light"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Mail className="absolute left-4 top-4 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-light"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Lock className="absolute left-4 top-4 text-white/40 group-focus-within:text-primary transition-colors" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-light"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2 text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-2 -mb-3.75">Emergency Protocol</div>

                            <div className="relative group">
                                <HeartPulse className="absolute left-4 top-4 text-white/40 group-focus-within:text-red-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    name="emergencyContactName"
                                    placeholder="Emergency Contact Name"
                                    value={formData.emergencyContactName}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-red-400/50 focus:ring-1 focus:ring-red-400/50 transition-all font-light"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Phone className="absolute left-4 top-4 text-white/40 group-focus-within:text-red-400 transition-colors" size={20} />
                                <input
                                    type="tel"
                                    name="emergencyContactNumber"
                                    placeholder="Contact Number"
                                    value={formData.emergencyContactNumber}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-red-400/50 focus:ring-1 focus:ring-red-400/50 transition-all font-light"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-[#050509] rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:bg-accent hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100 shadow-xl shadow-primary/20"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Establish Account <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-white/40 text-sm font-light tracking-wide">
                            Already registered?{' '}
                            <Link href="/login" className="text-primary hover:text-primary/80 font-bold transition-all">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="mt-12 text-center">
                    <Link href="/" className="text-white/30 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 uppercase tracking-[0.2em] font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div >
    );
}
