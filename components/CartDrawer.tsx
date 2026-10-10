'use client'

import Link from 'next/link'
import Image from 'next/image'
import { X } from 'lucide-react'
import { useCarrito } from '@/lib/cart-context'
import { formatPrecio, buildWhatsappCarritoLink } from '@/lib/whatsapp'
import { Button } from '@/components/ui/button'
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'

function BagIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M6 8.5h12l.7 11H5.3L6 8.5Z" strokeLinejoin="round" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  )
}

export default function CartDrawer() {
  const { items, quitar, cambiarCantidad, vaciar, totalItems, totalPrecio, carritoAbierto: abierto, setCarritoAbierto: setAbierto } = useCarrito()

  // El panel es un Sheet de shadcn/ui (Radix Dialog): se dibuja en un portal a
  // <body> (así no lo encierra el backdrop-blur del header) y Radix se encarga
  // del foco, la tecla Escape, el bloqueo del scroll y los atributos ARIA.

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

      <Sheet open={abierto} onOpenChange={setAbierto}>
        <SheetContent
          side="right"
          showClose={false}
          className="flex h-full min-h-0 w-full flex-col gap-0 overflow-hidden border-l border-white/10 bg-[#1d171d] p-0 text-white sm:max-w-lg"
        >
          <SheetDescription className="sr-only">
            Revisa los productos de tu pedido, cambia cantidades y envíalo por WhatsApp.
          </SheetDescription>
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-lavender-magenta-500/12 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-lavender-magenta-500/10 blur-3xl" />

          <div className="relative flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7 sm:py-5">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-lavender-magenta-300">Zoar Beauty Shop</p>
              <div className="mt-1 flex items-baseline gap-2">
                <SheetTitle className="font-display text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                  Tu carrito
                </SheetTitle>
                <span className="text-xs font-medium text-white/45">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</span>
              </div>
            </div>

            <SheetClose asChild>
              <Button variant="dark" size="icon" aria-label="Cerrar carrito" className="shrink-0">
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetClose>
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
              <Button asChild size="lg" className="mt-6">
                <Link href="/catalogo" onClick={() => setAbierto(false)}>
                  Explorar catálogo
                </Link>
              </Button>
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

              <p className="mb-3 text-[11px] leading-5 text-white/65">
                Al enviar tu pedido se abrirá WhatsApp con el resumen; allí nos compartirás tu nombre, ciudad y dirección solo para gestionarlo. Al continuar
                aceptas la{' '}
                <Link href="/privacidad" onClick={() => setAbierto(false)} className="font-semibold text-lavender-magenta-300 underline underline-offset-2">
                  Política de privacidad
                </Link>{' '}
                y los{' '}
                <Link href="/terminos" onClick={() => setAbierto(false)} className="font-semibold text-lavender-magenta-300 underline underline-offset-2">
                  Términos
                </Link>
                . Tienes{' '}
                <Link href="/devoluciones" onClick={() => setAbierto(false)} className="font-semibold text-lavender-magenta-300 underline underline-offset-2">
                  derecho de retracto
                </Link>
                .
              </p>
              <Button asChild size="lg" className="w-full rounded-2xl font-bold">
                <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer">
                  Enviar pedido por WhatsApp
                </a>
              </Button>
              <Button variant="link" size="sm" onClick={vaciar} className="mt-2 h-auto w-full py-2 font-medium text-white/45 hover:text-white/80 hover:no-underline">
                Vaciar carrito
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
