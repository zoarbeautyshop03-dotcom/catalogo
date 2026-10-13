import { createServerSupabase } from '@/lib/supabase/server'
import { crearProducto } from '@/lib/actions/productos'
import ProductoForm from '@/components/admin/ProductoForm'

export const dynamic = 'force-dynamic'

export default async function NuevoProductoPage() {
  const supabase = createServerSupabase()
  const [{ data: categorias }, { data: marcas }, { data: subcategorias }] = await Promise.all([
    supabase.from('categorias').select('*').order('orden'),
    supabase.from('marcas').select('*').order('nombre'),
    supabase.from('subcategorias').select('id, nombre, categoria_id').order('orden'),
  ])

  return (
    <div>
      <header className="mb-6">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-lavender-magenta-700"><span aria-hidden="true" className="h-px w-6 bg-dorado" />Catálogo</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-lavender-magenta-950">Nuevo producto</h1>
        <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">Completa la ficha y guárdala como borrador o publícala de inmediato.</p>
        <div className="hairline-gold mt-5" aria-hidden="true" />
      </header>
      <ProductoForm
        categorias={categorias ?? []}
        marcas={marcas ?? []}
        subcategorias={subcategorias ?? []}
        action={crearProducto}
      />
    </div>
  )
}
