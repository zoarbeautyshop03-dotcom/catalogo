import { notFound } from 'next/navigation'
import Image from 'next/image'
import type { Metadata } from 'next'
import { getProductoPorSlug, getImagenesDeProducto } from '@/lib/queries'
import { formatPrecio } from '@/lib/whatsapp'
import WhatsAppButton from '@/components/WhatsAppButton'
import AddToCartButton from '@/components/AddToCartButton'
import BotonVolver from '@/components/BotonVolver'

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
    <div className="section-shell py-7 sm:py-10">
      <BotonVolver label="Volver al catálogo" />
      <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-[32px] bg-white shadow-soft-card ring-1 ring-lavender-magenta-100">
            {imagenes[0] ? (
              <Image src={imagenes[0].url} alt={imagenes[0].texto_alt ?? producto.nombre} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" priority />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-lavender-magenta-500">
                <span className="text-6xl">✦</span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">Foto pendiente</span>
              </div>
            )}
          </div>

          {imagenes.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {imagenes.map((img) => (
                <div key={img.id} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white ring-1 ring-lavender-magenta-100">
                  <Image src={img.url} alt={img.texto_alt ?? ''} fill sizes="80px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="premium-card p-6 sm:p-8 lg:p-9">
          <span className="eyebrow">Zoar Beauty Shop</span>
          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-lavender-magenta-950 sm:text-4xl">{producto.nombre}</h1>

          <div className="mt-5 flex items-end gap-3">
            {tieneDescuento && <span className="text-sm text-gray-400 line-through">{formatPrecio(producto.precio_anterior as number, producto.moneda)}</span>}
            <span className="font-display text-3xl font-bold text-lavender-magenta-700">{formatPrecio(producto.precio, producto.moneda)}</span>
          </div>

          <div className="mt-4 inline-flex rounded-full bg-lavender-magenta-50 px-3 py-1.5 text-xs font-semibold text-lavender-magenta-800">
            {producto.estado_inventario === 'disponible' && 'Disponible'}
            {producto.estado_inventario === 'ultimas_unidades' && 'Últimas unidades'}
            {producto.estado_inventario === 'agotado' && 'Agotado'}
          </div>

          {producto.descripcion_completa && <p className="mt-6 text-sm leading-7 text-gray-600">{producto.descripcion_completa}</p>}
          {producto.contenido && <p className="mt-4 text-xs font-medium uppercase tracking-[0.1em] text-gray-400">Contenido: {producto.contenido}</p>}

          <div className="mt-7 space-y-4">
            {producto.modo_uso && (
              <div className="rounded-2xl bg-lavender-magenta-50/70 p-4">
                <h2 className="text-sm font-semibold text-lavender-magenta-950">Modo de uso</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">{producto.modo_uso}</p>
              </div>
            )}
            {producto.ingredientes_destacados && (
              <div className="rounded-2xl bg-white p-4 ring-1 ring-lavender-magenta-100">
                <h2 className="text-sm font-semibold text-lavender-magenta-950">Ingredientes destacados</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">{producto.ingredientes_destacados}</p>
              </div>
            )}
            {producto.advertencias && <p className="text-xs leading-5 text-gray-400">{producto.advertencias}</p>}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <AddToCartButton producto={{ id: producto.id, nombre: producto.nombre, slug: producto.slug, precio: producto.precio }} imagenUrl={imagenes[0]?.url} agotado={producto.estado_inventario === 'agotado'} variante="completo" />
            <WhatsAppButton producto={producto} />
          </div>

          <p className="mt-4 text-xs leading-5 text-gray-400">Agrega varios productos al carrito y envía un solo pedido por WhatsApp, o solicita este producto directamente.</p>
        </div>
      </div>
    </div>
  )
}
