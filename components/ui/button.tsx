import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Botón principal de la marca (magenta sólido).
        default:
          'bg-primary text-primary-foreground shadow-lg shadow-primary/15 hover:-translate-y-0.5 hover:bg-lavender-magenta-700',
        // Degradado Zoar para llamadas a la acción de la portada.
        brand: 'zoar-button-primary',
        secondary:
          'bg-secondary text-secondary-foreground ring-1 ring-lavender-magenta-100 hover:bg-accent',
        outline:
          'border border-lavender-magenta-200 bg-white text-lavender-magenta-700 shadow-sm hover:-translate-y-0.5 hover:bg-lavender-magenta-50',
        // Cristal translúcido para usar sobre imágenes o fondos rosados.
        glass:
          'border border-white/80 bg-white/70 text-lavender-magenta-900 shadow-sm backdrop-blur-md hover:bg-white',
        ghost: 'text-lavender-magenta-800 hover:bg-lavender-magenta-50',
        // Para paneles oscuros (carrito).
        dark: 'border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white',
        destructive: 'bg-destructive text-white shadow-sm hover:bg-destructive/90',
        link: 'rounded-none text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 text-sm',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-sm',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
