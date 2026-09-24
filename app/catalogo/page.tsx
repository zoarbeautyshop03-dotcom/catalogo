import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import BotonVolver from '@/components/BotonVolver'
import { getProductosCatalogo, getCategorias, getMarcas, getImagenesPrincipales } from '@/lib/queries'

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
  })
  const [categorias, marcas] = await Promise.all([getCategorias(), getMarcas()])
  const imagenes = await getImagenesPrincipales(productos.map((p) => p.id))

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
        <a href="/catalogo" className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${!searchParams.categoria ? 'bg-lavender-magenta-600 text-white' : 'bg-white text-gray-600 ring-1 ring-lavender-magenta-100 hover:bg-lavender-magenta-50'}`}>
          Todas
        </a>
        {categorias.map((c) => (
          <a key={c.id} href={`/catalogo?categoria=${c.slug}`} className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold ${searchParams.categoria === c.slug ? 'bg-lavender-magenta-600 text-white' : 'bg-white text-gray-600 ring-1 ring-lavender-magenta-100 hover:bg-lavender-magenta-50'}`}>
            {c.nombre}
          </a>
        ))}
      </div>

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

      {productos.length === 0 && (
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
