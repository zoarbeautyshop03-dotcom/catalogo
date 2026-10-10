import type { Producto } from '@/lib/types'
import { buildWhatsappLink } from '@/lib/whatsapp'
import { Button } from '@/components/ui/button'

export default function WhatsAppButton({ producto }: { producto: Producto }) {
  if (!producto.whatsapp_activo) return null
  return (
    <Button asChild variant="outline">
      <a href={buildWhatsappLink(producto)} target="_blank" rel="noopener noreferrer">
        <span aria-hidden="true">💬</span>
        Pedir por WhatsApp
      </a>
    </Button>
  )
}
