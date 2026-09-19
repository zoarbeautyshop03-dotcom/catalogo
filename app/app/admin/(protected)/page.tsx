import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = createServerSupabase()

  const [total, disponibles, ultimasUnidades, agotados, categorias, marcas] = await Promise.all([
    supabase.from('productos').select('*', { count: 'exact', head: true }),
    supabase.from('productos').select('*', { count: 'exact', head: true }).eq('estado_inventario', 'disponible'),
    supabase
      .from('productos')
      .select('*', { count: 'exact', head: true })
      .eq('estado_inventario', 'ultimas_unidades'),
    supabase.from('productos').select('*', { count: 'exact', head: true }).eq('estado_inventario', 'agotado'),
    supabase.from('categorias').select('*', { count: 'exact', head: true }),
    supabase.from('marcas').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Productos totales', value: total.count ?? 0 },
    { label: 'Disponibles', value: disponibles.count ?? 0, color: 'text-green-600' },
    { label: 'Últimas unidades', value: ultimasUnidades.count ?? 0, color: 'text-amber-600' },
    { label: 'Agotados', value: agotados.count ?? 0, color: 'text-red-500' },
    { label: 'Categorías', value: categorias.count ?? 0 },
    { label: 'Marcas', value: marcas.count ?? 0 },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5">
            <p className={`text-3xl font-semibold ${s.color ?? 'text-gray-800'}`}>{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
