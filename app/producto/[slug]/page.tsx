import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getProductoPorSlug, getImagenesDeProducto } from '@/lib/queries'
import { formatPrecio } from '@/lib/whatsapp'
import WhatsAppButton from '@/components/WhatsAppButton'
import AddToCartButton from '@/components/AddToCartButton'

export const revalidate = 300

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const producto = await getProductoPorSlug(params.slug)
  if (!producto) return {}
  return {
    title: `${producto.nombre} | Zoar Beauty Shop`,
    description: producto.descripcion_corta ?? producto.nombre,
    openGraph: {
      title: producto.nombre,
      description: producto.descripcion_corta ?? undefined,
      type: 'website',
    },
  }
}

export default async function ProductoPage({ params }: Props) {
  const producto = await getProductoPorSlug(params.slug)
  if (!producto) notFound()

  const imagenes = await getImagenesDeProducto(producto.id)
  const tieneDescuento = !!producto.precio_anterior && producto.precio_anterior > producto.precio

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <div className="relative aspect-square rounded-2xl bg-rosa-pastel/40 overflow-hidden">
          {imagenes[0] ? (
            <Image
              src={imagenes[0].url}
              alt={imagenes[0].texto_alt ?? producto.nombre}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-rosa-empolvado text-sm">
              Foto pendiente
            </div>
          )}
        </div>
        {imagenes.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {imagenes.map((img) => (
              <div
                key={img.id}
                className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-rosa-pastel/30"
              >
                <Image src={img.url} alt={img.texto_alt ?? ''} fill className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="font-display text-2xl text-gray-800">{producto.nombre}</h1>
        <div className="mt-2 flex items-baseline gap-2">
          {tieneDescuento && (
            <span className="text-gray-400 line-through">
              {formatPrecio(producto.precio_anterior as number, producto.moneda)}
            </span>
          )}
          <span className="text-fucsia text-xl font-semibold">
            {formatPrecio(producto.precio, producto.moneda)}
          </span>
        </div>

        <p className="mt-2 text-sm">
          {producto.estado_inventario === 'disponible' && <span className="text-green-600">🟢 Disponible</span>}
          {producto.estado_inventario === 'ultimas_unidades' && (
            <span className="text-amber-600">🟡 Últimas unidades</span>
          )}
          {producto.estado_inventario === 'agotado' && <span className="text-red-500">🔴 Agotado</span>}
        </p>

        {producto.descripcion_completa && <p className="mt-4 text-gray-600">{producto.descripcion_completa}</p>}
        {producto.contenido && <p className="mt-1 text-sm text-gray-500">Contenido: {producto.contenido}</p>}

        {producto.modo_uso && (
          <div className="mt-4">
            <h2 className="font-medium text-sm text-gray-700">Modo de uso</h2>
            <p className="text-sm text-gray-600">{producto.modo_uso}</p>
          </div>
        )}
        {producto.ingredientes_destacados && (
          <div className="mt-4">
            <h2 className="font-medium text-sm text-gray-700">Ingredientes destacados</h2>
            <p className="text-sm text-gray-600">{producto.ingredientes_destacados}</p>
          </div>
        )}
        {producto.advertencias && <p className="mt-3 text-xs text-gray-400">{producto.advertencias}</p>}

        <div className="mt-6 flex flex-wrap gap-3">
          <AddToCartButton
            producto={{ id: producto.id, nombre: producto.nombre, slug: producto.slug, precio: producto.precio }}
            imagenUrl={imagenes[0]?.url}
            agotado={producto.estado_inventario === 'agotado'}
            variante="completo"
          />
          <WhatsAppButton producto={producto} />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Agrega varios productos al carrito y envía un solo pedido por WhatsApp, o pide este directamente.
        </p>
      </div>
    </div>
  )
}
