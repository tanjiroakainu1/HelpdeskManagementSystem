/** @type {import('tailwindcss').Config} */

/** Enables opacity modifiers (e.g. bg-candy/35) inside @apply for custom colors */
const c = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        canvas: c('canvas'),
        surface: {
          DEFAULT: c('surface'),
          2: c('surface-2'),
          3: c('surface-3'),
        },
        border: {
          DEFAULT: c('border'),
          light: c('border-light'),
        },
        muted: c('muted'),
        accent: {
          DEFAULT: c('accent'),
          soft: c('accent-soft'),
          glow: c('accent-glow'),
          muted: c('accent-muted'),
        },
        candy: {
          DEFAULT: c('candy'),
          light: c('candy-light'),
          bright: c('candy-bright'),
          dark: c('candy-dark'),
          mint: c('candy-mint'),
        },
        galaxy: {
          DEFAULT: c('galaxy'),
          soft: c('galaxy-soft'),
          deep: c('galaxy-deep'),
          nebula: c('galaxy-nebula'),
          dust: c('galaxy-dust'),
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card: [
          '0 0 0 1px rgba(167, 139, 250, 0.12)',
          '0 1px 0 0 rgba(167, 243, 208, 0.08)',
          '0 8px 32px -8px rgba(0, 0, 0, 0.55)',
          '0 24px 48px -24px rgba(124, 58, 237, 0.2)',
        ].join(', '),
        glow: '0 0 40px -8px rgba(52, 211, 153, 0.45)',
        galaxy: '0 0 56px -10px rgba(124, 58, 237, 0.5)',
        'inner-soft': 'inset 0 1px 0 0 rgba(167, 243, 208, 0.1)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
      backgroundImage: {
        mesh: [
          'radial-gradient(ellipse 90% 70% at 15% -15%, rgba(52, 211, 153, 0.16), transparent 55%)',
          'radial-gradient(ellipse 70% 50% at 95% 5%, rgba(124, 58, 237, 0.24), transparent 50%)',
          'radial-gradient(ellipse 50% 40% at 50% 100%, rgba(88, 28, 135, 0.2), transparent)',
        ].join(', '),
        'auth-gradient':
          'linear-gradient(145deg, #0a0614 0%, #2e1065 42%, #064e3b 88%, #0a0614 100%)',
        'candy-galaxy':
          'linear-gradient(135deg, #34d399 0%, #6ee7b7 35%, #7c3aed 70%, #a78bfa 100%)',
        'text-shine':
          'linear-gradient(120deg, #ffffff 0%, #a7f3d0 40%, #c4b5fd 70%, #ffffff 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.45s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
        float: 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
