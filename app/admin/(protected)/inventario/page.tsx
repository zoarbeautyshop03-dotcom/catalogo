import { createServerSupabase } from '@/lib/supabase/server'
import InventarioClient, { type InventarioProducto, type InventarioFiltro } from '@/components/admin/InventarioClient'

export default async function InventarioPage({ searchParams }: { searchParams: { ok?: string; filtro?: string } }) {
  const supabase = createServerSupabase()
  const [{ data: productos, error }, { data: marcas }, { data: categorias }, { data: movimientos }] = await Promise.all([
    supabase
      .from('productos')
      .select('id, nombre, slug, sku, codigo_barras, cantidad_stock, stock_minimo, precio, estado_inventario, estado_publicacion, activo, marca_id, categoria_id')
      .order('nombre', { ascending: true }),
    supabase.from('marcas').select('id, nombre').order('nombre', { ascending: true }),
    supabase.from('categorias').select('id, nombre').order('nombre', { ascending: true }),
    supabase.from('movimientos_inventario').select('id, producto_id, tipo, cantidad_anterior, cantidad_movimiento, cantidad_nueva, motivo, creado_en, productos(nombre)').order('creado_en', { ascending: false }).limit(20),
  ])

  const lista = (productos ?? []) as InventarioProducto[]

  // Supabase devuelve la relación productos(nombre) como arreglo; el cliente espera un solo objeto.
  const listaMovimientos = (movimientos ?? []).map((m: any) => ({
    ...m,
    productos: Array.isArray(m.productos) ? (m.productos[0] ?? null) : (m.productos ?? null),
  }))
  const resumen = {
    total: lista.length,
    disponibles: lista.filter((p) => (p.cantidad_stock ?? 0) > (p.stock_minimo ?? 0)).length,
    bajos: lista.filter((p) => (p.cantidad_stock ?? 0) > 0 && (p.cantidad_stock ?? 0) <= (p.stock_minimo ?? 0)).length,
    agotados: lista.filter((p) => (p.cantidad_stock ?? 0) <= 0).length,
  }

  return (
    <InventarioClient
      productos={lista}
      marcas={marcas ?? []}
      categorias={categorias ?? []}
      resumen={resumen}
      filtroInicial={(searchParams.filtro as InventarioFiltro) || 'todos'}
      errorInicial={error?.message}
      actualizado={searchParams.ok === '1'}
      movimientos={listaMovimientos}
    />
  )
}
