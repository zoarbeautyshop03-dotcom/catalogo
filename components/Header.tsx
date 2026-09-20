import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-crema/95 backdrop-blur border-b border-rosa-pastel">
      <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Zoar Beauty Shop"
            width={44}
            height={44}
            className="rounded-xl object-cover"
            priority
          />
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
