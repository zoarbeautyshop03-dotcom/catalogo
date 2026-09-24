'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'

// Debe coincidir con los "remotePatterns" de next.config.mjs: si guardamos una
// URL de un dominio que no está ahí, next/image la va a rechazar y la imagen
// se ve rota en la tienda (aunque en el panel admin todo parezca normal).
const HOSTS_PERMITIDOS = ['res.cloudinary.com', 'ik.imagekit.io']

function validarUrlImagen(url: string) {
  let host: string
  try {
    host = new URL(url).hostname
  } catch {
    throw new Error('Esa URL de imagen no es válida. Debe empezar por https://')
  }
  if (!HOSTS_PERMITIDOS.includes(host)) {
    throw new Error(
      `Esa imagen no se va a mostrar en la tienda: solo se aceptan links de ${HOSTS_PERMITIDOS.join(' o ')}. Si la subiste a otro sitio (Google Fotos, Instagram, WhatsApp, etc.), primero súbela a Cloudinary o ImageKit y pega ese link.`
    )
  }
}

export async function agregarImagen(productoId: string, formData: FormData) {
  const supabase = createServerSupabase()
  const url = String(formData.get('url') ?? '').trim()
  if (!url) throw new Error('La URL de la imagen es obligatoria')
  validarUrlImagen(url)
  const { error } = await supabase.from('producto_imagenes').insert({
    producto_id: productoId,
    url,
    texto_alt: String(formData.get('texto_alt') ?? '') || null,
    orden: Number(formData.get('orden') ?? 0),
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/productos/${productoId}`)
  revalidatePath('/producto/[slug]', 'page')
  revalidatePath('/')
  revalidatePath('/catalogo')
}

export async function eliminarImagen(productoId: string, imagenId: string) {
  const supabase = createServerSupabase()
  const { error } = await supabase.from('producto_imagenes').delete().eq('id', imagenId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/productos/${productoId}`)
  revalidatePath('/producto/[slug]', 'page')
  revalidatePath('/')
  revalidatePath('/catalogo')
}

export async function marcarPrincipal(productoId: string, imagenId: string) {
  const supabase = createServerSupabase()
  await supabase.from('producto_imagenes').update({ es_principal: false }).eq('producto_id', productoId)
  const { error } = await supabase.from('producto_imagenes').update({ es_principal: true }).eq('id', imagenId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/productos/${productoId}`)
  revalidatePath('/producto/[slug]', 'page')
  revalidatePath('/')
  revalidatePath('/catalogo')
}
