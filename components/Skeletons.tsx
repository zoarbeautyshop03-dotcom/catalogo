// Marcadores de carga: muestran la forma de la página mientras llegan los datos,
// así no se ve una pantalla en blanco (sobre todo con datos móviles lentos).

export function TarjetaProductoSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-lavender-magenta-100" aria-hidden="true">
      <div className="aspect-[0.96] animate-pulse bg-lavender-magenta-50" />
      <div className="space-y-2.5 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-lavender-magenta-100" />
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-lavender-magenta-100" />
        <div className="h-5 w-1/2 animate-pulse rounded-full bg-lavender-magenta-100" />
      </div>
    </div>
  )
}

export function GrillaProductosSkeleton({ cantidad = 8 }: { cantidad?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4" role="status" aria-label="Cargando productos">
      {Array.from({ length: cantidad }).map((_, i) => (
        <TarjetaProductoSkeleton key={i} />
      ))}
    </div>
  )
}
