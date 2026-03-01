/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#000000',
                foreground: '#ffffff',
                primary: {
                    DEFAULT: '#94a3b8', // use slate-400 as primary accent
                    hover: '#cbd5e1',
                    foreground: '#ffffff',
                },
                accent: {
                    DEFAULT: '#7a8e9d', // neutral accent shade
                },
                slate: {
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    600: '#475569',
                    700: '#334155',
                },
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)', 'Inter', 'ui-sans-serif', 'system-ui'],
                mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular'],
            },
            backgroundColor: {
                'white/1': 'rgba(255, 255, 255, 0.01)',
                'white/1.5': 'rgba(255, 255, 255, 0.015)',
                'white/2.5': 'rgba(255, 255, 255, 0.025)',
            },
            animation: {
                'fade-in': 'fadeIn 0.8s ease-in forwards',
                'zoom-in': 'zoomIn 0.8s ease-in forwards',
                'bounce-slow': 'bounce 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                zoomIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
        },
    },
    plugins: [],
};
