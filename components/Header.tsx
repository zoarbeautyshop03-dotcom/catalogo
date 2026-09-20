import Link from 'next/link'
import Image from 'next/image'
import CartDrawer from './CartDrawer'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-crema/95 backdrop-blur border-b border-rosa-pastel">
      <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center gap-4">
        <Link href="/" className="shrink-0">
          <Image
            src="/logo.jpg"
            alt="Zoar Beauty Shop"
            width={44}
            height={44}
            className="rounded-xl object-cover"
            priority
          />
        </Link>

        {/* Buscador central, siempre visible (igual que en un ecommerce grande) */}
        <form action="/catalogo" className="hidden sm:flex flex-1 max-w-md">
          <input
            type="text"
            name="q"
            placeholder="¿Qué producto estás buscando?"
            className="w-full rounded-full border border-rosa-pastel px-4 py-2 text-sm focus:outline-fucsia"
          />
        </form>

        <nav className="hidden md:flex gap-5 text-sm text-gray-700 ml-auto">
          <Link href="/">Inicio</Link>
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/catalogo?oferta=1">Ofertas</Link>
          <Link href="/catalogo?nuevo=1">Novedades</Link>
        </nav>

        <div className="flex items-center gap-4 ml-auto md:ml-0">
          <Link href="/catalogo" className="text-gray-600 text-lg sm:hidden" aria-label="Buscar">
            🔍
          </Link>
          <CartDrawer />
        </div>
      </div>
    </header>
  )
}
