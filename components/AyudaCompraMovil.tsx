'use client'

import { useState } from 'react'
import Link from 'next/link'

const OPCIONES = [
  { id: 'cabello', label: 'Para mi cabello', icon: '♡', needs: ['Hidratación', 'Frizz', 'Reparación', 'Brillo', 'Cuidado diario'] },
  { id: 'piel', label: 'Para mi piel', icon: '✦', needs: ['Hidratación', 'Limpieza', 'Cuidado diario', 'Brillo', 'Protección'] },
  { id: 'maquillaje', label: 'Maquillaje', icon: '✧', needs: ['Rostro', 'Ojos', 'Labios', 'Accesorios', 'Uso diario'] },
  { id: 'ofertas', label: 'Quiero ver ofertas', icon: '♢', needs: [] },
]

// Se buscan raíces de palabra (sin tildes) porque la búsqueda del catálogo compara contra el nombre del producto:
// "hidrat" encuentra Hidratación, Hidratante, Hidratar…; "dolor" no, por eso no se usan palabras completas.
const TERMINOS: Record<string, string> = {
  'Hidratación': 'hidrat',
  Frizz: 'frizz',
  Reparación: 'repar',
  Brillo: 'brill',
  'Cuidado diario': 'cuidado',
  Limpieza: 'limpi',
  Protección: 'protec',
  Rostro: 'rostro',
  Ojos: 'ojos',
  Labios: 'labio',
  Accesorios: 'accesorio',
  'Uso diario': 'maquillaje',
}

export default function AyudaCompraMovil() {
  const [abierto, setAbierto] = useState(false)
  const [seleccion, setSeleccion] = useState<(typeof OPCIONES)[number] | null>(null)

  const cerrar = () => {
    setAbierto(false)
    setSeleccion(null)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        className="inline-flex items-center gap-2 rounded-full border border-lavender-magenta-200 bg-white/90 px-4 py-2.5 text-xs font-bold text-lavender-magenta-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-lavender-magenta-50"
      >
        <span className="text-sm">✦</span>
        ¿No sabes qué elegir? Te ayudamos
      </button>

      {abierto && (
        <div className="fixed inset-0 z-[55] md:hidden">
          <button aria-label="Cerrar ayuda" onClick={cerrar} className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />
          <section className="absolute inset-x-3 bottom-3 overflow-hidden rounded-[30px] bg-white shadow-2xl ring-1 ring-lavender-magenta-100">
            <div className="flex items-center justify-between border-b border-lavender-magenta-100 px-5 py-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-lavender-magenta-600">Compra fácil</p>
                <h2 className="mt-1 font-display text-xl font-bold text-lavender-magenta-950">
                  {seleccion ? '¿Qué necesitas?' : 'Te ayudamos a encontrarlo'}
                </h2>
              </div>
              <button type="button" onClick={cerrar} className="flex h-9 w-9 items-center justify-center rounded-full bg-lavender-magenta-50 text-lg text-lavender-magenta-800" aria-label="Cerrar">×</button>
            </div>

            <div className="max-h-[68vh] overflow-y-auto p-4">
              {!seleccion ? (
                <div className="grid gap-2.5">
                  {OPCIONES.map((opcion) => {
                    const contenido = (
                      <>
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-lg text-lavender-magenta-700 ring-1 ring-lavender-magenta-100">{opcion.icon}</span>
                        <span className="flex-1 text-sm font-bold text-lavender-magenta-950">{opcion.label}</span>
                        {opcion.needs.length > 0 ? <span className="text-gray-400">›</span> : <span className="rounded-full bg-lavender-magenta-600 px-3 py-2 text-[11px] font-bold text-white">Ver ofertas</span>}
                      </>
                    )
                    return opcion.needs.length > 0 ? (
                      <button key={opcion.id} type="button" onClick={() => setSeleccion(opcion)} className="flex items-center gap-3 rounded-2xl border border-lavender-magenta-100 bg-lavender-magenta-50/55 px-4 py-4 text-left transition active:scale-[0.99]">{contenido}</button>
                    ) : (
                      <Link key={opcion.id} href="/catalogo?oferta=1" onClick={cerrar} className="flex items-center gap-3 rounded-2xl border border-lavender-magenta-100 bg-lavender-magenta-50/55 px-4 py-4 text-left transition active:scale-[0.99]">{contenido}</Link>
                    )
                  })}
                </div>
              ) : (
                <div>
                  <button type="button" onClick={() => setSeleccion(null)} className="mb-3 text-xs font-bold text-lavender-magenta-700">← Cambiar</button>
                  <div className="grid grid-cols-2 gap-2.5">
                    {seleccion.needs.map((need) => (
                      <Link
                        key={need}
                        href={`/catalogo?q=${encodeURIComponent(TERMINOS[need] ?? need)}`}
                        onClick={cerrar}
                        className="rounded-2xl border border-lavender-magenta-100 bg-white px-4 py-4 text-center text-xs font-bold text-lavender-magenta-900 shadow-sm hover:bg-lavender-magenta-50"
                      >
                        {need}
                      </Link>
                    ))}
                  </div>
                  <p className="mt-4 text-center text-[11px] leading-5 text-gray-400">Te mostramos productos relacionados para que encuentres algo útil sin recorrer todo el catálogo.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  )
}
