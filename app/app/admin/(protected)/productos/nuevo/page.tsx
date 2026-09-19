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
      <h1 className="font-display text-2xl mb-6">Nuevo producto</h1>
      <ProductoForm
        categorias={categorias ?? []}
        marcas={marcas ?? []}
        subcategorias={subcategorias ?? []}
        action={crearProducto}
      />
    </div>
  )
}
