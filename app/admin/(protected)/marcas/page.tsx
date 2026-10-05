import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import { crearMarca, actualizarMarca, eliminarMarca, aplicarDescuentoMarca, quitarDescuentoMarca } from '@/lib/actions/marcas'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

type SearchParams = { q?: string; page?: string }

const PAGE_SIZE = 25

export default async function MarcasPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createServerSupabase()
  const requestedPage = Math.max(1, Number(searchParams.page ?? '1') || 1)

  let query = supabase.from('marcas').select('*', { count: 'exact' }).order('nombre')
  if (searchParams.q) query = query.ilike('nombre', `%${searchParams.q}%`)

  const from = (requestedPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  const { data, count } = await query.range(from, to)

  const total = count ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(requestedPage, totalPages)

  // Si alguien entra a una página que ya no existe, volvemos a consultar la última página.
  let marcas = data ?? []
  if (requestedPage !== currentPage) {
    let lastQuery = supabase.from('marcas').select('*').order('nombre')
    if (searchParams.q) lastQuery = lastQuery.ilike('nombre', `%${searchParams.q}%`)
    const last = await lastQuery.range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)
    marcas = last.data ?? []
  }

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams()
    if (searchParams.q) params.set('q', searchParams.q)
    if (page > 1) params.set('page', String(page))
    const queryString = params.toString()
    return `/admin/marcas${queryString ? `?${queryString}` : ''}`
  }

  const currentFrom = (currentPage - 1) * PAGE_SIZE

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Marcas</h1>

      <section className="bg-white rounded-2xl shadow-sm p-5 mb-6">
        <h2 className="font-medium text-gray-700 mb-3">Nueva marca</h2>
        <form action={crearMarca} className="flex flex-wrap gap-2">
          <input name="nombre" placeholder="Nombre" required className="rounded-lg border border-rosa-pastel px-3 py-2 text-sm flex-1 min-w-[160px]" />
          <input name="slug" placeholder="slug" required className="rounded-lg border border-rosa-pastel px-3 py-2 text-sm flex-1 min-w-[160px]" />
          <button className="rounded-lg bg-fucsia text-white px-4 py-2 text-sm">Crear</button>
        </form>
      </section>

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
          {total === 0 ? '0 marcas' : `${currentFrom + 1}-${Math.min(currentFrom + PAGE_SIZE, total)} de ${total} marcas`}
        </span>
        {totalPages > 1 && <span>Página {currentPage} de {totalPages}</span>}
      </div>

      <div className="bg-white rounded-2xl shadow-sm divide-y divide-rosa-pastel/40">
        {marcas.map((m) => {
          const actualizarConId = actualizarMarca.bind(null, m.id)
          const eliminarConId = eliminarMarca.bind(null, m.id)
          const aplicarDescuentoConId = aplicarDescuentoMarca.bind(null, m.id)
          const quitarDescuentoConId = quitarDescuentoMarca.bind(null, m.id)
          return (
            <div key={m.id} className="flex flex-col gap-2 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <form action={actualizarConId} className="flex flex-wrap items-center gap-2 flex-1">
                  <input name="nombre" defaultValue={m.nombre} className="rounded-lg border border-rosa-pastel px-3 py-1.5 text-sm flex-1 min-w-[140px]" />
                  <input name="slug" defaultValue={m.slug} className="rounded-lg border border-rosa-pastel px-3 py-1.5 text-sm flex-1 min-w-[140px]" />
                  <label className="flex items-center gap-1 text-xs text-gray-600">
                    <input type="checkbox" name="activa" defaultChecked={m.activa} /> Activa
                  </label>
                  <button className="text-xs text-fucsia hover:underline">Guardar</button>
                </form>
                <form action={eliminarConId}>
                  <DeleteButton />
                </form>
              </div>

              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-rosa-pastel/20 px-3 py-2">
                <span className="text-xs font-medium text-gray-500">Descuento para toda la marca:</span>
                <form action={aplicarDescuentoConId} className="flex items-center gap-1.5">
                  <input
                    type="number"
                    name="porcentaje"
                    min={1}
                    max={99}
                    placeholder="%"
                    required
                    className="w-16 rounded-lg border border-rosa-pastel px-2 py-1 text-sm"
                  />
                  <button className="rounded-lg bg-fucsia px-3 py-1 text-xs font-medium text-white">Aplicar a todos</button>
                </form>
                <form action={quitarDescuentoConId}>
                  <button className="text-xs text-gray-500 hover:text-fucsia hover:underline">Quitar descuento</button>
                </form>
              </div>
            </div>
          )
        })}
        {marcas.length === 0 && <p className="p-4 text-sm text-gray-400">Sin marcas todavía.</p>}
      </div>

      {totalPages > 1 && (
        <nav className="flex flex-wrap items-center justify-center gap-2 mt-5" aria-label="Paginación de marcas">
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
