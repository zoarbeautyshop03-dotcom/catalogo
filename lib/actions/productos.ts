'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'

function extraerPayload(formData: FormData) {
  const num = (v: FormDataEntryValue | null) => (v === null || v === '' ? null : Number(v))
  const txt = (v: FormDataEntryValue | null) => {
    const s = v ? String(v).trim() : ''
    return s === '' ? null : s
  }
  return {
    nombre: String(formData.get('nombre') ?? '').trim(),
    slug: String(formData.get('slug') ?? '').trim(),
    marca_id: txt(formData.get('marca_id')),
    categoria_id: txt(formData.get('categoria_id')),
    subcategoria_id: txt(formData.get('subcategoria_id')),
    sku: txt(formData.get('sku')),
    codigo_barras: txt(formData.get('codigo_barras')),
    descripcion_corta: txt(formData.get('descripcion_corta')),
    descripcion_completa: txt(formData.get('descripcion_completa')),
    precio: num(formData.get('precio')) ?? 0,
    precio_anterior: num(formData.get('precio_anterior')),
    descuento: num(formData.get('descuento')),
    costo: num(formData.get('costo')),
    cantidad_stock: num(formData.get('cantidad_stock')) ?? 0,
    stock_minimo: num(formData.get('stock_minimo')) ?? 3,
    contenido: txt(formData.get('contenido')),
    modo_uso: txt(formData.get('modo_uso')),
    ingredientes_destacados: txt(formData.get('ingredientes_destacados')),
    advertencias: txt(formData.get('advertencias')),
    destacado: formData.get('destacado') === 'on',
    nuevo: formData.get('nuevo') === 'on',
    mas_vendido: formData.get('mas_vendido') === 'on',
    oferta: formData.get('oferta') === 'on',
    whatsapp_activo: formData.get('whatsapp_activo') !== 'off',
    activo: formData.get('activo') !== 'off',
    estado_publicacion: String(formData.get('estado_publicacion') ?? 'borrador'),
  }
}

export async function crearProducto(formData: FormData) {
  const supabase = createServerSupabase()
  const payload = extraerPayload(formData)
  const { data, error } = await supabase.from('productos').insert(payload).select('id').single()
  if (error) throw new Error(error.message)
  revalidatePath('/admin/productos')
  redirect(`/admin/productos/${data.id}`)
}

export async function actualizarProducto(id: string, formData: FormData) {
  const supabase = createServerSupabase()
  const payload = extraerPayload(formData)
  const { error } = await supabase.from('productos').update(payload).eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/productos')
  revalidatePath(`/admin/productos/${id}`)
  revalidatePath('/')
  revalidatePath('/catalogo')
}

export async function eliminarProducto(id: string) {
  const supabase = createServerSupabase()
  const { error } = await supabase.from('productos').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/productos')
}

export async function duplicarProducto(id: string) {
  const supabase = createServerSupabase()
  const { data: original, error: errGet } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single()
  if (errGet) throw new Error(errGet.message)

  const copia: Record<string, unknown> = { ...original }
  delete copia.id
  delete copia.creado_en
  delete copia.actualizado_en
  copia.nombre = `${original.nombre} (copia)`
  copia.slug = `${original.slug}-copia-${Date.now()}`
  copia.estado_publicacion = 'borrador'

  const { error } = await supabase.from('productos').insert(copia)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/productos')
}
