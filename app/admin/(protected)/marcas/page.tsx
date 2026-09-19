import { createServerSupabase } from '@/lib/supabase/server'
import { crearMarca, actualizarMarca, eliminarMarca } from '@/lib/actions/marcas'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function MarcasPage() {
  const supabase = createServerSupabase()
  const { data: marcas } = await supabase.from('marcas').select('*').order('nombre')

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

      <div className="bg-white rounded-2xl shadow-sm divide-y divide-rosa-pastel/40">
        {(marcas ?? []).map((m) => {
          const actualizarConId = actualizarMarca.bind(null, m.id)
          const eliminarConId = eliminarMarca.bind(null, m.id)
          return (
            <div key={m.id} className="flex flex-wrap items-center gap-2 p-4">
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
          )
        })}
        {(marcas ?? []).length === 0 && <p className="p-4 text-sm text-gray-400">Sin marcas todavía.</p>}
      </div>
    </div>
  )
}
