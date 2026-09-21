'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCarrito } from '@/lib/cart-context'
import { formatPrecio, buildWhatsappCarritoLink } from '@/lib/whatsapp'

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M6 8.5h12l.7 11H5.3L6 8.5Z" strokeLinejoin="round" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  )
}

export default function CartDrawer() {
  const [abierto, setAbierto] = useState(false)
  const { items, quitar, cambiarCantidad, vaciar, totalItems, totalPrecio } = useCarrito()

  useEffect(() => {
    if (abierto) {
      const previo = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = previo
      }
    }
  }, [abierto])

  const linkWhatsapp = buildWhatsappCarritoLink(
    items.map((i) => ({ nombre: i.nombre, precio: i.precio, cantidad: i.cantidad }))
  )

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-lavender-magenta-800 hover:bg-lavender-magenta-50"
        aria-label="Ver carrito"
      >
        <BagIcon />
        {totalItems > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-lavender-magenta-600 px-1 text-[9px] font-bold text-white">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button aria-label="Cerrar" onClick={() => setAbierto(false)} className="absolute inset-0 bg-lavender-magenta-950/40 backdrop-blur-sm" />
          <div className="relative flex h-full min-h-0 w-full max-w-md flex-col border-l border-lavender-magenta-100 bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex shrink-0 items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-lavender-magenta-600">Zoar Beauty Shop</span>
                <h2 className="mt-1 font-display text-2xl text-lavender-magenta-950">
                  Tu pedido {totalItems > 0 && <span className="text-sm font-medium text-gray-400">({totalItems})</span>}
                </h2>
              </div>
              <button onClick={() => setAbierto(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-magenta-50 text-xl text-lavender-magenta-800" aria-label="Cerrar carrito">
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lavender-magenta-50 text-lavender-magenta-600">
                  <BagIcon />
                </div>
                <p className="mt-4 font-display text-xl text-lavender-magenta-950">Tu carrito está vacío</p>
                <p className="mt-1 max-w-xs text-sm leading-6 text-gray-500">Agrega tus productos favoritos y aquí podrás revisar todo antes de enviar tu pedido.</p>
                <Link href="/catalogo" onClick={() => setAbierto(false)} className="mt-5 rounded-full bg-lavender-magenta-600 px-5 py-3 text-sm font-semibold text-white hover:bg-lavender-magenta-700">
                  Explorar catálogo
                </Link>
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-2xl bg-lavender-magenta-50/65 p-3 ring-1 ring-lavender-magenta-100">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                      {item.imagenUrl ? (
                        <Image src={item.imagenUrl} alt={item.nombre} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xl text-lavender-magenta-400">✦</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-lavender-magenta-950">{item.nombre}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{formatPrecio(item.precio)} c/u</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => cambiarCantidad(item.id, item.cantidad - 1)} className="h-7 w-7 rounded-full bg-white text-sm font-semibold text-lavender-magenta-800 ring-1 ring-lavender-magenta-100">−</button>
                        <span className="w-5 text-center text-sm font-semibold text-lavender-magenta-950">{item.cantidad}</span>
                        <button onClick={() => cambiarCantidad(item.id, item.cantidad + 1)} className="h-7 w-7 rounded-full bg-white text-sm font-semibold text-lavender-magenta-800 ring-1 ring-lavender-magenta-100">+</button>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end justify-between">
                      <span className="text-sm font-bold text-lavender-magenta-700">{formatPrecio(item.precio * item.cantidad)}</span>
                      <button onClick={() => quitar(item.id)} className="text-[11px] font-medium text-gray-400 hover:text-lavender-magenta-700">Quitar</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className="shrink-0 border-t border-lavender-magenta-100 pt-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Total</span>
                  <span className="font-display text-2xl font-bold text-lavender-magenta-800">{formatPrecio(totalPrecio)}</span>
                </div>
                <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer" className="block rounded-full bg-lavender-magenta-600 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-lavender-magenta-600/15 hover:bg-lavender-magenta-700">
                  Enviar pedido por WhatsApp
                </a>
                <button onClick={vaciar} className="mt-3 w-full text-center text-xs font-medium text-gray-400 hover:text-lavender-magenta-700">
                  Vaciar carrito
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
