import { NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { createServerSupabase } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 5 * 1024 * 1024

type FilaExcel = Record<string, unknown>

type ProductoExistente = {
  id: string
  slug: string
  nombre: string
  cantidad_stock: number | null
  precio: number | null
}

export async function POST(request: Request) {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ ok: false, error: 'Tu sesión de administrador venció. Vuelve a iniciar sesión.' }, { status: 401 })
  }

  let archivo: File | null = null
  try {
    const formData = await request.formData()
    const candidato = formData.get('archivo')
    if (candidato instanceof File) archivo = candidato
  } catch {
    return NextResponse.json({ ok: false, error: 'No pude recibir el archivo. Inténtalo nuevamente.' }, { status: 400 })
  }

  if (!archivo || archivo.size === 0) {
    return NextResponse.json({ ok: false, error: 'Selecciona un archivo primero.' }, { status: 400 })
  }

  if (archivo.size > MAX_FILE_SIZE) {
    return NextResponse.json({ ok: false, error: 'El archivo supera el límite de 5 MB.' }, { status: 413 })
  }

  let filas: FilaExcel[]
  try {
    const buffer = Buffer.from(await archivo.arrayBuffer())
    const libro = XLSX.read(buffer, { type: 'buffer', cellDates: false })
    const primeraHoja = libro.SheetNames[0]

    if (!primeraHoja) {
      return NextResponse.json({ ok: false, error: 'El archivo no contiene ninguna hoja.' }, { status: 400 })
    }

    const hoja = libro.Sheets[primeraHoja]
    filas = XLSX.utils.sheet_to_json<FilaExcel>(hoja, { defval: null, raw: true })
      .map(normalizarFila)
  } catch {
    return NextResponse.json({
      ok: false,
      error: 'No pude leer el archivo. Usa el Excel/CSV descargado desde “Descargar plantilla”.',
    }, { status: 400 })
  }

  if (filas.length === 0) {
    return NextResponse.json({ ok: false, error: 'El archivo no tiene filas para leer.' }, { status: 400 })
  }

  const slugs = filas
    .map((fila) => String(fila.slug ?? '').trim())
    .filter(Boolean)

  if (slugs.length === 0) {
    return NextResponse.json({
      ok: false,
      error: 'No encontré una columna “slug” con datos. No cambies esa columna de la plantilla.',
    }, { status: 400 })
  }

  const { data: existentes, error } = await supabase
    .from('productos')
    .select('id, slug, nombre, cantidad_stock, precio')
    .in('slug', [...new Set(slugs)])

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  const porSlug = new Map<string, ProductoExistente>((existentes ?? []).map((p) => [p.slug, p]))
  const cambios: Array<{
    slug: string
    nombre: string
    stockActual: number | null
    stockNuevo: number | null
    precioActual: number | null
    precioNuevo: number | null
  }> = []
  const noReconocidos: string[] = []
  let sinCambios = 0

  for (const fila of filas) {
    const slug = String(fila.slug ?? '').trim()
    if (!slug) continue

    const producto = porSlug.get(slug)
    if (!producto) {
      noReconocidos.push(slug)
      continue
    }

    const nuevoStock = leerNumero(fila.cantidad_stock)
    const nuevoPrecio = leerNumero(fila.precio)

    if (nuevoStock !== null && (!Number.isInteger(nuevoStock) || nuevoStock < 0)) {
      return NextResponse.json({
        ok: false,
        error: `El stock de “${producto.nombre}” debe ser un número entero igual o mayor que 0.`,
      }, { status: 400 })
    }

    if (nuevoPrecio !== null && (!Number.isFinite(nuevoPrecio) || nuevoPrecio < 0)) {
      return NextResponse.json({
        ok: false,
        error: `El precio de “${producto.nombre}” debe ser un número igual o mayor que 0.`,
      }, { status: 400 })
    }

    const cambiaStock = nuevoStock !== null && nuevoStock !== producto.cantidad_stock
    const cambiaPrecio = nuevoPrecio !== null && nuevoPrecio !== producto.precio

    if (cambiaStock || cambiaPrecio) {
      cambios.push({
        slug,
        nombre: producto.nombre,
        stockActual: producto.cantidad_stock,
        stockNuevo: cambiaStock ? nuevoStock : null,
        precioActual: producto.precio,
        precioNuevo: cambiaPrecio ? nuevoPrecio : null,
      })
    } else {
      sinCambios++
    }
  }

  return NextResponse.json({
    ok: true,
    cambios,
    noReconocidos: [...new Set(noReconocidos)],
    sinCambios,
  })
}

function normalizarFila(fila: FilaExcel): FilaExcel {
  return Object.fromEntries(
    Object.entries(fila).map(([clave, valor]) => [
      clave.trim().toLowerCase(),
      typeof valor === 'string' ? valor.trim() : valor,
    ])
  )
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
  const numero = Number(limpio)
  return Number.isFinite(numero) ? numero : null
}
