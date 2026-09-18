import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rosa: {
          pastel: '#F7D9E3',
          empolvado: '#E8B4C0',
          nude: '#EED9CE',
        },
        fucsia: '#D63384',
        crema: '#FBF6F1',
        lavanda: '#D8CFE8',
        dorado: '#C9A15A',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
