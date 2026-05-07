import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'green-primary': '#6b9e7e',
        'sage': '#8aab8f',
        'green-muted': '#4a7a5c',
        'text-primary': '#e8ede9',
        'text-secondary': '#8a9e8d',
        'base': '#080c09',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'orb-drift-1': 'orb-drift 18s ease-in-out infinite',
        'orb-drift-2': 'orb-drift 22s ease-in-out infinite reverse',
        'orb-drift-3': 'orb-drift 15s ease-in-out infinite',
        'orb-drift-4': 'orb-drift 25s ease-in-out infinite',
        'orb-breathe': 'orb-breathe 4s ease-in-out infinite',
        'bubble-in': 'bubble-in 320ms ease-out forwards',
        'typing': 'typing 1.4s ease-in-out infinite',
        'fade-in': 'fade-in 400ms ease-out forwards',
      },
      keyframes: {
        'orb-drift': {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(18px,-22px) scale(1.06)' },
          '66%': { transform: 'translate(-12px,12px) scale(0.96)' },
        },
        'orb-breathe': {
          '0%,100%': { boxShadow: '0 0 20px rgba(107,158,126,0.2)', transform: 'scale(1)' },
          '50%': { boxShadow: '0 0 28px rgba(107,158,126,0.35)', transform: 'scale(1.03)' },
        },
        'bubble-in': {
          from: { opacity: '0', transform: 'translateY(7px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'typing': {
          '0%, 80%, 100%': { opacity: '0.2', transform: 'scale(0.8)' },
          '40%': { opacity: '1', transform: 'scale(1)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        'xs': '4px',
      },
    },
  },
  plugins: [],
}

export default config
