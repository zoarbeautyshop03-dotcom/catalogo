import Link from 'next/link'
import Image from 'next/image'
import type { Categoria } from '@/lib/types'

const EMOJI_POR_SLUG: Record<string, string> = {
  'cuidado-capilar': '💆🏻‍♀️',
  'perfumeria-femenina': '🌸',
  'perfumeria-masculina': '🍃',
  'cuidado-corporal': '🧴',
  'cuidado-facial': '✨',
  desodorantes: '🌿',
  maquillaje: '💄',
  'accesorios-cabello': '🎀',
  'productos-ninos': '🧸',
  otros: '🎁',
}

export default function CategoryCard({ categoria }: { categoria: Categoria }) {
  const emoji = categoria.icono ?? EMOJI_POR_SLUG[categoria.slug] ?? '🌸'

  return (
    <Link
      href={`/catalogo?categoria=${categoria.slug}`}
      className="flex-shrink-0 w-36 rounded-2xl bg-gradient-to-br from-rosa-pastel to-rosa-empolvado/60 hover:brightness-95 transition p-5 text-center shadow-sm"
    >
      {categoria.imagen_url ? (
        <span className="relative block w-10 h-10 mx-auto">
          <Image src={categoria.imagen_url} alt="" fill className="object-contain" />
        </span>
      ) : (
        <span className="text-3xl">{emoji}</span>
      )}
      <p className="mt-3 text-xs font-semibold text-gray-800">{categoria.nombre}</p>
      <span className="mt-1 inline-block text-[10px] text-fucsia">Ver más →</span>
    </Link>
  )
}
