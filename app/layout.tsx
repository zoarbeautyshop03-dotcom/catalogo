import type { Metadata } from 'next'
import { Playfair_Display, Inter, Playball } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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
})

export const metadata: Metadata = {
  title: 'Zoar Beauty Shop',
  description: 'Catálogo de belleza y cuidado capilar Zoar Beauty Shop.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} ${playball.variable}`}>
      <body className="font-body bg-crema text-gray-800 min-h-screen flex flex-col">
        <CarritoProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CarritoProvider>
      </body>
    </html>
  )
}
