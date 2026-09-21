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
    <div className="min-h-screen bg-gradient-to-br from-lavender-magenta-50 via-white to-lavender-magenta-100/50 md:flex">
      <AdminSidebar email={session.user.email ?? ''} />
      <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-10">{children}</div>
    </div>
  )
}
