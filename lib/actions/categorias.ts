'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'
import { slugify } from '@/lib/slug'

export async function crearCategoria(formData: FormData) {
  const supabase = createServerSupabase()
  const { error } = await supabase.from('categorias').insert({
    nombre: String(formData.get('nombre') ?? '').trim(),
    slug: slugify(String(formData.get('slug') ?? '') || String(formData.get('nombre') ?? '')),
    orden: Number(formData.get('orden') ?? 0),
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categorias')
  revalidatePath('/')
}

export async function actualizarCategoria(id: string, formData: FormData) {
  const supabase = createServerSupabase()
  const { error } = await supabase
    .from('categorias')
    .update({
      nombre: String(formData.get('nombre') ?? '').trim(),
      slug: slugify(String(formData.get('slug') ?? '') || String(formData.get('nombre') ?? '')),
      icono: String(formData.get('icono') ?? '').trim() || null,
      imagen_url: String(formData.get('imagen_url') ?? '').trim() || null,
      orden: Number(formData.get('orden') ?? 0),
      activa: formData.get('activa') === 'on',
    })
    .eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categorias')
  revalidatePath('/')
}

export async function eliminarCategoria(id: string) {
  const supabase = createServerSupabase()
  const { error } = await supabase.from('categorias').delete().eq('id', id)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/categorias')
}
