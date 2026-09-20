import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createServerSupabase()
  const { data: productos, error } = await supabase
    .from('productos')
    .select('slug, nombre, sku, codigo_barras, cantidad_stock, precio')
    .order('nombre')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const filas = (productos ?? []).map((p) => ({
    slug: p.slug,
    nombre: p.nombre,
    sku: p.sku ?? '',
    codigo_barras: p.codigo_barras ?? '',
    cantidad_stock: p.cantidad_stock,
    precio: p.precio,
  }))

  const hoja = XLSX.utils.json_to_sheet(filas)
  hoja['!cols'] = [{ wch: 40 }, { wch: 40 }, { wch: 16 }, { wch: 16 }, { wch: 14 }, { wch: 12 }]
  const libro = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(libro, hoja, 'Inventario')
  const buffer = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' }) as Buffer

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="zoar-inventario.xlsx"',
    },
  })
}
