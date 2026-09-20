import Link from 'next/link'
import Image from 'next/image'
import { cerrarSesion } from '@/lib/actions/auth'

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/productos', label: 'Productos' },
  { href: '/admin/inventario', label: 'Inventario' },
  { href: '/admin/categorias', label: 'Categorías' },
  { href: '/admin/marcas', label: 'Marcas' },
  { href: '/admin/configuracion', label: 'Configuración' },
]

export default function AdminSidebar({ email }: { email: string }) {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-rosa-pastel min-h-screen p-4 flex flex-col">
      <Image src="/logo.jpg" alt="Zoar Beauty Shop" width={40} height={40} className="rounded-lg mb-6" />
      <nav className="flex flex-col gap-1 text-sm">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-gray-700 hover:bg-rosa-pastel/40">
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-6 text-xs text-gray-400">
        <p className="mb-2 truncate">{email}</p>
        <form action={cerrarSesion}>
          <button className="text-fucsia hover:underline">Cerrar sesión</button>
        </form>
      </div>
    </aside>
  )
}
