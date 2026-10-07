'use client'

import { useRef } from 'react'
import Link from 'next/link'

const ENLACES: [string, string][] = [
  ['/', 'Inicio'],
  ['/catalogo', 'Catálogo'],
  ['/catalogo?oferta=1', 'Ofertas'],
  ['/catalogo?nuevo=1', 'Novedades'],
  ['/admin', 'Administración'],
]

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

export default function MenuMovil() {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const cerrar = () => {
    if (detailsRef.current) detailsRef.current.open = false
  }

  return (
    <details ref={detailsRef} className="relative md:hidden">
      <summary
        className="flex cursor-pointer list-none items-center rounded-full p-2 text-lavender-magenta-800 hover:bg-lavender-magenta-50"
        aria-label="Abrir menú"
      >
        <MenuIcon />
      </summary>
      <nav aria-label="Menú principal" className="absolute right-0 top-12 w-56 rounded-2xl border border-lavender-magenta-100 bg-white p-2 shadow-xl">
        {ENLACES.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            onClick={cerrar}
            className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-lavender-magenta-50 hover:text-lavender-magenta-800"
          >
            {label}
          </Link>
        ))}
      </nav>
    </details>
  )
}
