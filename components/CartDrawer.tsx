'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCarrito } from '@/lib/cart-context'
import { formatPrecio, buildWhatsappCarritoLink } from '@/lib/whatsapp'

export default function CartDrawer() {
  const [abierto, setAbierto] = useState(false)
  const { items, quitar, cambiarCantidad, vaciar, totalItems, totalPrecio } = useCarrito()

  const linkWhatsapp = buildWhatsappCarritoLink(
    items.map((i) => ({ nombre: i.nombre, precio: i.precio, cantidad: i.cantidad }))
  )

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="relative text-gray-600 text-lg"
        aria-label="Ver carrito"
      >
        🛍️
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-fucsia text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </button>

      {abierto && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            aria-label="Cerrar"
            onClick={() => setAbierto(false)}
            className="absolute inset-0 bg-black/30"
          />
          <div className="relative w-full max-w-sm h-full bg-white shadow-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg">Tu pedido</h2>
              <button onClick={() => setAbierto(false)} className="text-gray-400 text-xl leading-none">
                ×
              </button>
            </div>

            {items.length === 0 ? (
              <p className="text-sm text-gray-400 flex-1">
                Todavía no has agregado productos. Explora el{' '}
                <Link href="/catalogo" onClick={() => setAbierto(false)} className="text-fucsia underline">
                  catálogo
                </Link>
                .
              </p>
            ) : (
              <div className="flex-1 overflow-y-auto space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 border-b border-rosa-pastel/50 pb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 line-clamp-2">{item.nombre}</p>
                      <p className="text-xs text-gray-400">{formatPrecio(item.precio)}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <button
                          onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                          className="w-6 h-6 rounded-full bg-rosa-pastel/60 text-sm"
                        >
                          −
                        </button>
                        <span className="text-sm w-5 text-center">{item.cantidad}</span>
                        <button
                          onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                          className="w-6 h-6 rounded-full bg-rosa-pastel/60 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button onClick={() => quitar(item.id)} className="text-xs text-gray-400 hover:text-red-500">
                      Quitar
                    </button>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className="pt-4 border-t border-rosa-pastel/60">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="font-semibold text-fucsia">{formatPrecio(totalPrecio)}</span>
                </div>
                <a
                  href={linkWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center rounded-full bg-fucsia text-white py-3 font-medium mb-2"
                >
                  💬 Enviar pedido por WhatsApp
                </a>
                <button onClick={vaciar} className="w-full text-center text-xs text-gray-400 hover:text-red-500">
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
