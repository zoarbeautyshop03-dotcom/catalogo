import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import { eliminarProducto, duplicarProducto } from '@/lib/actions/productos'
import DeleteButton from '@/components/admin/DeleteButton'
import { formatPrecio } from '@/lib/whatsapp'

export const dynamic = 'force-dynamic'

type SearchParams = { q?: string }

export default async function ProductosPage({ searchParams }: { searchParams: SearchParams }) {
  const supabase = createServerSupabase()
  let query = supabase
    .from('productos')
    .select('id, nombre, slug, precio, estado_inventario, estado_publicacion, activo')
    .order('nombre')
    .limit(200)

  if (searchParams.q) query = query.ilike('nombre', `%${searchParams.q}%`)

  const { data: productos, error } = await query

  return (
    <div>
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

      {error && <p className="text-red-500 text-sm">{error.message}</p>}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
            {(productos ?? []).map((p) => (
              <tr key={p.id} className="border-t border-rosa-pastel/40">
                <td className="px-4 py-2">
                  <Link href={`/admin/productos/${p.id}`} className="text-gray-800 hover:text-fucsia">
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
                    <Link href={`/admin/productos/${p.id}`} className="text-xs text-fucsia hover:underline">
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
        {(productos ?? []).length === 0 && (
          <p className="text-center text-gray-400 py-10 text-sm">No hay productos que coincidan.</p>
        )}
      </div>
    </div>
  )
}
