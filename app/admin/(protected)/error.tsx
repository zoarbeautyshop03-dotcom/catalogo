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
      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft-card p-6 text-center">
        <p className="text-3xl mb-2">😕</p>
        <h1 className="font-display text-lg text-gray-800 mb-1">Algo falló en esta pantalla</h1>
        <p className="text-sm text-gray-500 mb-4">
          {error.message || 'Ocurrió un error inesperado. Intenta de nuevo.'}
        </p>
        <button
          onClick={reset}
          className="rounded-full bg-fucsia text-white px-5 py-2 text-sm font-medium"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
