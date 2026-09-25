import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import BotonVolver from '@/components/BotonVolver'
import { getProductosCatalogo, getCategorias, getMarcas, getImagenesPrincipales } from '@/lib/queries'

const POR_PAGINA = 24

export const revalidate = 60

type SearchParams = {
  categoria?: string
  marca?: string
  min?: string
  max?: string
  q?: string
  page?: string
  nuevo?: string
  oferta?: string
}

function construirUrl(searchParams: SearchParams, cambios: Partial<SearchParams>) {
  const combinado: SearchParams = { ...searchParams, ...cambios }
  if ('categoria' in cambios || 'marca' in cambios || 'q' in cambios) {
    combinado.page = undefined
  }

  const params = new URLSearchParams()
  if (combinado.categoria) params.set('categoria', combinado.categoria)
  if (combinado.marca) params.set('marca', combinado.marca)
  if (combinado.min) params.set('min', combinado.min)
  if (combinado.max) params.set('max', combinado.max)
  if (combinado.q) params.set('q', combinado.q)
  if (combinado.nuevo) params.set('nuevo', combinado.nuevo)
  if (combinado.oferta) params.set('oferta', combinado.oferta)
  if (combinado.page && combinado.page !== '1') params.set('page', combinado.page)

  const qs = params.toString()
  return `/catalogo${qs ? `?${qs}` : ''}`
}

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

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default async function CatalogoPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Number(searchParams.page ?? '1')
  const { productos, total } = await getProductosCatalogo({
    categoriaSlug: searchParams.categoria,
    marcaSlug: searchParams.marca,
    precioMin: searchParams.min ? Number(searchParams.min) : undefined,
    precioMax: searchParams.max ? Number(searchParams.max) : undefined,
    busqueda: searchParams.q,
    nuevo: searchParams.nuevo === '1',
    oferta: searchParams.oferta === '1',
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

  return (
    <div className="relative overflow-hidden pb-14 pt-5 sm:pb-20 sm:pt-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] bg-[radial-gradient(circle_at_12%_8%,rgba(255,148,244,0.15),transparent_28%),radial-gradient(circle_at_90%_22%,rgba(255,206,252,0.38),transparent_30%)]" />
      <div className="pointer-events-none absolute right-[-110px] top-[560px] h-80 w-80 rounded-full bg-lavender-magenta-200/15 blur-3xl" />
      <div className="pointer-events-none absolute left-[-120px] top-[1050px] h-96 w-96 rounded-full bg-lavender-magenta-100/40 blur-3xl" />

      <div className="section-shell relative">
        <BotonVolver label="Volver" />

        <section className="catalog-hero mt-3 overflow-hidden rounded-[34px] px-5 py-7 ring-1 ring-lavender-magenta-100/90 sm:px-8 sm:py-9 lg:px-10 lg:py-11">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-lavender-magenta-200/45 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/80 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div>
              <span className="eyebrow"><SparkleIcon /> Colección Zoar</span>
              <h1 className="mt-4 max-w-xl font-display text-4xl font-bold leading-[0.98] tracking-tight text-lavender-magenta-950 sm:text-5xl">
                Todo lo que buscas,<br className="hidden sm:block" /> en un solo lugar.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                Descubre productos de belleza, cuidado capilar y más. Filtra por categoría o marca y encuentra tus favoritos sin complicarte.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5 text-[11px] font-semibold text-lavender-magenta-800">
                <span className="rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-white/80">✦ {categorias.length} categorías</span>
                <span className="rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-white/80">♡ {marcas.length} marcas</span>
                <span className="rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-white/80">✓ Compra por WhatsApp</span>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[27px] border border-white/90 bg-white/90 p-2 shadow-[0_20px_50px_rgba(81,1,65,0.10)] backdrop-blur-md">
                <form action="/catalogo" className="flex flex-col gap-2 sm:flex-row">
                  <label className="flex min-w-0 flex-1 items-center gap-3 rounded-[20px] bg-lavender-magenta-50/80 px-4 py-3.5 text-gray-500 ring-1 ring-lavender-magenta-100/80 focus-within:ring-2 focus-within:ring-lavender-magenta-300/80">
                    <SearchIcon />
                    <span className="sr-only">Buscar productos</span>
                    <input
                      type="text"
                      name="q"
                      defaultValue={searchParams.q}
                      placeholder="Busca por nombre..."
                      className="min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none"
                    />
                  </label>
                  <button className="rounded-[20px] bg-lavender-magenta-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-lavender-magenta-600/20 hover:-translate-y-0.5 hover:bg-lavender-magenta-700">
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

        <section id="filtros-catalogo" className="catalog-filter-card mt-6 rounded-[30px] bg-white/[0.88] p-4 ring-1 ring-lavender-magenta-100/90 sm:mt-7 sm:p-6">
          <div className="flex flex-col gap-4 border-b border-lavender-magenta-100/80 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow px-2.5 py-1 text-[9px]">Encuentra más rápido</span>
              <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-lavender-magenta-950 sm:text-[28px]">Filtra tu próxima compra</h2>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-500 sm:text-sm">Todas las opciones están aquí, ordenadas para que puedas verlas sin barras ocultas ni desplazamientos laterales.</p>
            </div>
            {hayFiltros && (
              <Link
                href="/catalogo"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-lavender-magenta-50 px-4 py-2.5 text-xs font-bold text-lavender-magenta-700 ring-1 ring-lavender-magenta-100 hover:-translate-y-0.5 hover:bg-lavender-magenta-100"
              >
                Limpiar filtros
                <span aria-hidden="true">×</span>
              </Link>
            )}
          </div>

          <div className="pt-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-lavender-magenta-50 text-lavender-magenta-700 ring-1 ring-lavender-magenta-100">
                <SparkleIcon />
              </span>
              <div>
                <p className="text-sm font-bold text-lavender-magenta-950">Categorías</p>
                <p className="text-[11px] text-gray-400">{categorias.length} opciones disponibles</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2.5">
              <a
                href={construirUrl(searchParams, { categoria: undefined })}
                className={`catalog-chip gap-2 px-4 py-2.5 text-xs ${
                  !searchParams.categoria
                    ? 'catalog-chip-active'
                    : 'catalog-chip-muted'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                Todas
              </a>
              {categorias.map((c) => (
                <a
                  key={c.id}
                  href={construirUrl(searchParams, { categoria: c.slug })}
                  className={`catalog-chip max-w-full justify-between gap-3 px-4 py-2.5 text-xs ${
                    searchParams.categoria === c.slug
                      ? 'catalog-chip-active'
                      : 'catalog-chip-muted'
                  }`}
                >
                  <span className="truncate">{c.nombre}</span>
                  <ArrowIcon />
                </a>
              ))}
            </div>
          </div>

          {marcas.length > 0 && (
            <div className="mt-7 border-t border-lavender-magenta-100/80 pt-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-lavender-magenta-950 text-white">
                    <TagIcon />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-lavender-magenta-950">Marcas</p>
                    <p className="text-[11px] text-gray-400">{marcas.length} marcas disponibles</p>
                  </div>
                </div>
                <span className="hidden rounded-full bg-lavender-magenta-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-lavender-magenta-700 ring-1 ring-lavender-magenta-100 sm:inline-flex">A–Z</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={construirUrl(searchParams, { marca: undefined })}
                  className={`catalog-brand-chip ${!searchParams.marca ? 'catalog-brand-chip-active' : ''}`}
                >
                  <span className="catalog-brand-initial">A</span>
                  <span className="truncate">Todas</span>
                </a>
                {marcas.map((m) => (
                  <a
                    key={m.id}
                    href={construirUrl(searchParams, { marca: m.slug })}
                    className={`catalog-brand-chip ${searchParams.marca === m.slug ? 'catalog-brand-chip-active' : ''}`}
                    title={`Filtrar por ${m.nombre}`}
                  >
                    <span className="catalog-brand-initial">{m.nombre.charAt(0).toUpperCase()}</span>
                    <span className="truncate">{m.nombre}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="mt-7 flex flex-col gap-4 border-b border-lavender-magenta-100/80 pb-5 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-2xl font-bold tracking-tight text-lavender-magenta-950">{total} {total === 1 ? 'producto' : 'productos'}</p>
              {searchParams.oferta === '1' && <span className="catalog-status-pill">Ofertas</span>}
              {searchParams.nuevo === '1' && <span className="catalog-status-pill">Novedades</span>}
            </div>
            {(categoriaActual || marcaActual || searchParams.q) && (
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {searchParams.q && <span className="catalog-active-filter">“{searchParams.q}”</span>}
                {categoriaActual && <span className="catalog-active-filter">{categoriaActual}</span>}
                {marcaActual && <span className="catalog-active-filter">{marcaActual}</span>}
              </div>
            )}
          </div>
          <p className="text-xs font-medium text-gray-400">Página {page} de {totalPaginas}</p>
        </div>

        <div className="catalog-product-grid mt-6">
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
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/90 p-1.5 shadow-[0_12px_30px_rgba(81,1,65,0.07)] ring-1 ring-lavender-magenta-100">
              <Link
                href={construirUrl(searchParams, { page: String(Math.max(1, page - 1)) })}
                aria-disabled={page <= 1}
                tabIndex={page <= 1 ? -1 : undefined}
                className={`flex h-10 items-center gap-1.5 rounded-full px-4 text-xs font-bold ${page <= 1 ? 'pointer-events-none text-gray-300' : 'text-lavender-magenta-700 hover:bg-lavender-magenta-50'}`}
              >
                ← <span className="hidden sm:inline">Anterior</span>
              </Link>
              <span className="flex h-10 min-w-11 items-center justify-center rounded-full bg-lavender-magenta-600 px-3 text-xs font-bold text-white shadow-md shadow-lavender-magenta-600/20">
                {page}
              </span>
              <Link
                href={construirUrl(searchParams, { page: String(Math.min(totalPaginas, page + 1)) })}
                aria-disabled={page >= totalPaginas}
                tabIndex={page >= totalPaginas ? -1 : undefined}
                className={`flex h-10 items-center gap-1.5 rounded-full px-4 text-xs font-bold ${page >= totalPaginas ? 'pointer-events-none text-gray-300' : 'text-lavender-magenta-700 hover:bg-lavender-magenta-50'}`}
              >
                <span className="hidden sm:inline">Siguiente</span> →
              </Link>
            </div>
          </nav>
        )}

        {total === 0 && (
          <div className="premium-card mt-8 overflow-hidden px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-lavender-magenta-50 text-lavender-magenta-600 ring-1 ring-lavender-magenta-100">
              <SearchIcon />
            </div>
            <p className="mt-5 font-display text-2xl text-lavender-magenta-950">No encontramos ese producto</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">Prueba con otra palabra o cambia la categoría para seguir explorando nuestra colección.</p>
            <Link href="/catalogo" className="mt-6 inline-flex rounded-full bg-lavender-magenta-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-lavender-magenta-600/15 hover:-translate-y-0.5 hover:bg-lavender-magenta-700">
              Ver todo el catálogo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
