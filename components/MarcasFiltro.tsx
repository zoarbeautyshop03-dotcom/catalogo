'use client'

import { useState } from 'react'
import { construirUrl, type SearchParams } from '@/lib/catalogo-url'

type MarcaChip = { id: string; slug: string; nombre: string }

const LIMITE_VISIBLE = 10

export default function MarcasFiltro({
  marcas,
  searchParams,
}: {
  marcas: MarcaChip[]
  searchParams: SearchParams
}) {
  const [expandido, setExpandido] = useState(false)
  const marcaActiva = searchParams.marca
  const visibles = expandido ? marcas : marcas.slice(0, LIMITE_VISIBLE)
  const ocultas = marcas.length - visibles.length

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <a
        href={construirUrl(searchParams, { marca: undefined })}
        className={`catalog-brand-chip ${!marcaActiva ? 'catalog-brand-chip-active' : ''}`}
      >
        <span className="catalog-brand-initial">A</span>
        <span className="truncate">Todas</span>
      </a>

      {visibles.map((m) => (
        <a
          key={m.id}
          href={construirUrl(searchParams, { marca: m.slug })}
          className={`catalog-brand-chip ${marcaActiva === m.slug ? 'catalog-brand-chip-active' : ''}`}
          title={`Filtrar por ${m.nombre}`}
        >
          <span className="catalog-brand-initial">{m.nombre.charAt(0).toUpperCase()}</span>
          <span className="truncate">{m.nombre}</span>
        </a>
      ))}

      {!expandido && ocultas > 0 && (
        <button
          type="button"
          onClick={() => setExpandido(true)}
          className="catalog-brand-chip border-dashed"
        >
          <span className="catalog-brand-initial bg-white text-lavender-magenta-700">+{ocultas}</span>
          <span>Ver más marcas</span>
        </button>
      )}

      {expandido && marcas.length > LIMITE_VISIBLE && (
        <button type="button" onClick={() => setExpandido(false)} className="catalog-brand-chip border-dashed">
          <span className="catalog-brand-initial bg-white text-lavender-magenta-700">−</span>
          <span>Ver menos</span>
        </button>
      )}
    </div>
  )
}
