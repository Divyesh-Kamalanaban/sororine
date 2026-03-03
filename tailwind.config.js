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
                background: '#141414',
                foreground: '#ffffff',
                primary: {
                    DEFAULT: '#94a3b8',
                    hover: '#cbd5e1',
                    foreground: '#ffffff',
                },
                accent: {
                    DEFAULT: '#7a8e9d',
                },
                logo: {
                    start: '#cdffd8',
                    end: '#94b9ff',
                },
                appBg: {
                    start: '#141414',
                    end: '#023464',
                }
            },
            fontFamily: {
                sans: ['Garet', 'Outfit', 'Inter', 'ui-sans-serif', 'system-ui'],
                mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular'],
                garet: ['Garet', 'Outfit', 'sans-serif'],
            },
            backgroundColor: {
                'white/1': 'rgba(255, 255, 255, 0.01)',
                'white/1.5': 'rgba(255, 255, 255, 0.015)',
                'white/2.5': 'rgba(255, 255, 255, 0.025)',
                'white/3': 'rgba(255, 255, 255, 0.03)',
                'blue-500/2': 'rgba(59, 130, 246, 0.02)',
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
            zIndex: {
                '60': '60',
            },
        },
    },
    plugins: [],
};
