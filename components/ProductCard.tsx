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
    // Nota: el boton de "agregar al carrito" NO puede ir dentro del <Link>
    // (un <button> dentro de un <a> es HTML invalido), por eso es un
    // hermano posicionado encima, no un hijo del Link.
    <div className="group relative rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link href={`/producto/${producto.slug}`} className="block">
        <div className="relative aspect-square bg-rosa-pastel/40">
          {imagenUrl ? (
            <Image src={imagenUrl} alt={producto.nombre} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-rosa-empolvado text-xs text-center px-2">
              Foto pendiente
            </div>
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {producto.nuevo && <span className="badge bg-lavanda text-white">Nuevo</span>}
            {producto.mas_vendido && <span className="badge bg-dorado text-white">Más vendido</span>}
            {producto.oferta && <span className="badge bg-fucsia text-white">Oferta</span>}
          </div>
          {agotado && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center text-sm font-medium text-gray-600">
              Agotado
            </div>
          )}
        </div>
        <div className="p-3">
          {marcaNombre && (
            <p className="text-[11px] uppercase tracking-wide text-rosa-empolvado">{marcaNombre}</p>
          )}
          <h3 className="font-display text-sm text-gray-800 line-clamp-2">{producto.nombre}</h3>
          <div className="mt-1 flex items-baseline gap-2">
            {tieneDescuento && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrecio(producto.precio_anterior as number, producto.moneda)}
              </span>
            )}
            <span className="text-fucsia font-semibold">{formatPrecio(producto.precio, producto.moneda)}</span>
          </div>
        </div>
      </Link>

      <AddToCartButton
        producto={{ id: producto.id, nombre: producto.nombre, slug: producto.slug, precio: producto.precio }}
        imagenUrl={imagenUrl}
        agotado={agotado}
      />
    </div>
  )
}
