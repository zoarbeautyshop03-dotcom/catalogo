import { Skeleton } from '@/components/ui/skeleton'
import { GrillaProductosSkeleton } from '@/components/Skeletons'

export default function CargandoCatalogo() {
  return (
    <div className="relative pb-14 pt-5 sm:pb-20 sm:pt-7">
      <div className="section-shell relative" aria-busy="true" aria-live="polite">
        <Skeleton className="h-9 w-28 rounded-full" aria-hidden="true" />

        {/* Cabecera editorial (celular) */}
        <div className="mt-3 space-y-3 sm:hidden">
          <Skeleton className="h-3 w-28 rounded-full bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
          <Skeleton className="h-8 w-40 rounded-2xl bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
          <Skeleton className="h-4 w-4/5 rounded-full bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
        </div>

        {/* Cabecera editorial (tablet y escritorio) */}
        <div className="catalog-hero mt-4 hidden overflow-hidden rounded-boutique-lg px-6 py-8 ring-1 ring-lavender-magenta-100/80 sm:block sm:px-8 sm:py-10 lg:px-11 lg:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="space-y-4">
              <Skeleton className="h-3 w-32 rounded-full bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
              <Skeleton className="h-10 w-4/5 rounded-2xl bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
              <Skeleton className="h-10 w-3/5 rounded-2xl bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
              <Skeleton className="h-4 w-full max-w-md rounded-full bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
              <div className="flex flex-wrap gap-2.5 pt-2">
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-40 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-20 w-full rounded-boutique" />
          </div>
        </div>

        {/* Filtros + resultados */}
        <div className="mt-7 grid gap-7 lg:mt-9 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:items-start lg:gap-9">
          <div className="catalog-filter-card hidden rounded-boutique bg-white/[0.9] p-5 ring-1 ring-lavender-magenta-100/90 sm:block sm:p-6">
            <Skeleton className="h-3 w-28 rounded-full bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
            <Skeleton className="mt-3 h-7 w-4/5 rounded-2xl bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
            <div className="mt-6 space-y-3">
              <div className="flex flex-wrap gap-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-24 rounded-full" />
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-20 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-end justify-between border-b border-lavender-magenta-100/80 pb-5">
              <Skeleton className="h-8 w-40 rounded-2xl bg-gradient-to-r from-lavender-magenta-100 via-lavender-magenta-50 to-lavender-magenta-100" />
              <div className="hidden gap-2 sm:flex">
                <Skeleton className="h-11 w-36 rounded-full" />
              </div>
            </div>
            <div className="mt-6">
              <GrillaProductosSkeleton cantidad={8} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
