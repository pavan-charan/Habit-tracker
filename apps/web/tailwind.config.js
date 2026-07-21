/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          50: '#f4f5f8',
          100: '#e5e7eb',
          800: '#131620',
          900: '#0b0d13',
          950: '#07080b',
        },
        brand: {
          water: '#06b6d4',
          sleep: '#8b5cf6',
          habits: '#10b981',
          goals: '#f59e0b',
          journal: '#f43f5e',
          accent: '#6366f1',
        },
      },
      backgroundColor: {
        glass: 'rgba(255, 255, 255, 0.03)',
        'glass-hover': 'rgba(255, 255, 255, 0.06)',
      },
      borderColor: {
        glass: 'rgba(255, 255, 255, 0.08)',
        'glass-glow': 'rgba(139, 92, 246, 0.3)',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 20px -5px rgba(139, 92, 246, 0.3)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
