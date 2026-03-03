"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldAlert, LogIn, Lock, Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [redirectPath, setRedirectPath] = useState('/dashboard');

    useEffect(() => {
        const redirect = searchParams.get('redirect');
        if (redirect) {
            setRedirectPath(redirect);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                // Clear guest session
                localStorage.removeItem('safety_user_id');
                router.push(redirectPath);
                router.refresh(); // Refresh to update auth state in root layout/dashboard
            } else {
                const data = await res.json();
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-next-gen flex items-center justify-center p-4">
            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-10 hover:opacity-80 transition-opacity">
                        <span className="font-bold text-4xl tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-accent to-primary lowercase pr-2">
                            sororine.
                        </span>
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tighter">Welcome Back</h1>
                    <p className="text-white/60 text-base md:text-lg font-light">Sign in to the global safety network.</p>
                </div>

                <div className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="relative group">
                                <Mail className={cn("absolute left-4 top-4 w-5 h-5 text-white/40 transition-colors duration-300", "group-focus-within:text-primary")} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-light"
                                    required
                                />
                            </div>

                            <div className="relative group">
                                <Lock className={cn("absolute left-4 top-4 w-5 h-5 text-white/40 transition-colors duration-300", "group-focus-within:text-primary")} />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-light"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-primary text-[#050509] rounded-2xl font-bold uppercase tracking-widest text-xs transition-all hover:bg-accent hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-white/40 text-sm font-light tracking-wide">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary hover:text-primary/80 transition-colors font-bold">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="mt-10 text-center">
                    <Link href="/" className="text-white/30 hover:text-white text-sm transition-colors flex items-center justify-center gap-2 uppercase tracking-[0.2em] font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
