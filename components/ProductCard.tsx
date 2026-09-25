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

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 12 12 4M6 4h6v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ProductCard({ producto, imagenUrl, marcaNombre }: Props) {
  const tieneDescuento = !!producto.precio_anterior && producto.precio_anterior > producto.precio
  const porcentaje = porcentajeDescuento(producto)
  const agotado = producto.estado_inventario === 'agotado'
  const ultimasUnidades = producto.estado_inventario === 'ultimas_unidades'

  return (
    <article className="catalog-product-card group relative overflow-hidden rounded-[28px] bg-white ring-1 ring-lavender-magenta-100/90">
      <Link href={`/producto/${producto.slug}`} className="block h-full">
        <div className="catalog-product-media relative aspect-[0.96] overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(255,255,255,0.95),rgba(255,231,254,0.78))]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_0%,rgba(255,148,244,0.18),transparent_34%),radial-gradient(circle_at_10%_100%,rgba(255,206,252,0.24),transparent_38%)]" />

          {imagenUrl ? (
            <Image
              src={imagenUrl}
              alt={producto.nombre}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="relative z-10 object-contain p-3 transition duration-500 ease-out group-hover:scale-[1.045] sm:p-4"
            />
          ) : (
            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-lavender-magenta-500">
              <span className="text-4xl">✦</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-lavender-magenta-600">Foto pendiente</span>
            </div>
          )}

          <div className="absolute left-3 top-3 z-20 flex max-w-[72%] flex-wrap gap-1.5">
            {producto.nuevo && <span className="badge bg-lavender-magenta-950 text-white shadow-sm">Nuevo</span>}
            {producto.mas_vendido && <span className="badge bg-white/95 text-lavender-magenta-800 ring-1 ring-lavender-magenta-100">Favorito</span>}
            {producto.oferta && <span className="badge bg-lavender-magenta-600 text-white shadow-sm">Oferta</span>}
          </div>

          {tieneDescuento && porcentaje != null && (
            <span className="absolute bottom-3 left-3 z-20 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-lavender-magenta-700 shadow-sm ring-1 ring-lavender-magenta-100">
              Ahorras {porcentaje}%
            </span>
          )}

          <div className="catalog-product-hover absolute inset-x-3 bottom-3 z-20 flex translate-y-2 items-center justify-between rounded-2xl bg-white/[0.92] px-3 py-2.5 text-xs font-bold text-lavender-magenta-800 shadow-lg ring-1 ring-white/80 backdrop-blur-md">
            <span>Ver detalles</span>
            <ArrowUpRight />
          </div>

          {agotado && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/72 backdrop-blur-[2px]">
              <span className="rounded-full bg-lavender-magenta-950 px-4 py-2 text-xs font-bold text-white shadow-lg">Agotado</span>
            </div>
          )}
        </div>

        <div className="flex min-h-[148px] flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {marcaNombre && (
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-lavender-magenta-600">
                  {marcaNombre}
                </p>
              )}
              <h3 className="mt-1.5 line-clamp-2 font-display text-[15px] font-semibold leading-5 text-lavender-magenta-950 sm:text-base">
                {producto.nombre}
              </h3>
            </div>
          </div>

          <div className="mt-auto pt-4">
            <div className="flex items-end justify-between gap-3">
              <div className="min-w-0">
                {tieneDescuento && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-medium text-gray-400 line-through">
                      {formatPrecio(producto.precio_anterior as number, producto.moneda)}
                    </span>
                    {porcentaje != null && (
                      <span className="rounded-full bg-lavender-magenta-50 px-1.5 py-0.5 text-[10px] font-extrabold text-lavender-magenta-700 ring-1 ring-lavender-magenta-100">
                        -{porcentaje}%
                      </span>
                    )}
                  </div>
                )}
                <span className="mt-0.5 block text-lg font-extrabold tracking-tight text-lavender-magenta-700 sm:text-xl">
                  {formatPrecio(producto.precio, producto.moneda)}
                </span>
              </div>

              <span className={`hidden shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[10px] font-bold sm:inline-flex ${
                ultimasUnidades
                  ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                  : 'bg-lavender-magenta-50 text-lavender-magenta-700 ring-1 ring-lavender-magenta-100'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${ultimasUnidades ? 'bg-amber-500' : 'bg-lavender-magenta-500'}`} />
                {ultimasUnidades ? 'Últimas' : 'Disponible'}
              </span>
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
