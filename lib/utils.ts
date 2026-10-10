import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utilidad estándar de shadcn/ui: une clases de Tailwind sin duplicados ni conflictos.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
