import { createServerSupabase } from '@/lib/supabase/server'
import { crearCategoria, actualizarCategoria, eliminarCategoria } from '@/lib/actions/categorias'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

const INPUT = 'rounded-2xl border border-rosa-pastel bg-white px-3 py-2 text-sm text-gray-700 transition-colors duration-200 ease-boutique focus:border-lavender-magenta-400 focus:outline-none'

export default async function CategoriasPage() {
  const supabase = createServerSupabase()
  const { data: categorias } = await supabase.from('categorias').select('*').order('orden')

  return (
    <div>
      <header className="mb-6">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-lavender-magenta-700"><span aria-hidden="true" className="h-px w-6 bg-dorado" />Catálogo</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-lavender-magenta-950">Categorías</h1>
        <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">Organiza el catálogo por secciones para que tus clientas encuentren todo fácil.</p>
        <div className="hairline-gold mt-5" aria-hidden="true" />
      </header>

      <section className="mb-6 rounded-boutique-lg border border-lavender-magenta-100 bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-lg font-semibold text-lavender-magenta-950">Nueva categoría</h2>
        <div className="hairline-gold mt-3 mb-4" aria-hidden="true" />
        <form action={crearCategoria} className="flex flex-wrap gap-2">
          <input name="nombre" placeholder="Nombre" required className={`${INPUT} flex-1 min-w-[160px]`} />
          <input name="slug" placeholder="slug" required className={`${INPUT} flex-1 min-w-[160px]`} />
          <input name="orden" type="number" placeholder="Orden" defaultValue={0} className={`${INPUT} w-24`} />
          <button className="rounded-full bg-lavender-magenta-700 px-4 py-2 text-sm font-semibold text-white shadow-card transition-all duration-200 ease-boutique hover:-translate-y-0.5 hover:bg-lavender-magenta-800">Crear</button>
        </form>
      </section>

      <div className="divide-y divide-gray-100 rounded-boutique-lg border border-lavender-magenta-100 bg-white shadow-card">
        {(categorias ?? []).map((c) => {
          const actualizarConId = actualizarCategoria.bind(null, c.id)
          const eliminarConId = eliminarCategoria.bind(null, c.id)
          return (
            // Nota: no se puede anidar un <form> dentro de otro (HTML invalido),
            // por eso "guardar" y "eliminar" son dos <form> hermanos dentro de un div.
            <div key={c.id} className="flex flex-wrap items-center gap-2 p-4">
              <form action={actualizarConId} className="flex flex-wrap items-center gap-2 flex-1">
                <input name="nombre" defaultValue={c.nombre} className={`${INPUT} flex-1 min-w-[140px]`} />
                <input name="slug" defaultValue={c.slug} className={`${INPUT} flex-1 min-w-[140px]`} />
                <input name="icono" defaultValue={c.icono ?? ''} placeholder="emoji" className={`${INPUT} w-16 text-center`} />
                <input name="imagen_url" defaultValue={c.imagen_url ?? ''} placeholder="URL de ícono propio (opcional)" className={`${INPUT} flex-1 min-w-[160px]`} />
                <input name="orden" type="number" defaultValue={c.orden} className={`${INPUT} w-20`} />
                <label className="flex items-center gap-1.5 text-xs text-gray-600">
                  <input type="checkbox" name="activa" defaultChecked={c.activa} className="h-4 w-4 accent-lavender-magenta-600" /> Activa
                </label>
                <button className="text-xs font-semibold text-lavender-magenta-700 transition-colors duration-200 ease-boutique hover:underline">Guardar</button>
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
