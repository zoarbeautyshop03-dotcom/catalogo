import Link from 'next/link'
import Image from 'next/image'
import type { Categoria } from '@/lib/types'

const EMOJI_POR_SLUG: Record<string, string> = {
  'cuidado-capilar': '✦',
  'perfumeria-femenina': '✿',
  'perfumeria-masculina': '◌',
  'cuidado-corporal': '◊',
  'cuidado-facial': '✧',
  desodorantes: '♡',
  maquillaje: '◒',
  'accesorios-cabello': '⌁',
  'productos-ninos': '◡',
  otros: '⋆',
}

export default function CategoryCard({ categoria }: { categoria: Categoria }) {
  const icono = categoria.icono ?? EMOJI_POR_SLUG[categoria.slug] ?? '✦'

  return (
    <Link
      href={`/catalogo?categoria=${encodeURIComponent(categoria.slug)}`}
      className="group block w-40 shrink-0 snap-start rounded-3xl bg-white p-4 shadow-soft-card ring-1 ring-lavender-magenta-200/80 hover:shadow-soft-pink hover:ring-lavender-magenta-300 sm:w-44"
    >
      <div className="flex h-20 items-center justify-center rounded-2xl bg-lavender-magenta-100 transition-colors group-hover:bg-lavender-magenta-200/70">
        {categoria.imagen_url ? (
          <span className="relative block h-14 w-14">
            <Image src={categoria.imagen_url} alt="" fill className="object-contain" />
          </span>
        ) : (
          <span className="font-display text-4xl text-lavender-magenta-700">{icono}</span>
        )}
      </div>
      <p className="mt-3.5 text-sm font-semibold leading-snug text-gray-900">{categoria.nombre}</p>
    </Link>
  )
}
