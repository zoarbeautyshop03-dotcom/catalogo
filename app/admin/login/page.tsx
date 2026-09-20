'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
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
    <div className="min-h-screen flex items-center justify-center bg-crema px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-6">
        <Image src="/logo.jpg" alt="Zoar Beauty Shop" width={64} height={64} className="rounded-xl mb-4" />
        <p className="text-sm text-gray-500 mb-6">Inicia sesión para administrar el catálogo</p>

        <label className="block text-sm mb-1">Correo</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-rosa-pastel px-3 py-2 mb-4 text-sm"
        />

        <label className="block text-sm mb-1">Contraseña</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-rosa-pastel px-3 py-2 mb-4 text-sm"
        />

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <button
          disabled={cargando}
          className="w-full rounded-full bg-fucsia text-white py-2 font-medium disabled:opacity-60"
        >
          {cargando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="mt-4 text-xs text-gray-400">
          Tu usuario se crea desde Supabase → Authentication → Users (no hay
          registro público aquí a propósito).
        </p>
      </form>
    </div>
  )
}
