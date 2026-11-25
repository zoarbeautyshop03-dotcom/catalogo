'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'

export async function crearMarca(formData: FormData) {
  const supabase = createServerSupabase()
  const { error } = await supabase.from('marcas').insert({
    nombre: String(formData.get('nombre') ?? '').trim(),
    slug: slugify(String(formData.get('slug') ?? '') || String(formData.get('nombre') ?? '')),
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/marcas')
  revalidatePath('/')
}

export async function actualizarMarca(id: string, formData: FormData) {
  const supabase = createServerSupabase()
  const { error } = await supabase
    .from('marcas')
    .update({
      nombre: String(formData.get('nombre') ?? '').trim(),
      slug: slugify(String(formData.get('slug') ?? '') || String(formData.get('nombre') ?? '')),
      activa: formData.get('activa') === 'on',
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/marcas')
  revalidatePath('/')
}

export async function eliminarMarca(id: string) {
  const supabase = createServerSupabase()
  const { error } = await supabase.from('marcas').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/marcas')
}

function revalidarPublico() {
  revalidatePath('/admin/productos')
  revalidatePath('/admin/marcas')
  revalidatePath('/')
  revalidatePath('/catalogo')
  revalidatePath('/producto/[slug]', 'page')
}

// Aplica el mismo % de descuento a todos los productos de una marca.
// Se calcula siempre desde el precio "de siempre" (precio_anterior si ya
// tenía uno guardado; si no, el precio actual), para que aplicarlo dos
// veces no vaya descontando sobre un precio ya rebajado.
export async function aplicarDescuentoMarca(marcaId: string, formData: FormData) {
  const porcentaje = Number(formData.get('porcentaje'))
  if (!Number.isFinite(porcentaje) || porcentaje <= 0 || porcentaje >= 100) {
    throw new Error('El porcentaje de descuento debe ser un número entre 1 y 99.')
  }

  const supabase = createServerSupabase()
  const { data: productos, error: errFetch } = await supabase
    .from('productos')
    .select('id, precio, precio_anterior')
    .eq('marca_id', marcaId)
  if (errFetch) throw new Error(errFetch.message)

  for (const p of productos ?? []) {
    const precioBase = p.precio_anterior ?? p.precio
    const nuevoPrecio = Math.round(precioBase * (1 - porcentaje / 100))
    const { error } = await supabase
      .from('productos')
      .update({ precio: nuevoPrecio, precio_anterior: precioBase, descuento: porcentaje })
      .eq('id', p.id)
    if (error) throw new Error(`Error actualizando un producto de la marca: ${error.message}`)
  }

  revalidarPublico()
}

// Reversa el descuento por marca: vuelve cada producto a su precio_anterior
// guardado y limpia descuento/precio_anterior. Si un producto no tenía
// precio_anterior (no estaba descontado), lo deja intacto.
export async function quitarDescuentoMarca(marcaId: string) {
  const supabase = createServerSupabase()
  const { data: productos, error: errFetch } = await supabase
    .from('productos')
    .select('id, precio_anterior')
    .eq('marca_id', marcaId)
  if (errFetch) throw new Error(errFetch.message)

  for (const p of productos ?? []) {
    if (p.precio_anterior == null) continue
    const { error } = await supabase
      .from('productos')
      .update({ precio: p.precio_anterior, precio_anterior: null, descuento: null })
      .eq('id', p.id)
    if (error) throw new Error(`Error restaurando un producto de la marca: ${error.message}`)
  }

  revalidarPublico()
}

// ---------------------------------------------------------------------------
// Descuento para TODA la tienda (incluye productos sin marca).
// Misma mecánica que el de marca: se calcula desde el precio "de siempre"
// (precio_anterior si existe, si no el precio actual), así que aplicarlo dos
// veces no descuenta sobre un precio ya rebajado.
// ---------------------------------------------------------------------------
type ProductoPrecio = { id: string; precio: number; precio_anterior: number | null; descuento: number | null }

// Supabase devuelve máx. 1000 filas por consulta: se pide por tandas.
async function cargarPreciosTienda(supabase: ReturnType<typeof createServerSupabase>) {
  const todos: ProductoPrecio[] = []
  const paso = 1000
  for (let desde = 0; ; desde += paso) {
    const { data, error } = await supabase
      .from('productos')
      .select('id, precio, precio_anterior, descuento')
      .order('id', { ascending: true })
      .range(desde, desde + paso - 1)
    if (error) throw new Error(error.message)
    todos.push(...((data ?? []) as ProductoPrecio[]))
    if (!data || data.length < paso) break
  }
  return todos
}

// Actualiza en grupos pequeños en paralelo para que miles de productos no tarden minutos.
async function actualizarPorGrupos(
  supabase: ReturnType<typeof createServerSupabase>,
  filas: { id: string; cambios: Record<string, number | null> }[]
) {
  for (let i = 0; i < filas.length; i += 20) {
    const grupo = filas.slice(i, i + 20)
    const resultados = await Promise.all(
      grupo.map((f) => supabase.from('productos').update(f.cambios).eq('id', f.id))
    )
    const fallo = resultados.find((r) => r.error)
    if (fallo?.error) throw new Error(`Error actualizando productos: ${fallo.error.message}`)
  }
}

export async function aplicarDescuentoTienda(formData: FormData) {
  const porcentaje = Number(formData.get('porcentaje'))
  if (!Number.isFinite(porcentaje) || porcentaje <= 0 || porcentaje >= 100) {
    throw new Error('El porcentaje de descuento debe ser un número entre 1 y 99.')
  }
  if (formData.get('confirmo') !== 'on') {
    throw new Error('Marca la casilla para confirmar que el descuento se aplicará a toda la tienda.')
  }
  const respetarExistentes = formData.get('respetar_existentes') === 'on'

  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Tu sesión de administrador venció. Vuelve a iniciar sesión.')

  const productos = await cargarPreciosTienda(supabase)
  const filas = productos
    .filter((p) => !(respetarExistentes && p.precio_anterior != null && p.precio_anterior > p.precio))
    .map((p) => {
      const precioBase = p.precio_anterior ?? p.precio
      return {
        id: p.id,
        cambios: {
          precio: Math.round(precioBase * (1 - porcentaje / 100)),
          precio_anterior: precioBase,
          descuento: porcentaje,
        },
      }
    })

  await actualizarPorGrupos(supabase, filas)
  revalidarPublico()
}

// Reversa el descuento de toda la tienda: cada producto vuelve a su precio_anterior.
// Los que no tenían precio_anterior se dejan intactos.
export async function quitarDescuentoTienda(formData: FormData) {
  if (formData.get('confirmo') !== 'on') {
    throw new Error('Marca la casilla para confirmar que se quitarán los descuentos de toda la tienda.')
  }
  const supabase = createServerSupabase()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Tu sesión de administrador venció. Vuelve a iniciar sesión.')

  const productos = await cargarPreciosTienda(supabase)
  const filas = productos
    .filter((p) => p.precio_anterior != null)
    .map((p) => ({ id: p.id, cambios: { precio: p.precio_anterior as number, precio_anterior: null, descuento: null } }))

  await actualizarPorGrupos(supabase, filas)
  revalidarPublico()
}
