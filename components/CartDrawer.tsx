'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCarrito } from '@/lib/cart-context'
import { formatPrecio, buildWhatsappCarritoLink } from '@/lib/whatsapp'

export default function CartDrawer() {
  const [abierto, setAbierto] = useState(false)
  const { items, quitar, cambiarCantidad, vaciar, totalItems, totalPrecio } = useCarrito()

  // Bloquea el scroll de la pagina de fondo mientras el carrito esta abierto,
  // para que no se sienta "raro" al deslizar dentro del panel en celular.
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
            className="absolute inset-0 bg-black/60"
          />
          {/* min-h-0 es lo que hace que la lista de abajo pueda hacer scroll
              propio en vez de desbordar y "cortar" el total y el boton */}
          <div className="relative w-full max-w-sm h-full min-h-0 bg-white shadow-xl p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h2 className="font-display text-lg">
                Tu pedido {totalItems > 0 && <span className="text-sm text-gray-400">({totalItems})</span>}
              </h2>
              <button onClick={() => setAbierto(false)} className="text-gray-400 text-2xl leading-none px-1">
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
              <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 border-b border-rosa-pastel/50 pb-3">
                    <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-rosa-pastel/40">
                      {item.imagenUrl ? (
                        <Image src={item.imagenUrl} alt={item.nombre} fill className="object-cover" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[9px] text-rosa-empolvado text-center px-1">
                          Sin foto
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 line-clamp-2">{item.nombre}</p>
                      <p className="text-xs text-gray-400">{formatPrecio(item.precio)} c/u</p>
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
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-gray-600 font-medium">
                        {formatPrecio(item.precio * item.cantidad)}
                      </span>
                      <button onClick={() => quitar(item.id)} className="text-xs text-gray-400 hover:text-red-500">
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div className="pt-4 border-t border-rosa-pastel/60 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">Total ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                  <span className="font-semibold text-fucsia text-lg">{formatPrecio(totalPrecio)}</span>
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
