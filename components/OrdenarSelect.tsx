'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { construirUrl, type SearchParams } from '@/lib/catalogo-url'

const OPCIONES: [string, string][] = [
  ['nombre', 'Nombre A–Z'],
  ['precio-asc', 'Precio: menor a mayor'],
  ['precio-desc', 'Precio: mayor a menor'],
]

// Lista nativa: en el celular abre el selector del sistema, que la gente ya
// sabe usar.
export default function OrdenarSelect({
  searchParams,
  valorActual,
}: {
  searchParams: SearchParams
  valorActual: string
}) {
  const router = useRouter()
  const [valor, setValor] = useState(valorActual)

  useEffect(() => {
    setValor(valorActual)
  }, [valorActual])

  return (
    <label className="relative inline-flex min-w-0 flex-1 items-center sm:flex-none">
      <span className="sr-only">Ordenar por</span>
      <select
        value={valor}
        onChange={(e) => {
          setValor(e.target.value)
          router.push(construirUrl(searchParams, { orden: e.target.value }))
        }}
        className="h-11 w-full min-w-0 appearance-none rounded-full border border-lavender-magenta-100 bg-white py-2 pl-4 pr-9 text-xs font-bold text-lavender-magenta-800 shadow-sm focus:outline-none sm:w-auto"
      >
        {OPCIONES.map(([v, etiqueta]) => (
          <option key={v} value={v}>
            {etiqueta}
          </option>
        ))}
      </select>
      <svg viewBox="0 0 16 16" className="pointer-events-none absolute right-3.5 h-3.5 w-3.5 text-lavender-magenta-700" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </label>
  )
}
