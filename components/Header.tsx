import Link from 'next/link'
import CartDrawer from './CartDrawer'
import Logo from './Logo'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  )
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-lavender-magenta-100/80 bg-white/90 backdrop-blur-xl">
      <div className="hidden border-b border-lavender-magenta-100 bg-lavender-magenta-950 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-lavender-magenta-100 sm:block">
        <div className="section-shell py-2">Belleza que se siente · Detalles que enamoran</div>
      </div>

      <div className="section-shell grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2.5 sm:gap-5 sm:py-3">
        <Link href="/" className="shrink-0 rounded-xl" aria-label="Zoar Beauty Shop — Inicio">
          <Logo size="md" />
        </Link>

        <form action="/catalogo" className="hidden min-w-0 md:block">
          <label className="mx-auto flex max-w-xl items-center gap-2 rounded-full border border-lavender-magenta-100 bg-lavender-magenta-50/75 px-4 py-2.5 text-sm text-gray-500 shadow-inner">
            <SearchIcon />
            <input
              type="text"
              name="q"
              placeholder="Buscar productos, marcas o categorías..."
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
            />
          </label>
        </form>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <Link href="/catalogo" className="rounded-full p-2 text-lavender-magenta-700 hover:bg-lavender-magenta-50 md:hidden" aria-label="Buscar">
            <SearchIcon />
          </Link>
          <CartDrawer />
          <details className="relative md:hidden">
            <summary className="flex cursor-pointer list-none items-center rounded-full p-2 text-lavender-magenta-800 hover:bg-lavender-magenta-50" aria-label="Abrir menú">
              <MenuIcon />
            </summary>
            <div className="absolute right-0 top-12 w-56 rounded-2xl border border-lavender-magenta-100 bg-white p-2 shadow-xl">
              {[
                ['/','Inicio'],
                ['/catalogo','Catálogo'],
                ['/catalogo?oferta=1','Ofertas'],
                ['/catalogo?nuevo=1','Novedades'],
                ['/admin','Administración'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-lavender-magenta-50 hover:text-lavender-magenta-800">
                  {label}
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>

      <div className="hidden border-t border-lavender-magenta-100/80 md:block">
        <nav className="section-shell flex items-center justify-center gap-8 py-2.5 text-sm font-medium text-gray-600">
          <Link href="/" className="hover:text-lavender-magenta-700">Inicio</Link>
          <Link href="/catalogo" className="hover:text-lavender-magenta-700">Catálogo</Link>
          <Link href="/catalogo?oferta=1" className="hover:text-lavender-magenta-700">Ofertas</Link>
          <Link href="/catalogo?nuevo=1" className="hover:text-lavender-magenta-700">Novedades</Link>
          <Link href="/admin" className="text-xs text-gray-400 hover:text-lavender-magenta-700">Administración</Link>
        </nav>
      </div>
    </header>
  )
}
