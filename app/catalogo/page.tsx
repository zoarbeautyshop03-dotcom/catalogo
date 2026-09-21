import ProductCard from '@/components/ProductCard'
import { getProductosCatalogo, getCategorias, getMarcas, getImagenesPrincipales } from '@/lib/queries'

export const revalidate = 60

type SearchParams = {
  categoria?: string
  marca?: string
  min?: string
  max?: string
  q?: string
  page?: string
}

export default async function CatalogoPage({ searchParams }: { searchParams: SearchParams }) {
  const page = Number(searchParams.page ?? '1')
  const { productos, total } = await getProductosCatalogo({
    categoriaSlug: searchParams.categoria,
    marcaSlug: searchParams.marca,
    precioMin: searchParams.min ? Number(searchParams.min) : undefined,
    precioMax: searchParams.max ? Number(searchParams.max) : undefined,
    busqueda: searchParams.q,
    page,
  })
  const [categorias, marcas] = await Promise.all([getCategorias(), getMarcas()])
  const imagenes = await getImagenesPrincipales(productos.map((p) => p.id))

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl mb-2">Catálogo</h1>

      <form className="mb-6 flex gap-2" action="/catalogo">
        <input
          type="text"
          name="q"
          defaultValue={searchParams.q}
          placeholder="¿Qué producto estás buscando?"
          className="flex-1 rounded-full border border-rosa-pastel px-4 py-2 text-sm"
        />
        <button className="rounded-full bg-fucsia text-white px-4 py-2 text-sm">Buscar</button>
      </form>

      {/* Filtro simple por categoría; el resto de filtros (marca, precio, tipo de
          cabello) se agregan en una pasada siguiente reutilizando `marcas` y las
          mismas query params (?marca=, ?min=, ?max=) que ya soporta getProductosCatalogo */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
        <a
          href="/catalogo"
          className={`badge px-3 py-1.5 ${!searchParams.categoria ? 'bg-fucsia text-white' : 'bg-rosa-pastel/60 text-gray-700'}`}
        >
          Todas
        </a>
        {categorias.map((c) => (
          <a
            key={c.id}
            href={`/catalogo?categoria=${c.slug}`}
            className={`badge px-3 py-1.5 whitespace-nowrap ${
              searchParams.categoria === c.slug ? 'bg-fucsia text-white' : 'bg-rosa-pastel/60 text-gray-700'
            }`}
          >
            {c.nombre}
          </a>
        ))}
      </div>

      <p className="text-sm text-gray-500 mb-4">{total} productos</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {productos.map((p) => (
          <ProductCard key={p.id} producto={p} imagenUrl={imagenes[p.id]} />
        ))}
      </div>

      {productos.length === 0 && (
        <p className="text-center text-gray-500 py-16">
          No encontramos ese producto. Prueba con otra categoría o palabra de búsqueda.
        </p>
      )}
    </div>
  )
}
