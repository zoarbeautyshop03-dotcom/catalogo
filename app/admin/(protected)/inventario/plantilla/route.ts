import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServerSupabase()
  // Supabase devuelve máximo 1000 filas por consulta: se descarga por tandas.
  type Fila = {
    slug: string
    nombre: string
    sku: string | null
    codigo_barras: string | null
    cantidad_stock: number | null
    precio: number | null
    descripcion_corta: string | null
    marca_id: string | null
    categoria_id: string | null
  }
  const [{ data: marcas }, { data: categorias }] = await Promise.all([
    supabase.from('marcas').select('id, nombre'),
    supabase.from('categorias').select('id, nombre'),
  ])
  const marcaPorId = new Map((marcas ?? []).map((m) => [m.id as string, m.nombre as string]))
  const categoriaPorId = new Map((categorias ?? []).map((c) => [c.id as string, c.nombre as string]))
  const productos: Fila[] = []
  for (let desde = 0; ; desde += 1000) {
    const { data, error } = await supabase
      .from('productos')
      .select('slug, nombre, sku, codigo_barras, cantidad_stock, precio, descripcion_corta, marca_id, categoria_id')
      .order('nombre')
      .order('id')
      .range(desde, desde + 999)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    productos.push(...((data ?? []) as unknown as Fila[]))
    if (!data || data.length < 1000) break
  }

  const filas = productos.map((p) => ({
    slug: p.slug,
    nombre: p.nombre,
    sku: p.sku ?? '',
    codigo_barras: p.codigo_barras ?? '',
    cantidad_stock: p.cantidad_stock,
    precio: p.precio,
    marca: (p.marca_id && marcaPorId.get(p.marca_id)) || '',
    categoria: (p.categoria_id && categoriaPorId.get(p.categoria_id)) || '',
    descripcion_corta: p.descripcion_corta ?? '',
  }))

  const hoja = XLSX.utils.json_to_sheet(filas)
  hoja['!cols'] = [{ wch: 40 }, { wch: 40 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 40 }]
  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, 'Inventario')
  const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' }) as Buffer

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="zoar-inventario.xlsx"',
    },
  })
}
