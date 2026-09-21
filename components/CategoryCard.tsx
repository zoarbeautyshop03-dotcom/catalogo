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
      href={`/catalogo?categoria=${categoria.slug}`}
      className="group relative block w-44 shrink-0 overflow-hidden rounded-[26px] bg-white p-5 shadow-soft-card ring-1 ring-lavender-magenta-100 hover:-translate-y-1 hover:shadow-soft-pink sm:w-48"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-lavender-magenta-100/80 transition-transform duration-300 group-hover:scale-125" />
      <div className="relative flex h-20 items-center justify-center rounded-2xl bg-gradient-to-br from-lavender-magenta-50 to-lavender-magenta-100/70 ring-1 ring-lavender-magenta-100">
        {categoria.imagen_url ? (
          <span className="relative block h-14 w-14">
            <Image src={categoria.imagen_url} alt="" fill className="object-contain" />
          </span>
        ) : (
          <span className="font-display text-4xl text-lavender-magenta-500">{icono}</span>
        )}
      </div>
      <p className="relative mt-4 text-sm font-semibold text-lavender-magenta-950">{categoria.nombre}</p>
      <span className="relative mt-1 inline-block text-[11px] font-medium text-lavender-magenta-700">Explorar →</span>
    </Link>
  )
}
