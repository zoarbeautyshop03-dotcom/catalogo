'use client'

import { useRouter } from 'next/navigation'

export default function BotonVolver({ label = 'Volver' }: { label?: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="group mb-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-lavender-magenta-700 shadow-soft-card ring-1 ring-lavender-magenta-100 backdrop-blur transition duration-200 ease-boutique hover:-translate-y-0.5 hover:bg-white hover:shadow-card hover:ring-lavender-magenta-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-magenta-400"
    >
      <span
        aria-hidden="true"
        className="flex h-6 w-6 items-center justify-center rounded-full bg-lavender-magenta-50 text-lavender-magenta-700 transition-colors duration-200 ease-boutique group-hover:bg-lavender-magenta-100"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-3.5 w-3.5"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </span>
      {label}
    </button>
  )
}
