'use server'

import * as XLSX from 'xlsx'
import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'

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

export type FilaNuevo = {
  nombre: string
  slug: string
  sku: string | null
  codigo_barras: string | null
  precio: number
  stock: number
  marca: string | null
  categoria: string | null
  marca_id: string | null
  categoria_id: string | null
  descripcion_corta: string | null
}

export type FilaEliminar = {
  id: string
  nombre: string
  slug: string
  sku: string | null
  cantidad_stock: number | null
}

export type ResultadoPrevisualizacion = {
  ok: boolean
  error?: string
  cambios?: FilaCambio[]
  nuevos?: FilaNuevo[]
  eliminar?: FilaEliminar[]
  advertencias?: string[]
  noReconocidos?: string[]
  sinCambios?: number
  totalCatalogo?: number
  eliminacionMasiva?: boolean
}

export type ResultadoConfirmacion = {
  ok: boolean
  error?: string
  aplicados?: number
  creados?: number
  actualizados?: number
  eliminados?: number
}

function leerNumero(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === '') return null
  if (typeof valor === 'number') return Number.isFinite(valor) ? valor : null
  const limpio = String(valor)
    .trim()
    .replace(/[$\s]/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(/,(?=\d+$)/, '.')
  if (!limpio) return null
  const n = Number(limpio)
  return Number.isFinite(n) ? n : null
}

function texto(valor: unknown): string {
  return valor === null || valor === undefined ? '' : String(valor).trim()
}

function normalizarFila(fila: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fila).map(([k, v]) => [k.trim().toLowerCase(), v]))
}

type ProductoDb = {
  id: string
  slug: string
  nombre: string
  sku: string | null
  codigo_barras: string | null
  cantidad_stock: number | null
  precio: number | null
}

// Supabase devuelve máximo 1000 filas por consulta: se pide por tandas para no
// "olvidar" productos (y marcarlos por error como eliminables).
async function cargarTodosLosProductos(supabase: ReturnType<typeof createServerSupabase>) {
  const todos: ProductoDb[] = []
  const paso = 1000
  for (let desde = 0; ; desde += paso) {
    const { data, error } = await supabase
      .from('productos')
      .select('id, slug, nombre, sku, codigo_barras, cantidad_stock, precio')
      .order('id', { ascending: true })
      .range(desde, desde + paso - 1)
    if (error) throw new Error(error.message)
    todos.push(...((data ?? []) as ProductoDb[]))
    if (!data || data.length < paso) break
  }
  return todos
}

