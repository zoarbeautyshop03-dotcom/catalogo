'use server'

import * as XLSX from 'xlsx'
import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'

export type FilaCambio = {
  id?: string
  slug: string
  nombre: string
  sku?: string | null
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

export type ResultadoConfirmacion = { ok: boolean; error?: string; aplicados?: number }

function numeroValido(value: unknown): number | null {
  if (value === null || value === '' || value === undefined) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

export async function previsualizarInventario(
  _prevState: ResultadoPrevisualizacion,
  formData: FormData
): Promise<ResultadoPrevisualizacion> {
  const archivo = formData.get('archivo') as File | null
  if (!archivo || archivo.size === 0) return { ok: false, error: 'Selecciona un archivo primero.' }

  let filas: Record<string, unknown>[]
  try {
    const buffer = Buffer.from(await archivo.arrayBuffer())
    const libro = XLSX.read(buffer, { type: 'buffer' })
    const hoja = libro.Sheets[libro.SheetNames[0]]
    filas = XLSX.utils.sheet_to_json(hoja, { defval: null })
  } catch {
    return { ok: false, error: 'No pude leer el archivo. Usa un .xlsx, .xls o .csv válido.' }
  }

  if (!filas.length) return { ok: false, error: 'El archivo no tiene filas para leer.' }

  const supabase = createServerSupabase()
  const slugs = filas.map((f) => String(f.slug ?? '').trim()).filter(Boolean)
  const skus = filas.map((f) => String(f.sku ?? '').trim()).filter(Boolean)

  if (!slugs.length && !skus.length) {
    return { ok: false, error: 'No encontré "slug" ni "sku". Usa la plantilla descargada.' }
  }

  const queries = []
  if (slugs.length) queries.push(supabase.from('productos').select('id, slug, nombre, sku, cantidad_stock, precio').in('slug', [...new Set(slugs)]))
  if (skus.length) queries.push(supabase.from('productos').select('id, slug, nombre, sku, cantidad_stock, precio').in('sku', [...new Set(skus)]))

  const resultados = await Promise.all(queries)
  const primerError = resultados.find((r) => r.error)
  if (primerError?.error) return { ok: false, error: primerError.error.message }

  const existentes = resultados.flatMap((r) => r.data ?? [])
  const porClave = new Map<string, (typeof existentes)[number]>()
  for (const p of existentes) {
    porClave.set(`id:${p.id}`, p)
    if (p.slug) porClave.set(`slug:${p.slug}`, p)
    if (p.sku) porClave.set(`sku:${p.sku}`, p)
  }

  const cambios: FilaCambio[] = []
  const noReconocidos: string[] = []
  let sinCambios = 0

  for (const raw of filas) {
    const slug = String(raw.slug ?? '').trim()
    const sku = String(raw.sku ?? '').trim()
    const producto = (slug && porClave.get(`slug:${slug}`)) || (sku && porClave.get(`sku:${sku}`))
    if (!producto) {
      noReconocidos.push(sku || slug || '(fila sin identificador)')
      continue
    }

    const nuevoStock = numeroValido(raw.cantidad_stock)
    const nuevoPrecio = numeroValido(raw.precio)
    const cambiaStock = nuevoStock !== null && nuevoStock !== producto.cantidad_stock
    const cambiaPrecio = nuevoPrecio !== null && nuevoPrecio !== producto.precio

    if (cambiaStock || cambiaPrecio) {
      cambios.push({
        id: producto.id,
        slug: producto.slug,
        nombre: producto.nombre,
        sku: producto.sku,
        stockActual: producto.cantidad_stock,
        stockNuevo: cambiaStock ? nuevoStock : null,
        precioActual: producto.precio,
        precioNuevo: cambiaPrecio ? nuevoPrecio : null,
      })
    } else {
      sinCambios++
    }
  }

  return { ok: true, cambios, noReconocidos, sinCambios }
}

function funcionSqlNoInstalada(error: { code?: string; message?: string }) {
  return (
    error.code === 'PGRST202' ||
    error.code === '42883' ||
    /could not find the function|schema cache/i.test(error.message ?? '')
  )
}

/**
 * Aplica una lista de cambios (Excel o edición rápida). Usa la función SQL
 * `aplicar_cambios_inventario` (transacción + historial). Solo si esa función NO está
 * instalada todavía se usa el método antiguo; cualquier otro error se devuelve tal cual
 * para que no quede oculto.
 * Devuelve un mensaje de error, o null si todo salió bien.
 */
async function aplicarCambios(cambios: FilaCambio[]): Promise<string | null> {
  const supabase = createServerSupabase()
  const { error: rpcError } = await supabase.rpc('aplicar_cambios_inventario', {
    cambios: cambios.map((c) => ({
      id: c.id,
      cantidad_stock: c.stockNuevo,
      precio: c.precioNuevo,
      tipo: 'ajuste_excel',
      motivo: 'Importación desde Excel',
    })),
  })

  if (!rpcError) return null
  if (!funcionSqlNoInstalada(rpcError)) return `No se pudieron aplicar los cambios: ${rpcError.message}`

  // Compatibilidad con proyectos donde aún no se ha ejecutado supabase/inventario.sql
  for (const c of cambios) {
    const payload: Record<string, number> = {}
    if (c.stockNuevo !== null) payload.cantidad_stock = c.stockNuevo
    if (c.precioNuevo !== null) payload.precio = c.precioNuevo
    if (!Object.keys(payload).length) continue
    const { error } = await supabase.from('productos').update(payload).eq('id', c.id || '')
    if (error) return `Error actualizando "${c.nombre}": ${error.message}`
  }
  return null
}

export async function confirmarImportacionInventario(
  _prevState: ResultadoConfirmacion,
  formData: FormData
): Promise<ResultadoConfirmacion> {
  const crudo = String(formData.get('cambios') ?? '[]')
  let cambios: FilaCambio[]
  try {
    cambios = JSON.parse(crudo)
  } catch {
    return { ok: false, error: 'No pude leer los cambios. Vuelve a intentarlo.' }
  }
  if (!Array.isArray(cambios)) return { ok: false, error: 'Formato de cambios inválido.' }
  cambios = cambios.filter((c) => c && typeof c.id === 'string' && c.id)
  if (!cambios.length) return { ok: false, error: 'No hay cambios para aplicar.' }

  for (const c of cambios) {
    if (c.stockNuevo != null && (!Number.isInteger(c.stockNuevo) || c.stockNuevo < 0)) {
      return { ok: false, error: `Stock inválido para "${c.nombre}". Debe ser un entero igual o mayor que 0.` }
    }
    if (c.precioNuevo != null && (!Number.isFinite(c.precioNuevo) || c.precioNuevo < 0)) {
      return { ok: false, error: `Precio inválido para "${c.nombre}".` }
    }
  }

  const error = await aplicarCambios(cambios)
  if (error) return { ok: false, error }

  revalidateInventory()
  return { ok: true, aplicados: cambios.length }
}

export type ResultadoMovimiento = { ok: boolean; error?: string }

export async function actualizarInventarioMasivo(
  _prevState: ResultadoMovimiento,
  formData: FormData
): Promise<ResultadoMovimiento> {
  const ids = String(formData.get('ids') ?? '').split(',').map((v) => v.trim()).filter(Boolean)
  const modo = String(formData.get('modo') ?? '') as 'entrada' | 'salida' | 'establecer'
  const cantidad = Number(formData.get('cantidad'))
  const motivo = String(formData.get('motivo') ?? '').trim() || 'Ajuste manual'

  if (!ids.length) return { ok: false, error: 'Selecciona al menos un producto.' }
  if (!['entrada', 'salida', 'establecer'].includes(modo)) return { ok: false, error: 'Tipo de movimiento inválido.' }
  if (!Number.isFinite(cantidad) || cantidad < 0 || !Number.isInteger(cantidad)) return { ok: false, error: 'La cantidad debe ser un número entero igual o mayor que 0.' }
  if (modo === 'salida' && cantidad === 0) return { ok: false, error: 'Indica una cantidad mayor que 0 para la salida.' }

  const supabase = createServerSupabase()
  const { error } = await supabase.rpc('actualizar_inventario_masivo', {
    producto_ids: ids,
    modo,
    cantidad,
    motivo,
  })

  if (error) {
    return { ok: false, error: `No se pudo actualizar el inventario. Ejecuta primero el SQL de migración incluido en el proyecto. Detalle: ${error.message}` }
  }

  revalidateInventory()
  return { ok: true }
}

export async function actualizarPrecioMasivo(
  _prevState: ResultadoMovimiento,
  formData: FormData
): Promise<ResultadoMovimiento> {
  const ids = String(formData.get('ids') ?? '').split(',').map((v) => v.trim()).filter(Boolean)
  const precio = Number(formData.get('precio'))
  if (!ids.length) return { ok: false, error: 'Selecciona al menos un producto.' }
  if (!Number.isFinite(precio) || precio < 0) return { ok: false, error: 'El precio debe ser un número igual o mayor que 0.' }

  const supabase = createServerSupabase()
  const { error } = await supabase.rpc('actualizar_precio_masivo', { producto_ids: ids, nuevo_precio: precio, motivo: 'Cambio masivo de precio' })
  if (error) return { ok: false, error: `No se pudo actualizar el precio. Ejecuta el SQL de migración. Detalle: ${error.message}` }
  revalidateInventory()
  return { ok: true }
}

export async function actualizarStockRapido(
  _prevState: ResultadoMovimiento,
  formData: FormData
): Promise<ResultadoMovimiento> {
  const id = String(formData.get('id') ?? '').trim()
  const cantidad = Number(formData.get('cantidad'))
  if (!id) return { ok: false, error: 'Producto no válido.' }
  if (!Number.isInteger(cantidad) || cantidad < 0) return { ok: false, error: 'Stock inválido.' }

  const supabase = createServerSupabase()
  const { error } = await supabase.rpc('actualizar_inventario_masivo', {
    producto_ids: [id],
    modo: 'establecer',
    cantidad,
    motivo: 'Edición rápida de stock',
  })
  if (error) return { ok: false, error: error.message }
  revalidateInventory()
  return { ok: true }
}

function revalidateInventory() {
  revalidatePath('/admin')
  revalidatePath('/admin/inventario')
  revalidatePath('/admin/productos')
  revalidatePath('/')
  revalidatePath('/catalogo')
}
