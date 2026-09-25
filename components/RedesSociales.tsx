import type { Configuracion } from '@/lib/types'

type Red = 'instagram' | 'facebook' | 'tiktok'

function urlRedSocial(red: Red, valorCrudo: string) {
  const valor = valorCrudo.trim().replace(/^@/, '')
  if (/^https?:\/\//i.test(valor)) return valor
  const base: Record<Red, string> = {
    instagram: 'https://instagram.com/',
    facebook: 'https://facebook.com/',
    tiktok: 'https://tiktok.com/@',
  }
  return `${base[red]}${valor.replace(/^\/+/, '')}`
}

export default function RedesSociales({
  config,
}: {
  config: Pick<Configuracion, 'instagram' | 'facebook' | 'tiktok'> | null
}) {
  if (!config) return null

  const todas: { key: Red; valor: string | null; label: string; icono: React.ReactNode }[] = [
    { key: 'instagram', valor: config.instagram, label: 'Instagram', icono: <IconoInstagram /> },
    { key: 'facebook', valor: config.facebook, label: 'Facebook', icono: <IconoFacebook /> },
    { key: 'tiktok', valor: config.tiktok, label: 'TikTok', icono: <IconoTikTok /> },
  ]
  const redes = todas.filter((r) => !!r.valor && r.valor.trim() !== '')

  if (redes.length === 0) return null

  return (
    <div className="flex items-center gap-2.5">
      {redes.map((r) => (
        <a
          key={r.key}
          href={urlRedSocial(r.key, r.valor as string)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={r.label}
          title={r.label}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender-magenta-50 text-lavender-magenta-700 ring-1 ring-lavender-magenta-100 transition hover:bg-lavender-magenta-600 hover:text-white"
        >
          {r.icono}
        </a>
      ))}
    </div>
  )
}

function IconoInstagram() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconoFacebook() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 9h3V5h-3c-2.2 0-4 1.8-4 4v2H7v4h3v7h4v-7h3l1-4h-4V9c0-.6.4-1 1-1z" />
    </svg>
  )
}

function IconoTikTok() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 3c.4 2.2 2 3.7 4.2 3.9V10c-1.5 0-2.9-.5-4-1.3v6.2c0 3.4-2.8 6-6.1 5.7-2.8-.3-5-2.7-5-5.6 0-3.1 2.5-5.6 5.6-5.6.3 0 .6 0 .9.1v3.3a2.4 2.4 0 1 0 1.7 2.3V3h2.7z" />
    </svg>
  )
}
