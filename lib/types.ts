export type EstadoInventario = 'disponible' | 'ultimas_unidades' | 'agotado'

export type Producto = {
  id: string
  nombre: string
  slug: string
  marca_id: string | null
  categoria_id: string | null
  subcategoria_id: string | null
  tipo_producto: 'fisico' | 'digital' | 'servicio'
  sku: string | null
  descripcion_corta: string | null
  descripcion_completa: string | null
  precio: number
  precio_anterior: number | null
  descuento: number | null
  moneda: string
  estado_inventario: EstadoInventario
  destacado: boolean
  mas_vendido: boolean
  nuevo: boolean
  oferta: boolean
  contenido: string | null
  tipo_cabello: string[] | null
  modo_uso: string | null
  ingredientes_destacados: string | null
  advertencias: string | null
  whatsapp_activo: boolean
}

export type Categoria = {
  id: string
  nombre: string
  slug: string
  descripcion: string | null
  imagen_url: string | null
  icono: string | null
  orden: number
}

export type Marca = {
  id: string
  nombre: string
  slug: string
  logo_url: string | null
}

export type ProductoImagen = {
  id: string
  producto_id: string
  url: string
  orden: number
  es_principal: boolean
  texto_alt: string | null
}

export type Configuracion = {
  id: number
  nombre_tienda: string | null
  whatsapp_numero: string | null
  instagram: string | null
  facebook: string | null
  tiktok: string | null
  horarios: string | null
  info_entrega: string | null
  mostrar_agotados: boolean | null
}

// Placeholder simple: para tipado completo generado desde el esquema real,
// mas adelante correr `supabase gen types typescript` y reemplazar esto.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Database = any
