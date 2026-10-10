'use client'

import { Toaster as Sonner } from 'sonner'

// Avisos tipo "toast" (shadcn/ui + Sonner) con los colores de Zoar.
export function Toaster() {
  return (
    <Sonner
      position="top-center"
      duration={2600}
      offset={12}
      toastOptions={{
        classNames: {
          toast:
            '!rounded-2xl !border !border-lavender-magenta-100 !bg-white !font-body !text-gray-800 !shadow-soft-pink',
          title: '!text-sm !font-semibold !text-lavender-magenta-950',
          description: '!text-xs !text-gray-600',
          success: '[&_[data-icon]]:!text-lavender-magenta-600',
          actionButton: '!rounded-full !bg-lavender-magenta-600 !px-3 !text-xs !font-bold !text-white',
        },
      }}
    />
  )
}
