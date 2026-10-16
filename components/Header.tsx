import Link from 'next/link'
import CartDrawer from './CartDrawer'
import Logo from './Logo'
import RedesSociales from './RedesSociales'
import MenuMovil from './MenuMovil'
import { IconoUsuario } from './IconoUsuario'
import { getConfiguracion } from '@/lib/queries'

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-lavender-magenta-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  )
}

// Enlace de la navegación de escritorio con un filete dorado que se despliega
// al pasar el cursor. Solo cambia la capa visual respecto al enlace original.
function NavLink({
  href,
  tono = 'principal',
  children,
}: {
  href: string
  tono?: 'principal' | 'suave'
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center py-1 transition-colors duration-200 ease-boutique hover:text-lavender-magenta-800 ${
        tono === 'suave'
          ? 'text-xs font-medium tracking-wide text-gray-500'
          : 'text-[13px] font-semibold uppercase tracking-[0.14em] text-gray-700'
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-dorado/0 via-dorado to-dorado/0 transition-transform duration-300 ease-boutique group-hover:scale-x-100"
      />
    </Link>
  )
}

export default async function Header() {
  const config = await getConfiguracion()

  return (
    <header className="glass-panel sticky top-0 z-40 !border-0">
      {/* Franja de anuncio */}
      <div className="relative overflow-hidden border-b border-lavender-magenta-900/70 bg-gradient-to-r from-lavender-magenta-950 via-lavender-magenta-900 to-lavender-magenta-950 text-lavender-magenta-100">
        <div className="section-shell flex items-center justify-between gap-3 py-2">
          <p className="min-w-0 text-[10px] font-medium uppercase leading-snug tracking-[0.08em] sm:text-xs sm:tracking-[0.16em]">
            Belleza que se siente, detalles que enamoran
          </p>
          <RedesSociales config={config} variant="header" />
        </div>
      </div>

      {/* Fila principal: marca, buscador y carrito */}
      <div className="section-shell grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3.5 sm:gap-6 sm:py-5">
        <Link href="/" className="group shrink-0 rounded-2xl">
          <Logo size="md" />
        </Link>

        <form action="/catalogo" role="search" className="hidden min-w-0 md:block">
          <label className="campo-pill mx-auto flex max-w-xl items-center gap-2.5 rounded-full border border-lavender-magenta-200/70 bg-white/85 px-5 py-3 text-sm text-gray-600 shadow-card transition-colors duration-200 ease-boutique hover:border-lavender-magenta-300 focus-within:border-lavender-magenta-300 focus-within:bg-white">
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

        <div className="flex items-center justify-end gap-1.5 sm:gap-2.5">
          <CartDrawer whatsappNumero={config?.whatsapp_numero} />
          <MenuMovil />
        </div>
      </div>

      {/* Buscador siempre visible en celular (en escritorio va en la fila de arriba). */}
      <form action="/catalogo" role="search" className="section-shell pb-3 md:hidden">
        <label className="campo-pill flex items-center gap-2.5 rounded-full border border-lavender-magenta-200/70 bg-white/90 py-1 pl-4 pr-1 shadow-card transition-colors duration-200 ease-boutique focus-within:border-lavender-magenta-300">
          <SearchIcon />
          <span className="sr-only">Buscar productos</span>
          {/* text-base (16px) evita que iPhone haga zoom al tocar el campo */}
          <input
            type="search"
            name="q"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Buscar productos..."
            className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-base text-gray-800 placeholder:text-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-brand-gradient px-4 py-2.5 text-xs font-bold text-white shadow-card transition-transform duration-200 ease-boutique hover:-translate-y-0.5"
          >
            Buscar
          </button>
        </label>
      </form>

      {/* Navegación de escritorio con subrayado animado */}
      <div className="hidden border-t border-lavender-magenta-100/70 md:block">
        <nav aria-label="Principal" className="section-shell flex items-center justify-center gap-8 py-3.5 lg:gap-11">
          <NavLink href="/">Inicio</NavLink>
          <NavLink href="/catalogo">Catálogo</NavLink>
          <NavLink href="/catalogo?oferta=1">Ofertas</NavLink>
          <NavLink href="/catalogo?nuevo=1">Novedades</NavLink>
          <NavLink href="/admin" tono="suave">
            <IconoUsuario className="h-3.5 w-3.5 shrink-0" />
            <span className="ml-1.5">Administración</span>
          </NavLink>
        </nav>
      </div>

      {/* Filete dorado fino bajo la barra */}
      <div aria-hidden="true" className="hairline-gold" />
    </header>
  )
}
