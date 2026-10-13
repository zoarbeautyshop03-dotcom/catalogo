'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

type Props = {
  children: ReactNode
  cantidadActivos: number
  hayFiltros: boolean
  total: number
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3" strokeLinecap="round" />
      <path d="M14 2v4M8 10v4M16 18v4" strokeLinecap="round" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  )
}

// Botón "Filtrar" + panel que sube desde abajo (solo celular), hecho con el
// Sheet de shadcn/ui. Las categorías y marcas llegan como `children` ya
// renderizadas desde la página; cada una es un enlace normal, así que al
// tocarla la página se recarga con el filtro aplicado y el panel se cierra solo.
export default function FiltrosMovil({ children, cantidadActivos, hayFiltros, total }: Props) {
  const [abierto, setAbierto] = useState(false)

  // Si el celular se gira y la pantalla pasa a ser ancha, el panel ya no se
  // muestra: lo cerramos para no dejar la página bloqueada.
  useEffect(() => {
    if (!abierto) return
    const pantallaAncha = window.matchMedia('(min-width: 640px)')
    const cerrarSiAncha = (event: MediaQueryListEvent) => {
      if (event.matches) setAbierto(false)
    }
    pantallaAncha.addEventListener('change', cerrarSiAncha)
    return () => pantallaAncha.removeEventListener('change', cerrarSiAncha)
  }, [abierto])

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="h-11 flex-1 px-4 text-xs font-bold transition ease-boutique sm:hidden"
        >
          <SlidersIcon />
          Filtrar
          {cantidadActivos > 0 && (
            <Badge className="h-5 min-w-5 justify-center px-1 py-0 text-[10px] font-bold">{cantidadActivos}</Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        showClose={false}
        className="flex max-h-[88dvh] flex-col gap-0 overflow-hidden rounded-t-boutique-lg bg-white p-0 ring-1 ring-lavender-magenta-100 sm:hidden"
      >
        <SheetDescription className="sr-only">Elige categorías y marcas para filtrar el catálogo.</SheetDescription>

        {/* Agarradera visual del panel */}
        <div aria-hidden="true" className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-lavender-magenta-200" />

        <div className="mt-2 flex shrink-0 items-start justify-between gap-3 border-b border-lavender-magenta-100 px-5 pb-4">
          <div>
            <p className="eyebrow">Refina tu búsqueda</p>
            <SheetTitle className="mt-2 font-display text-display-sm font-bold text-lavender-magenta-950">
              Filtrar productos
            </SheetTitle>
          </div>
          <SheetClose asChild>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Cerrar filtros"
              className="shrink-0 rounded-full transition ease-boutique"
            >
              <XIcon />
            </Button>
          </SheetClose>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>

        <div className="flex shrink-0 gap-3 border-t border-lavender-magenta-100 bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          {hayFiltros && (
            <Button asChild variant="outline" size="lg" className="px-5 font-bold transition ease-boutique">
              <a href="/catalogo">Limpiar</a>
            </Button>
          )}
          <SheetClose asChild>
            <Button size="lg" className="flex-1 font-bold transition ease-boutique">
              Ver {total} {total === 1 ? 'producto' : 'productos'}
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
