'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ItemCarrito = {
  id: string
  nombre: string
  slug: string
  precio: number
  imagenUrl?: string
  cantidad: number
}

type CarritoContexto = {
  items: ItemCarrito[]
  agregar: (item: Omit<ItemCarrito, 'cantidad'>, cantidad?: number) => void
  quitar: (id: string) => void
  cambiarCantidad: (id: string, cantidad: number) => void
  vaciar: () => void
  totalItems: number
  totalPrecio: number
}

const CarritoContext = createContext<CarritoContexto | null>(null)

const CLAVE_STORAGE = 'zoar-carrito'

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([])
  const [cargado, setCargado] = useState(false)

  // Cargar del localStorage solo en el navegador (evita desajuste con el
  // render del servidor, que no tiene acceso a localStorage).
  useEffect(() => {
    try {
      const guardado = window.localStorage.getItem(CLAVE_STORAGE)
      if (guardado) setItems(JSON.parse(guardado))
    } catch {
      // si el JSON guardado esta corrupto, simplemente arrancamos vacio
    }
    setCargado(true)
  }, [])

  useEffect(() => {
    if (!cargado) return
    try {
      window.localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items))
    } catch {
      // localStorage puede fallar en modo incognito con espacio lleno; no es critico
    }
  }, [items, cargado])

  const agregar = useCallback((item: Omit<ItemCarrito, 'cantidad'>, cantidad = 1) => {
    setItems((prev) => {
      const existente = prev.find((i) => i.id === item.id)
      if (existente) {
        return prev.map((i) => (i.id === item.id ? { ...i, cantidad: i.cantidad + cantidad } : i))
      }
      return [...prev, { ...item, cantidad }]
    })
  }, [])

  const quitar = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const cambiarCantidad = useCallback((id: string, cantidad: number) => {
    setItems((prev) => {
      if (cantidad <= 0) return prev.filter((i) => i.id !== id)
      return prev.map((i) => (i.id === id ? { ...i, cantidad } : i))
    })
  }, [])

  const vaciar = useCallback(() => setItems([]), [])

  const totalItems = useMemo(() => items.reduce((acc, i) => acc + i.cantidad, 0), [items])
  const totalPrecio = useMemo(() => items.reduce((acc, i) => acc + i.cantidad * i.precio, 0), [items])

  return (
    <CarritoContext.Provider value={{ items, agregar, quitar, cambiarCantidad, vaciar, totalItems, totalPrecio }}>
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  const ctx = useContext(CarritoContext)
  if (!ctx) throw new Error('useCarrito debe usarse dentro de <CarritoProvider>')
  return ctx
}
