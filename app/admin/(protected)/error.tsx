'use client'

export default function ErrorAdmin({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-boutique-lg border border-lavender-magenta-100 bg-white p-8 text-center shadow-card">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          </svg>
        </span>
        <h1 className="font-display text-lg text-gray-800 mb-1">Algo falló en esta pantalla</h1>
        <p className="text-sm text-gray-500 mb-5">
          {error.message || 'Ocurrió un error inesperado. Intenta de nuevo.'}
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-brand-gradient px-6 py-2.5 text-sm font-semibold text-white shadow-card transition-transform duration-200 ease-boutique hover:-translate-y-0.5"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
