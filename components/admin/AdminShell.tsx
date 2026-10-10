'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Logo, { ButterflyMark } from '@/components/Logo'
import { cerrarSesion } from '@/lib/actions/auth'
import { useDialogoAccesible } from '@/lib/use-dialogo'
import { Icono, type NombreIcono } from './Iconos'

type Item = { href: string; label: string; icono: NombreIcono; exacto?: boolean; alertas?: boolean; externo?: boolean }

const GRUPOS: { titulo: string; items: Item[] }[] = [
  {
    titulo: 'Gestión',
    items: [
      { href: '/admin', label: 'Dashboard', icono: 'inicio', exacto: true },
      { href: '/admin/productos', label: 'Productos', icono: 'productos' },
      { href: '/admin/inventario', label: 'Inventario', icono: 'inventario' },
      { href: '/admin/alertas', label: 'Alertas', icono: 'alertas', alertas: true },
      { href: '/admin/reportes', label: 'Reportes', icono: 'reportes' },
    ],
  },
  {
    titulo: 'Catálogo',
    items: [
      { href: '/admin/categorias', label: 'Categorías', icono: 'categorias' },
      { href: '/admin/marcas', label: 'Marcas', icono: 'marcas' },
    ],
  },
  {
    titulo: 'Cuenta',
    items: [
      { href: '/admin/configuracion', label: 'Configuración', icono: 'configuracion' },
      { href: '/', label: 'Ver tienda', icono: 'tienda', externo: true },
    ],
  },
]

const TODOS = GRUPOS.flatMap((g) => g.items).filter((i) => !i.externo)

function estaActivo(item: Item, pathname: string) {
  if (item.exacto) return pathname === item.href
  return pathname === item.href || pathname.startsWith(`${item.href}/`)
}

