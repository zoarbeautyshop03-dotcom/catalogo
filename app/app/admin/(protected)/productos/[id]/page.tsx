import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { actualizarProducto } from '@/lib/actions/productos'
import { agregarImagen, eliminarImagen, marcarPrincipal } from '@/lib/actions/imagenes'
import ProductoForm from '@/components/admin/ProductoForm'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function EditarProductoPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase()
  const [{ data: producto }, { data: categorias }, { data: marcas }, { data: subcategorias }, { data: imagenes }] =
    await Promise.all([
      supabase.from('productos').select('*').eq('id', params.id).single(),
      supabase.from('categorias').select('*').order('orden'),
      supabase.from('marcas').select('*').order('nombre'),
      supabase.from('subcategorias').select('id, nombre, categoria_id').order('orden'),
      supabase.from('producto_imagenes').select('*').eq('producto_id', params.id).order('orden'),
    ])

  if (!producto) notFound()

  const actualizarConId = actualizarProducto.bind(null, params.id)
  const agregarImagenConId = agregarImagen.bind(null, params.id)

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">{producto.nombre}</h1>

      <ProductoForm
        producto={producto}
        categorias={categorias ?? []}
        marcas={marcas ?? []}
        subcategorias={subcategorias ?? []}
        action={actualizarConId}
      />

      <section className="bg-white rounded-2xl shadow-sm p-5 mt-6">
        <h2 className="font-medium text-gray-700 mb-4">Fotos</h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
          {(imagenes ?? []).map((img) => (
            <div key={img.id} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.texto_alt ?? ''} className="w-full aspect-square object-cover rounded-lg" />
              {img.es_principal && (
                <span className="absolute top-1 left-1 badge bg-fucsia text-white">Principal</span>
              )}
              <div className="flex items-center justify-between mt-1 text-xs">
                {!img.es_principal && (
                  <form action={marcarPrincipal.bind(null, params.id, img.id)}>
                    <button className="text-fucsia hover:underline">Hacer principal</button>
                  </form>
                )}
                <form action={eliminarImagen.bind(null, params.id, img.id)}>
                  <DeleteButton label="Quitar" />
                </form>
              </div>
            </div>
          ))}
          {(imagenes ?? []).length === 0 && (
            <p className="col-span-full text-sm text-gray-400">Todavía no hay fotos para este producto.</p>
          )}
        </div>

        <form action={agregarImagenConId} className="flex flex-col sm:flex-row gap-2">
          <input
            name="url"
            type="url"
            required
            placeholder="URL de la foto (Cloudinary/ImageKit)"
            className="flex-1 rounded-lg border border-rosa-pastel px-3 py-2 text-sm"
          />
          <input
            name="texto_alt"
            type="text"
            placeholder="Texto alternativo (opcional)"
            className="flex-1 rounded-lg border border-rosa-pastel px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-lg bg-fucsia text-white px-4 py-2 text-sm">
            Agregar
          </button>
        </form>
      </section>
    </div>
  )
}
