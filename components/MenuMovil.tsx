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
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" showClose={false} className="flex w-[82%] max-w-xs flex-col gap-0 bg-white p-0 md:hidden">
        <SheetDescription className="sr-only">Navegación principal de la tienda.</SheetDescription>

        <div className="flex items-center justify-between border-b border-lavender-magenta-100 px-5 py-4">
          <SheetTitle className="font-display text-xl font-bold text-lavender-magenta-950">Menú</SheetTitle>
          <SheetClose asChild>
            <Button variant="secondary" size="icon" aria-label="Cerrar menú">
              <X className="h-5 w-5" aria-hidden="true" />
            </Button>
          </SheetClose>
        </div>

        <nav aria-label="Menú principal" className="flex-1 overflow-y-auto p-3">
          {ENLACES.map(([href, label]) => (
            <SheetClose asChild key={href}>
              <Link
                href={href}
                className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-[15px] font-semibold text-gray-700 hover:bg-lavender-magenta-50 hover:text-lavender-magenta-800"
              >
                {label}
                <ChevronRight className="h-4 w-4 text-lavender-magenta-300" aria-hidden="true" />
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
