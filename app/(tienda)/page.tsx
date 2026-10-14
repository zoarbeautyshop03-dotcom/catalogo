import Link from 'next/link'
import type { CSSProperties } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
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

// Valores de marca (copy genérico, sin datos de contacto inventados).
const VALORES = [
  {
    titulo: 'Selección con criterio',
    texto: 'Elegimos cada producto pensando en resultados reales para tu rutina.',
    icono: 'm12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z',
  },
  {
    titulo: 'Cuidado cercano',
    texto: 'Acompañamos tu compra con una atención humana y sin afanes.',
    icono: 'M12 20.3 4.7 13a4.7 4.7 0 0 1 6.6-6.7l.7.7.7-.7A4.7 4.7 0 0 1 19.3 13L12 20.3Z',
  },
  {
    titulo: 'Detalle de boutique',
    texto: 'Empacamos cada pedido para que abrirlo también sea un momento bonito.',
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
    <div className="pb-16 sm:pb-24">
      <section className="section-shell pt-4 sm:pt-7">
        <div
          className="zoar-hero relative isolate overflow-hidden"
          style={{ '--hero-imagen': `url(${HERO_IMAGEN})` } as CSSProperties}
        >
          <div aria-hidden="true" className="zoar-hero-wash absolute inset-0" />
          <div aria-hidden="true" className="zoar-orb zoar-orb-one" />
          <div aria-hidden="true" className="zoar-orb zoar-orb-two" />
          <div className="relative z-10 grid min-h-[460px] items-center gap-10 px-6 py-12 sm:min-h-[520px] sm:px-10 sm:py-16 lg:min-h-[560px] lg:grid-cols-[1.05fr_.95fr] lg:px-16 lg:py-20">
            <div className="max-w-2xl">
              <p className="eyebrow reveal-up">Tu ritual, tu momento</p>
              <h1 className="mt-5 font-display text-display-lg font-semibold text-lavender-magenta-950 sm:text-display-xl">
                La belleza está en los <span className="zoar-hero-emphasis">detalles.</span>
              </h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
                Encuentra tus favoritos de belleza y cuidado capilar. Productos elegidos para acompañarte y hacer de tu rutina algo especial.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="brand" size="lg" className="px-6 font-bold">
                  <Link href="/catalogo">
                    Descubrir productos
                    <IconoFlechaArriba />
                  </Link>
                </Button>
                <Button asChild variant="glass" size="lg" className="px-6 font-bold">
                  <Link href="/catalogo?oferta=1">Ver ofertas</Link>
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-gray-700 sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <IconoDestello className="h-4 w-4 text-dorado" /> Selección especial
                </span>
                <span className="inline-flex items-center gap-2">
                  <IconoCorazon className="h-4 w-4 text-lavender-magenta-600" /> Atención cercana
                </span>
              </div>
            </div>

            <div className="hidden min-h-[290px] items-center justify-center lg:flex">
              <div className="zoar-hero-note w-[min(100%,340px)] rounded-boutique p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-[.16em] text-lavender-magenta-800">
                    Zoar Beauty
                  </span>
                  <IconoDestello className="h-5 w-5 text-lavender-magenta-600" />
                </div>
                <div className="my-7 flex h-36 items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-white/80 to-lavender-magenta-100/80">
                  <span className="font-script text-5xl text-lavender-magenta-700">Shop</span>
                  <IconoDestello className="h-7 w-7 text-lavender-magenta-400" />
                </div>
                <p className="font-display text-2xl font-semibold leading-tight text-lavender-magenta-950">
                  Un toque de cuidado, todos los días.
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Pequeños detalles que hacen especial tu rutina.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-6 sm:pt-8" aria-label="Por qué comprar en Zoar">
        <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-boutique bg-lavender-magenta-100/70 shadow-card ring-1 ring-lavender-magenta-100 sm:grid-cols-2 lg:grid-cols-4">
          {GARANTIAS.map((g) => (
            <li key={g.titulo} className="flex items-start gap-3.5 bg-white/95 px-6 py-6">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lavender-magenta-50 text-lavender-magenta-700 ring-1 ring-lavender-magenta-100">
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
        <section className="section-shell reveal-on-scroll pt-16 sm:pt-24">
          <Encabezado
            eyebrow="Colecciones"
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
        <section className="section-shell reveal-on-scroll pt-16 sm:pt-24">
          <Encabezado
            eyebrow="Curaduría"
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
        <Seccion eyebrow="Favoritos" titulo="Favoritos de la tienda" descripcion="Los productos que más recomendamos en la tienda." productos={masVendidos} imagenes={imagenes} />
      )}
      {novedades.length > 0 && (
        <Seccion eyebrow="Novedades" titulo="Recién llegados" descripcion="Productos que acaban de llegar a la tienda." productos={novedades} imagenes={imagenes} />
      )}
      {ofertas.length > 0 && (
        <Seccion eyebrow="Ahorra" titulo="Ofertas especiales" descripcion="Productos con precio rebajado." productos={ofertas} imagenes={imagenes} resaltada />
      )}
      {destacadosRestantes.length > 0 && (
        <Seccion
          eyebrow="Destacados"
          titulo={mostrarSeleccion ? 'Más de nuestra selección' : 'Destacados'}
          descripcion="Elegidos por el equipo de Zoar."
          productos={destacadosRestantes}
          imagenes={imagenes}
        />
      )}

      <section className="section-shell pt-16 sm:pt-24">
        <div className="reveal-on-scroll overflow-hidden rounded-boutique-lg bg-gradient-to-br from-lavender-magenta-950 via-plum to-lavender-magenta-900 px-6 py-12 text-white shadow-float sm:px-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
            <div>
              <p className="eyebrow !text-blush-pink-200">Nuestra historia</p>
              <h2 className="mt-4 font-display text-display-md font-semibold leading-tight text-white">
                Belleza pensada para tu día a día
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                En Zoar Beauty creemos que cuidarte no tiene que ser complicado. Reunimos productos de belleza y
                cuidado capilar en un solo lugar, con una selección cuidada y una atención cercana para que
                encontrar tu próximo favorito sea fácil y bonito.
              </p>
              <p className="mt-6 font-script text-3xl text-blush-pink-200">Zoar</p>
            </div>

            <ul className="grid gap-4">
              {VALORES.map((v) => (
                <li key={v.titulo} className="flex items-start gap-4 rounded-boutique border border-white/15 bg-white/10 px-5 py-4 md:backdrop-blur-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15 text-blush-pink-100">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d={v.icono} />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{v.titulo}</p>
                    <p className="mt-0.5 text-sm leading-6 text-white/75">{v.texto}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

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
  eyebrow,
  titulo,
  descripcion,
  href,
  enlace,
}: {
  eyebrow?: string
  titulo: string
  descripcion?: string
  href: string
  enlace: string
}) {
  return (
    <header>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="max-w-2xl">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2 className="section-title mt-3">{titulo}</h2>
          {descripcion && <p className="section-copy">{descripcion}</p>}
        </div>
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 pb-1 text-sm font-semibold text-lavender-magenta-700 transition-colors hover:text-lavender-magenta-900"
        >
          {enlace}
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 transition-transform duration-300 ease-boutique group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </Link>
      </div>
      <div className="hairline-gold mt-8" />
    </header>
  )
}

function Seccion({
  eyebrow,
  titulo,
  descripcion,
  productos,
  imagenes,
  resaltada = false,
}: {
  eyebrow?: string
  titulo: string
  descripcion: string
  productos: Producto[]
  imagenes: Record<string, string>
  resaltada?: boolean
}) {
  const contenido = (
    <>
      <Encabezado eyebrow={eyebrow} titulo={titulo} descripcion={descripcion} href="/catalogo" enlace="Ver todo" />
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
      <section className="section-shell reveal-on-scroll pt-16 sm:pt-24">
        <div className="rounded-boutique-lg bg-lavender-magenta-50/70 px-4 py-10 ring-1 ring-lavender-magenta-100 sm:px-8 sm:py-12">
          {contenido}
        </div>
      </section>
    )
  }

  return <section className="section-shell reveal-on-scroll pt-16 sm:pt-24">{contenido}</section>
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
      className={`group relative block overflow-hidden rounded-boutique-lg bg-gradient-to-br from-white to-lavender-magenta-50 shadow-card ring-1 ring-lavender-magenta-100 transition duration-300 ease-boutique hover:-translate-y-1 hover:shadow-card-hover ${
        alta ? 'col-span-2 aspect-[4/3] lg:col-span-1 lg:row-span-2 lg:aspect-auto' : 'aspect-square lg:aspect-auto'
      }`}
    >
      <div className="absolute inset-0">
        <Image
          src={imagenUrl}
          alt={producto.nombre}
          fill
          sizes="(max-width: 1024px) 50vw, 40vw"
          className="object-contain p-6 pb-20 transition-transform duration-500 ease-boutique group-hover:scale-105"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-lavender-magenta-950/10 to-transparent"
      />
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-3 rounded-full bg-white/90 py-2 pl-4 pr-2 shadow-sm ring-1 ring-lavender-magenta-100 sm:inset-x-4 sm:bottom-4">
        <p className="min-w-0 truncate text-xs font-semibold text-gray-900 sm:text-sm">{producto.nombre}</p>
        <span className="shrink-0 rounded-full bg-lavender-magenta-600 px-3 py-1.5 text-xs font-bold text-white">
          {formatPrecio(producto.precio, producto.moneda)}
        </span>
      </div>
    </Link>
  )
}

type IconoProps = { className?: string }

function IconoFlechaArriba({ className = 'h-4 w-4' }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  )
}

function IconoDestello({ className = 'h-4 w-4' }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3.2l1.7 4.9 4.9 1.7-4.9 1.7L12 16.4l-1.7-4.9L5.4 9.8l4.9-1.7L12 3.2Z" />
      <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
    </svg>
  )
}

function IconoCorazon({ className = 'h-4 w-4' }: IconoProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20.3 4.7 13a4.7 4.7 0 0 1 6.6-6.7l.7.7.7-.7A4.7 4.7 0 0 1 19.3 13L12 20.3Z" />
    </svg>
  )
}

