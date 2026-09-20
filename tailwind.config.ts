import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rosa: {
          pastel: '#F9DCE6',
          empolvado: '#EAB0C6',
          nude: '#EED9CE',
        },
        fucsia: '#E0179E',
        crema: '#FDF3F6',
        lavanda: '#D8CFE8',
        dorado: '#F0A93C',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        script: ['var(--font-script)', 'cursive'],
      },
    },
  },
  plugins: [],
}
export default config
