import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'lavender-magenta': {
          50: '#fff4fe',
          100: '#ffe7fe',
          200: '#ffcefc',
          300: '#ff94f4',
          400: '#fe74ee',
          500: '#f540df',
          600: '#d920bf',
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
        fucsia: '#d920bf',
        crema: '#fff4fe',
        lavanda: '#ffcefc',
        dorado: '#b78b3c',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      boxShadow: {
        'soft-pink': '0 14px 40px rgba(217, 32, 191, 0.10)',
        'soft-card': '0 10px 30px rgba(81, 1, 65, 0.07)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
export default config
