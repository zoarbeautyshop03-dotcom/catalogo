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
} from '@/lib/queries'

export const revalidate = 300 // ISR: refresca cada 5 minutos

export default async function HomePage() {
  const [categorias, destacados, novedades, ofertas, masVendidos] = await Promise.all([
    getCategorias(),
    getDestacados(),
    getNovedades(),
    getOfertas(),
    getMasVendidos(),
  ])

  return (
    <div>
      <section className="bg-rosa-pastel/40 py-16 px-4 text-center">
        <h1 className="font-display text-3xl md:text-4xl text-gray-800 max-w-2xl mx-auto">
          Tu cabello merece sentirse tan bien como se ve
        </h1>
        <p className="mt-3 text-gray-600">
          Descubre productos de belleza y cuidado capilar seleccionados para ti
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/catalogo" className="rounded-full bg-fucsia text-white px-6 py-3 font-medium">
            Explorar catálogo
          </Link>
          <Link
            href="/catalogo?oferta=1"
            className="rounded-full border border-fucsia text-fucsia px-6 py-3 font-medium"
          >
            Ver ofertas
          </Link>
        </div>
      </section>

      {categorias.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="font-display text-xl mb-4">Encuentra lo que necesitas</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categorias.map((c) => (
              <CategoryCard key={c.id} categoria={c} />
            ))}
          </div>
        </section>
      )}

      {masVendidos.length > 0 && <Section title="🔥 Los favoritos de nuestras clientas" productos={masVendidos} />}
      {novedades.length > 0 && <Section title="✨ Recién llegados" productos={novedades} />}
      {ofertas.length > 0 && <Section title="💗 Ofertas especiales" productos={ofertas} />}
      {destacados.length > 0 && <Section title="Destacados" productos={destacados} />}

      {masVendidos.length === 0 && novedades.length === 0 && ofertas.length === 0 && destacados.length === 0 && (
        <p className="text-center text-gray-500 py-16">
          Todavía no hay productos marcados como destacados, nuevos u ofertas. Puedes activarlos desde el panel
          admin (Fase 4) o directamente en Supabase mientras tanto.
        </p>
      )}
    </div>
  )
}

function Section({ title, productos }: { title: string; productos: Producto[] }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="font-display text-xl mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} />
        ))}
      </div>
    </section>
  )
}
