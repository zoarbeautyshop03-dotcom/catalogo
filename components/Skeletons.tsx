import { Skeleton } from '@/components/ui/skeleton'

// Marcadores de carga: muestran la forma de la página mientras llegan los datos,
// así no se ve una pantalla en blanco (sobre todo con datos móviles lentos).
// Imitan el layout editorial: tarjetas redondeadas y un brillo rosado suave.

export function TarjetaProductoSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-boutique bg-white shadow-soft-card ring-1 ring-lavender-magenta-100/70"
      aria-hidden="true"
    >
      <div className="catalog-product-media relative aspect-[0.96] overflow-hidden">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-gradient-to-br from-lavender-magenta-100/85 via-white/45 to-lavender-magenta-100/85" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full bg-white/80" />
        </div>
      </div>
      <div className="space-y-2.5 p-4 sm:p-5">
        <Skeleton className="h-3 w-1/3 rounded-full bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
        <Skeleton className="h-4 w-4/5 rounded-full bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
        <Skeleton className="h-4 w-2/3 rounded-full bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
        <div className="pt-3">
          <Skeleton className="h-5 w-1/2 rounded-full bg-gradient-to-r from-lavender-magenta-200 via-lavender-magenta-100 to-lavender-magenta-200" />
        </div>
      </div>
    </div>
  )
}

export function GrillaProductosSkeleton({ cantidad = 8 }: { cantidad?: number }) {
  return (
    <div className="catalog-product-grid" role="status" aria-label="Cargando productos">
      {Array.from({ length: cantidad }).map((_, i) => (
        <TarjetaProductoSkeleton key={i} />
      ))}
    </div>
  )
}
