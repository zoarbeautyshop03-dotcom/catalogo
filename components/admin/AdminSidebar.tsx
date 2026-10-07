'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo, { ButterflyMark } from '@/components/Logo'
import { cerrarSesion } from '@/lib/actions/auth'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '⌂' },
  { href: '/admin/productos', label: 'Productos', icon: '◇' },
  { href: '/admin/inventario', label: 'Inventario', icon: '▦' },
  { href: '/admin/alertas', label: 'Alertas', icon: '⚠' },
  { href: '/admin/reportes', label: 'Reportes', icon: '◒' },
  { href: '/admin/categorias', label: 'Categorías', icon: '◫' },
  { href: '/admin/marcas', label: 'Marcas', icon: '✦' },
  { href: '/admin/configuracion', label: 'Configuración', icon: '⚙' },
]

const CLAVE_GUARDADA = 'zoar-admin-sidebar-abierto'

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname()
  const [abierto, setAbierto] = useState(true)

  useEffect(() => {
    const guardado = window.localStorage.getItem(CLAVE_GUARDADA)
    if (guardado !== null) setAbierto(guardado === '1')
  }, [])

  const alternar = () => {
    setAbierto((previo) => {
      const nuevo = !previo
      window.localStorage.setItem(CLAVE_GUARDADA, nuevo ? '1' : '0')
      return nuevo
    })
  }

  return (
    <aside
      className={`relative flex shrink-0 flex-col border-r border-lavender-magenta-100 bg-white py-5 shadow-sm transition-[width] duration-200 ${
        abierto ? 'w-64 px-4' : 'w-[78px] px-2.5'
      }`}
    >
      <button
        onClick={alternar}
        title={abierto ? 'Contraer menú' : 'Expandir menú'}
        aria-label={abierto ? 'Contraer menú' : 'Expandir menú'}
        className="absolute -right-3 top-8 flex h-7 w-7 items-center justify-center rounded-full border border-lavender-magenta-100 bg-white text-lavender-magenta-700 shadow-md transition hover:bg-lavender-magenta-50"
      >
        <span className={`inline-block transition-transform ${abierto ? '' : 'rotate-180'}`}>‹</span>
      </button>

      <Link
        href="/admin"
        className={`block rounded-2xl bg-lavender-magenta-50/70 ring-1 ring-lavender-magenta-100 ${
          abierto ? 'px-3 py-4' : 'flex items-center justify-center py-3'
        }`}
      >
        {abierto ? <Logo size="sm" /> : <ButterflyMark className="h-7 w-7" />}
      </Link>

      {abierto && (
        <div className="px-2 pb-3 pt-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lavender-magenta-500">Administración</p>
          <p className="mt-1 text-xs text-gray-400">Gestiona tu tienda desde aquí</p>
        </div>
      )}

      <nav className={`flex flex-col gap-1.5 text-sm ${abierto ? 'mt-1' : 'mt-6 items-center'}`}>
        {LINKS.map((l) => {
          const activo = l.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(l.href)
          return (
            <Link
              key={l.href}
              href={l.href}
              title={!abierto ? l.label : undefined}
              className={`group flex items-center gap-3 rounded-2xl font-medium transition-colors ${
                abierto ? 'px-3 py-3' : 'h-11 w-11 justify-center'
              } ${activo ? 'bg-lavender-magenta-600 text-white' : 'text-gray-600 hover:bg-lavender-magenta-50 hover:text-lavender-magenta-800'}`}
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                  activo ? 'bg-white/20' : 'bg-lavender-magenta-50 text-lavender-magenta-600 group-hover:bg-white'
                }`}
              >
                {l.icon}
              </span>
              {abierto && l.label}
            </Link>
          )
        })}
      </nav>

      <div className={`mt-auto rounded-2xl bg-lavender-magenta-50/70 ring-1 ring-lavender-magenta-100 ${abierto ? 'p-3' : 'flex justify-center p-2'}`}>
        {abierto ? (
          <>
            <p className="truncate text-xs font-medium text-lavender-magenta-950">{email}</p>
            <form action={cerrarSesion} className="mt-2">
              <button className="text-xs font-semibold text-lavender-magenta-700 hover:text-lavender-magenta-900">Cerrar sesión</button>
            </form>
          </>
        ) : (
          <form action={cerrarSesion}>
            <button title="Cerrar sesión" aria-label="Cerrar sesión" className="flex h-9 w-9 items-center justify-center rounded-xl text-lavender-magenta-700 hover:bg-white">
              ⏻
            </button>
          </form>
        )}
      </div>
    </aside>
  )
}
