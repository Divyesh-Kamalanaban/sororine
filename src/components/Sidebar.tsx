"use client";

import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    Map as MapIcon,
    ShieldAlert,
    Users,
    Settings,
    Menu,
    X,
    LogOut,
    History as HistoryIcon,
    LogIn
} from 'lucide-react';
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: ShieldAlert, label: "Reports", href: "/reports" },
    { icon: HistoryIcon, label: "History", href: "/history" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchUser();

        // Handle resize to close mobile sidebar on desktop
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className={cn(
                    "md:hidden fixed top-4 left-4 z-50 p-2 bg-[#0A0A10] text-white rounded-lg border border-white/10 hover:bg-white/10 transition-all shadow-lg",
                    isMobileOpen ? "opacity-0 pointer-events-none" : "opacity-100"
                )}
                onClick={() => setIsMobileOpen(true)}
                aria-label="Open menu"
            >
                <Menu size={24} />
            </button>

            {/* Mobile Sidebar Overlay */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden transition-opacity duration-300",
                    isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsMobileOpen(false)}
            />

            <aside
                className={cn(
                    "fixed md:relative top-0 left-0 h-screen bg-[#0A0A10]/95 md:bg-white/5 backdrop-blur-2xl border-r border-white/10 transition-all duration-500 ease-in-out z-[110] flex flex-col",
                    "w-72", // Base width for mobile and expanded desktop
                    collapsed && "md:w-20", // Collapsed width only on desktop
                    isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                <div className="flex items-center justify-between p-6 h-24 border-b border-white/5">
                    {(!collapsed || isMobileOpen) && (
                        <Link href="/" className="hover:opacity-80 transition-opacity">
                            <span className="font-bold text-3xl tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-accent to-primary lowercase animate-in fade-in duration-500">
                                sororine.
                            </span>
                        </Link>
                    )}
                    <button
                        onClick={() => {
                            if (window.innerWidth < 768) setIsMobileOpen(false);
                            else setCollapsed(!collapsed);
                        }}
                        className="p-2.5 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all ml-auto"
                        aria-label={isMobileOpen ? "Close menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {(collapsed && !isMobileOpen) ? <Menu size={22} /> : <X size={22} />}
                    </button>
                </div>

                <nav className="flex-1 py-8 flex flex-col gap-2 px-4">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-white/50 hover:bg-white/5 hover:text-white"
                                )}
                            >
                                <item.icon size={22} className={cn("min-w-5.5 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                                {(!collapsed || isMobileOpen) && (
                                    <span className="font-medium whitespace-nowrap tracking-tight animate-in fade-in slide-in-from-left-2 duration-300">
                                        {item.label}
                                    </span>
                                )}
                                {isActive && (
                                    <div className="absolute left-0 w-1 h-6 bg-primary rounded-full" />
                                )}
                                {/* Desktop Tooltip */}
                                {(collapsed && !isMobileOpen) && (
                                    <div className="absolute left-20 bg-background text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all -translate-x-2.5 group-hover:translate-x-0 whitespace-nowrap z-50 border border-white/10 hidden md:block font-bold">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-white/5">
                    {user ? (
                        <button
                            onClick={handleLogout}
                            className={cn(
                                "flex items-center gap-4 px-4 py-4 w-full rounded-2xl transition-all text-red-400/70 hover:bg-red-500/10 hover:text-red-400",
                            )}
                        >
                            <LogOut size={22} className="min-w-5.5" />
                            {(!collapsed || isMobileOpen) && <span className="font-medium tracking-tight">Logout</span>}
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className={cn(
                                "flex items-center gap-4 px-4 py-4 w-full rounded-2xl transition-all text-accent/70 hover:bg-accent/10 hover:text-accent",
                            )}
                        >
                            <LogIn size={22} className="min-w-5.5" />
                            {(!collapsed || isMobileOpen) && <span className="font-medium tracking-tight">Login</span>}
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
}
