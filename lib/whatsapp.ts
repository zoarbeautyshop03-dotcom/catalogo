import type { Producto } from './types'

export function formatPrecio(precio: number, moneda = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(precio)
}

export function buildWhatsappLink(producto: Producto): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const precio = formatPrecio(producto.precio, producto.moneda)
  const url = `${siteUrl}/producto/${producto.slug}`
  const mensaje =
    `Hola, Zoar Beauty. Estoy interesada en el producto ${producto.nombre} ` +
    `(${precio}). Lo vi en su catálogo: ${url}`
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
}
