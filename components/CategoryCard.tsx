import Link from 'next/link'
import type { Categoria } from '@/lib/types'

export default function CategoryCard({ categoria }: { categoria: Categoria }) {
  return (
    <Link
      href={`/catalogo?categoria=${categoria.slug}`}
      className="flex-shrink-0 w-32 rounded-2xl bg-rosa-pastel/50 hover:bg-rosa-pastel transition p-4 text-center"
    >
      <span className="text-2xl">{categoria.icono ?? '🌸'}</span>
      <p className="mt-2 text-xs font-medium text-gray-700">{categoria.nombre}</p>
    </Link>
  )
}
