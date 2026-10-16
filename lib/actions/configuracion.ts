'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'
import { validarUrlImagen } from '@/lib/imagenes-url'

export async function guardarConfiguracion(formData: FormData) {
  const supabase = createServerSupabase()

  // Hasta 5 imágenes para el carrusel de la portada. Se validan una a una y se
  // descartan las repetidas.
  const elegidas: string[] = []
  for (const valor of formData.getAll('hero_imagenes')) {
    const url = String(valor).trim()
    if (!url) continue
    validarUrlImagen(url)
    if (!elegidas.includes(url)) elegidas.push(url)
  }

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
    hero_imagenes: elegidas.length > 0 ? elegidas.slice(0, 5) : null,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/admin/configuracion')
  revalidatePath('/', 'layout')
}
