'use client'

import { useRouter } from 'next/navigation'
import { Icono } from './Iconos'

export default function BotonVolver() {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="group mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors duration-200 ease-boutique hover:text-lavender-magenta-700"
    >
      <Icono nombre="flechaIzq" className="h-4 w-4 transition-transform duration-200 ease-boutique group-hover:-translate-x-0.5" />
      Volver
    </button>
  )
}
