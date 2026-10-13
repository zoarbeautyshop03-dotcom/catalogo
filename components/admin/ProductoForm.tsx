import type { Categoria, Marca } from '@/lib/types'

type Subcategoria = { id: string; nombre: string; categoria_id: string }

type ProductoCompleto = {
  id: string
  nombre: string
  slug: string
  marca_id: string | null
  categoria_id: string | null
  subcategoria_id: string | null
  sku: string | null
  codigo_barras: string | null
  descripcion_corta: string | null
  descripcion_completa: string | null
  precio: number
  precio_anterior: number | null
  descuento: number | null
  costo: number | null
  cantidad_stock: number
  stock_minimo: number
  contenido: string | null
  modo_uso: string | null
  ingredientes_destacados: string | null
  advertencias: string | null
  destacado: boolean
  nuevo: boolean
  mas_vendido: boolean
  oferta: boolean
  whatsapp_activo: boolean
  activo: boolean
  estado_publicacion: string
}

type Props = {
  producto?: ProductoCompleto
  categorias: Categoria[]
  marcas: Marca[]
  subcategorias: Subcategoria[]
  action: (formData: FormData) => void
  returnTo?: string
}

export default function ProductoForm({ producto, categorias, marcas, subcategorias, action, returnTo = '/admin/productos' }: Props) {
  const v = producto

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="return_to" value={returnTo} />
      <section className="rounded-boutique-lg border border-lavender-magenta-100 bg-white space-y-4 p-5 shadow-card sm:p-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-lavender-magenta-950">Información básica</h2>
          <div className="hairline-gold mt-3" aria-hidden="true" />
        </div>
        <Campo label="Nombre" name="nombre" defaultValue={v?.nombre} required />
        <Campo label="Slug (URL)" name="slug" defaultValue={v?.slug} hint="Opcional. Si lo dejas vacío se crea solo desde el nombre. Se limpia automáticamente: sin tildes, espacios ni signos como + & % #." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Categoría" name="categoria_id" defaultValue={v?.categoria_id ?? ''}>
            <option value="">— Sin categoría —</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Select>
          <Select label="Subcategoría" name="subcategoria_id" defaultValue={v?.subcategoria_id ?? ''}>
            <option value="">— Sin subcategoría —</option>
            {subcategorias.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </Select>
        </div>
        <Select label="Marca" name="marca_id" defaultValue={v?.marca_id ?? ''}>
          <option value="">— Sin marca —</option>
          {marcas.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </Select>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="SKU" name="sku" defaultValue={v?.sku ?? ''} />
          <Campo label="Código de barras" name="codigo_barras" defaultValue={v?.codigo_barras ?? ''} />
        </div>
      </section>

      <section className="rounded-boutique-lg border border-lavender-magenta-100 bg-white space-y-4 p-5 shadow-card sm:p-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-lavender-magenta-950">Precio e inventario</h2>
          <div className="hairline-gold mt-3" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Campo label="Precio (COP)" name="precio" type="number" defaultValue={v?.precio} required />
          <Campo label="Precio anterior" name="precio_anterior" type="number" defaultValue={v?.precio_anterior ?? ''} />
          <Campo label="Descuento (%)" name="descuento" type="number" defaultValue={v?.descuento ?? ''} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Campo label="Costo (privado)" name="costo" type="number" defaultValue={v?.costo ?? ''} />
          <Campo label="Cantidad en stock" name="cantidad_stock" type="number" defaultValue={v?.cantidad_stock ?? 0} />
          <Campo label="Stock mínimo" name="stock_minimo" type="number" defaultValue={v?.stock_minimo ?? 3} />
        </div>
        <p className="text-xs leading-5 text-gray-400">
          El estado (disponible / últimas unidades / agotado) se calcula solo a partir de estos dos últimos campos.
        </p>
      </section>

      <section className="rounded-boutique-lg border border-lavender-magenta-100 bg-white space-y-4 p-5 shadow-card sm:p-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-lavender-magenta-950">Descripción y detalle</h2>
          <div className="hairline-gold mt-3" aria-hidden="true" />
        </div>
        <Campo label="Contenido (ej. 500 ml)" name="contenido" defaultValue={v?.contenido ?? ''} />
        <Textarea label="Descripción corta" name="descripcion_corta" defaultValue={v?.descripcion_corta ?? ''} />
        <Textarea label="Descripción completa" name="descripcion_completa" defaultValue={v?.descripcion_completa ?? ''} />
        <Textarea label="Modo de uso" name="modo_uso" defaultValue={v?.modo_uso ?? ''} />
        <Textarea label="Ingredientes destacados" name="ingredientes_destacados" defaultValue={v?.ingredientes_destacados ?? ''} />
        <Textarea label="Advertencias" name="advertencias" defaultValue={v?.advertencias ?? ''} />
      </section>

      <section className="rounded-boutique-lg border border-lavender-magenta-100 bg-white space-y-4 p-5 shadow-card sm:p-6">
        <div>
          <h2 className="font-display text-lg font-semibold text-lavender-magenta-950">Visibilidad</h2>
          <div className="hairline-gold mt-3" aria-hidden="true" />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Check label="Destacado" name="destacado" defaultChecked={v?.destacado} />
          <Check label="Nuevo" name="nuevo" defaultChecked={v?.nuevo} />
          <Check label="Más vendido" name="mas_vendido" defaultChecked={v?.mas_vendido} />
          <Check label="Oferta" name="oferta" defaultChecked={v?.oferta} />
          <Check label="Pedido por WhatsApp activo" name="whatsapp_activo" defaultChecked={v?.whatsapp_activo ?? true} />
          <Check label="Activo (visible en el sistema)" name="activo" defaultChecked={v?.activo ?? true} />
        </div>
        <Select label="Estado de publicación" name="estado_publicacion" defaultValue={v?.estado_publicacion ?? 'borrador'}>
          <option value="borrador">Borrador (no visible al público)</option>
          <option value="publicado">Publicado</option>
        </Select>
      </section>

      <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-lavender-magenta-700 px-6 py-2.5 font-semibold text-white shadow-card transition-all duration-200 ease-boutique hover:-translate-y-0.5 hover:bg-lavender-magenta-800">
        {producto ? 'Guardar cambios' : 'Crear producto'}
      </button>
    </form>
  )
}

function Campo({
  label,
  name,
  defaultValue,
  type = 'text',
  required,
  hint,
}: {
  label: string
  name: string
  defaultValue?: string | number | null
  type?: string
  required?: boolean
  hint?: string
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-gray-600">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        required={required}
        className="mt-1.5 w-full rounded-2xl border border-rosa-pastel bg-white px-3 py-2 text-sm text-gray-700 transition-colors duration-200 ease-boutique focus:border-lavender-magenta-400 focus:outline-none"
      />
      {hint && <span className="mt-1 block text-xs leading-5 text-gray-500">{hint}</span>}
    </label>
  )
}

function Textarea({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-gray-600">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        className="mt-1.5 w-full rounded-2xl border border-rosa-pastel bg-white px-3 py-2 text-sm text-gray-700 transition-colors duration-200 ease-boutique focus:border-lavender-magenta-400 focus:outline-none"
      />
    </label>
  )
}

function Select({
  label,
  name,
  defaultValue,
  children,
}: {
  label: string
  name: string
  defaultValue?: string
  children: React.ReactNode
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-gray-600">{label}</span>
      <select name={name} defaultValue={defaultValue} className="mt-1.5 w-full rounded-2xl border border-rosa-pastel bg-white px-3 py-2 text-sm text-gray-700 transition-colors duration-200 ease-boutique focus:border-lavender-magenta-400 focus:outline-none">
        {children}
      </select>
    </label>
  )
}

function Check({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-lavender-magenta-600" />
      {label}
    </label>
  )
}
