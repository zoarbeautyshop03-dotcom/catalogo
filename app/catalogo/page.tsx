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
  // Si cambia el filtro (categoría, marca o búsqueda), siempre volvemos a la página 1.
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

  const categoriaActual = categorias.find((c) => c.slug === searchParams.categoria)?.nombre
  const marcaActual = marcas.find((m) => m.slug === searchParams.marca)?.nombre

  return (
    <div className="section-shell py-7 sm:py-10">
      <BotonVolver label="Volver" />
      <div className="overflow-hidden rounded-[30px] bg-gradient-to-br from-white to-lavender-magenta-50 px-5 py-8 ring-1 ring-lavender-magenta-100 sm:px-8 sm:py-10">
        <span className="eyebrow">Colección Zoar</span>
        <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-lavender-magenta-950">Catálogo</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Explora por categoría, busca por nombre y arma tu pedido a tu ritmo.
            </p>
          </div>
          <form action="/catalogo" className="flex w-full max-w-xl gap-2">
            <input
              type="text"
              name="q"
              defaultValue={searchParams.q}
              placeholder="Buscar productos..."
              className="min-w-0 flex-1 rounded-full border border-lavender-magenta-100 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-gray-400 focus:border-lavender-magenta-300 focus:outline-none"
            />
            <button className="rounded-full bg-lavender-magenta-600 px-5 py-3 text-sm font-semibold text-white hover:bg-lavender-magenta-700">Buscar</button>
          </form>
        </div>
      </div>

      <div className="mt-7 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <a href={construirUrl(searchParams, { categoria: undefined })} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${!searchParams.categoria ? 'bg-lavender-magenta-600 text-white' : 'bg-white text-gray-600 ring-1 ring-lavender-magenta-100 hover:bg-lavender-magenta-50'}`}>
          Todas
        </a>
        {categorias.map((c) => (
          <a key={c.id} href={construirUrl(searchParams, { categoria: c.slug })} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${searchParams.categoria === c.slug ? 'bg-lavender-magenta-600 text-white' : 'bg-white text-gray-600 ring-1 ring-lavender-magenta-100 hover:bg-lavender-magenta-50'}`}>
            {c.nombre}
          </a>
        ))}
      </div>

      {marcas.length > 0 && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Marca:</span>
          <a href={construirUrl(searchParams, { marca: undefined })} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${!searchParams.marca ? 'bg-lavender-magenta-950 text-white' : 'bg-white text-gray-600 ring-1 ring-lavender-magenta-100 hover:bg-lavender-magenta-50'}`}>
            Todas
          </a>
          {marcas.map((m) => (
            <a key={m.id} href={construirUrl(searchParams, { marca: m.slug })} className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold ${searchParams.marca === m.slug ? 'bg-lavender-magenta-950 text-white' : 'bg-white text-gray-600 ring-1 ring-lavender-magenta-100 hover:bg-lavender-magenta-50'}`}>
              {m.nombre}
            </a>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 border-b border-lavender-magenta-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-lavender-magenta-950">{total} {total === 1 ? 'producto' : 'productos'}</p>
          {(categoriaActual || marcaActual || searchParams.q) && (
            <p className="mt-1 text-xs text-gray-400">
              Filtro{searchParams.q ? `: “${searchParams.q}”` : ''}{categoriaActual ? ` · ${categoriaActual}` : ''}{marcaActual ? ` · ${marcaActual}` : ''}
            </p>
          )}
        </div>
        <Link href="/catalogo" className="text-xs font-semibold text-lavender-magenta-700 hover:text-lavender-magenta-900">Limpiar filtros</Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} imagenUrl={imagenes[p.id]} />
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <Link
            href={construirUrl(searchParams, { page: String(page - 1) })}
            aria-disabled={page <= 1}
            tabIndex={page <= 1 ? -1 : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-lavender-magenta-100 transition ${
              page <= 1
                ? 'pointer-events-none text-gray-300'
                : 'text-lavender-magenta-700 hover:bg-lavender-magenta-50'
            }`}
          >
            ← Anterior
          </Link>
          <span className="text-sm font-medium text-gray-500">
            Página {page} de {totalPaginas}
          </span>
          <Link
            href={construirUrl(searchParams, { page: String(page + 1) })}
            aria-disabled={page >= totalPaginas}
            tabIndex={page >= totalPaginas ? -1 : undefined}
            className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-lavender-magenta-100 transition ${
              page >= totalPaginas
                ? 'pointer-events-none text-gray-300'
                : 'text-lavender-magenta-700 hover:bg-lavender-magenta-50'
            }`}
          >
            Siguiente →
          </Link>
        </div>
      )}

      {total === 0 && (
        <div className="premium-card mt-8 px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lavender-magenta-50 text-2xl text-lavender-magenta-500">✦</div>
          <p className="mt-4 font-display text-2xl text-lavender-magenta-950">No encontramos ese producto</p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">Prueba con otra palabra o cambia la categoría para seguir explorando.</p>
          <Link href="/catalogo" className="mt-5 inline-flex rounded-full bg-lavender-magenta-600 px-5 py-3 text-sm font-semibold text-white hover:bg-lavender-magenta-700">Ver todo el catálogo</Link>
        </div>
      )}
    </div>
  )
}
