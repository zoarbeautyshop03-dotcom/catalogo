'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

type Foto = { id: string; url: string; texto_alt: string | null }

function Flecha({ lado }: { lado: 'izq' | 'der' }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d={lado === 'izq' ? 'M10 3 5 8l5 5' : 'm6 3 5 5-5 5'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Galería del producto: foto grande + miniaturas que se pueden tocar, flechas
// y deslizar con el dedo en el celular. Antes las miniaturas eran solo decorativas.
export default function ProductGallery({ fotos, nombre }: { fotos: Foto[]; nombre: string }) {
  const [actual, setActual] = useState(0)
  const inicioToque = useRef<number | null>(null)
  const miniaturas = useRef<(HTMLButtonElement | null)[]>([])
  const total = fotos.length

  const ir = (i: number) => setActual(((i % total) + total) % total)

  // Mantiene visible la miniatura activa dentro de la fila deslizable.
  useEffect(() => {
    miniaturas.current[actual]?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [actual])

  if (total === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-[32px] bg-white shadow-soft-card ring-1 ring-lavender-magenta-100">
        <div className="flex h-full flex-col items-center justify-center gap-2 text-lavender-magenta-700">
          <span className="text-6xl">✦</span>
          <span className="text-xs font-medium text-gray-500">Foto pendiente</span>
        </div>
      </div>
    )
  }

  const foto = fotos[actual]

  return (
    <div role="group" aria-roledescription="galería" aria-label={`Fotos de ${nombre}`}>
      <div
        className="group relative aspect-square overflow-hidden rounded-[32px] bg-white shadow-soft-card ring-1 ring-lavender-magenta-100"
        onTouchStart={(e) => {
          inicioToque.current = e.touches[0].clientX
        }}
        onTouchEnd={(e) => {
          if (inicioToque.current == null || total < 2) return
          const dx = e.changedTouches[0].clientX - inicioToque.current
          inicioToque.current = null
          if (Math.abs(dx) > 45) ir(actual + (dx < 0 ? 1 : -1))
        }}
      >
        <Image
          key={foto.id}
          src={foto.url}
          alt={foto.texto_alt ?? `${nombre} (foto ${actual + 1} de ${total})`}
          fill
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
          priority={actual === 0}
        />

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => ir(actual - 1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lavender-magenta-800 shadow-md ring-1 ring-lavender-magenta-100 transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <Flecha lado="izq" />
            </button>
            <button
              type="button"
              onClick={() => ir(actual + 1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lavender-magenta-800 shadow-md ring-1 ring-lavender-magenta-100 transition hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <Flecha lado="der" />
            </button>
            <span
              aria-live="polite"
              className="absolute bottom-3 right-3 rounded-full bg-lavender-magenta-950/80 px-3 py-1 text-xs font-semibold text-white"
            >
              {actual + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {fotos.map((f, i) => (
            <button
              key={f.id}
              type="button"
              ref={(el) => {
                miniaturas.current[i] = el
              }}
              onClick={() => ir(i)}
              aria-label={`Ver foto ${i + 1} de ${total}`}
              aria-current={i === actual ? 'true' : undefined}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white transition ${
                i === actual ? 'ring-2 ring-lavender-magenta-600' : 'opacity-75 ring-1 ring-lavender-magenta-100 hover:opacity-100'
              }`}
            >
              <Image src={f.url} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
