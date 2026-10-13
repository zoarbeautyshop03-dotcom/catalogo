import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import { eliminarProducto, duplicarProducto } from '@/lib/actions/productos'
import DeleteButton from '@/components/admin/DeleteButton'
import RestaurarScroll from '@/components/admin/RestaurarScroll'
import { Icono } from '@/components/admin/Iconos'
import { formatPrecio } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

type SearchParams = { q?: string; page?: string; estado?: string }

const PAGE_SIZE = 25

export default async function ProductosPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createServerSupabase()
  const requestedPage = Math.max(1, Number(searchParams.page ?? '1') || 1)
  const estadoFiltro = searchParams.estado === 'publicado' || searchParams.estado === 'borrador' ? searchParams.estado : undefined

  let query = supabase
    .from('productos')
    .select('id, nombre, slug, precio, estado_inventario, estado_publicacion, activo', { count: 'exact' })
    .order('nombre')

  if (searchParams.q) query = query.ilike('nombre', `%${searchParams.q}%`)
  if (estadoFiltro) query = query.eq('estado_publicacion', estadoFiltro)

  const from = (requestedPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data: productos, error, count } = await query.range(from, to)

  // Conteos para las pestañas (respetando la búsqueda, pero no el filtro de estado).
  let conteoTodos = supabase.from('productos').select('*', { count: 'exact', head: true })
  let conteoPublicados = supabase.from('productos').select('*', { count: 'exact', head: true }).eq('estado_publicacion', 'publicado')
  let conteoBorradores = supabase.from('productos').select('*', { count: 'exact', head: true }).eq('estado_publicacion', 'borrador')
  if (searchParams.q) {
    conteoTodos = conteoTodos.ilike('nombre', `%${searchParams.q}%`)
    conteoPublicados = conteoPublicados.ilike('nombre', `%${searchParams.q}%`)
    conteoBorradores = conteoBorradores.ilike('nombre', `%${searchParams.q}%`)
  }
  const [resTodos, resPublicados, resBorradores] = await Promise.all([conteoTodos, conteoPublicados, conteoBorradores])

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(requestedPage, totalPages)

  // Si alguien entra a una página que ya no existe, volvemos a consultar la última página.
  let productosFinal = productos ?? []
  if (requestedPage !== currentPage) {
    let lastQuery = supabase
      .from('productos')
      .select('id, nombre, slug, precio, estado_inventario, estado_publicacion, activo')
      .order('nombre')
    if (searchParams.q) lastQuery = lastQuery.ilike('nombre', `%${searchParams.q}%`)
    if (estadoFiltro) lastQuery = lastQuery.eq('estado_publicacion', estadoFiltro)
    const last = await lastQuery.range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)
    productosFinal = last.data ?? []
  }

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (searchParams.q) params.set('q', searchParams.q)
    if (estadoFiltro) params.set('estado', estadoFiltro)
    if (page > 1) params.set('page', String(page))
    const queryString = params.toString()
    return `/admin/productos${queryString ? `?${queryString}` : ''}`
  }

  const buildEstadoUrl = (estado?: string) => {
    const params = new URLSearchParams()
    if (searchParams.q) params.set('q', searchParams.q)
    if (estado) params.set('estado', estado)
    const queryString = params.toString()
    return `/admin/productos${queryString ? `?${queryString}` : ''}`
  }

  const currentFrom = (currentPage - 1) * PAGE_SIZE
  const returnTo = buildPageUrl(currentPage)

  return (
    <div>
      <RestaurarScroll />

      <header className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-lavender-magenta-700"><span aria-hidden="true" className="h-px w-6 bg-dorado" />Catálogo</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-lavender-magenta-950">Productos</h1>
            <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">Busca, publica y organiza los productos de la tienda.</p>
          </div>
          <Link href="/admin/productos/nuevo" className="inline-flex w-fit items-center gap-2 rounded-full bg-lavender-magenta-700 px-4 py-2.5 text-sm font-semibold text-white shadow-card transition-all duration-200 ease-boutique hover:-translate-y-0.5 hover:bg-lavender-magenta-800">
            <Icono nombre="mas" className="h-4 w-4" /> Nuevo producto
          </Link>
        </div>
        <div className="hairline-gold mt-5" aria-hidden="true" />
      </header>

      <form className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q}
          placeholder="Buscar por nombre..."
          className="w-full max-w-sm rounded-full border border-rosa-pastel bg-white px-4 py-2 text-sm text-gray-700 transition-colors duration-200 ease-boutique focus:border-lavender-magenta-400 focus:outline-none"
        />
      </form>

      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href={buildEstadoUrl(undefined)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ease-boutique ${
            !estadoFiltro ? 'bg-lavender-magenta-700 text-white' : 'bg-white border border-rosa-pastel text-gray-600 hover:border-lavender-magenta-400 hover:text-lavender-magenta-700'
          }`}
        >
          Todos ({resTodos.count ?? 0})
        </Link>
        <Link
          href={buildEstadoUrl('publicado')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ease-boutique ${
            estadoFiltro === 'publicado' ? 'bg-lavender-magenta-700 text-white' : 'bg-white border border-rosa-pastel text-gray-600 hover:border-lavender-magenta-400 hover:text-lavender-magenta-700'
          }`}
        >
          Publicados ({resPublicados.count ?? 0})
        </Link>
        <Link
          href={buildEstadoUrl('borrador')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ease-boutique ${
            estadoFiltro === 'borrador' ? 'bg-lavender-magenta-700 text-white' : 'bg-white border border-rosa-pastel text-gray-600 hover:border-lavender-magenta-400 hover:text-lavender-magenta-700'
          }`}
        >
          Borradores ({resBorradores.count ?? 0})
        </Link>
      </div>

      <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
        <span>
          {total === 0 ? '0 productos' : `${currentFrom + 1}-${Math.min(currentFrom + PAGE_SIZE, total)} de ${total} productos`}
        </span>
        {totalPages > 1 && <span>Página {currentPage} de {totalPages}</span>}
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error.message}</p>}

      <div className="rounded-boutique-lg border border-lavender-magenta-100 bg-white overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Inventario</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {productosFinal.map((p) => (
                <tr key={p.id} className="border-t border-gray-100 transition-colors duration-150 ease-boutique hover:bg-lavender-magenta-50/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/productos/${p.id}?returnTo=${encodeURIComponent(returnTo)}`} data-preserve-scroll="true" className="font-medium text-gray-800 transition-colors duration-150 ease-boutique hover:text-lavender-magenta-700">
                      {p.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{formatPrecio(p.precio)}</td>
                  <td className="px-4 py-3">
                    {p.estado_inventario === 'disponible' && <span className="inline-flex items-center gap-1.5 text-green-600"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-green-500" />Disponible</span>}
                    {p.estado_inventario === 'ultimas_unidades' && <span className="inline-flex items-center gap-1.5 text-amber-600"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-500" />Últimas</span>}
                    {p.estado_inventario === 'agotado' && <span className="inline-flex items-center gap-1.5 text-red-500"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-red-500" />Agotado</span>}
                  </td>
                  <td className="px-4 py-3">
                    {p.estado_publicacion === 'publicado' ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> Publicado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Borrador
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/productos/${p.id}?returnTo=${encodeURIComponent(returnTo)}`} data-preserve-scroll="true" className="text-xs font-semibold text-lavender-magenta-700 transition-colors duration-150 ease-boutique hover:underline">
                        Editar
                      </Link>
                      <form action={duplicarProducto.bind(null, p.id)}>
                        <button type="submit" className="text-xs text-gray-500 transition-colors duration-150 ease-boutique hover:text-lavender-magenta-700 hover:underline">
                          Duplicar
                        </button>
                      </form>
                      <form action={eliminarProducto.bind(null, p.id)}>
                        <DeleteButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {productosFinal.length === 0 && (
          <p className="text-center text-gray-400 py-10 text-sm">No hay productos que coincidan.</p>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-center gap-2 mt-5" aria-label="Paginación de productos">
          {currentPage > 1 ? (
            <Link
              href={buildPageUrl(currentPage - 1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-rosa-pastel bg-white px-4 py-2 text-sm text-gray-600 transition-colors duration-200 ease-boutique hover:border-lavender-magenta-400 hover:text-lavender-magenta-700"
            >
              <Icono nombre="flechaIzq" className="h-4 w-4" /> Anterior
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm text-gray-300"><Icono nombre="flechaIzq" className="h-4 w-4" /> Anterior</span>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
              .map((page, index, visible) => {
                const previous = visible[index - 1]
                const showDots = previous !== undefined && page - previous > 1
                return (
                  <span key={page} className="flex items-center gap-1">
                    {showDots && <span className="px-1 text-gray-400">…</span>}
                    <Link
                      href={buildPageUrl(page)}
                      aria-current={page === currentPage ? 'page' : undefined}
                      className={`min-w-9 rounded-full px-3 py-2 text-sm text-center transition-colors duration-200 ease-boutique ${
                        page === currentPage
                          ? 'bg-lavender-magenta-700 text-white'
                          : 'bg-white border border-rosa-pastel text-gray-600 hover:border-lavender-magenta-400 hover:text-lavender-magenta-700'
                      }`}
                    >
                      {page}
                    </Link>
                  </span>
                )
              })}
          </div>

          {currentPage < totalPages ? (
            <Link
              href={buildPageUrl(currentPage + 1)}
              className="inline-flex items-center gap-1.5 rounded-full border border-rosa-pastel bg-white px-4 py-2 text-sm text-gray-600 transition-colors duration-200 ease-boutique hover:border-lavender-magenta-400 hover:text-lavender-magenta-700"
            >
              Siguiente <Icono nombre="flecha" className="h-4 w-4" />
            </Link>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm text-gray-300">Siguiente <Icono nombre="flecha" className="h-4 w-4" /></span>
          )}
        </nav>
      )}
    </div>
  )
}
