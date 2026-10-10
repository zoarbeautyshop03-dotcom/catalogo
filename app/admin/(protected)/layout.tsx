import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import AdminShell from '@/components/admin/AdminShell'
import BotonVolver from '@/components/admin/BotonVolver'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/admin/login')

  // Cantidad de productos que necesitan atención (misma regla que /admin/alertas)
  // para mostrarla como globo en el menú y en la campana.
  let alertas = 0
  try {
    const { data } = await supabase.from('productos').select('cantidad_stock, stock_minimo, precio, estado_inventario')
    for (const p of data ?? []) {
      const stock = Number(p.cantidad_stock ?? 0)
      const agotado = stock <= 0 || p.estado_inventario === 'agotado'
      const bajoMinimo = stock > 0 && p.stock_minimo != null && stock <= Number(p.stock_minimo)
      const sinPrecio = !p.precio || Number(p.precio) <= 0
      if (agotado || bajoMinimo || sinPrecio) alertas++
    }
  } catch {
    alertas = 0
  }

  return (
    <AdminShell email={session.user.email ?? ''} alertas={alertas}>
      <BotonVolver />
      {children}
    </AdminShell>
  )
}
