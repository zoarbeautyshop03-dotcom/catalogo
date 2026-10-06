import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const ACCESOS_RAPIDOS = [
  { href: '/admin/productos/nuevo', label: '+ Nuevo producto', destacado: true },
  { href: '/admin/inventario', label: 'Gestionar inventario' },
  { href: '/admin/productos', label: 'Ver productos' },
  { href: '/admin/reportes', label: 'Ver reportes' },
  { href: '/admin/alertas', label: 'Ver alertas' },
]

function money(value: number) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)
}

export default async function DashboardPage() {
  const supabase = createServerSupabase()

  const [productos, categorias, marcas, movimientos] = await Promise.all([
    supabase.from('productos').select('id, nombre, precio, cantidad_stock, stock_minimo, estado_inventario, estado_publicacion, oferta, marca_id, categoria_id, actualizado_en').order('actualizado_en', { ascending: false }),
    supabase.from('categorias').select('id, nombre').order('nombre'),
    supabase.from('marcas').select('id, nombre').order('nombre'),
    supabase.from('movimientos_inventario').select('id, producto_id, tipo, cantidad_anterior, cantidad_movimiento, cantidad_nueva, precio_anterior, precio_nuevo, motivo, creado_en, productos(nombre)').order('creado_en', { ascending: false }).limit(8),
  ])

  const items = productos.data ?? []
  const categoriasData = categorias.data ?? []
  const marcasData = marcas.data ?? []
  const movimientosData = movimientos.data ?? []

  // Mismos criterios que /admin/inventario y /admin/alertas, para que los números coincidan en todo el panel.
  const stockDe = (p: any) => Number(p.cantidad_stock ?? 0)
  const minimoDe = (p: any) => Number(p.stock_minimo ?? 0)
  const errorCarga = productos.error?.message || categorias.error?.message || marcas.error?.message
  const disponibles = items.filter((p: any) => stockDe(p) > minimoDe(p)).length
  const agotados = items.filter((p: any) => stockDe(p) <= 0).length
  const publicados = items.filter((p) => p.estado_publicacion === 'publicado').length
  const borradores = items.filter((p) => p.estado_publicacion === 'borrador').length
  const ofertas = items.filter((p) => p.oferta).length
  const bajoMinimo = items.filter((p: any) => stockDe(p) > 0 && stockDe(p) <= minimoDe(p))
  const sinPrecio = items.filter((p) => p.precio == null || Number(p.precio) <= 0).length
  const valorInventario = items.reduce((sum, p) => sum + Number(p.precio || 0) * Number(p.cantidad_stock || 0), 0)

  const topStock = [...items].sort((a, b) => Number(b.cantidad_stock || 0) - Number(a.cantidad_stock || 0)).slice(0, 5)
  const recientes = items.slice(0, 6)
  const alertCount = agotados + bajoMinimo.length + sinPrecio

  const stats = [
    { label: 'Productos', value: items.length, note: `${publicados} publicados · ${borradores} borradores`, href: '/admin/productos', icon: '◇' },
    { label: 'Inventario', value: disponibles, note: `${bajoMinimo.length} bajo mínimo · ${agotados} agotados`, href: '/admin/inventario', icon: '▦' },
    { label: 'Agotados', value: agotados, note: 'Requieren reposición', href: '/admin/alertas?tipo=agotados', icon: '!' },
    { label: 'Bajo mínimo', value: bajoMinimo.length, note: 'Revisar compras', href: '/admin/alertas?tipo=minimo', icon: '⚠' },
  ]

  return (
    <div className="mx-auto max-w-7xl pb-10">
      <section className="overflow-hidden rounded-[30px] bg-gradient-to-br from-lavender-magenta-950 via-lavender-magenta-900 to-lavender-magenta-700 px-6 py-7 text-white shadow-xl shadow-lavender-magenta-950/10 sm:px-8 sm:py-8">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-lavender-magenta-200">Zoar Beauty Shop · Dashboard 2.0</span>
            <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">Tu tienda, de un vistazo ✦</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-lavender-magenta-100">Controla catálogo, inventario, alertas y actividad desde un solo lugar.</p>
          </div>
          <Link href="/admin/inventario" className="inline-flex w-fit items-center rounded-2xl bg-white px-5 py-3 text-sm font-bold text-lavender-magenta-800 shadow-lg transition hover:-translate-y-0.5">⚡ Gestionar inventario</Link>
        </div>
      </section>

      {errorCarga && <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">No pude cargar algunos datos del dashboard: {errorCarga}</div>}

      <div className="mt-5 flex flex-wrap gap-2.5">
        {ACCESOS_RAPIDOS.map((a) => <Link key={a.href} href={a.href} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${a.destacado ? 'bg-lavender-magenta-700 text-white hover:bg-lavender-magenta-800' : 'bg-white text-lavender-magenta-700 ring-1 ring-lavender-magenta-100 hover:bg-lavender-magenta-50'}`}>{a.label}</Link>)}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => <Link href={s.href} key={s.label} className="group rounded-[24px] bg-white p-5 shadow-soft-card ring-1 ring-lavender-magenta-100 transition hover:-translate-y-0.5 hover:ring-lavender-magenta-200">
          <div className="flex items-start justify-between"><p className="text-sm font-semibold text-gray-600">{s.label}</p><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender-magenta-50 font-bold text-lavender-magenta-600">{s.icon}</span></div>
          <p className="mt-4 font-display text-4xl font-bold text-lavender-magenta-900">{s.value}</p>
          <p className="mt-1 text-xs text-gray-400">{s.note}</p>
        </Link>)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-[26px] bg-white p-5 shadow-soft-card ring-1 ring-lavender-magenta-100 sm:p-6">
          <div className="flex items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-magenta-500">Salud del inventario</p><h2 className="mt-1 text-xl font-bold text-gray-900">Qué necesita atención</h2></div><Link href="/admin/alertas" className="text-xs font-bold text-lavender-magenta-700">Ver todo →</Link></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link href="/admin/alertas?tipo=agotados" className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-100"><span className="text-xs font-bold text-red-600">AGOTADOS</span><p className="mt-2 text-2xl font-bold text-red-800">{agotados}</p><p className="mt-1 text-xs text-red-600">Reponer cuanto antes</p></Link>
            <Link href="/admin/alertas?tipo=minimo" className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-100"><span className="text-xs font-bold text-amber-700">BAJO MÍNIMO</span><p className="mt-2 text-2xl font-bold text-amber-900">{bajoMinimo.length}</p><p className="mt-1 text-xs text-amber-700">Revisar existencias</p></Link>
            <Link href="/admin/alertas?tipo=precio" className="rounded-2xl bg-lavender-magenta-50 p-4 ring-1 ring-lavender-magenta-100"><span className="text-xs font-bold text-lavender-magenta-700">SIN PRECIO</span><p className="mt-2 text-2xl font-bold text-lavender-magenta-900">{sinPrecio}</p><p className="mt-1 text-xs text-lavender-magenta-700">Corregir catálogo</p></Link>
          </div>
          <div className="mt-6 grid gap-2">
            {bajoMinimo.slice(0, 5).map((p) => <div key={p.id} className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-gray-800">{p.nombre}</p><p className="text-xs text-gray-400">Mínimo: {p.stock_minimo ?? 0}</p></div><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">{p.cantidad_stock ?? 0} uds.</span></div>)}
            {!bajoMinimo.length && <div className="rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-700">✓ No hay productos por debajo del stock mínimo.</div>}
          </div>
        </section>

        <section className="rounded-[26px] bg-white p-5 shadow-soft-card ring-1 ring-lavender-magenta-100 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-magenta-500">Valor de inventario</p><h2 className="mt-1 text-xl font-bold text-gray-900">Resumen económico</h2></div><Link href="/admin/reportes" className="text-xs font-bold text-lavender-magenta-700">Reportes →</Link></div>
          <p className="mt-6 font-display text-3xl font-bold text-lavender-magenta-900">{money(valorInventario)}</p>
          <p className="mt-1 text-xs text-gray-400">Valor referencial: precio de venta × unidades actuales.</p>
          <div className="mt-6 space-y-3">
            {[['Publicados', publicados, items.length], ['En oferta', ofertas, items.length], ['Disponibles', disponibles, items.length]].map(([label, value, total]) => <div key={String(label)}><div className="mb-1 flex justify-between text-xs"><span className="font-semibold text-gray-600">{label}</span><span className="text-gray-400">{value}</span></div><div className="h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-lavender-magenta-500" style={{ width: `${Math.min(100, Number(total) ? (Number(value) / Number(total)) * 100 : 0)}%` }} /></div></div>)}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-400">Categorías</p><p className="mt-1 text-xl font-bold text-gray-800">{categoriasData.length}</p></div><div className="rounded-2xl bg-gray-50 p-4"><p className="text-xs text-gray-400">Marcas</p><p className="mt-1 text-xl font-bold text-gray-800">{marcasData.length}</p></div></div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[26px] bg-white p-5 shadow-soft-card ring-1 ring-lavender-magenta-100 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-magenta-500">Catálogo</p><h2 className="mt-1 text-xl font-bold text-gray-900">Productos con más stock</h2></div><Link href="/admin/productos" className="text-xs font-bold text-lavender-magenta-700">Productos →</Link></div>
          <div className="mt-4 space-y-2">{topStock.map((p) => <div key={p.id} className="flex items-center justify-between gap-4 rounded-2xl px-3 py-3 hover:bg-gray-50"><p className="min-w-0 truncate text-sm font-semibold text-gray-700">{p.nombre}</p><span className="shrink-0 rounded-full bg-lavender-magenta-50 px-3 py-1 text-xs font-bold text-lavender-magenta-700">{p.cantidad_stock ?? 0} uds.</span></div>)}</div>
        </section>
        <section className="rounded-[26px] bg-white p-5 shadow-soft-card ring-1 ring-lavender-magenta-100 sm:p-6">
          <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-magenta-500">Actividad</p><h2 className="mt-1 text-xl font-bold text-gray-900">Movimientos recientes</h2></div><Link href="/admin/inventario#historial" className="text-xs font-bold text-lavender-magenta-700">Historial →</Link></div>
          <div className="mt-4 space-y-2">{movimientosData.length ? movimientosData.map((m: any) => <div key={m.id} className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 px-3 py-3"><div className="min-w-0"><p className="truncate text-sm font-semibold text-gray-700">{m.productos?.nombre ?? 'Producto'}</p><p className="text-xs text-gray-400">{m.motivo || m.tipo}</p></div><span className={`shrink-0 text-xs font-bold ${Number(m.cantidad_movimiento) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{Number(m.cantidad_movimiento) >= 0 ? '+' : ''}{m.cantidad_movimiento}</span></div>) : <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-500">{movimientos.error ? 'No se pudo leer el historial. Ejecuta supabase/inventario.sql en Supabase (SQL Editor) para activarlo.' : 'Aún no hay movimientos registrados.'}</div>}</div>
        </section>
      </div>

      <section className="mt-6 rounded-[26px] bg-white p-5 shadow-soft-card ring-1 ring-lavender-magenta-100 sm:p-6">
        <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-magenta-500">Administración</p><h2 className="mt-1 text-xl font-bold text-gray-900">Acciones rápidas</h2></div></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Link href="/admin/productos/nuevo" className="rounded-2xl border border-lavender-magenta-100 p-4 transition hover:bg-lavender-magenta-50"><span className="text-lg">＋</span><p className="mt-2 text-sm font-bold text-gray-800">Nuevo producto</p><p className="mt-1 text-xs text-gray-400">Añadir al catálogo</p></Link><Link href="/admin/inventario" className="rounded-2xl border border-lavender-magenta-100 p-4 transition hover:bg-lavender-magenta-50"><span className="text-lg">▦</span><p className="mt-2 text-sm font-bold text-gray-800">Actualizar inventario</p><p className="mt-1 text-xs text-gray-400">Edición rápida o Excel</p></Link><Link href="/admin/marcas" className="rounded-2xl border border-lavender-magenta-100 p-4 transition hover:bg-lavender-magenta-50"><span className="text-lg">✦</span><p className="mt-2 text-sm font-bold text-gray-800">Marcas</p><p className="mt-1 text-xs text-gray-400">Organizar proveedores</p></Link><Link href="/admin/categorias" className="rounded-2xl border border-lavender-magenta-100 p-4 transition hover:bg-lavender-magenta-50"><span className="text-lg">◫</span><p className="mt-2 text-sm font-bold text-gray-800">Categorías</p><p className="mt-1 text-xs text-gray-400">Ordenar catálogo</p></Link></div>
      </section>
    </div>
  )
}
