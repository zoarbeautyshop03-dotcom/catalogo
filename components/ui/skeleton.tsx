import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-full bg-lavender-magenta-100', className)} {...props} />
}

export { Skeleton }
