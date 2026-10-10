export default function CargandoProducto() {
  return (
    <div className="section-shell py-7 sm:py-10" role="status" aria-label="Cargando producto">
      <div className="mb-5 h-4 w-56 animate-pulse rounded-full bg-lavender-magenta-100" aria-hidden="true" />
      <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-10" aria-hidden="true">
        <div className="aspect-square animate-pulse rounded-[32px] bg-lavender-magenta-50" />
        <div className="space-y-4 rounded-3xl bg-white p-6 ring-1 ring-lavender-magenta-100 sm:p-8">
          <div className="h-4 w-32 animate-pulse rounded-full bg-lavender-magenta-100" />
          <div className="h-9 w-3/4 animate-pulse rounded-full bg-lavender-magenta-100" />
          <div className="h-8 w-40 animate-pulse rounded-full bg-lavender-magenta-100" />
          <div className="h-12 w-full animate-pulse rounded-full bg-lavender-magenta-100" />
          <div className="h-24 w-full animate-pulse rounded-2xl bg-lavender-magenta-50" />
        </div>
      </div>
    </div>
  )
}
