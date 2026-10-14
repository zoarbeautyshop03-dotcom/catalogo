import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Playball } from 'next/font/google'
import './globals.css'
import { CarritoProvider } from '@/lib/cart-context'

// Fuentes reales cargadas por Next (antes solo estaban referenciadas en el CSS
// pero nunca importadas, asi que el sitio caia al serif/sans-serif por
// defecto del sistema). Playfair Display + Playball imitan el par
// serif-elegante + script del logo real de Zoar.
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})
const playball = Playball({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
  preload: false,
})

export const metadata: Metadata = {
  title: 'Zoar Beauty Shop',
  description: 'Catálogo de belleza y cuidado capilar Zoar Beauty Shop.',
  applicationName: 'Zoar Beauty Shop',
}

// Color de la barra del navegador en móvil, alineado con la marca.
export const viewport: Viewport = {
  themeColor: '#d11fb8',
  colorScheme: 'light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} ${playball.variable}`}>
      <body className="font-body bg-crema text-gray-800 min-h-screen flex flex-col">
        <CarritoProvider>
          {children}
        </CarritoProvider>
      </body>
    </html>
  )
}
