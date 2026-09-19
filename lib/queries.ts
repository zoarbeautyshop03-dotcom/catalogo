import { supabase } from './supabase/public'
import type { Producto, Categoria, Marca, ProductoImagen } from './types'

const PRODUCTO_PUBLICO_SELECT = '*'

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

type FiltrosCatalogo = {
  categoriaSlug?: string
  marcaSlug?: string
  precioMin?: number
  precioMax?: number
  busqueda?: string
  page?: number
  porPagina?: number
}

export async function getProductosCatalogo(filtros: FiltrosCatalogo = {}) {
  const { categoriaSlug, marcaSlug, precioMin, precioMax, busqueda, page = 1, porPagina = 24 } = filtros

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

  const from = (page - 1) * porPagina
  const to = from + porPagina - 1
  query = query.range(from, to).order('nombre')

  const { data, error, count } = await query
  if (error) throw error
  return { productos: (data ?? []) as Producto[], total: count ?? 0 }
}
