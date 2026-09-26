import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import { eliminarProducto, duplicarProducto } from '@/lib/actions/productos'
import DeleteButton from '@/components/admin/DeleteButton'
import RestaurarScroll from '@/components/admin/RestaurarScroll'
import { formatPrecio } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

type SearchParams = { q?: string; page?: string }

const PAGE_SIZE = 25

export default async function ProductosPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createServerSupabase()
  const requestedPage = Math.max(1, Number(searchParams.page ?? '1') || 1)

  let query = supabase
    .from('productos')
    .select('id, nombre, slug, precio, estado_inventario, estado_publicacion, activo', { count: 'exact' })
    .order('nombre')

  if (searchParams.q) query = query.ilike('nombre', `%${searchParams.q}%`)

  const from = (requestedPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data: productos, error, count } = await query.range(from, to)

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
    const last = await lastQuery.range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)
    productosFinal = last.data ?? []
  }

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (searchParams.q) params.set('q', searchParams.q)
    if (page > 1) params.set('page', String(page))
    const queryString = params.toString()
    return `/admin/productos${queryString ? `?${queryString}` : ''}`
  }

  const currentFrom = (currentPage - 1) * PAGE_SIZE
  const returnTo = buildPageUrl(currentPage)

  return (
    <div>
      <RestaurarScroll />

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Productos</h1>
        <Link href="/admin/productos/nuevo" className="rounded-full bg-fucsia text-white px-4 py-2 text-sm">
          + Nuevo producto
        </Link>
      </div>

      <form className="mb-4">
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q}
          placeholder="Buscar por nombre..."
          className="w-full max-w-sm rounded-full border border-rosa-pastel px-4 py-2 text-sm"
        />
      </form>

      <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
        <span>
          {total === 0 ? '0 productos' : `${currentFrom + 1}-${Math.min(currentFrom + PAGE_SIZE, total)} de ${total} productos`}
        </span>
        {totalPages > 1 && <span>Página {currentPage} de {totalPages}</span>}
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error.message}</p>}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-rosa-pastel/30 text-left text-gray-600">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Inventario</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {productosFinal.map((p) => (
                <tr key={p.id} className="border-t border-rosa-pastel/40">
                  <td className="px-4 py-2">
                    <Link href={`/admin/productos/${p.id}?returnTo=${encodeURIComponent(returnTo)}`} data-preserve-scroll="true" className="text-gray-800 hover:text-fucsia">
                      {p.nombre}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{formatPrecio(p.precio)}</td>
                  <td className="px-4 py-2">
                    {p.estado_inventario === 'disponible' && <span className="text-green-600">🟢 Disponible</span>}
                    {p.estado_inventario === 'ultimas_unidades' && <span className="text-amber-600">🟡 Últimas</span>}
                    {p.estado_inventario === 'agotado' && <span className="text-red-500">🔴 Agotado</span>}
                  </td>
                  <td className="px-4 py-2 capitalize">{p.estado_publicacion}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/productos/${p.id}?returnTo=${encodeURIComponent(returnTo)}`} data-preserve-scroll="true" className="text-xs text-fucsia hover:underline">
                        Editar
                      </Link>
                      <form action={duplicarProducto.bind(null, p.id)}>
                        <button type="submit" className="text-xs text-gray-500 hover:underline">
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
              className="rounded-full border border-rosa-pastel bg-white px-4 py-2 text-sm text-gray-600 hover:border-fucsia hover:text-fucsia transition"
            >
              ← Anterior
            </Link>
          ) : (
            <span className="rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm text-gray-300">← Anterior</span>
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
                      className={`min-w-9 rounded-full px-3 py-2 text-sm text-center transition ${
                        page === currentPage
                          ? 'bg-fucsia text-white'
                          : 'bg-white border border-rosa-pastel text-gray-600 hover:border-fucsia hover:text-fucsia'
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
              className="rounded-full border border-rosa-pastel bg-white px-4 py-2 text-sm text-gray-600 hover:border-fucsia hover:text-fucsia transition"
            >
              Siguiente →
            </Link>
          ) : (
            <span className="rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm text-gray-300">Siguiente →</span>
          )}
        </nav>
      )}
    </div>
  )
}
