'use client'

export default function DeleteButton({ label = 'Eliminar' }: { label?: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm('¿Seguro que quieres eliminar esto? No se puede deshacer.')) {
          e.preventDefault()
        }
      }}
      className="text-xs text-red-500 hover:underline"
    >
      {label}
    </button>
  )
}
