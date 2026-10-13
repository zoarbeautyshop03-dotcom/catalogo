import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import BotonVolver from '@/components/BotonVolver'
import MarcasFiltro from '@/components/MarcasFiltro'
import ScrollAlPaginar from '@/components/ScrollAlPaginar'
import FiltrosMovil from '@/components/FiltrosMovil'
import OrdenarSelect from '@/components/OrdenarSelect'
import { construirUrl, type SearchParams } from '@/lib/catalogo-url'
import { getProductosCatalogo, getCategorias, getMarcas, getImagenesPrincipales } from '@/lib/queries'

const POR_PAGINA = 24

export const revalidate = 60

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <circle cx="11" cy="11" r="6.8" />
      <path d="m16.2 16.2 4 4" strokeLinecap="round" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4L12 3Z" strokeLinejoin="round" />
      <path d="m18.8 15.2.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z" strokeLinejoin="round" />
    </svg>
  )
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 5.5V10l8.8 8.8a1.8 1.8 0 0 0 2.5 0l3.5-3.5a1.8 1.8 0 0 0 0-2.5L10 4H5.5A1.5 1.5 0 0 0 4 5.5Z" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.7" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.7" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.7" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.7" />
    </svg>
  )
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M12 20s-7-4.3-7-9.2A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7 2.8C19 15.7 12 20 12 20Z" strokeLinejoin="round" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M20 11.5a7.5 7.5 0 0 1-10.9 6.7L5 19l.8-3.9A7.5 7.5 0 1 1 20 11.5Z" strokeLinejoin="round" />
      <path d="M9 11.5h.01M12 11.5h.01M15 11.5h.01" strokeLinecap="round" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="m14.5 6-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronRightIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="m9.5 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <path d="m5 12.5 4.5 4.5L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  )
}

