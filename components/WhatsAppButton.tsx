import type { Producto } from '@/lib/types'
import { buildWhatsappLink } from '@/lib/whatsapp'
import { Button } from '@/components/ui/button'

function IconoWhatsApp({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.9-4.44 9.9-9.9s-4.44-9.9-9.9-9.9Zm0 18.02c-1.5 0-2.97-.4-4.25-1.16l-.3-.18-3.12.82.83-3.04-.2-.31a8.1 8.1 0 0 1-1.24-4.32c0-4.48 3.65-8.12 8.13-8.12 4.48 0 8.12 3.64 8.12 8.12 0 4.48-3.64 8.12-8.12 8.12Zm4.46-6.08c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.81-.2-.48-.4-.41-.55-.42-.14-.01-.3-.01-.46-.01-.16 0-.42.06-.63.3-.22.24-.83.81-.83 1.98 0 1.17.85 2.3.97 2.46.12.16 1.67 2.55 4.05 3.58.57.24 1.01.39 1.35.5.57.18 1.09.16 1.5.09.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  )
}

export default function WhatsAppButton({ producto, numero }: { producto: Producto; numero?: string | null }) {
  if (!producto.whatsapp_activo) return null
  return (
    <Button asChild variant="outline" className="w-full sm:w-auto">
      <a href={buildWhatsappLink(producto, numero)} target="_blank" rel="noopener noreferrer">
        <IconoWhatsApp />
        Pedir por WhatsApp
      </a>
    </Button>
  )
}
