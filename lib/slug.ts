// Utilidades para que los nombres con signos (+, &, %, #, ?, acentos, espacios...)
// no rompan los enlaces de los productos, categorías y marcas.

// Convierte cualquier texto en un "slug" seguro para URL:
// "Shampoo + Acondicionador 2x1 (Ñandú)" -> "shampoo-mas-acondicionador-2x1-nandu"
export function slugify(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita tildes (ñ -> n, á -> a)
    .toLowerCase()
    .replace(/&/g, ' y ')
    .replace(/\+/g, ' mas ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Ruta pública de un producto, con el slug codificado para que cualquier signo
// (por ejemplo "+", "&", "#", "?" o "%") llegue intacto a la página.
export function rutaProducto(slug: string): string {
  return `/producto/${encodeURIComponent(slug)}`
}

// Next.js entrega el parámetro de la URL todavía codificado ("a%2Bb", "caf%C3%A9");
// lo decodificamos sin que un "%" mal formado cause un error.
export function decodificarSlug(valor: string): string {
  try {
    return decodeURIComponent(valor)
  } catch {
    return valor
  }
}
