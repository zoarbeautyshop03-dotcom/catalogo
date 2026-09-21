import Link from 'next/link'
import Image from 'next/image'
import type { Producto } from '@/lib/types'
import { formatPrecio } from '@/lib/whatsapp'
import AddToCartButton from './AddToCartButton'

type Props = {
  producto: Producto
  imagenUrl?: string
  marcaNombre?: string
}

export default function ProductCard({ producto, imagenUrl, marcaNombre }: Props) {
  const tieneDescuento = !!producto.precio_anterior && producto.precio_anterior > producto.precio
  const agotado = producto.estado_inventario === 'agotado'

  return (
    <article className="group relative overflow-hidden rounded-[26px] bg-white shadow-soft-card ring-1 ring-lavender-magenta-100/80 hover:-translate-y-1 hover:shadow-soft-pink">
      <Link href={`/producto/${producto.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-lavender-magenta-50 to-lavender-magenta-100/70">
          {imagenUrl ? (
            <Image
              src={imagenUrl}
              alt={producto.nombre}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-lavender-magenta-500">
              <span className="text-4xl">✦</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-lavender-magenta-600">Foto pendiente</span>
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {producto.nuevo && <span className="badge bg-lavender-magenta-950 text-white">Nuevo</span>}
            {producto.mas_vendido && <span className="badge bg-white/95 text-lavender-magenta-800 ring-1 ring-lavender-magenta-100">Favorito</span>}
            {producto.oferta && <span className="badge bg-lavender-magenta-600 text-white">Oferta</span>}
          </div>

          {agotado && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/75 backdrop-blur-[2px]">
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100">Agotado</span>
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          {marcaNombre && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-lavender-magenta-600">{marcaNombre}</p>
          )}
          <h3 className="mt-1 font-display text-sm font-semibold leading-5 text-lavender-magenta-950 sm:text-base">{producto.nombre}</h3>
          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="flex min-w-0 flex-col">
              {tieneDescuento && (
                <span className="text-[11px] text-gray-400 line-through">
                  {formatPrecio(producto.precio_anterior as number, producto.moneda)}
                </span>
              )}
              <span className="text-base font-bold text-lavender-magenta-700 sm:text-lg">
                {formatPrecio(producto.precio, producto.moneda)}
              </span>
            </div>
            <span className="hidden rounded-full bg-lavender-magenta-50 px-3 py-1 text-[10px] font-semibold text-lavender-magenta-700 sm:inline-flex">Ver producto</span>
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
