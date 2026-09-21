import type { Producto } from '@/lib/types'
import { buildWhatsappLink } from '@/lib/whatsapp'

export default function WhatsAppButton({ producto }: { producto: Producto }) {
  if (!producto.whatsapp_activo) return null
  return (
    <a
      href={buildWhatsappLink(producto)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-full border border-lavender-magenta-200 bg-white px-6 py-3 font-semibold text-lavender-magenta-700 shadow-sm hover:-translate-y-0.5 hover:bg-lavender-magenta-50"
    >
      <span aria-hidden="true">💬</span>
      Pedir por WhatsApp
    </a>
  )
}
