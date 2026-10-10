import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
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
        // Dorado: acento secundario, solo para pequeños detalles (filetes, firma).
        dorado: { DEFAULT: '#b78b3c', claro: '#e8cf9a' },
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
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
      boxShadow: {
        'soft-pink': '0 1px 2px rgba(81, 1, 65, 0.05), 0 18px 48px rgba(81, 1, 65, 0.10)',
        'soft-card': '0 1px 2px rgba(81, 1, 65, 0.04), 0 10px 28px rgba(81, 1, 65, 0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
export default config
