import type { Config } from 'tailwindcss';

// tailwind.config.ts

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1E40AF', // Example primary color
                secondary: '#F59E0B', // Example secondary color
                accent: '#10B981', // Example accent color
                background: '#F3F4F6', // Example background color
                text: '#111827', // Example text color
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Example font family
                serif: ['Merriweather', 'serif'], // Example serif font family
            },
            fontSize: {
                sm: ['0.875rem', { lineHeight: '1.25rem' }], // Example small font size
                base: ['1rem', { lineHeight: '1.5rem' }], // Example base font size
                lg: ['1.125rem', { lineHeight: '1.75rem' }], // Example large font size
                xl: ['1.25rem', { lineHeight: '1.75rem' }], // Example extra large font size
                '2xl': ['1.5rem', { lineHeight: '2rem' }], // Example 2xl font size
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // Example 3xl font size
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // Example 4xl font size
                '5xl': ['3rem', { lineHeight: '1' }], // Example 5xl font size
            },
            spacing: {
                0: '0px',
                1: '0.25rem', // 4px
                2: '0.5rem', // 8px
                3: '0.75rem', // 12px
                4: '1rem', // 16px
            },
        },
    },
    plugins: [],
};

export default config;
