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
}

export default function ProductoForm({ producto, categorias, marcas, subcategorias, action }: Props) {
  const v = producto

  return (
    <form action={action} className="space-y-6">
      <section className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="font-medium text-gray-700">Información básica</h2>
        <Campo label="Nombre" name="nombre" defaultValue={v?.nombre} required />
        <Campo label="Slug (URL)" name="slug" defaultValue={v?.slug} required />
        <div className="grid grid-cols-2 gap-4">
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
        <div className="grid grid-cols-2 gap-4">
          <Campo label="SKU" name="sku" defaultValue={v?.sku ?? ''} />
          <Campo label="Código de barras" name="codigo_barras" defaultValue={v?.codigo_barras ?? ''} />
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="font-medium text-gray-700">Precio e inventario</h2>
        <div className="grid grid-cols-3 gap-4">
          <Campo label="Precio (COP)" name="precio" type="number" defaultValue={v?.precio} required />
          <Campo label="Precio anterior" name="precio_anterior" type="number" defaultValue={v?.precio_anterior ?? ''} />
          <Campo label="Descuento (%)" name="descuento" type="number" defaultValue={v?.descuento ?? ''} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Campo label="Costo (privado)" name="costo" type="number" defaultValue={v?.costo ?? ''} />
          <Campo label="Cantidad en stock" name="cantidad_stock" type="number" defaultValue={v?.cantidad_stock ?? 0} />
          <Campo label="Stock mínimo" name="stock_minimo" type="number" defaultValue={v?.stock_minimo ?? 3} />
        </div>
        <p className="text-xs text-gray-400">
          El estado (disponible / últimas unidades / agotado) se calcula solo a partir de estos dos últimos campos.
        </p>
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="font-medium text-gray-700">Descripción y detalle</h2>
        <Campo label="Contenido (ej. 500 ml)" name="contenido" defaultValue={v?.contenido ?? ''} />
        <Textarea label="Descripción corta" name="descripcion_corta" defaultValue={v?.descripcion_corta ?? ''} />
        <Textarea label="Descripción completa" name="descripcion_completa" defaultValue={v?.descripcion_completa ?? ''} />
        <Textarea label="Modo de uso" name="modo_uso" defaultValue={v?.modo_uso ?? ''} />
        <Textarea label="Ingredientes destacados" name="ingredientes_destacados" defaultValue={v?.ingredientes_destacados ?? ''} />
        <Textarea label="Advertencias" name="advertencias" defaultValue={v?.advertencias ?? ''} />
      </section>

      <section className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
        <h2 className="font-medium text-gray-700">Visibilidad</h2>
        <div className="grid grid-cols-2 gap-2">
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

      <button type="submit" className="rounded-full bg-fucsia text-white px-6 py-2.5 font-medium">
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
}: {
  label: string
  name: string
  defaultValue?: string | number | null
  type?: string
  required?: boolean
}) {
  return (
    <label className="block text-sm">
      <span className="text-gray-600">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        required={required}
        className="mt-1 w-full rounded-lg border border-rosa-pastel px-3 py-2"
      />
    </label>
  )
}

function Textarea({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="block text-sm">
      <span className="text-gray-600">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={3}
        className="mt-1 w-full rounded-lg border border-rosa-pastel px-3 py-2"
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
      <span className="text-gray-600">{label}</span>
      <select name={name} defaultValue={defaultValue} className="mt-1 w-full rounded-lg border border-rosa-pastel px-3 py-2">
        {children}
      </select>
    </label>
  )
}

function Check({ label, name, defaultChecked }: { label: string; name: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} />
      {label}
    </label>
  )
}