export async function previsualizarInventario(
  _prevState: ResultadoPrevisualizacion,
  formData: FormData
): Promise<ResultadoPrevisualizacion> {
  const archivo = formData.get('archivo') as File | null
  const eliminarFaltantes = formData.get('eliminar_faltantes') === 'on'
  if (!archivo || archivo.size === 0) return { ok: false, error: 'Selecciona un archivo primero.' }

  let filas: Record<string, unknown>[]
  try {
    const buffer = Buffer.from(await archivo.arrayBuffer())
    const libro = XLSX.read(buffer, { type: 'buffer' })
    const hoja = libro.Sheets[libro.SheetNames[0]]
    filas = XLSX.utils.sheet_to_json<Record<string, unknown>>(hoja, { defval: null }).map(normalizarFila)
  } catch {
    return { ok: false, error: 'No pude leer el archivo. Usa un .xlsx, .xls o .csv válido.' }
  }

  if (!filas.length) return { ok: false, error: 'El archivo no tiene filas para leer.' }

  const supabase = createServerSupabase()

  let productos: ProductoDb[]
  try {
    productos = await cargarTodosLosProductos(supabase)
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'No pude leer los productos actuales.' }
  }

  const [{ data: marcas }, { data: categorias }] = await Promise.all([
    supabase.from('marcas').select('id, nombre'),
    supabase.from('categorias').select('id, nombre'),
  ])
  const marcaPorNombre = new Map((marcas ?? []).map((m) => [slugify(m.nombre), m.id as string]))
  const categoriaPorNombre = new Map((categorias ?? []).map((c) => [slugify(c.nombre), c.id as string]))

  const porSlug = new Map<string, ProductoDb>()
  const porSku = new Map<string, ProductoDb>()
  for (const p of productos) {
    if (p.slug) porSlug.set(p.slug, p)
    if (p.sku) porSku.set(p.sku, p)
  }

  const cambios: FilaCambio[] = []
  const nuevos: FilaNuevo[] = []
  const advertencias: string[] = []
  const conservados = new Set<string>() // ids que SÍ están en el Excel
  const slugsNuevos = new Set<string>()
  const skusNuevos = new Set<string>()
  let sinCambios = 0
  let filasConIdentificador = 0

  filas.forEach((raw, i) => {
    const fila = i + 2 // fila real en Excel (la 1 es el encabezado)
    const nombre = texto(raw.nombre)
    const slugExcel = texto(raw.slug)
    const sku = texto(raw.sku)
    if (!nombre && !slugExcel && !sku) return // fila vacía

    filasConIdentificador++
    const slugLimpio = slugify(slugExcel || nombre)

    const existente =
      (slugExcel && porSlug.get(slugExcel)) ||
      (slugLimpio && porSlug.get(slugLimpio)) ||
      (sku && porSku.get(sku)) ||
      null

    const nuevoStock = leerNumero(raw.cantidad_stock)
    const nuevoPrecio = leerNumero(raw.precio)

    if (existente) {
      if (conservados.has(existente.id)) {
        advertencias.push(`Fila ${fila}: “${existente.nombre}” está repetido en el Excel. Se usó solo la primera vez.`)
        return
      }
      conservados.add(existente.id)

      let stockOk = nuevoStock
      let precioOk = nuevoPrecio
      if (stockOk !== null && (!Number.isInteger(stockOk) || stockOk < 0)) {
        advertencias.push(`Fila ${fila}: stock inválido en “${existente.nombre}”. Se dejó el stock actual.`)
        stockOk = null
      }
      if (precioOk !== null && precioOk < 0) {
        advertencias.push(`Fila ${fila}: precio inválido en “${existente.nombre}”. Se dejó el precio actual.`)
        precioOk = null
      }

      const cambiaStock = stockOk !== null && stockOk !== existente.cantidad_stock
      const cambiaPrecio = precioOk !== null && precioOk !== existente.precio
      if (cambiaStock || cambiaPrecio) {
        cambios.push({
          id: existente.id,
          slug: existente.slug,
          nombre: existente.nombre,
          sku: existente.sku,
          stockActual: existente.cantidad_stock,
          stockNuevo: cambiaStock ? stockOk : null,
          precioActual: existente.precio,
          precioNuevo: cambiaPrecio ? precioOk : null,
        })
      } else {
        sinCambios++
      }
      return
    }

    // ---- Producto NUEVO ----
    if (!nombre) {
      advertencias.push(`Fila ${fila}: producto nuevo sin nombre. No se creó.`)
      return
    }
    if (nuevoPrecio === null || nuevoPrecio < 0) {
      advertencias.push(`Fila ${fila}: “${nombre}” es nuevo pero no tiene un precio válido. No se creó.`)
      return
    }
    if (nuevoStock !== null && (!Number.isInteger(nuevoStock) || nuevoStock < 0)) {
      advertencias.push(`Fila ${fila}: “${nombre}” tiene un stock inválido. No se creó.`)
      return
    }
    if (!slugLimpio) {
      advertencias.push(`Fila ${fila}: no pude generar un enlace (slug) para “${nombre}”. No se creó.`)
      return
    }
    if (slugsNuevos.has(slugLimpio) || (sku && skusNuevos.has(sku))) {
      advertencias.push(`Fila ${fila}: “${nombre}” está repetido en el Excel. Se creó solo una vez.`)
      return
    }
    slugsNuevos.add(slugLimpio)
    if (sku) skusNuevos.add(sku)

    const marca = texto(raw.marca)
    const categoria = texto(raw.categoria)
    const marcaId = marca ? marcaPorNombre.get(slugify(marca)) ?? null : null
    const categoriaId = categoria ? categoriaPorNombre.get(slugify(categoria)) ?? null : null
    if (marca && !marcaId) advertencias.push(`Fila ${fila}: la marca “${marca}” no existe; “${nombre}” se creará sin marca.`)
    if (categoria && !categoriaId) advertencias.push(`Fila ${fila}: la categoría “${categoria}” no existe; “${nombre}” se creará sin categoría.`)

    nuevos.push({
      nombre,
      slug: slugLimpio,
      sku: sku || null,
      codigo_barras: texto(raw.codigo_barras) || null,
      precio: nuevoPrecio,
      stock: nuevoStock ?? 0,
      marca: marca || null,
      categoria: categoria || null,
      marca_id: marcaId,
      categoria_id: categoriaId,
      descripcion_corta: texto(raw.descripcion_corta) || null,
    })
  })

  if (filasConIdentificador === 0) {
    return { ok: false, error: 'No encontré productos en el archivo. Revisa que tenga las columnas nombre, slug o sku.' }
  }

  // Productos que están en la página pero ya NO en el Excel.
  const eliminar: FilaEliminar[] = eliminarFaltantes
    ? productos
        .filter((p) => !conservados.has(p.id))
        .map((p) => ({ id: p.id, nombre: p.nombre, slug: p.slug, sku: p.sku, cantidad_stock: p.cantidad_stock }))
    : []

  // Protección: si el Excel no reconoce casi ningún producto actual, casi seguro es el archivo equivocado.
  if (eliminarFaltantes && productos.length > 0 && conservados.size === 0) {
    return {
      ok: false,
      error: 'Ningún producto del Excel coincide con los que ya están en la página; así se eliminaría TODO el catálogo. Descarga la plantilla actual y vuelve a intentarlo.',
    }
  }

  const eliminacionMasiva = eliminar.length >= 10 && eliminar.length >= productos.length * 0.4

  return {
    ok: true,
    cambios,
    nuevos,
    eliminar,
    advertencias,
    noReconocidos: [],
    sinCambios,
    totalCatalogo: productos.length,
    eliminacionMasiva,
  }
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

