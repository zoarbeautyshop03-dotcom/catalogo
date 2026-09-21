import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import type { Producto } from '@/lib/types'
import {
  getCategorias,
  getDestacados,
  getNovedades,
  getOfertas,
  getMasVendidos,
  getImagenesPrincipales,
} from '@/lib/queries'

export const revalidate = 300

export default async function HomePage() {
  const [categorias, destacados, novedades, ofertas, masVendidos] = await Promise.all([
    getCategorias(),
    getDestacados(),
    getNovedades(),
    getOfertas(),
    getMasVendidos(),
  ])

  const idsUnicos = Array.from(
    new Set([...destacados, ...novedades, ...ofertas, ...masVendidos].map((p) => p.id))
  )
  const imagenes = await getImagenesPrincipales(idsUnicos)

  return (
    <div className="pb-10">
      <section className="section-shell pt-5 sm:pt-8">
        <div className="relative overflow-hidden rounded-[34px] bg-gradient-to-br from-white via-lavender-magenta-50 to-lavender-magenta-100 px-6 py-12 shadow-soft-pink ring-1 ring-lavender-magenta-100 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-lavender-magenta-200/50 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-lavender-magenta-300/25 blur-3xl" />
          <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_.9fr]">
            <div className="max-w-2xl">
              <span className="eyebrow">Belleza · Cuidado · Confianza</span>
              <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight text-lavender-magenta-950 sm:text-5xl lg:text-6xl">
                Tu cabello merece sentirse tan bien como se ve.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
                Descubre una selección de productos de belleza y cuidado capilar para crear tu rutina y disfrutar cada paso.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/catalogo"
                  className="rounded-full bg-lavender-magenta-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-lavender-magenta-600/20 hover:-translate-y-0.5 hover:bg-lavender-magenta-700"
                >
                  Explorar catálogo
                </Link>
                <Link
                  href="/catalogo?oferta=1"
                  className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-lavender-magenta-700 ring-1 ring-lavender-magenta-200 hover:-translate-y-0.5 hover:bg-lavender-magenta-50"
                >
                  Ver ofertas
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-5 text-xs font-medium text-gray-500">
                <span>✓ Atención por WhatsApp</span>
                <span>✓ Pedido consolidado</span>
                <span>✓ Envíos a todo el país</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] bg-white/85 p-5 shadow-soft-card ring-1 ring-lavender-magenta-100 backdrop-blur">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,148,244,.36),transparent_32%),radial-gradient(circle_at_72%_70%,rgba(255,206,252,.8),transparent_42%)]" />
                <div className="relative flex h-full flex-col items-center justify-center text-center">
                  <div className="text-[72px] leading-none text-lavender-magenta-500 drop-shadow-sm">✦</div>
                  <p className="mt-2 font-display text-3xl font-semibold text-lavender-magenta-950">Zoar Beauty</p>
                  <p className="mt-1 font-script text-3xl text-lavender-magenta-600">Shop</p>
                  <span className="mt-4 h-px w-24 bg-lavender-magenta-300" />
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-gray-500">By Daniela Perez</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-white px-4 py-3 shadow-soft-card ring-1 ring-lavender-magenta-100">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-lavender-magenta-600">Tu rutina</p>
                <p className="mt-1 text-sm font-semibold text-lavender-magenta-950">Empieza aquí ✨</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-6 sm:pt-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['01', 'Atención personalizada', 'Te ayudamos por WhatsApp a elegir.'],
            ['02', 'Envíos a todo el país', 'Compra desde donde estés.'],
            ['03', 'Selección cuidada', 'Productos pensados para tu rutina.'],
            ['04', 'Un solo pedido', 'Agrega varios productos al carrito.'],
          ].map(([n, title, copy]) => (
            <div key={n} className="rounded-2xl bg-white/90 p-4 ring-1 ring-lavender-magenta-100 sm:p-5">
              <span className="text-[10px] font-bold tracking-[0.2em] text-lavender-magenta-500">{n}</span>
              <p className="mt-2 text-sm font-semibold text-lavender-magenta-950">{title}</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {categorias.length > 0 && (
        <section className="section-shell pt-14 sm:pt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Explora por categoría</span>
              <h2 className="section-title mt-3">Encuentra lo que necesitas</h2>
            </div>
            <Link href="/catalogo" className="hidden text-sm font-semibold text-lavender-magenta-700 hover:text-lavender-magenta-900 sm:block">
              Ver catálogo →
            </Link>
          </div>
          <div className="mt-6 flex gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categorias.map((c) => (
              <CategoryCard key={c.id} categoria={c} />
            ))}
          </div>
        </section>
      )}

      {masVendidos.length > 0 && <Section title="Los favoritos de nuestras clientas" eyebrow="Más buscados" productos={masVendidos} imagenes={imagenes} />}
      {novedades.length > 0 && <Section title="Recién llegados" eyebrow="Lo nuevo" productos={novedades} imagenes={imagenes} />}
      {ofertas.length > 0 && <Section title="Ofertas especiales" eyebrow="Precio especial" productos={ofertas} imagenes={imagenes} />}
      {destacados.length > 0 && <Section title="Destacados" eyebrow="Selección Zoar" productos={destacados} imagenes={imagenes} />}

      {masVendidos.length === 0 && novedades.length === 0 && ofertas.length === 0 && destacados.length === 0 && (
        <div className="section-shell py-20">
          <div className="premium-card px-6 py-14 text-center">
            <p className="font-display text-2xl text-lavender-magenta-950">Tu catálogo está listo para crecer ✨</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Activa productos destacados, nuevos u ofertas desde el panel administrativo para mostrarlos aquí.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Section({
  title,
  eyebrow,
  productos,
  imagenes,
}: {
  title: string
  eyebrow: string
  productos: Producto[]
  imagenes: Record<string, string>
}) {
  return (
    <section className="section-shell pt-14 sm:pt-16">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="section-title mt-3">{title}</h2>
        </div>
        <Link href="/catalogo" className="text-sm font-semibold text-lavender-magenta-700 hover:text-lavender-magenta-900">
          Ver todo →
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} imagenUrl={imagenes[p.id]} />
        ))}
      </div>
    </section>
  )
}
