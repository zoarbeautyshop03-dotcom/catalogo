'use client'

import { useEffect, type RefObject } from 'react'

const ENFOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

// Accesibilidad de teclado para ventanas emergentes (carrito y filtros):
// al abrirlas el foco entra en la ventana, Tab y Shift+Tab se quedan dentro
// mientras está abierta y, al cerrarla, el foco vuelve al botón que la abrió.
export function useDialogoAccesible(ref: RefObject<HTMLElement>, abierto: boolean) {
  useEffect(() => {
    if (!abierto) return
    const contenedor = ref.current
    if (!contenedor) return

    const previo = document.activeElement as HTMLElement | null
    const enfocables = () => Array.from(contenedor.querySelectorAll<HTMLElement>(ENFOCABLES))

    ;(enfocables()[0] ?? contenedor).focus()

    const manejarTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const lista = enfocables()
      if (lista.length === 0) {
        event.preventDefault()
        contenedor.focus()
        return
      }
      const primero = lista[0]
      const ultimo = lista[lista.length - 1]
      const activo = document.activeElement
      if (event.shiftKey && (activo === primero || !contenedor.contains(activo))) {
        event.preventDefault()
        ultimo.focus()
      } else if (!event.shiftKey && (activo === ultimo || !contenedor.contains(activo))) {
        event.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', manejarTab)
    return () => {
      document.removeEventListener('keydown', manejarTab)
      previo?.focus?.()
    }
  }, [abierto, ref])
}
