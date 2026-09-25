import Link from 'next/link'
import RedesSociales from '@/components/RedesSociales'
import { getConfiguracion } from '@/lib/queries'

export default async function Footer() {
  const config = await getConfiguracion()

  return (
    <footer className="mt-20 border-t border-lavender-magenta-100 bg-white">
      <div className="section-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold text-lavender-magenta-800">ZOAR BEAUTY</p>
          <p className="mt-1 font-script text-2xl text-lavender-magenta-600">Shop</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
            Un espacio para descubrir productos de belleza y cuidado que encajen contigo y con tu rutina.
          </p>
          <div className="mt-5">
            <RedesSociales config={config} />
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-magenta-700">Explora</p>
          <div className="mt-4 space-y-3 text-sm text-gray-500">
            <Link href="/" className="block hover:text-lavender-magenta-700">Inicio</Link>
            <Link href="/catalogo" className="block hover:text-lavender-magenta-700">Catálogo</Link>
            <Link href="/catalogo?oferta=1" className="block hover:text-lavender-magenta-700">Ofertas</Link>
            <Link href="/catalogo?nuevo=1" className="block hover:text-lavender-magenta-700">Novedades</Link>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-magenta-700">Compra con confianza</p>
          <p className="mt-4 text-sm leading-6 text-gray-500">Atención personalizada, pedidos por WhatsApp y carrito para reunir varios productos en una sola solicitud.</p>
        </div>
      </div>

      <div className="border-t border-lavender-magenta-100">
        <div className="section-shell flex flex-col gap-2 py-5 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Zoar Beauty Shop. Todos los derechos reservados.</p>
          <p>By Daniela Perez</p>
        </div>
      </div>
    </footer>
  )
}
