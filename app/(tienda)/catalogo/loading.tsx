import { GrillaProductosSkeleton } from '@/components/Skeletons'

export default function CargandoCatalogo() {
  return (
    <div className="section-shell pb-14 pt-5 sm:pt-8">
      <div className="h-9 w-48 animate-pulse rounded-full bg-lavender-magenta-100" aria-hidden="true" />
      <div className="mt-6" />
      <GrillaProductosSkeleton cantidad={8} />
    </div>
  )
}
