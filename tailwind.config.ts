import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tokens de shadcn/ui conectados a la paleta Zoar (valores en app/globals.css).
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        'blush-pink': {
          50: '#fff3fd',
          100: '#ffe7fc',
          200: '#ffcef8',
          300: '#ffa7ef',
          400: '#ff6ee2',
          500: '#f73ed2',
          600: '#db1eb1',
          700: '#b6158f',
          800: '#951374',
          900: '#79165d',
          950: '#51013b',
        },
        'lavender-magenta': {
          50: '#fff4fe',
          100: '#ffe7fe',
          200: '#ffcefc',
          300: '#ff94f4',
          400: '#fe74ee',
          500: '#f540df',
          600: '#d11fb8', // oscurecido levemente para que texto blanco sobre este color cumpla contraste AA (4.5:1)
          700: '#b4179a',
          800: '#93157d',
          900: '#781765',
          950: '#510141',
        },
        // Alias existentes para no romper componentes que ya usan estos nombres.
        rosa: {
          pastel: '#ffe7fe',
          empolvado: '#ffcefc',
          nude: '#fff4fe',
        },
        fucsia: '#d11fb8',
        crema: '#ffeefc',
        lavanda: '#ffcefc',
        // Dorado: acento secundario, para filetes, firma y detalles de lujo.
        dorado: {
          DEFAULT: '#b78b3c',
          claro: '#e8cf9a',
          oscuro: '#8a6520',
          50: '#fbf6ea',
          100: '#f5ecd5',
          200: '#ecdab0',
          300: '#e0c184',
          400: '#d3a758',
          500: '#b78b3c',
          600: '#9c7330',
          700: '#7d5a26',
          800: '#5f441d',
          900: '#3f2d14',
        },
        // Grises con un leve matiz ciruela para que texto, bordes y fondos
        // neutros armonicen con el magenta de la marca (antes eran grises puros).
        gray: {
          50: '#faf7fa',
          100: '#f4eef4',
          200: '#e8dfe8',
          300: '#d6cad5',
          400: '#a999a7',
          500: '#725f6f',
          600: '#5a4859',
          700: '#463746',
          800: '#33252f',
          900: '#241a22',
          950: '#170f16',
        },
        // Tinta de marca para titulares (ciruela muy profundo).
        ink: '#2b1d29',
        plum: '#510141',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      fontSize: {
        // Escala editorial fluida (sin media queries): se adapta al ancho.
        'display-sm': ['clamp(1.65rem, 3vw, 2.1rem)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 4vw, 2.85rem)', { lineHeight: '1.08', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.5rem, 5.5vw, 3.75rem)', { lineHeight: '1.04', letterSpacing: '-0.035em' }],
        'display-xl': ['clamp(2.9rem, 7vw, 4.75rem)', { lineHeight: '1.01', letterSpacing: '-0.045em' }],
      },
      boxShadow: {
        'soft-pink': '0 1px 2px rgba(81, 1, 65, 0.05), 0 18px 48px rgba(81, 1, 65, 0.10)',
        'soft-card': '0 1px 2px rgba(81, 1, 65, 0.04), 0 10px 28px rgba(81, 1, 65, 0.06)',
        // Sombras del rediseño: capas suaves con tinte ciruela/magenta.
        card: '0 1px 2px rgba(81, 1, 65, 0.04), 0 14px 32px -14px rgba(81, 1, 65, 0.16)',
        'card-hover': '0 2px 4px rgba(81, 1, 65, 0.05), 0 26px 52px -18px rgba(149, 19, 116, 0.26)',
        float: '0 30px 70px -24px rgba(81, 1, 65, 0.32)',
        'gold-line': 'inset 0 0 0 1px rgba(183, 139, 60, 0.38)',
      },
      borderRadius: {
        '4xl': '2rem',
        boutique: '1.75rem',
        'boutique-lg': '2.25rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #db1eb1 0%, #951374 100%)',
        'brand-gradient-soft': 'linear-gradient(135deg, #ffe7fc 0%, #fff4fe 100%)',
        'gold-hairline': 'linear-gradient(90deg, transparent, rgba(183,139,60,.65), transparent)',
        'page-wash':
          'radial-gradient(ellipse 70% 45% at 100% 0%, rgba(255, 148, 244, 0.22), transparent 70%), radial-gradient(ellipse 55% 45% at 0% 40%, rgba(255, 206, 252, 0.45), transparent 72%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 6s ease-in-out infinite',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      transitionTimingFunction: {
        boutique: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
export default config
