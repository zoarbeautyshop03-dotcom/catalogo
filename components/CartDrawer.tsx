'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCarrito } from '@/lib/cart-context'
import { formatPrecio, buildWhatsappCarritoLink } from '@/lib/whatsapp'

function BagIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M6 8.5h12l.7 11H5.3L6 8.5Z" strokeLinejoin="round" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="m7 7 10 10M17 7 7 17" strokeLinecap="round" />
    </svg>
  )
}

export default function CartDrawer() {
  const [abierto, setAbierto] = useState(false)
  const { items, quitar, cambiarCantidad, vaciar, totalItems, totalPrecio } = useCarrito()

  useEffect(() => {
    if (!abierto) return

    const previo = document.body.style.overflow
    const manejarEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAbierto(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', manejarEscape)

    return () => {
      document.body.style.overflow = previo
      window.removeEventListener('keydown', manejarEscape)
    }
  }, [abierto, setAbierto])

  const linkWhatsapp = buildWhatsappCarritoLink(
    items.map((i) => ({ nombre: i.nombre, precio: i.precio, cantidad: i.cantidad }))
  )

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-lavender-magenta-800 hover:bg-lavender-magenta-50"
        aria-label={`Ver carrito${totalItems > 0 ? `, ${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}` : ''}`}
        aria-haspopup="dialog"
        aria-expanded={abierto}
      >
        <BagIcon />
        {totalItems > 0 && (
          <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-lavender-magenta-600 px-1 text-[9px] font-bold text-white ring-2 ring-white">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </button>

      {abierto && (
        <div className="fixed inset-0 z-[60]" role="presentation">
          <button
            aria-label="Cerrar carrito"
            onClick={() => setAbierto(false)}
            className="cart-backdrop absolute inset-0 h-full w-full bg-black/72 backdrop-blur-[3px]"
          />

          <aside
            className="cart-panel absolute right-0 top-0 flex h-full min-h-0 w-full max-w-lg flex-col overflow-hidden border-l border-white/10 bg-[#1d171d] text-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-lavender-magenta-500/12 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-lavender-magenta-500/10 blur-3xl" />

            <div className="relative flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7 sm:py-5">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-lavender-magenta-300">Zoar Beauty Shop</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <h2 id="cart-title" className="font-display text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                    Tu carrito
                  </h2>
                  <span className="text-xs font-medium text-white/45">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</span>
                </div>
              </div>

              <button
                onClick={() => setAbierto(false)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                aria-label="Cerrar carrito"
              >
                <CloseIcon />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-[24px] border border-lavender-magenta-400/20 bg-lavender-magenta-500/10 text-lavender-magenta-300 shadow-lg shadow-black/10">
                  <BagIcon className="h-8 w-8" />
                </div>
                <p className="mt-5 font-display text-2xl text-white">Tu carrito está vacío</p>
                <p className="mt-2 max-w-sm text-sm leading-6 text-white/50">
                  Agrega tus favoritos y aquí podrás revisar cantidades, precios y tu total antes de enviar el pedido.
                </p>
                <Link
                  href="/catalogo"
                  onClick={() => setAbierto(false)}
                  className="mt-6 rounded-full bg-lavender-magenta-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-lavender-magenta-500/20 hover:bg-lavender-magenta-400"
                >
                  Explorar catálogo
                </Link>
              </div>
            ) : (
              <div className="relative flex-1 min-h-0 overflow-y-auto px-5 py-5 sm:px-7">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[22px] border border-white/10 bg-white/[0.045] p-3.5 shadow-lg shadow-black/5 backdrop-blur-sm sm:p-4"
                    >
                      <div className="flex gap-3.5">
                        <div className="relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-[18px] bg-white/5 ring-1 ring-white/10">
                          {item.imagenUrl ? (
                            <Image src={item.imagenUrl} alt={item.nombre} fill sizes="74px" className="object-cover" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-xl text-lavender-magenta-300">✦</div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <p className="line-clamp-2 text-sm font-semibold leading-5 text-white sm:text-[15px]">{item.nombre}</p>
                            <span className="shrink-0 text-sm font-bold text-lavender-magenta-300">{formatPrecio(item.precio * item.cantidad)}</span>
                          </div>
                          <p className="mt-1 text-xs text-white/45">{formatPrecio(item.precio)} por unidad</p>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="inline-flex items-center rounded-full border border-white/10 bg-black/15 p-1">
                              <button
                                onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold text-white/70 hover:bg-white/10 hover:text-white"
                                aria-label={`Reducir cantidad de ${item.nombre}`}
                              >
                                −
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-white">{item.cantidad}</span>
                              <button
                                onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-full bg-lavender-magenta-500/15 text-sm font-semibold text-lavender-magenta-200 hover:bg-lavender-magenta-500/25"
                                aria-label={`Aumentar cantidad de ${item.nombre}`}
                              >
                                +
                              </button>
                            </div>
                            <button
                              onClick={() => quitar(item.id)}
                              className="text-[11px] font-medium text-white/35 underline-offset-4 hover:text-lavender-magenta-300 hover:underline"
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {items.length > 0 && (
              <div className="relative shrink-0 border-t border-white/10 bg-[#181318] px-5 pb-5 pt-4 sm:px-7 sm:pb-6 sm:pt-5">
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">Resumen del pedido</p>
                    <span className="mt-1 block text-sm text-white/55">Total a pagar</span>
                  </div>
                  <span className="font-display text-2xl font-bold text-white sm:text-3xl">{formatPrecio(totalPrecio)}</span>
                </div>

                <a
                  href={linkWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-2xl bg-lavender-magenta-500 px-5 py-3.5 text-center text-sm font-bold text-white shadow-xl shadow-lavender-magenta-500/15 hover:-translate-y-0.5 hover:bg-lavender-magenta-400"
                >
                  Enviar pedido por WhatsApp
                </a>
                <button
                  onClick={vaciar}
                  className="mt-3 w-full rounded-full py-2 text-xs font-medium text-white/35 hover:text-white/65"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  )
}
