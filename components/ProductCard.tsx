import { rutaProducto } from '@/lib/slug'
import Link from 'next/link'
import Image from 'next/image'
import type { Producto } from '@/lib/types'
import { formatPrecio, porcentajeDescuento } from '@/lib/whatsapp'
import AddToCartButton from './AddToCartButton'

type Props = {
  producto: Producto
  imagenUrl?: string
  marcaNombre?: string
}

export default function ProductCard({ producto, imagenUrl, marcaNombre }: Props) {
  const tieneDescuento = !!producto.precio_anterior && producto.precio_anterior > producto.precio
  const porcentaje = porcentajeDescuento(producto)
  const agotado = producto.estado_inventario === 'agotado'
  const ultimasUnidades = producto.estado_inventario === 'ultimas_unidades'

  // Máximo dos etiquetas por tarjeta, en orden de importancia, para que la foto respire.
  const etiquetas: { texto: string; clase: string }[] = []
  if (producto.oferta) etiquetas.push({ texto: 'Oferta', clase: 'bg-lavender-magenta-600 text-white' })
  if (producto.nuevo) etiquetas.push({ texto: 'Nuevo', clase: 'bg-lavender-magenta-950 text-white' })
  if (producto.mas_vendido) etiquetas.push({ texto: 'Favorito', clase: 'bg-white text-lavender-magenta-800 ring-1 ring-lavender-magenta-100' })

  return (
    <article className="catalog-product-card group relative overflow-hidden rounded-3xl bg-white ring-1 ring-lavender-magenta-200/80">
      <Link href={rutaProducto(producto.slug)} className="block h-full">
        <div className="catalog-product-media relative aspect-[0.96] overflow-hidden bg-gradient-to-b from-lavender-magenta-50 to-lavender-magenta-100/70">
          {imagenUrl ? (
            <Image
              src={imagenUrl}
              alt={producto.nombre}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="relative z-10 object-contain p-4 transition duration-500 ease-out group-hover:scale-[1.04] sm:p-5"
            />
          ) : (
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-lavender-magenta-700">
              <span className="text-4xl">✦</span>
              <span className="text-xs font-medium text-gray-500">Foto pendiente</span>
            </div>
          )}

          {etiquetas.length > 0 && (
            <div className="absolute left-3 top-3 z-20 flex max-w-[68%] flex-wrap gap-1.5">
              {etiquetas.slice(0, 2).map((e) => (
                <span key={e.texto} className={`badge shadow-sm ${e.clase}`}>{e.texto}</span>
              ))}
            </div>
          )}

          {agotado && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/80">
              <span className="rounded-full bg-lavender-magenta-950 px-4 py-2 text-xs font-semibold text-white shadow-lg">Agotado</span>
            </div>
          )}
        </div>

        <div className="flex min-h-[132px] flex-col p-4 sm:p-5">
          {marcaNombre && (
            <p className="truncate text-xs font-medium text-lavender-magenta-700">{marcaNombre}</p>
          )}
          <h3 className={`line-clamp-2 text-sm font-semibold leading-snug text-gray-900 sm:text-[15px] ${marcaNombre ? 'mt-1' : ''}`}>
            {producto.nombre}
          </h3>

          <div className="mt-auto pt-4">
            {tieneDescuento && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-gray-500 line-through">
                  {formatPrecio(producto.precio_anterior as number, producto.moneda)}
                </span>
                {porcentaje != null && (
                  <span className="rounded-full bg-lavender-magenta-50 px-1.5 py-0.5 text-[11px] font-bold text-lavender-magenta-700 ring-1 ring-lavender-magenta-100">
                    -{porcentaje}%
                  </span>
                )}
              </div>
            )}
            <div className="flex items-end justify-between gap-2">
              <span className={`block text-lg font-bold tracking-tight sm:text-xl ${tieneDescuento ? 'text-lavender-magenta-700' : 'text-lavender-magenta-950'}`}>
                {formatPrecio(producto.precio, producto.moneda)}
              </span>
              {ultimasUnidades && (
                <span className="mb-1 inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Últimas unidades
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <AddToCartButton
        producto={{ id: producto.id, nombre: producto.nombre, slug: producto.slug, precio: producto.precio }}
        imagenUrl={imagenUrl}
        agotado={agotado}
      />
    </article>
  )
}
