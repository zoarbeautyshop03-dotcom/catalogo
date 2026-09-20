import Link from 'next/link'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-crema/95 backdrop-blur border-b border-rosa-pastel">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-1.5 leading-none">
          <span className="text-lg">🦋</span>
          <span className="font-display font-bold tracking-wide text-fucsia text-lg">
            ZOAR BEAUTY
          </span>
          <span className="font-script text-2xl text-gray-700 -ml-0.5">Shop</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm text-gray-700">
          <Link href="/">Inicio</Link>
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/catalogo?oferta=1">Ofertas</Link>
          <Link href="/catalogo?nuevo=1">Novedades</Link>
        </nav>
        <Link href="/catalogo" className="text-gray-600 text-lg" aria-label="Buscar">
          🔍
        </Link>
      </div>
    </header>
  )
}
