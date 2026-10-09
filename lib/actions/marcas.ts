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
