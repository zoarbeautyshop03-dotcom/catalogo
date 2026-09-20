'use client'

import { useState } from 'react'
import { useCarrito } from '@/lib/cart-context'

type Props = {
  producto: { id: string; nombre: string; slug: string; precio: number }
  imagenUrl?: string
  agotado?: boolean
  variante?: 'icono' | 'completo'
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
        className="inline-flex items-center justify-center gap-2 rounded-full border border-fucsia text-fucsia px-6 py-3 font-medium hover:bg-fucsia/5 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {agotado ? 'Agotado' : agregado ? '✓ Agregado' : '🛍️ Agregar al carrito'}
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={agotado}
      aria-label="Agregar al carrito"
      title="Agregar al carrito"
      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white"
    >
      {agregado ? '✓' : '🛍️'}
    </button>
  )
}
