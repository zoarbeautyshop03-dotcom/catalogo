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

function IconoFotoPendiente() {
  return (
    <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <circle cx="8.5" cy="9.5" r="1.6" />
      <path d="m4 17 4.8-4.3a1.6 1.6 0 0 1 2.1 0L15 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13.6 14.2 1.9-1.7a1.6 1.6 0 0 1 2.1 0L20 14.8" strokeLinecap="round" strokeLinejoin="round" />
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
      <div className="catalog-product-media relative aspect-square overflow-hidden rounded-boutique-lg border border-lavender-magenta-100 shadow-card">
        <div className="flex h-full flex-col items-center justify-center gap-3 text-lavender-magenta-400">
          <IconoFotoPendiente />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Foto pendiente</span>
        </div>
      </div>
    )
  }

  const foto = fotos[actual]

  return (
    <div role="group" aria-roledescription="galería" aria-label={`Fotos de ${nombre}`}>
      <div
        className="catalog-product-media group relative aspect-square overflow-hidden rounded-boutique-lg border border-lavender-magenta-100 shadow-card"
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
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 text-lavender-magenta-800 shadow-card backdrop-blur-sm transition duration-200 ease-boutique hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <Flecha lado="izq" />
            </button>
            <button
              type="button"
              onClick={() => ir(actual + 1)}
              aria-label="Foto siguiente"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/85 text-lavender-magenta-800 shadow-card backdrop-blur-sm transition duration-200 ease-boutique hover:bg-white sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100"
            >
              <Flecha lado="der" />
            </button>
            <span
              aria-live="polite"
              className="absolute bottom-3 right-3 rounded-full bg-lavender-magenta-950/80 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
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
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-white transition duration-200 ease-boutique ${
                i === actual
                  ? 'ring-2 ring-lavender-magenta-600 ring-offset-2 ring-offset-white'
                  : 'opacity-75 ring-1 ring-lavender-magenta-100 hover:opacity-100'
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