function MenuNav({ compacto, pathname, alertas, onNavegar }: { compacto: boolean; pathname: string; alertas: number; onNavegar?: () => void }) {
  return (
    <nav aria-label="Menú de administración" className="flex-1 overflow-y-auto px-2 py-2">
      {GRUPOS.map((grupo, gi) => (
        <div key={grupo.titulo} className={gi > 0 ? 'mt-4 border-t border-lavender-magenta-100 pt-3 adm-separador' : ''}>
          {!compacto && (
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500">{grupo.titulo}</p>
          )}
          <ul className="space-y-1">
            {grupo.items.map((item) => {
              const activo = !item.externo && estaActivo(item, pathname)
              const base =
                'group relative flex h-11 w-full items-center rounded-xl text-sm font-medium transition-colors'
              const estado = activo
                ? 'adm-item-activo bg-lavender-magenta-50 text-lavender-magenta-800 shadow-sm'
                : 'text-gray-600 hover:bg-lavender-magenta-50/70 hover:text-lavender-magenta-800'
              const contenido = (
                <>
                  {activo && <span aria-hidden="true" className="absolute left-0 h-6 w-1 rounded-r-full bg-lavender-magenta-600" />}
                  <span className="grid h-full w-11 shrink-0 place-content-center">
                    <Icono nombre={item.icono} className="h-[18px] w-[18px]" />
                  </span>
                  <span className={compacto ? 'sr-only' : 'truncate'}>{item.label}</span>
                  {item.externo && <span className="sr-only"> (se abre en una pestaña nueva)</span>}
                  {item.alertas && alertas > 0 && (
                    <span
                      className={
                        compacto
                          ? 'absolute right-1.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white'
                          : 'ml-auto mr-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white'
                      }
                    >
                      <span className="sr-only">{alertas} pendientes: </span>
                      {alertas > 99 ? '99+' : alertas}
                    </span>
                  )}
                </>
              )
              return (
                <li key={item.href}>
                  {item.externo ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer" title={compacto ? item.label : undefined} className={`${base} ${estado}`}>
                      {contenido}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={onNavegar}
                      aria-current={activo ? 'page' : undefined}
                      title={compacto ? item.label : undefined}
                      className={`${base} ${estado}`}
                    >
                      {contenido}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function CuentaPie({ email, compacto }: { email: string; compacto: boolean }) {
  return (
    <div className="border-t border-lavender-magenta-100 p-2 adm-separador">
      {compacto ? (
        <form action={cerrarSesion}>
          <button type="submit" title="Cerrar sesión" className="flex h-11 w-full items-center justify-center rounded-xl text-gray-600 hover:bg-lavender-magenta-50 hover:text-lavender-magenta-800">
            <Icono nombre="salir" className="h-[18px] w-[18px]" />
            <span className="sr-only">Cerrar sesión</span>
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-lavender-magenta-50/70 p-2.5">
          <span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-content-center rounded-full bg-lavender-magenta-700 text-sm font-bold uppercase text-white">
            {(email[0] ?? 'Z').toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-lavender-magenta-950">{email}</p>
            <form action={cerrarSesion}>
              <button type="submit" className="text-xs font-semibold text-lavender-magenta-700 hover:underline">Cerrar sesión</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminShell({ email, alertas, children }: { email: string; alertas: number; children: ReactNode }) {
  const pathname = usePathname() ?? '/admin'
  const [abierto, setAbierto] = useState(true)
  const [oscuro, setOscuro] = useState(false)
  const [movil, setMovil] = useState(false)
  const cajonRef = useRef<HTMLDivElement>(null)

  // Recuerda en este dispositivo si el menú estaba contraído y el tema elegido.
  useEffect(() => {
    try {
      setAbierto(localStorage.getItem('zoar-admin-menu') !== '0')
      setOscuro(localStorage.getItem('zoar-admin-tema') === 'oscuro')
    } catch {}
  }, [])

  const alternarMenu = () => {
    const nuevo = !abierto
    setAbierto(nuevo)
    try { localStorage.setItem('zoar-admin-menu', nuevo ? '1' : '0') } catch {}
  }

  const alternarTema = () => {
    const nuevo = !oscuro
    setOscuro(nuevo)
    try { localStorage.setItem('zoar-admin-tema', nuevo ? 'oscuro' : 'claro') } catch {}
  }

  useEffect(() => {
    setMovil(false)
  }, [pathname])

  useDialogoAccesible(cajonRef, movil)

  useEffect(() => {
    if (!movil) return
    const previo = document.body.style.overflow
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') setMovil(false) }
    const ancha = window.matchMedia('(min-width: 768px)')
    const cerrarSiAncha = (e: MediaQueryListEvent) => { if (e.matches) setMovil(false) }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', escape)
    ancha.addEventListener('change', cerrarSiAncha)
    return () => {
      document.body.style.overflow = previo
      window.removeEventListener('keydown', escape)
      ancha.removeEventListener('change', cerrarSiAncha)
    }
  }, [movil])

  const titulo = TODOS.filter((i) => estaActivo(i, pathname)).sort((a, b) => b.href.length - a.href.length)[0]?.label ?? 'Administración'

  return (
    <div className={`admin-root ${oscuro ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-lavender-magenta-50 via-white to-lavender-magenta-100/50 text-gray-900 dark:from-[#150f15] dark:via-[#1a141a] dark:to-[#1d171d] md:flex">
        <a href="#contenido" className="saltar-contenido">Saltar al contenido</a>

        {/* Menú lateral (escritorio): se puede contraer a solo íconos */}
        <aside
          className={`adm-lateral sticky top-0 hidden h-screen shrink-0 flex-col self-start border-r border-lavender-magenta-100 bg-white transition-[width] duration-300 ease-in-out md:flex ${abierto ? 'w-64' : 'w-[76px]'}`}
        >
          <div className={`flex h-14 shrink-0 items-center border-b border-lavender-magenta-100 adm-separador ${abierto ? 'px-4' : 'justify-center'}`}>
            <Link href="/admin" aria-label="Zoar Beauty Shop, ir al dashboard" className="flex items-center">
              {abierto ? <Logo size="sm" showBy={false} /> : <ButterflyMark className="h-8 w-8" />}
            </Link>
          </div>

          <MenuNav compacto={!abierto} pathname={pathname} alertas={alertas} />
          <CuentaPie email={email} compacto={!abierto} />

          <button
            type="button"
            onClick={alternarMenu}
            aria-expanded={abierto}
            aria-label={abierto ? 'Contraer menú' : 'Expandir menú'}
            className="flex h-12 shrink-0 items-center border-t border-lavender-magenta-100 text-gray-600 transition-colors hover:bg-lavender-magenta-50 adm-separador"
          >
            <span className="grid h-full w-[76px] shrink-0 place-content-center">
              <Icono nombre="chevrons" className={`h-[18px] w-[18px] transition-transform duration-300 ${abierto ? 'rotate-180' : ''}`} />
            </span>
            {abierto && <span className="text-sm font-medium">Ocultar menú</span>}
          </button>
        </aside>

        {/* Menú lateral (celular): cajón que se abre desde la izquierda */}
        {movil && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button type="button" aria-label="Cerrar menú" onClick={() => setMovil(false)} className="cart-backdrop absolute inset-0 h-full w-full bg-black/60" />
            <div
              ref={cajonRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label="Menú de administración"
              className="adm-lateral adm-cajon absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white shadow-2xl"
            >
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-lavender-magenta-100 px-4 adm-separador">
                <Logo size="sm" showBy={false} />
                <button type="button" onClick={() => setMovil(false)} aria-label="Cerrar menú" className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 hover:bg-lavender-magenta-50">
                  <Icono nombre="cerrar" />
                </button>
              </div>
              <MenuNav compacto={false} pathname={pathname} alertas={alertas} onNavegar={() => setMovil(false)} />
              <CuentaPie email={email} compacto={false} />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="adm-barra sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-lavender-magenta-100/80 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-10">
            <button type="button" onClick={() => setMovil(true)} aria-haspopup="dialog" aria-label="Abrir menú" className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-lavender-magenta-50 md:hidden">
              <Icono nombre="menu" />
            </button>
            <Link href="/admin" aria-label="Ir al dashboard" className="md:hidden">
              <ButterflyMark className="h-7 w-7" />
            </Link>
            <p className="min-w-0 truncate font-display text-lg font-semibold text-lavender-magenta-950">{titulo}</p>

            <div className="ml-auto flex items-center gap-1.5">
              <a href="/" target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-lavender-magenta-50 sm:inline-flex">
                <Icono nombre="tienda" className="h-4 w-4" />
                Ver tienda
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
              <Link href="/admin/alertas" aria-label={alertas > 0 ? `Alertas: ${alertas} pendientes` : 'Alertas'} className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-lavender-magenta-50">
                <Icono nombre="alertas" />
                {alertas > 0 && <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-600 ring-2 ring-white" />}
              </Link>
              <button
                type="button"
                onClick={alternarTema}
                aria-pressed={oscuro}
                aria-label={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 hover:bg-lavender-magenta-50"
              >
                <Icono nombre={oscuro ? 'sol' : 'luna'} />
              </button>
            </div>
          </header>

          <main id="contenido" tabIndex={-1} className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
