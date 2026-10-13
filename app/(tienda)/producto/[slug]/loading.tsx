export default function CargandoProducto() {
  return (
    <div className="section-shell py-7 sm:py-10" role="status" aria-label="Cargando producto">
      <div className="mb-6 flex flex-wrap items-center gap-3" aria-hidden="true">
        <div className="h-3 w-14 animate-pulse rounded-full bg-lavender-magenta-100" />
        <div className="h-3 w-20 animate-pulse rounded-full bg-lavender-magenta-100" />
        <div className="h-3 w-28 animate-pulse rounded-full bg-lavender-magenta-100" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-start lg:gap-10" aria-hidden="true">
        <div className="catalog-product-media aspect-square animate-pulse rounded-boutique-lg border border-lavender-magenta-100" />

        <div className="premium-card space-y-5 p-6 sm:p-8 lg:p-9">
          <div className="flex items-center justify-between gap-3">
            <div className="h-3 w-28 animate-pulse rounded-full bg-lavender-magenta-100" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-lavender-magenta-100" />
          </div>
          <div className="space-y-3">
            <div className="h-8 w-4/5 animate-pulse rounded-full bg-lavender-magenta-100" />
            <div className="h-8 w-3/5 animate-pulse rounded-full bg-lavender-magenta-100" />
          </div>
          <div className="h-9 w-40 animate-pulse rounded-full bg-lavender-magenta-100" />
          <div className="hairline-magenta" />
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="h-11 flex-1 animate-pulse rounded-full bg-lavender-magenta-100" />
            <div className="h-11 flex-1 animate-pulse rounded-full bg-lavender-magenta-100" />
          </div>
          <div className="h-24 w-full animate-pulse rounded-boutique bg-lavender-magenta-50" />
        </div>
      </div>
    </div>
  )
}
