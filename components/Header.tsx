import Link from 'next/link'
import CartDrawer from './CartDrawer'
import Logo from './Logo'
import RedesSociales from './RedesSociales'
import MenuMovil from './MenuMovil'
import { getConfiguracion } from '@/lib/queries'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  )
}

export default async function Header() {
  const config = await getConfiguracion()

  return (
    <header className="sticky top-0 z-40 border-b border-lavender-magenta-100/80 bg-white/95 backdrop-blur">
      <div className="border-b border-lavender-magenta-900 bg-lavender-magenta-950 text-lavender-magenta-100">
        <div className="section-shell flex items-center justify-between gap-3 py-1.5 sm:py-2">
          <p className="min-w-0 truncate text-[11px] font-medium tracking-wide sm:text-xs">
            Belleza que se siente, detalles que enamoran
          </p>
          <RedesSociales config={config} variant="header" />
        </div>
      </div>

      <div className="section-shell grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5 sm:gap-5 sm:py-3">
        <Link href="/" className="shrink-0 rounded-xl" aria-label="Zoar Beauty Shop — Inicio">
          <Logo size="md" />
        </Link>

        <form action="/catalogo" className="hidden min-w-0 md:block">
          <label className="campo-pill mx-auto flex max-w-xl items-center gap-2 rounded-full border border-lavender-magenta-100 bg-lavender-magenta-50/75 px-4 py-2.5 text-sm text-gray-600 shadow-inner">
            <SearchIcon />
            <span className="sr-only">Buscar productos, marcas o categorías</span>
            <input
              type="text"
              name="q"
              placeholder="Buscar productos, marcas o categorías..."
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
            />
          </label>
        </form>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <CartDrawer />
          <MenuMovil />
        </div>
      </div>

      {/* Buscador siempre visible en celular (en escritorio va en la fila de arriba). */}
      <form action="/catalogo" role="search" className="section-shell pb-2.5 md:hidden">
        <label className="campo-pill flex items-center gap-2 rounded-full border border-lavender-magenta-100 bg-lavender-magenta-50/75 py-1 pl-4 pr-1 shadow-inner">
          <SearchIcon />
          <span className="sr-only">Buscar productos</span>
          {/* text-base (16px) evita que iPhone haga zoom al tocar el campo */}
          <input
            type="search"
            name="q"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Buscar productos..."
            className="min-w-0 flex-1 border-0 bg-transparent py-2 text-base text-gray-800 placeholder:text-gray-500 focus:outline-none"
          />
          <button type="submit" className="shrink-0 rounded-full bg-lavender-magenta-600 px-4 py-2 text-xs font-bold text-white hover:bg-lavender-magenta-700">
            Buscar
          </button>
        </label>
      </form>

      <div className="hidden border-t border-lavender-magenta-100/80 md:block">
        <nav aria-label="Principal" className="section-shell flex items-center justify-center gap-9 py-3 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-lavender-magenta-700">Inicio</Link>
          <Link href="/catalogo" className="hover:text-lavender-magenta-700">Catálogo</Link>
          <Link href="/catalogo?oferta=1" className="hover:text-lavender-magenta-700">Ofertas</Link>
          <Link href="/catalogo?nuevo=1" className="hover:text-lavender-magenta-700">Novedades</Link>
          <Link href="/admin" className="text-xs text-gray-500 hover:text-lavender-magenta-700">Administración</Link>
        </nav>
      </div>
    </header>
  )
}
