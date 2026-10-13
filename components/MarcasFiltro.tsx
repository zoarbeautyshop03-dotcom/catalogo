'use client'

import { useMemo, useState } from 'react'
import { construirUrl, type SearchParams } from '@/lib/catalogo-url'

type MarcaChip = { id: string; slug: string; nombre: string }

// Cuántas marcas se ven antes de "Ver más marcas". Se mantiene corto para que
// el panel no se vea saturado; el buscador permite encontrar cualquier marca.
const LIMITE_VISIBLE = 8

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-lavender-magenta-400" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" strokeLinecap="round" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

function MinusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  )
}

function FilaMarca({
  href,
  activa,
  inicial,
  nombre,
}: {
  href: string
  activa: boolean
  inicial: string
  nombre: string
}) {
  return (
    <a
      href={href}
      aria-current={activa ? 'true' : undefined}
      title={nombre}
      className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition duration-200 ease-boutique ${
        activa
          ? 'bg-brand-gradient text-white shadow-card'
          : 'text-gray-700 hover:bg-lavender-magenta-50 hover:text-lavender-magenta-800'
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold uppercase ${
          activa
            ? 'bg-white/20 text-white'
            : 'bg-lavender-magenta-50 text-lavender-magenta-700 ring-1 ring-lavender-magenta-100'
        }`}
      >
        {inicial}
      </span>
      <span className="truncate">{nombre}</span>
    </a>
  )
}

export default function MarcasFiltro({
  marcas,
  searchParams,
}: {
  marcas: MarcaChip[]
  searchParams: SearchParams
}) {
  const [expandido, setExpandido] = useState(false)
  const [query, setQuery] = useState('')
  const marcaActiva = searchParams.marca

  const buscando = query.trim().length > 0

  const filtradas = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return marcas
    return marcas.filter((m) => m.nombre.toLowerCase().includes(q))
  }, [marcas, query])

  // Al buscar se muestran todas las coincidencias; sin búsqueda, solo las
  // primeras LIMITE_VISIBLE hasta pulsar "Ver más marcas".
  const visibles = buscando || expandido ? filtradas : filtradas.slice(0, LIMITE_VISIBLE)
  const ocultas = filtradas.length - visibles.length

  return (
    <div className="mt-4">
      {marcas.length > LIMITE_VISIBLE && (
        <label className="campo-pill mb-3 flex items-center gap-2.5 rounded-full bg-white px-3.5 py-2.5 text-sm ring-1 ring-lavender-magenta-100 transition-colors duration-200 ease-boutique focus-within:ring-lavender-magenta-300">
          <SearchIcon />
          <span className="sr-only">Buscar marca</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar marca..."
            className="min-w-0 flex-1 border-0 bg-transparent text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none"
          />
        </label>
      )}

      <div className="space-y-1">
        <FilaMarca
          href={construirUrl(searchParams, { marca: undefined })}
          activa={!marcaActiva}
          inicial="A"
          nombre="Todas las marcas"
        />

        {visibles.map((m) => (
          <FilaMarca
            key={m.id}
            href={construirUrl(searchParams, { marca: m.slug })}
            activa={marcaActiva === m.slug}
            inicial={m.nombre.charAt(0).toUpperCase()}
            nombre={m.nombre}
          />
        ))}
      </div>

      {buscando && filtradas.length === 0 && (
        <p className="mt-3 text-xs text-gray-500">No hay marcas que coincidan con “{query.trim()}”.</p>
      )}

      {!buscando && filtradas.length > LIMITE_VISIBLE && (
        <button
          type="button"
          onClick={() => setExpandido((v) => !v)}
          aria-expanded={expandido}
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-lavender-magenta-50 px-3.5 py-2 text-xs font-bold text-lavender-magenta-700 ring-1 ring-lavender-magenta-100 transition duration-200 ease-boutique hover:-translate-y-0.5 hover:bg-lavender-magenta-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-magenta-400"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-lavender-magenta-700">
            {expandido ? <MinusIcon /> : <PlusIcon />}
          </span>
          {expandido ? 'Ver menos marcas' : 'Ver más marcas'}
          {!expandido && <span className="font-extrabold">{ocultas}</span>}
        </button>
      )}
    </div>
  )
}
