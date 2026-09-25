import type { Producto } from './types'

export function formatPrecio(precio: number, moneda = 'COP'): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(precio)
}

// Prioriza el % que se escribe a mano en el admin; si no hay ninguno pero sí
// hay precio anterior, lo calcula a partir de la diferencia de precios.
export function porcentajeDescuento(producto: {
  precio: number
  precio_anterior: number | null
  descuento: number | null
}): number | null {
  if (producto.descuento != null && producto.descuento > 0) {
    return Math.round(producto.descuento)
  }
  if (producto.precio_anterior && producto.precio_anterior > producto.precio) {
    return Math.round((1 - producto.precio / producto.precio_anterior) * 100)
  }
  return null
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

type ItemParaWhatsapp = {
  nombre: string
  precio: number
  cantidad: number
}

export function buildWhatsappCarritoLink(items: ItemParaWhatsapp[], moneda = 'COP'): string {
  const numero = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? ''
  const lineas = items.map(
    (i, idx) => `${idx + 1}. ${i.nombre} x${i.cantidad} - ${formatPrecio(i.precio * i.cantidad, moneda)}`
  )
  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
  const mensaje =
    `Hola, Zoar Beauty. Quiero pedir:\n\n` +
    lineas.join('\n') +
    `\n\nTotal: ${formatPrecio(total, moneda)}` +
    `\n\n¿Me confirman disponibilidad? Gracias`
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`
}
