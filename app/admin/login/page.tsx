'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'
import { createClientSupabase } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setCargando(true)
    setError(null)
    const supabase = createClientSupabase()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setCargando(false)
    if (error) {
      setError('Correo o contraseña incorrectos.')
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-lavender-magenta-50 px-4 py-8">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-lavender-magenta-200/60 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-lavender-magenta-300/25 blur-3xl" />

      <form onSubmit={handleSubmit} className="relative w-full max-w-md rounded-[30px] border border-lavender-magenta-100 bg-white p-6 shadow-2xl shadow-lavender-magenta-900/10 sm:p-8">
        <div className="flex justify-center rounded-2xl bg-lavender-magenta-50/80 px-4 py-6 ring-1 ring-lavender-magenta-100">
          <Logo size="lg" />
        </div>
        <div className="mt-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-lavender-magenta-600">Panel privado</span>
          <h1 className="mt-1 font-display text-2xl font-bold text-lavender-magenta-950">Bienvenida a Zoar</h1>
          <p className="mt-1 text-sm leading-6 text-gray-500">Inicia sesión para administrar productos, inventario y categorías.</p>
        </div>

        <label className="mt-6 block text-xs font-semibold text-gray-700">Correo</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-2xl border border-lavender-magenta-100 bg-lavender-magenta-50/45 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-lavender-magenta-300 focus:outline-none" />

        <label className="mt-4 block text-xs font-semibold text-gray-700">Contraseña</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-2xl border border-lavender-magenta-100 bg-lavender-magenta-50/45 px-4 py-3 text-sm focus:border-lavender-magenta-300 focus:outline-none" />

        {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

        <button disabled={cargando} className="mt-5 w-full rounded-full bg-lavender-magenta-600 py-3.5 font-semibold text-white shadow-lg shadow-lavender-magenta-600/15 hover:bg-lavender-magenta-700 disabled:opacity-60">
          {cargando ? 'Entrando...' : 'Entrar al panel'}
        </button>

        <p className="mt-4 text-center text-[11px] leading-5 text-gray-400">Tu usuario se administra desde Supabase Authentication.</p>
      </form>
    </div>
  )
}
