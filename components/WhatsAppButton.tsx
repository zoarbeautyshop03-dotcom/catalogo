import type { Producto } from '@/lib/types'
import { buildWhatsappLink } from '@/lib/whatsapp'

export default function WhatsAppButton({ producto }: { producto: Producto }) {
  if (!producto.whatsapp_activo) return null
  return (
    <a
      href={buildWhatsappLink(producto)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-full bg-fucsia px-6 py-3 text-white font-medium shadow-md hover:opacity-90 transition"
    >
      💬 Pedir por WhatsApp
    </a>
  )
}
