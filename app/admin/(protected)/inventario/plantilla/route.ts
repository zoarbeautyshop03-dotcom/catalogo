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
    stock_minimo: number | null
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
      .select('slug, nombre, sku, codigo_barras, cantidad_stock, stock_minimo, precio, descripcion_corta, marca_id, categoria_id')
      .order('nombre')
      .order('id')
      .range(desde, desde + 999)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    productos.push(...((data ?? []) as unknown as Fila[]))
    if (!data || data.length < 1000) break
  }

  // Mismas columnas y mismo orden que el Excel que exporta el otro programa,
  // para poder subir ese archivo tal cual (y viceversa).
  const MODIFICADORES = [
    'AVON CARE', 'TONOS', 'GORROS EN SATIN RÍGIDO', 'SPLASH FRUTAS', 'DANCING', 'NITRO', 'PERFUMES OLE',
    'SPLASH LEESENCE YANBAL', 'SPLASH COLORS', 'AGUA DE COLONIA', 'CREMA MANOS AVON', 'PERFUME CLICK',
    'PERFUME MAGNAT', 'COLONIA 300 KM', 'BOMBONERAS', 'SPLASH MIX & CHIC',
  ]
  const filas = productos.map((p) => {
    const fila: Record<string, string | number> = {
      Handle: p.slug,
      REF: p.sku ?? '',
      Nombre: String(p.nombre).toUpperCase(),
      Categoria: (p.categoria_id && categoriaPorId.get(p.categoria_id)) || '',
      'Descripción': p.descripcion_corta ?? '',
      'Vendido por peso': 'N',
      'Opción 1 nombre': '',
      'Opción 1 valor': '',
      'Opción 2 nombre': '',
      'Opción 2 valor': '',
      'Opción 3 nombre': '',
      'Opción 3 valor': '',
      Coste: '',
      'Codigo de barras': p.codigo_barras ?? '',
      'REF del componente': '',
      'Cantidad del componente': '',
      'Seguir el Inventario': 'Y',
      'Disponibles para la venta [Zoar]': 'Y',
      'Precio [Zoar]': p.precio ?? 0,
      // Número entero normal (3), no "3.000": así Excel no lo convierte en 3000.
      'En inventario [Zoar]': p.cantidad_stock ?? 0,
      'Existencias bajas [Zoar]': p.stock_minimo ?? 0,
    }
    for (const m of MODIFICADORES) fila[`modificador - "${m}"`] = 'N'
    return fila
  })

  const hoja = XLSX.utils.json_to_sheet(filas)
  hoja['!cols'] = [{ wch: 40 }, { wch: 10 }, { wch: 40 }, { wch: 20 }, { wch: 24 }]
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
