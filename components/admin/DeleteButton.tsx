'use client'

import { Icono } from './Iconos'

export default function DeleteButton({ label = 'Eliminar' }: { label?: string }) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm('¿Seguro que quieres eliminar esto? No se puede deshacer.')) {
          e.preventDefault()
        }
      }}
      className="inline-flex items-center gap-1 text-xs font-medium text-red-500 transition-colors duration-200 ease-boutique hover:underline"
    >
      <Icono nombre="papelera" className="h-3.5 w-3.5" />
      {label}
    </button>
  )
}
