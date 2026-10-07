import { supabase } from './supabase/public'
import type { Producto, Categoria, Marca, ProductoImagen, Configuracion } from './types'

const PRODUCTO_PUBLICO_SELECT = '*'

// Usa el cliente público (sin sesión), así que si la tabla "configuracion" no
// tiene una política RLS que permita lectura anónima, esto devuelve null en
// vez de romper el sitio para cualquier visitante.
export async function getConfiguracion(): Promise<Configuracion | null> {
  try {
    const { data, error } = await supabase.from('configuracion').select('*').eq('id', 1).maybeSingle()
    if (error) return null
    return data
  } catch {
    return null
  }
}

export async function getCategorias(): Promise<Categoria[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('activa', true)
    .order('orden')
  if (error) throw error
  return data ?? []
}

export async function getMarcas(): Promise<Marca[]> {
  const { data, error } = await supabase
    .from('marcas')
    .select('*')
    .eq('activa', true)
    .order('nombre')
  if (error) throw error
  return data ?? []
}

export async function getDestacados(limit = 8): Promise<Producto[]> {
  const { data, error } = await supabase
    .from('productos_publicos')
    .select(PRODUCTO_PUBLICO_SELECT)
    .eq('destacado', true)
    .limit(limit)
  if (error) throw error
  return (data ?? []) as Producto[]
}

export async function getMasVendidos(limit = 8): Promise<Producto[]> {
  const { data, error } = await supabase
    .from('productos_publicos')
    .select(PRODUCTO_PUBLICO_SELECT)
    .eq('mas_vendido', true)
    .limit(limit)
  if (error) throw error
  return (data ?? []) as Producto[]
}

export async function getNovedades(limit = 8): Promise<Producto[]> {
  const { data, error } = await supabase
    .from('productos_publicos')
    .select(PRODUCTO_PUBLICO_SELECT)
    .eq('nuevo', true)
    .limit(limit)
  if (error) throw error
  return (data ?? []) as Producto[]
}

export async function getOfertas(limit = 8): Promise<Producto[]> {
  const { data, error } = await supabase
    .from('productos_publicos')
    .select(PRODUCTO_PUBLICO_SELECT)
    .eq('oferta', true)
    .limit(limit)
  if (error) throw error
  return (data ?? []) as Producto[]
}

export async function getProductoPorSlug(slug: string): Promise<Producto | null> {
  const { data, error } = await supabase
    .from('productos_publicos')
    .select(PRODUCTO_PUBLICO_SELECT)
    .eq('slug', slug)
    .maybeSingle()
  if (error) throw error
  return data as Producto | null
}

export async function getImagenesDeProducto(productoId: string): Promise<ProductoImagen[]> {
  const { data, error } = await supabase
    .from('producto_imagenes')
    .select('*')
    .eq('producto_id', productoId)
    .order('orden')
  if (error) throw error
  return (data ?? []) as ProductoImagen[]
}

// Trae, en una sola consulta, la mejor imagen (principal si existe, si no la
// de menor `orden`) de cada producto de la lista. Se usa en el inicio y en el
// listado del catalogo para no dejar las tarjetas siempre en "Foto pendiente".
export async function getImagenesPrincipales(productoIds: string[]): Promise<Record<string, string>> {
  if (productoIds.length === 0) return {}
  const { data, error } = await supabase
    .from('producto_imagenes')
    .select('producto_id, url, orden, es_principal')
    .in('producto_id', productoIds)
    .order('es_principal', { ascending: false })
    .order('orden', { ascending: true })
  if (error) throw error

  const mapa: Record<string, string> = {}
  for (const img of data ?? []) {
    if (!mapa[img.producto_id]) mapa[img.producto_id] = img.url
  }
  return mapa
}

type FiltrosCatalogo = {
  categoriaSlug?: string
  marcaSlug?: string
  precioMin?: number
  precioMax?: number
  busqueda?: string
  page?: number
  porPagina?: number
  nuevo?: boolean
  oferta?: boolean
}

export async function getProductosCatalogo(filtros: FiltrosCatalogo = {}) {
  const { categoriaSlug, marcaSlug, precioMin, precioMax, busqueda, page = 1, porPagina = 24, nuevo, oferta } = filtros

  let categoriaId: string | undefined
  if (categoriaSlug) {
    const { data } = await supabase.from('categorias').select('id').eq('slug', categoriaSlug).maybeSingle()
    categoriaId = data?.id
  }
  let marcaId: string | undefined
  if (marcaSlug) {
    const { data } = await supabase.from('marcas').select('id').eq('slug', marcaSlug).maybeSingle()
    marcaId = data?.id
  }

  let query = supabase.from('productos_publicos').select(PRODUCTO_PUBLICO_SELECT, { count: 'exact' })

  if (categoriaId) query = query.eq('categoria_id', categoriaId)
  if (marcaId) query = query.eq('marca_id', marcaId)
  if (precioMin != null) query = query.gte('precio', precioMin)
  if (precioMax != null) query = query.lte('precio', precioMax)
  if (busqueda) query = query.ilike('nombre', `%${busqueda}%`)
  if (nuevo) query = query.eq('nuevo', true)
  if (oferta) query = query.eq('oferta', true)

  const from = (page - 1) * porPagina
  const to = from + porPagina - 1
  query = query.range(from, to).order('nombre')

  const { data, error, count } = await query
  if (error) throw error
  return { productos: (data ?? []) as Producto[], total: count ?? 0 }
}
