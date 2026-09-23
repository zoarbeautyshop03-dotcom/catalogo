import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_CAMBIOS = 5000

export type FilaCambio = {
  slug: string
  nombre: string
  stockActual: number | null
  stockNuevo: number | null
  precioActual: number | null
  precioNuevo: number | null
}

export async function POST(request: Request) {
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ ok: false, error: 'Tu sesión de administrador venció. Vuelve a iniciar sesión.' }, { status: 401 })
  }

  let body: { cambios?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'La solicitud de actualización no es válida.' }, { status: 400 })
  }

  if (!Array.isArray(body.cambios) || body.cambios.length === 0) {
    return NextResponse.json({ ok: false, error: 'No hay cambios para aplicar.' }, { status: 400 })
  }

  if (body.cambios.length > MAX_CAMBIOS) {
    return NextResponse.json({ ok: false, error: 'El archivo contiene demasiados cambios para procesarlos de una vez.' }, { status: 400 })
  }

  for (const cambio of body.cambios) {
    if (!esFilaCambio(cambio)) {
      return NextResponse.json({ ok: false, error: 'Hay una fila de cambios inválida. Vuelve a cargar la plantilla.' }, { status: 400 })
    }

    const payload: Record<string, number> = {}
    if (cambio.stockNuevo !== null) payload.cantidad_stock = cambio.stockNuevo
    if (cambio.precioNuevo !== null) payload.precio = cambio.precioNuevo
    if (Object.keys(payload).length === 0) continue

    const { error } = await supabase
      .from('productos')
      .update(payload)
      .eq('slug', cambio.slug)

    if (error) {
      return NextResponse.json({
        ok: false,
        error: `Error actualizando “${cambio.nombre}”: ${error.message}`,
      }, { status: 500 })
    }
  }

  revalidatePath('/admin/productos')
  revalidatePath('/admin/inventario')
  revalidatePath('/')
  revalidatePath('/catalogo')

  return NextResponse.json({ ok: true })
}

function esFilaCambio(valor: unknown): valor is FilaCambio {
  if (!valor || typeof valor !== 'object') return false

  const fila = valor as Record<string, unknown>
  const slugValido = typeof fila.slug === 'string' && fila.slug.trim().length > 0
  const nombreValido = typeof fila.nombre === 'string'
  const stockValido = fila.stockNuevo === null || (typeof fila.stockNuevo === 'number' && Number.isInteger(fila.stockNuevo) && fila.stockNuevo >= 0)
  const precioValido = fila.precioNuevo === null || (typeof fila.precioNuevo === 'number' && Number.isFinite(fila.precioNuevo) && fila.precioNuevo >= 0)

  return slugValido && nombreValido && stockValido && precioValido
}
