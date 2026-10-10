import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-lavender-magenta-600 text-white',
        dark: 'bg-lavender-magenta-950 text-white',
        soft: 'bg-lavender-magenta-50 text-lavender-magenta-700 ring-1 ring-lavender-magenta-100',
        outline: 'bg-white text-lavender-magenta-800 ring-1 ring-lavender-magenta-100',
        warning: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
        success: 'bg-green-50 text-green-800 ring-1 ring-green-200',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
