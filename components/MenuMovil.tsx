'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const ENLACES: [string, string][] = [
  ['/', 'Inicio'],
  ['/catalogo', 'Catálogo'],
  ['/catalogo?oferta=1', 'Ofertas'],
  ['/catalogo?nuevo=1', 'Novedades'],
  ['/admin', 'Administración'],
]

// Menú del celular como panel lateral (Sheet de shadcn/ui): enlaces más
// grandes para el pulgar, foco controlado y cierre con Escape o tocando fuera.
export default function MenuMovil() {
  const [abierto, setAbierto] = useState(false)

  // Si la pantalla pasa a ser ancha (≥768px) el menú ya no existe: se cierra.
  useEffect(() => {
    if (!abierto) return
    const ancha = window.matchMedia('(min-width: 768px)')
    const cerrarSiAncha = (event: MediaQueryListEvent) => {
      if (event.matches) setAbierto(false)
    }
    ancha.addEventListener('change', cerrarSiAncha)
    return () => ancha.removeEventListener('change', cerrarSiAncha)
  }, [abierto])

  return (
    <Sheet open={abierto} onOpenChange={setAbierto}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden rounded-full text-lavender-magenta-800 hover:bg-lavender-magenta-50"
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showClose={false}
        className="flex w-[86%] max-w-sm flex-col gap-0 overflow-hidden border-l border-white/70 bg-gradient-to-b from-white via-white to-blush-pink-50/70 p-0 shadow-float md:hidden"
      >
        <SheetDescription className="sr-only">Navegación principal de la tienda.</SheetDescription>

        <div className="relative shrink-0 px-6 pb-5 pt-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-lavender-magenta-300/25 blur-3xl"
          />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="eyebrow">Navegación</p>
              <SheetTitle className="mt-2 font-display text-2xl font-bold tracking-tight text-lavender-magenta-950">
                Menú
              </SheetTitle>
            </div>
            <SheetClose asChild>
              <Button variant="secondary" size="icon" className="shrink-0 rounded-full" aria-label="Cerrar menú">
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetClose>
          </div>
          <div aria-hidden="true" className="hairline-gold mt-5" />
        </div>

        <nav aria-label="Menú principal" className="flex-1 overflow-y-auto px-3 pb-4">
          <ul className="space-y-1">
            {ENLACES.map(([href, label], indice) => (
              <li key={href}>
                <SheetClose asChild>
                  <Link
                    href={href}
                    className="group flex items-center justify-between gap-3 rounded-2xl px-4 py-3.5 text-[15px] font-semibold text-gray-700 transition-colors duration-200 ease-boutique hover:bg-lavender-magenta-50 hover:text-lavender-magenta-800"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="font-display text-xs font-bold tabular-nums text-dorado-oscuro/70"
                      >
                        {String(indice + 1).padStart(2, '0')}
                      </span>
                      {label}
                    </span>
                    <ChevronRight
                      className="h-4 w-4 shrink-0 text-lavender-magenta-300 transition-transform duration-200 ease-boutique group-hover:translate-x-0.5 group-hover:text-lavender-magenta-600"
                      aria-hidden="true"
                    />
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-lavender-magenta-100/70 px-6 py-5">
          <p className="font-script text-xl leading-none text-lavender-magenta-700">Zoar Beauty Shop</p>
          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-dorado-oscuro">
            Boutique de belleza
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
