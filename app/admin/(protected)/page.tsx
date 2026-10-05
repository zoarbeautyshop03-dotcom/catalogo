import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const ACCESOS_RAPIDOS = [
  { href: '/admin/productos/nuevo', label: '+ Nuevo producto', destacado: true },
  { href: '/admin/productos', label: 'Ver productos' },
  { href: '/admin/inventario', label: 'Actualizar inventario' },
  { href: '/admin/marcas', label: 'Marcas' },
  { href: '/admin/categorias', label: 'Categorías' },
  { href: '/admin/configuracion', label: 'Configuración' },
]

export default async function DashboardPage() {
  const supabase = createServerSupabase()

  const [total, disponibles, ultimasUnidades, agotados, categorias, marcas, publicados, borradores, enOferta] =
    await Promise.all([
      supabase.from('productos').select('*', { count: 'exact', head: true }),
      supabase.from('productos').select('*', { count: 'exact', head: true }).eq('estado_inventario', 'disponible'),
      supabase.from('productos').select('*', { count: 'exact', head: true }).eq('estado_inventario', 'ultimas_unidades'),
      supabase.from('productos').select('*', { count: 'exact', head: true }).eq('estado_inventario', 'agotado'),
      supabase.from('categorias').select('*', { count: 'exact', head: true }),
      supabase.from('marcas').select('*', { count: 'exact', head: true }),
      supabase.from('productos').select('*', { count: 'exact', head: true }).eq('estado_publicacion', 'publicado'),
      supabase.from('productos').select('*', { count: 'exact', head: true }).eq('estado_publicacion', 'borrador'),
      supabase.from('productos').select('*', { count: 'exact', head: true }).eq('oferta', true),
    ])

  const stats = [
    { label: 'Productos totales', value: total.count ?? 0, note: 'Catálogo completo' },
    { label: 'Publicados', value: publicados.count ?? 0, note: 'Visibles en la tienda' },
    { label: 'Borradores', value: borradores.count ?? 0, note: 'Pendientes de publicar' },
    { label: 'En oferta', value: enOferta.count ?? 0, note: 'Con descuento activo' },
    { label: 'Disponibles', value: disponibles.count ?? 0, note: 'Listos para vender' },
    { label: 'Últimas unidades', value: ultimasUnidades.count ?? 0, note: 'Revisar inventario' },
    { label: 'Agotados', value: agotados.count ?? 0, note: 'Sin existencias' },
    { label: 'Categorías', value: categorias.count ?? 0, note: 'Organización' },
    { label: 'Marcas', value: marcas.count ?? 0, note: 'Catálogo de marcas' },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="rounded-[30px] bg-gradient-to-br from-lavender-magenta-950 to-lavender-magenta-800 px-6 py-8 text-white shadow-xl shadow-lavender-magenta-950/10 sm:px-8">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-lavender-magenta-200">Zoar Beauty Shop</span>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Panel de administración</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-lavender-magenta-100">Una vista rápida del estado de tu catálogo para que puedas mantener productos e inventario al día.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2.5">
        {ACCESOS_RAPIDOS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              a.destacado
                ? 'bg-lavender-magenta-700 text-white hover:bg-lavender-magenta-800'
                : 'bg-white text-lavender-magenta-700 ring-1 ring-lavender-magenta-100 hover:bg-lavender-magenta-50'
            }`}
          >
            {a.label}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[24px] bg-white p-5 shadow-soft-card ring-1 ring-lavender-magenta-100">
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm font-semibold text-gray-600">{s.label}</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-lavender-magenta-50 text-lavender-magenta-600">✦</span>
            </div>
            <p className="mt-5 font-display text-4xl font-bold text-lavender-magenta-900">{s.value}</p>
            <p className="mt-1 text-xs text-gray-400">{s.note}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
