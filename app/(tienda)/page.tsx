import Link from 'next/link'
import Image from 'next/image'
import ProductCard from '@/components/ProductCard'
import CategoryCard from '@/components/CategoryCard'
import type { Producto } from '@/lib/types'
import { rutaProducto } from '@/lib/slug'
import { formatPrecio } from '@/lib/whatsapp'
import {
  getCategorias,
  getDestacados,
  getNovedades,
  getOfertas,
  getMasVendidos,
  getImagenesPrincipales,
} from '@/lib/queries'

export const revalidate = 300

// Imagen de fondo de la portada (carpeta /public). Para usar una foto propia,
// súbela a /public (por ejemplo hero.jpg) y cambia esta línea por '/hero.jpg'.
const HERO_IMAGEN = '/hero-fondo.svg'

const GARANTIAS = [
  {
    titulo: 'Atención personalizada',
    texto: 'Te ayudamos por WhatsApp a elegir.',
    icono: 'M4 5h16v11H9l-5 4V5Z',
  },
  {
    titulo: 'Envíos a todo el país',
    texto: 'Compra desde donde estés.',
    icono: 'M3 7h11v9H3V7Zm11 3h4l3 3v3h-7v-6ZM7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
  },
  {
    titulo: 'Selección cuidada',
    texto: 'Productos pensados para tu rutina.',
    icono: 'm12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z',
  },
  {
    titulo: 'Un solo pedido',
    texto: 'Agrega varios productos al carrito.',
    icono: 'M6 8.5h12l.7 11H5.3L6 8.5ZM9 9V7a3 3 0 0 1 6 0v2',
  },
]

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

  // Selección Zoar: tres destacados con foto, en una cuadrícula de tamaños
  // distintos. Si no hay tres con foto, se omite y los destacados van en la
  // cuadrícula normal del final.
  const conFoto = destacados.filter((p) => imagenes[p.id]).slice(0, 3)
  const mostrarSeleccion = conFoto.length === 3
  const idsSeleccion = new Set(conFoto.map((p) => p.id))
  const destacadosRestantes = mostrarSeleccion
    ? destacados.filter((p) => !idsSeleccion.has(p.id))
    : destacados

  return (
    <div className="pb-8">
      <section className="section-shell pt-4 sm:pt-8">
        <div
          className="relative overflow-hidden rounded-[32px] shadow-soft-pink ring-1 ring-lavender-magenta-200"
          style={{ backgroundImage: `url(${HERO_IMAGEN})`, backgroundSize: 'cover', backgroundPosition: '72% center' }}
        >
          {/* Velo claro a la izquierda para que el texto siempre se lea sobre la imagen. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-lavender-magenta-50/90 via-lavender-magenta-50/60 to-transparent lg:via-lavender-magenta-50/35"
          />
          <div className="relative px-6 py-16 sm:px-12 sm:py-24 lg:px-16 lg:py-32">
            <div className="max-w-xl lg:max-w-2xl">
              <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-[-0.02em] text-lavender-magenta-950 sm:text-5xl lg:text-[3.5rem]">
                Tu cabello merece sentirse tan bien como se ve.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-gray-700 sm:text-lg sm:leading-8">
                Descubre una selección de productos de belleza y cuidado capilar para crear una rutina que disfrutes de principio a fin.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/catalogo"
                  className="rounded-full bg-lavender-magenta-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-lavender-magenta-600/25 hover:-translate-y-0.5 hover:bg-lavender-magenta-700"
                >
                  Explorar catálogo
                </Link>
                <Link
                  href="/catalogo?oferta=1"
                  className="rounded-full bg-white/90 px-7 py-3.5 text-sm font-semibold text-lavender-magenta-800 ring-1 ring-lavender-magenta-200 backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white"
                >
                  Ver ofertas
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-6 sm:pt-8" aria-label="Por qué comprar en Zoar">
        <ul className="grid grid-cols-1 gap-5 rounded-3xl bg-white/90 px-6 py-6 shadow-soft-card ring-1 ring-lavender-magenta-200/80 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-lavender-magenta-200 lg:px-8">
          {GARANTIAS.map((g) => (
            <li key={g.titulo} className="flex items-start gap-3.5 lg:px-6 lg:first:pl-0 lg:last:pr-0">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-magenta-100 text-lavender-magenta-700 ring-1 ring-lavender-magenta-200">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
                  <path d={g.icono} />
                </svg>
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-900">{g.titulo}</p>
                <p className="mt-0.5 text-sm leading-5 text-gray-600">{g.texto}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {categorias.length > 0 && (
        <section className="section-shell pt-16 sm:pt-24">
          <Encabezado
            titulo="Encuentra lo que necesitas"
            descripcion="Explora la tienda por categoría."
            href="/catalogo"
            enlace="Ver catálogo"
          />
          <div className="-mx-4 mt-8 flex snap-x gap-3 overflow-x-auto px-4 pb-3 sm:mx-0 sm:gap-4 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categorias.map((c) => (
              <CategoryCard key={c.id} categoria={c} />
            ))}
          </div>
        </section>
      )}

      {mostrarSeleccion && (
        <section className="section-shell pt-16 sm:pt-24">
          <Encabezado
            titulo="Selección Zoar"
            descripcion="Los productos que no pueden faltar en tu rutina."
            href="/catalogo"
            enlace="Ver catálogo"
          />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:h-[34rem] lg:grid-cols-[1.1fr_1fr] lg:grid-rows-2">
            <TarjetaSeleccion producto={conFoto[0]} imagenUrl={imagenes[conFoto[0].id]} alta />
            <TarjetaSeleccion producto={conFoto[1]} imagenUrl={imagenes[conFoto[1].id]} />
            <TarjetaSeleccion producto={conFoto[2]} imagenUrl={imagenes[conFoto[2].id]} />
          </div>
        </section>
      )}

      {masVendidos.length > 0 && (
        <Seccion titulo="Favoritos de la tienda" descripcion="Lo que más eligen nuestras clientas." productos={masVendidos} imagenes={imagenes} />
      )}
      {novedades.length > 0 && (
        <Seccion titulo="Recién llegados" descripcion="Productos que acaban de llegar a la tienda." productos={novedades} imagenes={imagenes} />
      )}
      {ofertas.length > 0 && (
        <Seccion titulo="Ofertas especiales" descripcion="Productos con precio rebajado." productos={ofertas} imagenes={imagenes} resaltada />
      )}
      {destacadosRestantes.length > 0 && (
        <Seccion
          titulo={mostrarSeleccion ? 'Más de nuestra selección' : 'Destacados'}
          descripcion="Elegidos por el equipo de Zoar."
          productos={destacadosRestantes}
          imagenes={imagenes}
        />
      )}

      {masVendidos.length === 0 && novedades.length === 0 && ofertas.length === 0 && destacados.length === 0 && (
        <div className="section-shell py-20">
          <div className="premium-card px-6 py-14 text-center">
            <p className="font-display text-2xl font-semibold text-lavender-magenta-950">Tu catálogo está listo para crecer</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-600">
              Activa productos destacados, nuevos u ofertas desde el panel administrativo para mostrarlos aquí.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Encabezado({
  titulo,
  descripcion,
  href,
  enlace,
}: {
  titulo: string
  descripcion?: string
  href: string
  enlace: string
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="section-title">{titulo}</h2>
        {descripcion && <p className="section-copy">{descripcion}</p>}
      </div>
      <Link
        href={href}
        className="shrink-0 pb-1 text-sm font-semibold text-lavender-magenta-700 underline-offset-4 hover:text-lavender-magenta-900 hover:underline"
      >
        {enlace}
      </Link>
    </div>
  )
}

function Seccion({
  titulo,
  descripcion,
  productos,
  imagenes,
  resaltada = false,
}: {
  titulo: string
  descripcion: string
  productos: Producto[]
  imagenes: Record<string, string>
  resaltada?: boolean
}) {
  const contenido = (
    <>
      <Encabezado titulo={titulo} descripcion={descripcion} href="/catalogo" enlace="Ver todo" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} imagenUrl={imagenes[p.id]} />
        ))}
      </div>
    </>
  )

  // La sección resaltada va sobre un fondo suave para darle ritmo a la página.
  if (resaltada) {
    return (
      <section className="section-shell pt-16 sm:pt-24">
        <div className="rounded-[32px] bg-lavender-magenta-200/50 px-4 py-8 ring-1 ring-lavender-magenta-200 sm:px-8 sm:py-12">
          {contenido}
        </div>
      </section>
    )
  }

  return <section className="section-shell pt-16 sm:pt-24">{contenido}</section>
}

function TarjetaSeleccion({
  producto,
  imagenUrl,
  alta = false,
}: {
  producto: Producto
  imagenUrl: string
  alta?: boolean
}) {
  return (
    <Link
      href={rutaProducto(producto.slug)}
      className={`group relative block overflow-hidden rounded-3xl bg-gradient-to-br from-white to-lavender-magenta-50 shadow-soft-card ring-1 ring-lavender-magenta-100 hover:shadow-soft-pink ${
        alta ? 'col-span-2 aspect-[4/3] lg:col-span-1 lg:row-span-2 lg:aspect-auto' : 'aspect-square lg:aspect-auto'
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={imagenUrl}
          alt={producto.nombre}
          fill
          sizes="(max-width: 1024px) 50vw, 40vw"
          className="object-contain p-6 pb-20 transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-full bg-white/90 py-2 pl-4 pr-2 shadow-sm ring-1 ring-lavender-magenta-100 backdrop-blur-sm sm:inset-x-4 sm:bottom-4">
        <p className="min-w-0 truncate text-xs font-semibold text-gray-900 sm:text-sm">{producto.nombre}</p>
        <span className="shrink-0 rounded-full bg-lavender-magenta-600 px-3 py-1.5 text-xs font-bold text-white">
          {formatPrecio(producto.precio, producto.moneda)}
        </span>
      </div>
    </Link>
  )
}
