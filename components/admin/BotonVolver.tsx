'use client'

import { useRouter } from 'next/navigation'

export default function BotonVolver() {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-lavender-magenta-700 transition-colors"
    >
      <span aria-hidden>←</span> Volver
    </button>
  )
}
