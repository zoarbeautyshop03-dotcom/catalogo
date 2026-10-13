import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BarraCarritoMovil from '@/components/BarraCarritoMovil'
import { Toaster } from '@/components/ui/sonner'

// Marco de la tienda pública (cabecera, pie de página y barra del carrito).
// El panel /admin tiene su propio marco y ya no hereda esta cabecera.
export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col overflow-x-clip">
      <a href="#contenido" className="saltar-contenido">Saltar al contenido</a>
      <Header />
      <main id="contenido" tabIndex={-1} className="fondo-tienda relative flex-1 pb-16 sm:pb-20">{children}</main>
      <Footer />
      <BarraCarritoMovil />
      <Toaster />
    </div>
  )
}
