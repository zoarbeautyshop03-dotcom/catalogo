'use server'

import * as XLSX from 'xlsx'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'

export type FilaCambio = {
  slug: string
  nombre: string
  stockActual: number | null
  stockNuevo: number | null
  precioActual: number | null
  precioNuevo: number | null
}

export type ResultadoPrevisualizacion = {
  ok: boolean
  error?: string
  cambios?: FilaCambio[]
  noReconocidos?: string[]
  sinCambios?: number
}

export async function previsualizarInventario(
  _prevState: ResultadoPrevisualizacion,
  formData: FormData
): Promise<ResultadoPrevisualizacion> {
  const archivo = formData.get('archivo') as File | null
  if (!archivo || archivo.size === 0) {
    return { ok: false, error: 'Selecciona un archivo primero.' }
  }

  let filas: Record<string, unknown>[]
  try {
    const buffer = Buffer.from(await archivo.arrayBuffer())
    const libro = XLSX.read(buffer, { type: 'buffer' })
    const hoja = libro.Sheets[libro.SheetNames[0]]
    filas = XLSX.utils.sheet_to_json(hoja, { defval: null })
  } catch {
    return { ok: false, error: 'No pude leer el archivo. ¿Es un .xlsx, .xls o .csv válido, con la primera fila como encabezados?' }
  }

  if (filas.length === 0) {
    return { ok: false, error: 'El archivo no tiene filas para leer.' }
  }

  const supabase = createServerSupabase()
  const slugs = filas
    .map((f) => String((f as { slug?: unknown }).slug ?? '').trim())
    .filter(Boolean)

  if (slugs.length === 0) {
    return { ok: false, error: 'No encontré una columna "slug" en el archivo. Usa la plantilla descargada, no cambies esa columna.' }
  }

  const { data: existentes, error } = await supabase
    .from('productos')
    .select('id, slug, nombre, cantidad_stock, precio')
    .in('slug', slugs)

  if (error) return { ok: false, error: error.message }

  const porSlug = new Map((existentes ?? []).map((p) => [p.slug, p]))
  const cambios: FilaCambio[] = []
  const noReconocidos: string[] = []
  let sinCambios = 0

  for (const filaRaw of filas) {
    const fila = filaRaw as { slug?: unknown; cantidad_stock?: unknown; precio?: unknown }
    const slug = String(fila.slug ?? '').trim()
    if (!slug) continue

    const producto = porSlug.get(slug)
    if (!producto) {
      noReconocidos.push(slug)
      continue
    }

    const stockCrudo = fila.cantidad_stock
    const precioCrudo = fila.precio
    const nuevoStock = stockCrudo === null || stockCrudo === '' || stockCrudo === undefined ? null : Number(stockCrudo)
    const nuevoPrecio = precioCrudo === null || precioCrudo === '' || precioCrudo === undefined ? null : Number(precioCrudo)

    const cambiaStock = nuevoStock !== null && !Number.isNaN(nuevoStock) && nuevoStock !== producto.cantidad_stock
    const cambiaPrecio = nuevoPrecio !== null && !Number.isNaN(nuevoPrecio) && nuevoPrecio !== producto.precio

    if (cambiaStock || cambiaPrecio) {
      cambios.push({
        slug,
        nombre: producto.nombre,
        stockActual: producto.cantidad_stock,
        stockNuevo: cambiaStock ? (nuevoStock as number) : null,
        precioActual: producto.precio,
        precioNuevo: cambiaPrecio ? (nuevoPrecio as number) : null,
      })
    } else {
      sinCambios++
    }
  }

  return { ok: true, cambios, noReconocidos, sinCambios }
}

export async function confirmarImportacionInventario(formData: FormData) {
  const crudo = String(formData.get('cambios') ?? '[]')
  let cambios: FilaCambio[]
  try {
    cambios = JSON.parse(crudo)
  } catch {
    throw new Error('No pude leer los cambios a aplicar. Vuelve a subir el archivo.')
  }

  const supabase = createServerSupabase()

  for (const c of cambios) {
    const payload: Record<string, number> = {}
    if (c.stockNuevo !== null) payload.cantidad_stock = c.stockNuevo
    if (c.precioNuevo !== null) payload.precio = c.precioNuevo
    if (Object.keys(payload).length === 0) continue

    const { error } = await supabase.from('productos').update(payload).eq('slug', c.slug)
    if (error) throw new Error(`Error actualizando "${c.slug}": ${error.message}`)
  }

  revalidatePath('/admin/productos')
  revalidatePath('/admin/inventario')
  revalidatePath('/')
  revalidatePath('/catalogo')
  redirect('/admin/inventario?ok=1')
}