export default async function CatalogoPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Number(searchParams.page ?? '1')
  const orden = searchParams.orden === 'precio-asc' || searchParams.orden === 'precio-desc' ? searchParams.orden : 'nombre'
  const { productos, total } = await getProductosCatalogo({
    categoriaSlug: searchParams.categoria,
    marcaSlug: searchParams.marca,
    precioMin: searchParams.min ? Number(searchParams.min) : undefined,
    precioMax: searchParams.max ? Number(searchParams.max) : undefined,
    busqueda: searchParams.q,
    nuevo: searchParams.nuevo === '1',
    oferta: searchParams.oferta === '1',
    orden,
    page,
    porPagina: POR_PAGINA,
  })

  const [categorias, marcas] = await Promise.all([getCategorias(), getMarcas()])
  const imagenes = await getImagenesPrincipales(productos.map((p) => p.id))
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA))
  const marcaPorId = new Map(marcas.map((m) => [m.id, m.nombre]))

  const categoriaActual = categorias.find((c) => c.slug === searchParams.categoria)?.nombre
  const marcaActual = marcas.find((m) => m.slug === searchParams.marca)?.nombre
  const hayFiltros = Boolean(searchParams.q || categoriaActual || marcaActual || searchParams.nuevo || searchParams.oferta)
  const cantidadActivos = [categoriaActual, marcaActual, searchParams.nuevo === '1', searchParams.oferta === '1'].filter(Boolean).length

  // Mismo contenido para la tarjeta de escritorio y para el panel del celular.
  // En el panel (envolver = true) las categorías se acomodan en varias filas en
  // vez de deslizarse hacia los lados.
  const bloqueCategorias = (
    <details open className="filtro-seccion mt-6 border-t border-lavender-magenta-100/70 pt-5">
      <summary className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender-magenta-50 text-lavender-magenta-700 ring-1 ring-lavender-magenta-100">
            <GridIcon />
          </span>
          <span>
            <span className="block font-display text-sm font-bold text-lavender-magenta-950">Categorías</span>
            <span className="block text-[11px] text-gray-500">{categorias.length} opciones</span>
          </span>
        </span>
        <ChevronRightIcon className="filtro-chevron h-4 w-4 shrink-0 text-lavender-magenta-400" />
      </summary>

      <nav className="mt-4 space-y-1" aria-label="Categorías">
        <a
          href={construirUrl(searchParams, { categoria: undefined })}
          aria-current={!searchParams.categoria ? 'true' : undefined}
          className={`flex items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition duration-200 ease-boutique ${
            !searchParams.categoria
              ? 'bg-brand-gradient text-white shadow-card'
              : 'text-gray-700 hover:bg-lavender-magenta-50 hover:text-lavender-magenta-800'
          }`}
        >
          <span className="truncate">Todas las categorías</span>
          {!searchParams.categoria && <CheckIcon className="h-4 w-4 shrink-0" />}
        </a>
        {categorias.map((c) => (
          <a
            key={c.id}
            href={construirUrl(searchParams, { categoria: c.slug })}
            aria-current={searchParams.categoria === c.slug ? 'true' : undefined}
            className={`flex items-center justify-between gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition duration-200 ease-boutique ${
              searchParams.categoria === c.slug
                ? 'bg-brand-gradient text-white shadow-card'
                : 'text-gray-700 hover:bg-lavender-magenta-50 hover:text-lavender-magenta-800'
            }`}
          >
            <span className="truncate">{c.nombre}</span>
            {searchParams.categoria === c.slug && <CheckIcon className="h-4 w-4 shrink-0" />}
          </a>
        ))}
      </nav>
    </details>
  )

  const bloqueMarcas = (
    <>
      {marcas.length > 0 && (
        <details open={Boolean(searchParams.marca)} className="filtro-seccion mt-6 border-t border-lavender-magenta-100/70 pt-5">
          <summary className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender-magenta-50 text-lavender-magenta-700 ring-1 ring-lavender-magenta-100">
                <TagIcon />
              </span>
              <span>
                <span className="block font-display text-sm font-bold text-lavender-magenta-950">Marcas</span>
                <span className="block text-[11px] text-gray-500">{marcas.length} marcas</span>
              </span>
            </span>
            <ChevronRightIcon className="filtro-chevron h-4 w-4 shrink-0 text-lavender-magenta-400" />
          </summary>

          <MarcasFiltro marcas={marcas} searchParams={searchParams} />
        </details>
      )}
    </>
  )

  return (
    <div className="relative pb-14 pt-5 sm:pb-20 sm:pt-7">
      {/* Fondo decorativo de la página (recortado para evitar desbordes). */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-page-wash" />
        <div className="absolute -left-32 top-[900px] h-96 w-96 rounded-full bg-lavender-magenta-100/40 blur-3xl" />
        <div className="absolute -right-24 top-[420px] h-80 w-80 rounded-full bg-dorado-100/40 blur-3xl" />
      </div>

      <div className="section-shell relative">
        <BotonVolver label="Volver" />

        {/* Cabecera compacta (celular) */}
        <header className="mt-1 sm:hidden">
          <p className="eyebrow">Colección Zoar</p>
          <h1 className="mt-3 font-display text-display-sm font-bold text-lavender-magenta-950">Catálogo</h1>
          <p className="mt-2 text-sm leading-6 text-gray-600">Agrega varios productos y envía un solo pedido por WhatsApp.</p>
          <div className="hairline-gold mt-5" />
        </header>

        {/* Cabecera editorial (tablet y escritorio) */}
        <section className="catalog-hero relative mt-4 hidden overflow-hidden rounded-boutique-lg px-6 py-8 ring-1 ring-lavender-magenta-100/80 sm:block sm:px-8 sm:py-10 lg:px-11 lg:py-12">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-lavender-magenta-200/45 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-64 w-64 rounded-full bg-dorado-200/30 blur-3xl" aria-hidden="true" />

          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10">
            <div className="reveal-up">
              <p className="eyebrow">Colección Zoar</p>
              <h1 className="mt-4 max-w-xl font-display text-display-md font-bold text-lavender-magenta-950">
                Todo lo que buscas,<br className="hidden sm:block" /> en un solo lugar.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Descubre productos de belleza, cuidado capilar y más. Filtra por categoría o marca y encuentra tus favoritos sin complicarte.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5 text-[11px] font-semibold text-lavender-magenta-800">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-white/80 shadow-soft-card">
                  <GridIcon />
                  {categorias.length} categorías
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-white/80 shadow-soft-card">
                  <HeartIcon />
                  {marcas.length} marcas
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-white/80 shadow-soft-card">
                  <ChatIcon />
                  Compra por WhatsApp
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-boutique border border-white/90 bg-white/95 p-2 shadow-float">
                <form action="/catalogo" className="flex flex-col gap-2 sm:flex-row">
                  <label className="campo-pill flex min-w-0 flex-1 items-center gap-3 rounded-full bg-lavender-magenta-50/80 px-4 py-3 text-gray-600 ring-1 ring-lavender-magenta-100/80">
                    <SearchIcon />
                    <span className="sr-only">Buscar productos</span>
                    <input
                      type="text"
                      name="q"
                      defaultValue={searchParams.q}
                      placeholder="Busca por nombre..."
                      className="min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
                    />
                  </label>
                  <button className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-bold text-white shadow-lg shadow-lavender-magenta-600/20 transition ease-boutique hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-magenta-400 focus-visible:ring-offset-2">
                    <SearchIcon />
                    Buscar
                  </button>
                </form>
              </div>
              <div className="mt-3 flex items-center gap-2 px-2 text-[11px] font-medium text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-lavender-magenta-500" />
                Explora, compara y agrega varios productos al mismo pedido.
              </div>
            </div>
          </div>
        </section>

        {/* Panel de filtros + resultados */}
        <div className="mt-7 grid gap-7 lg:mt-9 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start lg:gap-9">
          <aside
            id="filtros-catalogo"
            className="catalog-filter-card scroll-brand hidden rounded-boutique bg-white/[0.9] p-5 ring-1 ring-lavender-magenta-100/90 sm:block sm:p-6 lg:sticky lg:top-24 lg:max-h-[calc(100dvh_-_7rem)] lg:overflow-y-auto"
          >
            <div className="border-b border-lavender-magenta-100/70 pb-5">
              <p className="eyebrow">Encuentra más rápido</p>
              <h2 className="mt-3 font-display text-display-sm font-bold text-lavender-magenta-950">Filtra tu próxima compra</h2>
              <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
                Abre una sección y elige lo que buscas. Todo queda a la vista en una sola lista.
              </p>
              {hayFiltros && (
                <Link
                  href="/catalogo"
                  className="mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-lavender-magenta-50 px-4 py-2.5 text-xs font-bold text-lavender-magenta-700 ring-1 ring-lavender-magenta-100 transition ease-boutique hover:-translate-y-0.5 hover:bg-lavender-magenta-100"
                >
                  Limpiar filtros
                  <XIcon />
                </Link>
              )}
            </div>

            {bloqueCategorias}

            {bloqueMarcas}
          </aside>

          <div className="min-w-0">
            <div className="flex flex-col-reverse gap-4 border-b border-lavender-magenta-100/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                  <p className="font-display text-display-sm font-bold tracking-tight text-lavender-magenta-950">
                    {total} {total === 1 ? 'producto' : 'productos'}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    {searchParams.oferta === '1' && <span className="catalog-status-pill">Ofertas</span>}
                    {searchParams.nuevo === '1' && <span className="catalog-status-pill">Novedades</span>}
                  </div>
                </div>
                {(categoriaActual || marcaActual || searchParams.q) && (
                  <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
                    {searchParams.q && <span className="catalog-active-filter">“{searchParams.q}”</span>}
                    {categoriaActual && <span className="catalog-active-filter">{categoriaActual}</span>}
                    {marcaActual && <span className="catalog-active-filter">{marcaActual}</span>}
                  </div>
                )}
                {totalPaginas > 1 && (
                  <p className="mt-2 text-xs font-medium text-gray-500">
                    Página {page} de {totalPaginas}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <FiltrosMovil cantidadActivos={cantidadActivos} hayFiltros={hayFiltros} total={total}>
                  {bloqueCategorias}
                  {bloqueMarcas}
                </FiltrosMovil>
                <OrdenarSelect searchParams={searchParams} valorActual={orden} />
              </div>
            </div>

            <ScrollAlPaginar targetId="resultados" />
            <div id="resultados" className="catalog-product-grid mt-6 scroll-mt-28">
              {productos.map((p) => (
                <ProductCard
                  key={p.id}
                  producto={p}
                  imagenUrl={imagenes[p.id]}
                  marcaNombre={p.marca_id ? marcaPorId.get(p.marca_id) : undefined}
                />
              ))}
            </div>

            {totalPaginas > 1 && (
              <nav className="mt-11 flex items-center justify-center" aria-label="Paginación del catálogo">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 p-1.5 shadow-card ring-1 ring-lavender-magenta-100">
                  <Link
                    href={construirUrl(searchParams, { page: String(Math.max(1, page - 1)) })}
                    scroll={false}
                    aria-disabled={page <= 1}
                    tabIndex={page <= 1 ? -1 : undefined}
                    className={`flex h-10 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition ease-boutique ${page <= 1 ? 'pointer-events-none text-gray-500' : 'text-lavender-magenta-700 hover:bg-lavender-magenta-50'}`}
                  >
                    <ChevronLeftIcon />
                    <span className="hidden sm:inline">Anterior</span>
                  </Link>
                  <span className="flex h-10 min-w-11 items-center justify-center rounded-full bg-brand-gradient px-3 text-xs font-bold text-white shadow-md shadow-lavender-magenta-600/20">
                    {page}
                  </span>
                  <Link
                    href={construirUrl(searchParams, { page: String(Math.min(totalPaginas, page + 1)) })}
                    scroll={false}
                    aria-disabled={page >= totalPaginas}
                    tabIndex={page >= totalPaginas ? -1 : undefined}
                    className={`flex h-10 items-center gap-1.5 rounded-full px-4 text-xs font-bold transition ease-boutique ${page >= totalPaginas ? 'pointer-events-none text-gray-500' : 'text-lavender-magenta-700 hover:bg-lavender-magenta-50'}`}
                  >
                    <span className="hidden sm:inline">Siguiente</span>
                    <ChevronRightIcon />
                  </Link>
                </div>
              </nav>
            )}

            {total === 0 && (
              <div className="card-editorial reveal-on-scroll mt-8 overflow-hidden px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-boutique bg-lavender-magenta-50 text-lavender-magenta-700 ring-1 ring-lavender-magenta-100">
                  <SearchIcon />
                </div>
                <p className="mt-5 font-display text-display-sm text-lavender-magenta-950">No encontramos ese producto</p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Prueba con otra palabra o cambia la categoría para seguir explorando nuestra colección.
                </p>
                <div className="hairline-gold mx-auto mt-7 max-w-xs" />
                <Link
                  href="/catalogo"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-bold text-white shadow-lg shadow-lavender-magenta-600/15 transition ease-boutique hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-magenta-400 focus-visible:ring-offset-2"
                >
                  <SparkleIcon />
                  Ver todo el catálogo
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
