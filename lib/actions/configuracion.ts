'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'

export async function guardarConfiguracion(formData: FormData) {
  const supabase = createServerSupabase()
  const { error } = await supabase.from('configuracion').upsert({
    id: 1,
    nombre_tienda: String(formData.get('nombre_tienda') ?? 'ZOAR BEAUTY SHOP'),
    whatsapp_numero: String(formData.get('whatsapp_numero') ?? ''),
    instagram: String(formData.get('instagram') ?? ''),
    facebook: String(formData.get('facebook') ?? ''),
    tiktok: String(formData.get('tiktok') ?? ''),
    horarios: String(formData.get('horarios') ?? ''),
    info_entrega: String(formData.get('info_entrega') ?? ''),
    mostrar_agotados: formData.get('mostrar_agotados') === 'on',
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/configuracion')
  revalidatePath('/', 'layout')
}
