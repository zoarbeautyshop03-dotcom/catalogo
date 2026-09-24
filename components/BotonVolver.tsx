'use client'

import { useRouter } from 'next/navigation'

export default function BotonVolver({ label = 'Volver' }: { label?: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="group mb-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-lavender-magenta-700 shadow-soft-card ring-1 ring-lavender-magenta-100 transition hover:bg-lavender-magenta-50 hover:ring-lavender-magenta-200"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lavender-magenta-50 text-sm text-lavender-magenta-600 transition group-hover:bg-white">
        ←
      </span>
      {label}
    </button>
  )
}
