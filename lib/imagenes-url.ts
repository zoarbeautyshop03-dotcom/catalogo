// Normaliza las URLs de imagen de la tienda para que todas se vean igual:
// cuadradas, centradas, sin recortes y con buena calidad.
//
// El problema que resuelve: las fotos subidas tienen proporciones muy distintas
// (muy verticales, muy horizontales, algunas con fondo blanco y otras no). Si se
// muestran con "object-cover" se recortan; si se muestran sin encuadre, unas se
// ven enormes y otras diminutas. Aquí pedimos a Cloudinary que las entregue ya
// encuadradas en un cuadrado con fondo blanco (c_pad, b_white, ar_1:1) y a una
// resolución suficiente para pantallas de alta densidad.
//
// Es una transformación de URL: no modifica el archivo original ni la base de
// datos, así que se puede revertir en cualquier momento.

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

const LADO_POR_DEFECTO = 1200

function esCloudinary(url: string) {
  try {
    return new URL(url).hostname === 'res.cloudinary.com'
  } catch {
    return false
  }
}

function esImageKit(url: string) {
  try {
    return new URL(url).hostname === 'ik.imagekit.io'
  } catch {
    return false
  }
}

/**
 * Devuelve la URL de Cloudinary con un encuadre cuadrado, fondo blanco y alta
 * calidad. Si la URL no es de Cloudinary (o ya viene con una transformación
 * propia que no podemos analizar) se devuelve tal cual para no romperla.
 */
export function urlImagenCuadrada(url: string | null | undefined, lado = LADO_POR_DEFECTO): string | null {
  if (!url) return null

  if (esCloudinary(url)) {
    const marca = '/image/upload/'
    const i = url.indexOf(marca)
    if (i === -1) return url
    const resto = url.slice(i + marca.length)
    const partes = resto.split('/')

    // La primera parte es la transformación si no es una versión (v123) ni el
    // propio archivo. La reemplazamos completa para no acumular parámetros
    // contradictorios (por ejemplo, dos "ar" o "w/h" distintos).
    const primera = partes[0] ?? ''
    const esVersion = /^v\d+$/.test(primera)
    const esTransformacion = !esVersion && /[,_]/.test(primera)
    if (esTransformacion) partes.shift()

    const transformacion = `f_auto,q_auto:good,c_pad,b_white,ar_1:1,w_${lado},h_${lado}`
    return url.slice(0, i + marca.length) + transformacion + '/' + partes.join('/')
  }

  if (esImageKit(url)) {
    const limpia = url.split('?')[0]
    return `${limpia}?tr=w-${lado},h-${lado},fo-auto,bg-FFFFFF`
  }

  return url
}

/** Igual que urlImagenCuadrada pero para listas. */
export function urlsImagenesCuadradas(urls: string[], lado = LADO_POR_DEFECTO): string[] {
  return urls.map((u) => urlImagenCuadrada(u, lado) ?? u)
}
