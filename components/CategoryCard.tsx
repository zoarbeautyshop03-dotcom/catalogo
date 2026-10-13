import Link from 'next/link'
import Image from 'next/image'
import type { Categoria } from '@/lib/types'

// Iconografía SVG (estilo Lucide) por categoría. Reemplaza los antiguos
// símbolos tipográficos que se usaban como icono por defecto.
const SLUGS_CON_ICONO = new Set([
  'cuidado-capilar',
  'perfumeria-femenina',
  'perfumeria-masculina',
  'cuidado-corporal',
  'cuidado-facial',
  'desodorantes',
  'maquillaje',
  'accesorios-cabello',
  'productos-ninos',
  'otros',
])

function IconoCategoria({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {slug === 'cuidado-capilar' && (
        <>
          <path d="M12 2.8c3.4 3.9 5.7 6.9 5.7 10.1a5.7 5.7 0 0 1-11.4 0c0-3.2 2.3-6.2 5.7-10.1Z" />
          <path d="M12 9.5V19" />
        </>
      )}
      {slug === 'perfumeria-femenina' && (
        <>
          <path d="M12 3.2l1.7 4.9 4.9 1.7-4.9 1.7L12 16.4l-1.7-4.9L5.4 9.8l4.9-1.7L12 3.2Z" />
          <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
        </>
      )}
      {slug === 'perfumeria-masculina' && <path d="M12 3.2 20.8 12 12 20.8 3.2 12 12 3.2Z" />}
      {slug === 'cuidado-corporal' && (
        <>
          <path d="M4.5 19.5C3 12 6.5 4.5 19.5 4.5c0 13-7.5 16.5-15 15Z" />
          <path d="M4.5 19.5C8 16 11 13 14.5 11" />
        </>
      )}
      {slug === 'cuidado-facial' && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
        </>
      )}
      {(slug === 'desodorantes' || slug === 'otros' || !SLUGS_CON_ICONO.has(slug)) && (
        <path d="M12 3.2l1.7 4.9 4.9 1.7-4.9 1.7L12 16.4l-1.7-4.9L5.4 9.8l4.9-1.7L12 3.2Z" />
      )}
      {slug === 'maquillaje' && (
        <>
          <path d="M12 3.2 20.8 12 12 20.8 3.2 12 12 3.2Z" />
          <path d="M8.5 12h7" />
        </>
      )}
      {(slug === 'accesorios-cabello' || slug === 'productos-ninos') && (
        <path d="M12 20.3 4.7 13a4.7 4.7 0 0 1 6.6-6.7l.7.7.7-.7A4.7 4.7 0 0 1 19.3 13L12 20.3Z" />
      )}
    </svg>
  )
}

export default function CategoryCard({ categoria }: { categoria: Categoria }) {
  return (
    <Link
      href={`/catalogo?categoria=${encodeURIComponent(categoria.slug)}`}
      className="card-editorial group flex w-40 shrink-0 snap-start flex-col overflow-hidden sm:w-44"
    >
      <div className="relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br from-lavender-magenta-50 to-lavender-magenta-100/70">
        <span
          aria-hidden="true"
          className="absolute -right-6 -top-8 h-20 w-20 rounded-full bg-white/60 blur-xl"
        />
        {categoria.imagen_url ? (
          <span className="relative block h-16 w-16">
            <Image
              src={categoria.imagen_url}
              alt=""
              fill
              sizes="64px"
              className="object-contain transition-transform duration-300 ease-boutique group-hover:scale-105"
            />
          </span>
        ) : (
          <IconoCategoria
            slug={categoria.slug}
            className="relative h-9 w-9 text-lavender-magenta-600 transition-transform duration-300 ease-boutique group-hover:scale-110"
          />
        )}
      </div>

      <div className="flex flex-1 items-center justify-between gap-2 px-4 py-3.5">
        <p className="min-w-0 font-display text-sm font-semibold leading-snug text-gray-900">
          {categoria.nombre}
        </p>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 shrink-0 text-dorado transition-transform duration-300 ease-boutique group-hover:translate-x-0.5"
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
      </div>
    </Link>
  )
}
