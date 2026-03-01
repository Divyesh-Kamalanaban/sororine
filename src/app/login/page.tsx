"use client";

import { Suspense } from 'react';
import LoginContent from './login-content';

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050509] flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>}>
            <LoginContent />
        </Suspense>
    );
}
