import Link from 'next/link'
import Image from 'next/image'
import type { Categoria } from '@/lib/types'

// Emoji por defecto SOLO para cuando la categoria no trae icono/imagen propia
// desde el panel. En cuanto Zoar suba sus iconos reales (imagen_url), esos
// tienen prioridad automaticamente.
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
      className="flex-shrink-0 w-32 rounded-2xl bg-rosa-pastel/50 hover:bg-rosa-pastel transition p-4 text-center"
    >
      {categoria.imagen_url ? (
        <span className="relative block w-8 h-8 mx-auto">
          <Image src={categoria.imagen_url} alt="" fill className="object-contain" />
        </span>
      ) : (
        <span className="text-2xl">{emoji}</span>
      )}
      <p className="mt-2 text-xs font-medium text-gray-700">{categoria.nombre}</p>
    </Link>
  )
}
