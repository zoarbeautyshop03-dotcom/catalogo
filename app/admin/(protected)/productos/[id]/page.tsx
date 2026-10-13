import { notFound } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { actualizarProducto } from '@/lib/actions/productos'
import { agregarImagen, eliminarImagen, marcarPrincipal } from '@/lib/actions/imagenes'
import ProductoForm from '@/components/admin/ProductoForm'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function EditarProductoPage({ params, searchParams }: { params: { id: string }; searchParams: { returnTo?: string } }) {
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
      <header className="mb-6">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-lavender-magenta-700"><span aria-hidden="true" className="h-px w-6 bg-dorado" />Catálogo · Edición</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-lavender-magenta-950">{producto.nombre}</h1>
        <div className="hairline-gold mt-5" aria-hidden="true" />
      </header>

      <ProductoForm
        producto={producto}
        categorias={categorias ?? []}
        marcas={marcas ?? []}
        subcategorias={subcategorias ?? []}
        action={actualizarConId}
        returnTo={searchParams.returnTo ?? '/admin/productos'}
      />

      <section className="mt-6 rounded-boutique-lg border border-lavender-magenta-100 bg-white p-5 shadow-card">
        <h2 className="font-display text-lg font-semibold text-lavender-magenta-950">Fotos</h2>
        <div className="hairline-gold mt-3 mb-4" aria-hidden="true" />

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
          {(imagenes ?? []).map((img) => (
            <div key={img.id} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.texto_alt ?? ''} className="w-full aspect-square object-cover rounded-2xl ring-1 ring-lavender-magenta-100" />
              {img.es_principal && (
                <span className="badge absolute top-1.5 left-1.5 bg-lavender-magenta-700 text-white shadow-card">Principal</span>
              )}
              <div className="flex items-center justify-between mt-1.5 text-xs">
                {!img.es_principal && (
                  <form action={marcarPrincipal.bind(null, params.id, img.id)}>
                    <button className="font-medium text-lavender-magenta-700 transition-colors duration-200 ease-boutique hover:underline">Hacer principal</button>
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

        <p className="mb-3 text-xs leading-5 text-gray-500">
          Usa solo fotos tuyas o que tengas autorización escrita de usar (de la marca o del proveedor). No copies imágenes de otras tiendas, buscadores o redes
          sociales: pueden tener derechos de autor. En «Texto alternativo» describe lo que se ve (ej.: «Frasco de shampoo hidratante de 400 ml»).
        </p>
        <form action={agregarImagenConId} className="flex flex-col sm:flex-row gap-2">
          <input
            name="url"
            type="url"
            required
            aria-label="URL de la foto"
            placeholder="URL de la foto (Cloudinary/ImageKit)"
            className="flex-1 rounded-2xl border border-rosa-pastel bg-white px-3 py-2 text-sm text-gray-700 transition-colors duration-200 ease-boutique focus:border-lavender-magenta-400 focus:outline-none"
          />
          <input
            name="texto_alt"
            type="text"
            aria-label="Texto alternativo de la foto"
            placeholder="Texto alternativo (opcional)"
            className="flex-1 rounded-2xl border border-rosa-pastel bg-white px-3 py-2 text-sm text-gray-700 transition-colors duration-200 ease-boutique focus:border-lavender-magenta-400 focus:outline-none"
          />
          <button type="submit" className="rounded-full bg-lavender-magenta-700 px-5 py-2 text-sm font-semibold text-white shadow-card transition-all duration-200 ease-boutique hover:-translate-y-0.5 hover:bg-lavender-magenta-800">
            Agregar
          </button>
        </form>
      </section>
    </div>
  )
}
