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

function IconoMenos() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M6 12h12" strokeLinecap="round" />
    </svg>
  )
}

function IconoMas() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 6v12M6 12h12" strokeLinecap="round" />
    </svg>
  )
}

function IconoWhatsApp({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.9-4.44 9.9-9.9s-4.44-9.9-9.9-9.9Zm0 18.02c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.12.82.83-3.04-.2-.31a8.1 8.1 0 0 1-1.24-4.32c0-4.48 3.65-8.12 8.13-8.12 4.48 0 8.12 3.64 8.12 8.12 0 4.48-3.64 8.12-8.12 8.12Zm4.46-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.63.3-.22.24-.83.81-.83 1.98 0 1.17.85 2.3.97 2.46.12.16 1.67 2.55 4.05 3.58.57.24 1.01.39 1.35.5.57.18 1.09.16 1.5.09.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  )
}

export default function CartDrawer({ whatsappNumero }: { whatsappNumero?: string | null }) {
  const { items, quitar, cambiarCantidad, vaciar, totalItems, totalPrecio, carritoAbierto: abierto, setCarritoAbierto: setAbierto } = useCarrito()

  // El panel es un Sheet de shadcn/ui (Radix Dialog): se dibuja en un portal a
  // <body> (así no lo encierra el backdrop-blur del header) y Radix se encarga
  // del foco, la tecla Escape, el bloqueo del scroll y los atributos ARIA.

  const linkWhatsapp = buildWhatsappCarritoLink(
    items.map((i) => ({ nombre: i.nombre, precio: i.precio, cantidad: i.cantidad })),
    'COP',
    whatsappNumero
  )

  return (
    <>
      <button
        onClick={() => setAbierto(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-lavender-magenta-800 transition duration-200 ease-boutique hover:bg-lavender-magenta-50"
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

          <div className="relative shrink-0 px-5 pt-5 sm:px-7 sm:pt-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-lavender-magenta-300">Zoar Beauty Shop</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <SheetTitle className="font-display text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                    Tu carrito
                  </SheetTitle>
                  <span className="text-xs font-medium text-white/65">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</span>
                </div>
              </div>

              <SheetClose asChild>
                <Button variant="dark" size="icon" aria-label="Cerrar carrito" className="shrink-0">
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </SheetClose>
            </div>

            <div className="hairline-gold mt-4" />
          </div>

          {items.length === 0 ? (
            <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-boutique border border-lavender-magenta-400/20 bg-lavender-magenta-500/10 text-lavender-magenta-300 shadow-lg shadow-black/10">
                <BagIcon className="h-8 w-8" />
              </div>
              <p className="mt-5 font-display text-2xl text-white">Tu carrito está vacío</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">
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
                    className="rounded-boutique border border-white/10 bg-white/[0.045] p-3.5 shadow-lg shadow-black/5 transition duration-200 ease-boutique hover:border-white/20 sm:p-4"
                  >
                    <div className="flex gap-3.5">
                      <div className="relative h-[74px] w-[74px] shrink-0 overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10">
                        {item.imagenUrl ? (
                          <Image src={item.imagenUrl} alt={item.nombre} fill sizes="74px" className="object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-lavender-magenta-300">
                            <BagIcon className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <p className="line-clamp-2 text-sm font-semibold leading-5 text-white sm:text-[15px]">{item.nombre}</p>
                          <span className="shrink-0 font-display text-base font-bold text-lavender-magenta-300">{formatPrecio(item.precio * item.cantidad)}</span>
                        </div>
                        <p className="mt-1 text-xs text-white/65">{formatPrecio(item.precio)} por unidad</p>

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="inline-flex items-center rounded-full border border-white/10 bg-black/15 p-1">
                            <button
                              onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition duration-200 ease-boutique hover:bg-white/10 hover:text-white"
                              aria-label={`Reducir cantidad de ${item.nombre}`}
                            >
                              <IconoMenos />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-white">{item.cantidad}</span>
                            <button
                              onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-lavender-magenta-500/15 text-lavender-magenta-200 transition duration-200 ease-boutique hover:bg-lavender-magenta-500/25"
                              aria-label={`Aumentar cantidad de ${item.nombre}`}
                            >
                              <IconoMas />
                            </button>
                          </div>
                          <button
                            onClick={() => quitar(item.id)}
                            className="text-[11px] font-medium text-white/65 underline-offset-4 transition duration-200 ease-boutique hover:text-lavender-magenta-300 hover:underline"
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
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60">Resumen del pedido</p>
                  <span className="mt-1 block text-sm text-white/70">Total a pagar</span>
                </div>
                <span className="font-display text-3xl font-bold text-white sm:text-[32px]">{formatPrecio(totalPrecio)}</span>
              </div>
              <div className="hairline-magenta mb-3" />

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
              <Button asChild size="lg" className="w-full rounded-boutique font-bold">
                <a href={linkWhatsapp} target="_blank" rel="noopener noreferrer">
                  <IconoWhatsApp />
                  Enviar pedido por WhatsApp
                </a>
              </Button>
              <Button variant="link" size="sm" onClick={vaciar} className="mt-2 h-auto w-full py-2 font-medium text-white/65 hover:text-white/80 hover:no-underline">
                Vaciar carrito
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
