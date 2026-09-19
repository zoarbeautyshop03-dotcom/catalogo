import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen flex bg-crema">
      <AdminSidebar email={session.user.email ?? ''} />
      <div className="flex-1 p-6 max-w-5xl">{children}</div>
    </div>
  )
}
