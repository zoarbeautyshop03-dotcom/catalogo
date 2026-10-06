'use client'

import { usePathname } from 'next/navigation'
import { useCarrito } from '@/lib/cart-context'
import { formatPrecio } from '@/lib/whatsapp'

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M6 8.5h12l.7 11H5.3L6 8.5Z" strokeLinejoin="round" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M3.5 8h9M9 4.5 12.5 8 9 11.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Barra fija al fondo de la pantalla (solo celular) que aparece cuando hay
// productos en el carrito: confirma que se agregó algo y deja llegar al
// pedido con un solo toque del pulgar.
export default function BarraCarritoMovil() {
  const { totalItems, totalPrecio, carritoAbierto, setCarritoAbierto } = useCarrito()
  const pathname = usePathname()

  if (totalItems === 0 || pathname?.startsWith('/admin')) return null

  const textoProductos = `${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}`

  return (
    <>
      {/* Espacio para que la barra no tape el final de la página. */}
      <div aria-hidden="true" className="h-24 md:hidden" />

      {!carritoAbierto && (
        <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
          <button
            type="button"
            onClick={() => setCarritoAbierto(true)}
            aria-label={`Ver carrito, ${textoProductos}, total ${formatPrecio(totalPrecio)}`}
            className="barra-carrito flex w-full items-center gap-3 rounded-2xl bg-lavender-magenta-600 px-4 py-3 text-left text-white shadow-[0_12px_30px_rgba(81,1,65,0.28)] ring-1 ring-white/20 active:bg-lavender-magenta-700"
          >
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
              <BagIcon />
              <span
                key={totalItems}
                className="barra-carrito-pop absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-extrabold text-lavender-magenta-700"
              >
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold leading-5">Ver mi carrito</span>
              <span className="block truncate text-[11px] leading-4 text-white/80">{textoProductos} · envía tu pedido por WhatsApp</span>
            </span>

            <span className="shrink-0 text-base font-extrabold">{formatPrecio(totalPrecio)}</span>
            <ArrowIcon />
          </button>
        </div>
      )}
    </>
  )
}
