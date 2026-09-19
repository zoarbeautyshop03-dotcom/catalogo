'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'

export async function agregarImagen(productoId: string, formData: FormData) {
  const supabase = createServerSupabase()
  const url = String(formData.get('url') ?? '').trim()
  if (!url) throw new Error('La URL de la imagen es obligatoria')
  const { error } = await supabase.from('producto_imagenes').insert({
    producto_id: productoId,
    url,
    texto_alt: String(formData.get('texto_alt') ?? '') || null,
    orden: Number(formData.get('orden') ?? 0),
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/productos/${productoId}`)
}

export async function eliminarImagen(productoId: string, imagenId: string) {
  const supabase = createServerSupabase()
  const { error } = await supabase.from('producto_imagenes').delete().eq('id', imagenId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/productos/${productoId}`)
}

export async function marcarPrincipal(productoId: string, imagenId: string) {
  const supabase = createServerSupabase()
  await supabase.from('producto_imagenes').update({ es_principal: false }).eq('producto_id', productoId)
  const { error } = await supabase.from('producto_imagenes').update({ es_principal: true }).eq('id', imagenId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/productos/${productoId}`)
}
