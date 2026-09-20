import { createServerSupabase } from '@/lib/supabase/server'
import { crearCategoria, actualizarCategoria, eliminarCategoria } from '@/lib/actions/categorias'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function CategoriasPage() {
  const supabase = createServerSupabase()
  const { data: categorias } = await supabase.from('categorias').select('*').order('orden')

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Categorías</h1>

      <section className="bg-white rounded-2xl shadow-sm p-5 mb-6">
        <h2 className="font-medium text-gray-700 mb-3">Nueva categoría</h2>
        <form action={crearCategoria} className="flex flex-wrap gap-2">
          <input name="nombre" placeholder="Nombre" required className="rounded-lg border border-rosa-pastel px-3 py-2 text-sm flex-1 min-w-[160px]" />
          <input name="slug" placeholder="slug" required className="rounded-lg border border-rosa-pastel px-3 py-2 text-sm flex-1 min-w-[160px]" />
          <input name="orden" type="number" placeholder="Orden" defaultValue={0} className="w-24 rounded-lg border border-rosa-pastel px-3 py-2 text-sm" />
          <button className="rounded-lg bg-fucsia text-white px-4 py-2 text-sm">Crear</button>
        </form>
      </section>

      <div className="bg-white rounded-2xl shadow-sm divide-y divide-rosa-pastel/40">
        {(categorias ?? []).map((c) => {
          const actualizarConId = actualizarCategoria.bind(null, c.id)
          const eliminarConId = eliminarCategoria.bind(null, c.id)
          return (
            // Nota: no se puede anidar un <form> dentro de otro (HTML invalido),
            // por eso "guardar" y "eliminar" son dos <form> hermanos dentro de un div.
            <div key={c.id} className="flex flex-wrap items-center gap-2 p-4">
              <form action={actualizarConId} className="flex flex-wrap items-center gap-2 flex-1">
                <input name="nombre" defaultValue={c.nombre} className="rounded-lg border border-rosa-pastel px-3 py-1.5 text-sm flex-1 min-w-[140px]" />
                <input name="slug" defaultValue={c.slug} className="rounded-lg border border-rosa-pastel px-3 py-1.5 text-sm flex-1 min-w-[140px]" />
                <input name="icono" defaultValue={c.icono ?? ''} placeholder="emoji" className="w-16 rounded-lg border border-rosa-pastel px-2 py-1.5 text-sm text-center" />
                <input name="imagen_url" defaultValue={c.imagen_url ?? ''} placeholder="URL de ícono propio (opcional)" className="rounded-lg border border-rosa-pastel px-3 py-1.5 text-sm flex-1 min-w-[160px]" />
                <input name="orden" type="number" defaultValue={c.orden} className="w-20 rounded-lg border border-rosa-pastel px-3 py-1.5 text-sm" />
                <label className="flex items-center gap-1 text-xs text-gray-600">
                  <input type="checkbox" name="activa" defaultChecked={c.activa} /> Activa
                </label>
                <button className="text-xs text-fucsia hover:underline">Guardar</button>
              </form>
              <form action={eliminarConId}>
                <DeleteButton />
              </form>
            </div>
          )
        })}
        {(categorias ?? []).length === 0 && <p className="p-4 text-sm text-gray-400">Sin categorías todavía.</p>}
      </div>
    </div>
  )
}
