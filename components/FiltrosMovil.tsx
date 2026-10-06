'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" strokeLinecap="round" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
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

type Props = {
  children: ReactNode
  cantidadActivos: number
  hayFiltros: boolean
  total: number
}

// Botón "Filtrar" + panel que sube desde abajo (solo celular). Las categorías
// y marcas llegan como `children` ya renderizadas desde la página; cada una es
// un enlace normal, así que al tocarla la página se recarga con el filtro
// aplicado y el panel se cierra solo.
export default function FiltrosMovil({ children, cantidadActivos, hayFiltros, total }: Props) {
  const [abierto, setAbierto] = useState(false)
  const [montado, setMontado] = useState(false)

  useEffect(() => {
    setMontado(true)
  }, [])

  useEffect(() => {
    if (!abierto) return

    const previo = document.body.style.overflow
    const manejarEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setAbierto(false)
    }

    // Si el celular se gira y la pantalla pasa a ser ancha, el panel ya no se
    // muestra: lo cerramos para no dejar la página bloqueada.
    const pantallaAncha = window.matchMedia('(min-width: 640px)')
    const cerrarSiAncha = (event: MediaQueryListEvent) => {
      if (event.matches) setAbierto(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', manejarEscape)
    pantallaAncha.addEventListener('change', cerrarSiAncha)

    return () => {
      document.body.style.overflow = previo
      window.removeEventListener('keydown', manejarEscape)
      pantallaAncha.removeEventListener('change', cerrarSiAncha)
    }
  }, [abierto])

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-haspopup="dialog"
        aria-expanded={abierto}
        className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-lavender-magenta-100 bg-white px-4 text-xs font-bold text-lavender-magenta-800 shadow-sm sm:hidden"
      >
        <FilterIcon />
        Filtrar
        {cantidadActivos > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-lavender-magenta-600 px-1 text-[10px] font-bold text-white">
            {cantidadActivos}
          </span>
        )}
      </button>

      {montado && abierto && createPortal(
        <div className="fixed inset-0 z-[60] sm:hidden" role="presentation">
          <button
            type="button"
            aria-label="Cerrar filtros"
            onClick={() => setAbierto(false)}
            className="cart-backdrop absolute inset-0 h-full w-full bg-black/60"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="filtros-titulo"
            className="hoja-panel absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-lavender-magenta-100 px-5 py-4">
              <h2 id="filtros-titulo" className="font-display text-xl font-bold text-lavender-magenta-950">
                Filtrar productos
              </h2>
              <button
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar filtros"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-lavender-magenta-50 text-lavender-magenta-800"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>

            <div className="flex shrink-0 gap-3 border-t border-lavender-magenta-100 bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
              {hayFiltros && (
                <a
                  href="/catalogo"
                  className="flex h-12 items-center justify-center rounded-full border border-lavender-magenta-200 px-5 text-sm font-bold text-lavender-magenta-700"
                >
                  Limpiar
                </a>
              )}
              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="h-12 flex-1 rounded-full bg-lavender-magenta-600 text-sm font-bold text-white shadow-lg shadow-lavender-magenta-600/20"
              >
                Ver {total} {total === 1 ? 'producto' : 'productos'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
