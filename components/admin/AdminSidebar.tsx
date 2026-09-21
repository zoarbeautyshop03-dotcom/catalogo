import Link from 'next/link'
import Image from 'next/image'
import { cerrarSesion } from '@/lib/actions/auth'

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '⌂' },
  { href: '/admin/productos', label: 'Productos', icon: '◇' },
  { href: '/admin/inventario', label: 'Inventario', icon: '▦' },
  { href: '/admin/categorias', label: 'Categorías', icon: '◫' },
  { href: '/admin/marcas', label: 'Marcas', icon: '✦' },
  { href: '/admin/configuracion', label: 'Configuración', icon: '⚙' },
]

export default function AdminSidebar({ email }: { email: string }) {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-lavender-magenta-100 bg-white px-4 py-5 shadow-sm">
      <Link href="/admin" className="block rounded-2xl bg-lavender-magenta-50/70 p-2 ring-1 ring-lavender-magenta-100">
        <Image src="/logo-banner.png" alt="Zoar Beauty Shop" width={260} height={98} className="h-auto w-full" priority />
      </Link>

      <div className="px-2 pb-3 pt-7">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-lavender-magenta-500">Administración</p>
        <p className="mt-1 text-xs text-gray-400">Gestiona tu tienda desde aquí</p>
      </div>

      <nav className="flex flex-col gap-1.5 text-sm">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="group flex items-center gap-3 rounded-2xl px-3 py-3 font-medium text-gray-600 hover:bg-lavender-magenta-50 hover:text-lavender-magenta-800">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-lavender-magenta-50 text-lavender-magenta-600 group-hover:bg-white">{l.icon}</span>
            {l.label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl bg-lavender-magenta-50/70 p-3 ring-1 ring-lavender-magenta-100">
        <p className="truncate text-xs font-medium text-lavender-magenta-950">{email}</p>
        <form action={cerrarSesion} className="mt-2">
          <button className="text-xs font-semibold text-lavender-magenta-700 hover:text-lavender-magenta-900">Cerrar sesión</button>
        </form>
      </div>
    </aside>
  )
}
