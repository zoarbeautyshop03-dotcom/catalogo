'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'

export async function crearMarca(formData: FormData) {
  const supabase = createServerSupabase()
  const { error } = await supabase.from('marcas').insert({
    nombre: String(formData.get('nombre') ?? '').trim(),
    slug: String(formData.get('slug') ?? '').trim(),
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
      slug: String(formData.get('slug') ?? '').trim(),
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
