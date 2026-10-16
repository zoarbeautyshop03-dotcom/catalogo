// Validación de links de imagen, compartida entre las acciones del panel.
// Debe coincidir con los "remotePatterns" de next.config.mjs: si guardamos una
// URL de un dominio que no está ahí, next/image la rechaza y la imagen se ve
// rota en la tienda (aunque en el panel admin todo parezca normal).
export const HOSTS_PERMITIDOS = ['res.cloudinary.com', 'ik.imagekit.io']

export function validarUrlImagen(url: string) {
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

export function esUrlPermitida(url: string): boolean {
  try {
    return HOSTS_PERMITIDOS.includes(new URL(url).hostname)
  } catch {
    return false
  }
}
