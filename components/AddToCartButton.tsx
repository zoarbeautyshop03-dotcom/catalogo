'use client'

import { useState } from 'react'
import { useCarrito } from '@/lib/cart-context'

type Props = {
  producto: { id: string; nombre: string; slug: string; precio: number }
  imagenUrl?: string
  agotado?: boolean
  variante?: 'icono' | 'completo'
}

function BagIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-4 w-4 ${className}`} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M6 8.5h12l.7 11H5.3L6 8.5Z" strokeLinejoin="round" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  )
}

export default function AddToCartButton({ producto, imagenUrl, agotado, variante = 'icono' }: Props) {
  const { agregar } = useCarrito()
  const [agregado, setAgregado] = useState(false)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (agotado) return
    agregar({ id: producto.id, nombre: producto.nombre, slug: producto.slug, precio: producto.precio, imagenUrl })
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1500)
  }

  if (variante === 'completo') {
    return (
      <button
        onClick={handleClick}
        disabled={agotado}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-lavender-magenta-600 px-6 py-3 font-semibold text-white shadow-lg shadow-lavender-magenta-600/15 hover:-translate-y-0.5 hover:bg-lavender-magenta-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <BagIcon />
        {agotado ? 'Agotado' : agregado ? '✓ Agregado al carrito' : 'Agregar al carrito'}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={agotado}
      aria-label={agregado ? 'Agregado al carrito' : 'Agregar al carrito'}
      title="Agregar al carrito"
      className={`absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center gap-1.5 rounded-full px-0 text-[11px] font-bold shadow-md ring-1 transition-all duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:px-3.5 ${
        agotado || agregado ? '' : 'pista-agregar-carrito'
      } ${
        agregado
          ? 'bg-lavender-magenta-600 text-white ring-lavender-magenta-600'
          : 'bg-white/95 text-lavender-magenta-700 ring-lavender-magenta-100 hover:bg-lavender-magenta-50'
      }`}
    >
      {agregado ? '✓' : <BagIcon className={agotado ? '' : 'pista-agregar-icono'} />}
      <span className="hidden sm:inline">{agregado ? 'Agregado' : 'Agregar'}</span>
    </button>
  )
}
