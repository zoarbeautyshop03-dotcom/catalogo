export type SearchParams = {
  categoria?: string
  marca?: string
  min?: string
  max?: string
  q?: string
  page?: string
  nuevo?: string
  oferta?: string
}

export function construirUrl(searchParams: SearchParams, cambios: Partial<SearchParams>) {
  const combinado: SearchParams = { ...searchParams, ...cambios }
  // Si cambia el filtro (categoría, marca o búsqueda), siempre volvemos a la página 1.
  if ('categoria' in cambios || 'marca' in cambios || 'q' in cambios || 'nuevo' in cambios || 'oferta' in cambios) {
    combinado.page = undefined
  }

  const params = new URLSearchParams()
  if (combinado.categoria) params.set('categoria', combinado.categoria)
  if (combinado.marca) params.set('marca', combinado.marca)
  if (combinado.min) params.set('min', combinado.min)
  if (combinado.max) params.set('max', combinado.max)
  if (combinado.q) params.set('q', combinado.q)
  if (combinado.nuevo) params.set('nuevo', combinado.nuevo)
  if (combinado.oferta) params.set('oferta', combinado.oferta)
  if (combinado.page && combinado.page !== '1') params.set('page', combinado.page)

  const qs = params.toString()
  return `/catalogo${qs ? `?${qs}` : ''}`
}
