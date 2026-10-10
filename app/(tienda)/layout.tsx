import Header from '@/components/Header'
import Footer from '@/components/Footer'
import BarraCarritoMovil from '@/components/BarraCarritoMovil'

// Marco de la tienda pública (cabecera, pie de página y barra del carrito).
// El panel /admin tiene su propio marco y ya no hereda esta cabecera.
export default function TiendaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#contenido" className="saltar-contenido">Saltar al contenido</a>
      <Header />
      <main id="contenido" tabIndex={-1} className="flex-1">{children}</main>
      <Footer />
      <BarraCarritoMovil />
    </>
  )
}
