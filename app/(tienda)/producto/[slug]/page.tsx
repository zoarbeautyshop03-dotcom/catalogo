import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProductoPorSlug, getImagenesDeProducto, getCategorias, getProductosRelacionados, getImagenesPrincipales, getConfiguracion } from '@/lib/queries'
import { formatPrecio, porcentajeDescuento } from '@/lib/whatsapp'
import WhatsAppButton from '@/components/WhatsAppButton'
import AddToCartButton from '@/components/AddToCartButton'
import BotonVolver from '@/components/BotonVolver'
import ProductGallery from '@/components/ProductGallery'
import Breadcrumb from '@/components/Breadcrumb'
import ProductCard from '@/components/ProductCard'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export const revalidate = 300

type Props = { params: { slug: string } }

function IconoEnvio() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 7.5h11v9H3z" strokeLinejoin="round" />
      <path d="M14 10h3.4l3.1 3.2v3.3H14z" strokeLinejoin="round" />
      <circle cx="7" cy="17.5" r="1.6" />
      <circle cx="17.2" cy="17.5" r="1.6" />
    </svg>
  )
}

function IconoGarantia() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 3.2 5.5 5.9v5.2c0 4.1 2.7 7.6 6.5 8.9 3.8-1.3 6.5-4.8 6.5-8.9V5.9L12 3.2Z" strokeLinejoin="round" />
      <path d="m9.2 12 1.9 1.9 3.7-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconoAtencion() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 12a8 8 0 0 1 16 0" strokeLinecap="round" />
      <path d="M4 13.5v2.2A2.3 2.3 0 0 0 6.3 18H7v-5.5H6.3A2.3 2.3 0 0 0 4 13.5Zm16 0v2.2A2.3 2.3 0 0 1 17.7 18H17v-5.5h.7a2.3 2.3 0 0 1 2.3 2.3Z" strokeLinejoin="round" />
      <path d="M12 20.2h2.2a2 2 0 0 0 2-2" strokeLinecap="round" />
    </svg>
  )
}

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

  const [imagenes, categorias, relacionados, config] = await Promise.all([
    getImagenesDeProducto(producto.id),
    getCategorias().catch(() => []),
    getProductosRelacionados(producto.categoria_id, producto.id, 4),
    getConfiguracion().catch(() => null),
  ])
  const imagenesRelacionados = await getImagenesPrincipales(relacionados.map((r) => r.id)).catch(() => ({}) as Record<string, string>)
  const categoria = categorias.find((c) => c.id === producto.categoria_id)
  const tieneDescuento = !!producto.precio_anterior && producto.precio_anterior > producto.precio
  const porcentaje = porcentajeDescuento(producto)

  return (
    <div className="section-shell py-7 sm:py-10">
      <Breadcrumb
        items={[
          { etiqueta: 'Inicio', href: '/' },
          { etiqueta: 'Catálogo', href: '/catalogo' },
          ...(categoria ? [{ etiqueta: categoria.nombre, href: `/catalogo?categoria=${encodeURIComponent(categoria.slug)}` }] : []),
          { etiqueta: producto.nombre },
        ]}
      />
      <div className="sm:hidden">
        <BotonVolver label="Volver al catálogo" />
      </div>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-start lg:gap-10">
        <ProductGallery fotos={imagenes.map((i) => ({ id: i.id, url: i.url, texto_alt: i.texto_alt }))} nombre={producto.nombre} />

        <div className="lg:sticky lg:top-24">
          <div className="premium-card p-6 sm:p-8 lg:p-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="eyebrow">Zoar Beauty Shop</span>
              <span className="catalog-status-pill gap-1.5">
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${
                    producto.estado_inventario === 'disponible'
                      ? 'bg-green-500'
                      : producto.estado_inventario === 'ultimas_unidades'
                        ? 'bg-amber-500'
                        : 'bg-gray-400'
                  }`}
                />
                {producto.estado_inventario === 'disponible' && 'Disponible'}
                {producto.estado_inventario === 'ultimas_unidades' && 'Últimas unidades'}
                {producto.estado_inventario === 'agotado' && 'Agotado'}
              </span>
            </div>

            <h1 className="mt-5 font-display text-3xl font-semibold leading-tight tracking-[-0.015em] text-lavender-magenta-950 sm:text-4xl">{producto.nombre}</h1>

            <div className="mt-5 flex flex-wrap items-end gap-x-3 gap-y-1">
              {tieneDescuento && <span className="text-sm text-gray-500 line-through">{formatPrecio(producto.precio_anterior as number, producto.moneda)}</span>}
              <span className="font-display text-4xl font-semibold tracking-tight text-lavender-magenta-950">{formatPrecio(producto.precio, producto.moneda)}</span>
              {tieneDescuento && porcentaje != null && (
                <Badge className="mb-1 text-xs font-bold shadow-sm">-{porcentaje}%</Badge>
              )}
            </div>

            <div className="hairline-magenta mt-6" />

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <AddToCartButton producto={{ id: producto.id, nombre: producto.nombre, slug: producto.slug, precio: producto.precio }} imagenUrl={imagenes[0]?.url} agotado={producto.estado_inventario === 'agotado'} variante="completo" />
              <WhatsAppButton producto={producto} numero={config?.whatsapp_numero} />
            </div>

            <p className="mt-3 text-xs leading-5 text-gray-600">
              Agrega varios productos al carrito y envía un solo pedido por WhatsApp, o solicita este producto directamente. Al continuar a WhatsApp aceptas la{' '}
              <Link href="/privacidad" className="font-semibold text-lavender-magenta-700 underline underline-offset-2">Política de privacidad</Link> y los{' '}
              <Link href="/terminos" className="font-semibold text-lavender-magenta-700 underline underline-offset-2">Términos</Link>. Tienes{' '}
              <Link href="/devoluciones" className="font-semibold text-lavender-magenta-700 underline underline-offset-2">derecho de retracto</Link>.
            </p>

            {producto.descripcion_completa && <p className="mt-6 text-sm leading-7 text-gray-600">{producto.descripcion_completa}</p>}
            {producto.contenido && <p className="mt-4 text-sm font-medium text-gray-500">Contenido: {producto.contenido}</p>}

            {(producto.modo_uso || producto.ingredientes_destacados) && (
              <>
                <h2 className="mt-8 font-display text-lg font-semibold text-lavender-magenta-950">Detalles del producto</h2>
                <Accordion type="multiple" defaultValue={['uso']} className="mt-3 space-y-3">
                {producto.modo_uso && (
                  <AccordionItem value="uso">
                    <AccordionTrigger>Modo de uso</AccordionTrigger>
                    <AccordionContent>{producto.modo_uso}</AccordionContent>
                  </AccordionItem>
                )}
                {producto.ingredientes_destacados && (
                  <AccordionItem value="ingredientes">
                    <AccordionTrigger>Ingredientes destacados</AccordionTrigger>
                    <AccordionContent>{producto.ingredientes_destacados}</AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
              </>
            )}
            {producto.advertencias && <p className="mt-4 text-xs leading-5 text-gray-500">{producto.advertencias}</p>}
          </div>

          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            <li className="card-editorial flex items-start gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-magenta-50 text-lavender-magenta-700">
                <IconoEnvio />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-[0.08em] text-lavender-magenta-950">Envío</span>
                <span className="mt-0.5 block text-xs leading-5 text-gray-600">Coordinamos la entrega por WhatsApp.</span>
              </span>
            </li>
            <li className="card-editorial flex items-start gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-magenta-50 text-lavender-magenta-700">
                <IconoGarantia />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-[0.08em] text-lavender-magenta-950">Garantía</span>
                <span className="mt-0.5 block text-xs leading-5 text-gray-600">Productos originales y sellados.</span>
              </span>
            </li>
            <li className="card-editorial flex items-start gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-magenta-50 text-lavender-magenta-700">
                <IconoAtencion />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-[0.08em] text-lavender-magenta-950">Atención</span>
                <span className="mt-0.5 block text-xs leading-5 text-gray-600">Te asesoramos antes de comprar.</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      {relacionados.length > 0 && (
        <section className="reveal-on-scroll mt-14" aria-labelledby="relacionados-titulo">
          <div className="flex items-end justify-between gap-4">
            <header className="max-w-2xl">
              <p className="eyebrow">Colección</p>
              <h2 id="relacionados-titulo" className="section-title mt-3">También te puede interesar</h2>
            </header>
          </div>
          <div className="hairline-gold mt-6" />
          <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {relacionados.map((r) => (
              <ProductCard key={r.id} producto={r} imagenUrl={imagenesRelacionados[r.id]} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