function enTandas<T>(lista: T[], tamano: number): T[][] {
  const tandas: T[][] = []
  for (let i = 0; i < lista.length; i += tamano) tandas.push(lista.slice(i, i + tamano))
  return tandas
}

/** Elimina productos por tandas. Devuelve un mensaje de error, o null si todo salió bien. */
async function eliminarProductosPorId(ids: string[]): Promise<string | null> {
  const supabase = createServerSupabase()
  for (const tanda of enTandas(ids, 100)) {
    let { data, error } = await supabase.from('productos').delete().in('id', tanda).select('id')

    // Si hay registros que dependen del producto (fotos, historial), se limpian y se reintenta.
    if (error?.code === '23503') {
      await supabase.from('producto_imagenes').delete().in('producto_id', tanda)
      await supabase.from('movimientos_inventario').delete().in('producto_id', tanda)
      ;({ data, error } = await supabase.from('productos').delete().in('id', tanda).select('id'))
    }

    if (error) return `No se pudieron eliminar algunos productos: ${error.message}`
    if ((data?.length ?? 0) < tanda.length) {
      return 'Algunos productos no se pudieron eliminar (permisos de Supabase). Revisa las políticas de borrado de la tabla productos.'
    }
  }
  return null
}

export async function confirmarSincronizacionInventario(
  _prevState: ResultadoConfirmacion,
  formData: FormData
): Promise<ResultadoConfirmacion> {
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Tu sesión de administrador venció. Vuelve a iniciar sesión.' }

  let plan: { cambios?: FilaCambio[]; nuevos?: FilaNuevo[]; eliminar?: FilaEliminar[]; eliminacionMasiva?: boolean }
  try {
    plan = JSON.parse(String(formData.get('plan') ?? '{}'))
  } catch {
    return { ok: false, error: 'No pude leer el plan de cambios. Vuelve a subir el archivo.' }
  }

  const cambios = (plan.cambios ?? []).filter((c) => c && typeof c.id === 'string' && c.id)
  const nuevos = plan.nuevos ?? []
  const eliminar = (plan.eliminar ?? []).filter((e) => e && typeof e.id === 'string' && e.id)

  if (!cambios.length && !nuevos.length && !eliminar.length) {
    return { ok: false, error: 'No hay nada para aplicar.' }
  }

  if (eliminar.length > 0) {
    if (formData.get('entiendo') !== 'on') {
      return { ok: false, error: 'Marca la casilla para confirmar que entiendes que se eliminarán productos.' }
    }
    if (plan.eliminacionMasiva && String(formData.get('palabra') ?? '').trim().toUpperCase() !== 'ELIMINAR') {
      return { ok: false, error: 'Vas a eliminar muchos productos. Escribe ELIMINAR para confirmar.' }
    }
  }

  for (const c of cambios) {
    if (c.stockNuevo != null && (!Number.isInteger(c.stockNuevo) || c.stockNuevo < 0)) {
      return { ok: false, error: `Stock inválido para "${c.nombre}".` }
    }
    if (c.precioNuevo != null && (!Number.isFinite(c.precioNuevo) || c.precioNuevo < 0)) {
      return { ok: false, error: `Precio inválido para "${c.nombre}".` }
    }
  }
  for (const n of nuevos) {
    if (!n.nombre || !n.slug || !Number.isFinite(n.precio) || n.precio < 0 || !Number.isInteger(n.stock) || n.stock < 0) {
      return { ok: false, error: `Datos inválidos en el producto nuevo "${n.nombre || n.slug}".` }
    }
  }

  let actualizados = 0
  let creados = 0
  let eliminados = 0
  const hecho = () => `Ya se aplicó: ${actualizados} actualizados, ${creados} creados, ${eliminados} eliminados.`

  // 1) Actualizar existentes
  if (cambios.length) {
    const error = await aplicarCambios(cambios)
    if (error) return { ok: false, error }
    actualizados = cambios.length
  }

  // 2) Crear nuevos (publicados y activos para que aparezcan en la página)
  for (const tanda of enTandas(nuevos, 200)) {
    const { error } = await supabase.from('productos').insert(
      tanda.map((n) => ({
        nombre: n.nombre,
        slug: n.slug,
        sku: n.sku,
        codigo_barras: n.codigo_barras,
        precio: n.precio,
        cantidad_stock: n.stock,
        stock_minimo: 3,
        marca_id: n.marca_id,
        categoria_id: n.categoria_id,
        descripcion_corta: n.descripcion_corta,
        activo: true,
        estado_publicacion: 'publicado',
      }))
    )
    if (error) return { ok: false, error: `No se pudieron crear los productos nuevos: ${error.message}. ${hecho()}` }
    creados += tanda.length
  }

  // 3) Eliminar los que ya no están en el Excel (al final, para que un error antes no borre nada)
  if (eliminar.length) {
    const error = await eliminarProductosPorId(eliminar.map((e) => e.id))
    if (error) return { ok: false, error: `${error} ${hecho()}` }
    eliminados = eliminar.length
  }

  revalidateInventory()
  revalidatePath('/producto/[slug]', 'page')
  return { ok: true, aplicados: actualizados + creados + eliminados, actualizados, creados, eliminados }
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
