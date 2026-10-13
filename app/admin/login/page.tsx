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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-lavender-magenta-50 px-4 py-10">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-lavender-magenta-200/60 blur-3xl" />
      <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-lavender-magenta-300/25 blur-3xl" />

      <form onSubmit={handleSubmit} className="premium-card animate-scale-in relative w-full max-w-md p-6 sm:p-8">
        <div className="flex justify-center rounded-boutique bg-lavender-magenta-50/80 px-4 py-6 ring-1 ring-lavender-magenta-100">
          <Logo size="lg" />
        </div>
        <div className="mt-7">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-lavender-magenta-600">
            <span aria-hidden="true" className="h-px w-6 bg-dorado" />
            Panel privado
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-lavender-magenta-950">Bienvenida a Zoar</h1>
          <p className="mt-1 text-sm leading-6 text-gray-500">Inicia sesión para administrar productos, inventario y categorías.</p>
          <div className="hairline-gold mt-5" aria-hidden="true" />
        </div>

        <label htmlFor="login-correo" className="mt-6 block text-xs font-semibold text-gray-700">Correo</label>
        <input id="login-correo" name="email" autoComplete="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-2xl border border-lavender-magenta-100 bg-lavender-magenta-50/45 px-4 py-3 text-sm placeholder:text-gray-400 transition-colors duration-200 ease-boutique focus:border-lavender-magenta-300 focus:outline-none" />

        <label htmlFor="login-clave" className="mt-4 block text-xs font-semibold text-gray-700">Contraseña</label>
        <input id="login-clave" name="password" autoComplete="current-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-2xl border border-lavender-magenta-100 bg-lavender-magenta-50/45 px-4 py-3 text-sm transition-colors duration-200 ease-boutique focus:border-lavender-magenta-300 focus:outline-none" />

        {error && <p role="alert" className="mt-3 rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">{error}</p>}

        <button type="submit" disabled={cargando} className="mt-6 w-full rounded-full bg-lavender-magenta-600 py-3.5 font-semibold text-white shadow-lg shadow-lavender-magenta-600/15 transition-all duration-200 ease-boutique hover:-translate-y-0.5 hover:bg-lavender-magenta-700 disabled:translate-y-0 disabled:opacity-60">
          {cargando ? 'Entrando...' : 'Entrar al panel'}
        </button>

        <p className="mt-4 text-center text-[11px] leading-5 text-gray-400">Tu usuario se administra desde Supabase Authentication.</p>
      </form>
    </main>
  )
}
