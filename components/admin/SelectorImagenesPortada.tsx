'use client'

import { useState } from 'react'
import Image from 'next/image'
import { esUrlPermitida } from '@/lib/imagenes-url'

const MAXIMO = 5

type Sugerida = { url: string; alt: string }

// Selector de las imágenes que se turnan al lado del texto de la portada.
// Se puede pegar un link (Cloudinary o ImageKit, igual que las fotos de los
// productos) o elegir entre las que ya están subidas. Los valores viajan con el
// mismo formulario de Configuración, así que se guardan con el botón Guardar.
export function SelectorImagenesPortada({
  valorInicial,
  sugeridas,
  faltaColumna,
}: {
  valorInicial: string[]
  sugeridas: Sugerida[]
  faltaColumna: boolean
}) {
  const [imagenes, setImagenes] = useState<string[]>(valorInicial.slice(0, MAXIMO))
  const [nuevo, setNuevo] = useState('')
  const lleno = imagenes.length >= MAXIMO
  const nuevoLimpio = nuevo.trim()
  const nuevoPermitido = nuevoLimpio ? esUrlPermitida(nuevoLimpio) : false

  function agregar(url: string) {
    const limpia = url.trim()
    if (!limpia || imagenes.length >= MAXIMO || imagenes.includes(limpia)) return
    setImagenes([...imagenes, limpia])
  }

  function quitar(indice: number) {
    setImagenes(imagenes.filter((_, i) => i !== indice))
  }

  return (
    <div className="rounded-2xl border border-lavender-magenta-100 bg-lavender-magenta-50/40 p-4">
      <p className="text-sm font-semibold text-gray-700">Imágenes de la portada</p>
      <p className="mt-1 text-xs leading-5 text-gray-500">
        Se muestran al lado derecho del texto del inicio, con un desenfoque suave, y se van
        turnando cada 5 segundos. Puedes poner hasta {MAXIMO}. Si no pones ninguna, la portada
        queda solo con el texto.
      </p>

      {faltaColumna && (
        <p className="mt-3 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
          Falta un paso en Supabase: corre el archivo <strong>supabase/portada-imagen.sql</strong> en
          el SQL Editor para poder guardar estas imágenes. Mientras tanto el resto de la
          configuración se guarda normal, pero este campo no.
        </p>
      )}

      {/* Lo elegido viaja con el formulario de Configuración. */}
      {imagenes.map((url, indice) => (
        <input key={indice} type="hidden" name="hero_imagenes" value={url} />
      ))}

      <div className="mt-3 flex flex-wrap gap-3">
        {imagenes.map((url, indice) => (
          <div key={indice} className="relative">
            <div className="relative h-28 w-20 overflow-hidden rounded-xl border border-lavender-magenta-100 bg-white">
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
            </div>
            <span
              aria-hidden="true"
              className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-lavender-magenta-700 text-[10px] font-bold text-white"
            >
              {indice + 1}
            </span>
            <button
              type="button"
              onClick={() => quitar(indice)}
              aria-label={`Quitar la imagen ${indice + 1}`}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-gray-500 shadow ring-1 ring-lavender-magenta-200 transition hover:bg-red-50 hover:text-red-600"
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
        ))}
        {imagenes.length === 0 && (
          <div className="flex h-28 w-20 items-center justify-center rounded-xl border border-dashed border-lavender-magenta-200 bg-white/60 px-2 text-center text-[10px] leading-4 text-gray-400">
            Sin imágenes
          </div>
        )}
      </div>

      <div className="mt-4">
        <label className="block text-sm">
          <span className="font-medium text-gray-600">Agregar por link</span>
          <div className="mt-1.5 flex gap-2">
            <input
              value={nuevo}
              onChange={(evento) => setNuevo(evento.target.value)}
              onKeyDown={(evento) => {
                if (evento.key !== 'Enter') return
                evento.preventDefault()
                agregar(nuevo)
                setNuevo('')
              }}
              disabled={lleno}
              placeholder={lleno ? 'Ya tienes las 5' : 'https://res.cloudinary.com/...'}
              className="w-full rounded-2xl border border-rosa-pastel bg-white px-3 py-2 text-sm text-gray-700 transition-colors duration-200 ease-boutique focus:border-lavender-magenta-400 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
            />
            <button
              type="button"
              onClick={() => {
                agregar(nuevo)
                setNuevo('')
              }}
              disabled={lleno || !nuevoPermitido}
              className="shrink-0 rounded-full bg-lavender-magenta-700 px-4 py-2 text-xs font-bold text-white transition hover:bg-lavender-magenta-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Agregar
            </button>
          </div>
        </label>

        {nuevoLimpio && !nuevoPermitido && (
          <p className="mt-2 rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">
            Ese link no se va a ver en la tienda: solo se aceptan imágenes de Cloudinary o ImageKit.
          </p>
        )}
        {lleno && (
          <p className="mt-2 text-xs text-gray-500">
            Ya tienes las {MAXIMO} imágenes. Quita una para poner otra.
          </p>
        )}
      </div>

      {sugeridas.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-600">O elige de las fotos que ya subiste:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sugeridas.map((sugerida) => {
              const puesta = imagenes.includes(sugerida.url)
              return (
                <button
                  key={sugerida.url}
                  type="button"
                  onClick={() => agregar(sugerida.url)}
                  disabled={lleno && !puesta}
                  title={sugerida.alt || 'Usar esta imagen'}
                  aria-label={sugerida.alt || 'Usar esta imagen'}
                  aria-pressed={puesta}
                  className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 bg-white transition disabled:cursor-not-allowed disabled:opacity-40 ${
                    puesta
                      ? 'border-lavender-magenta-600'
                      : 'border-transparent hover:border-lavender-magenta-300'
                  }`}
                >
                  <Image src={sugerida.url} alt="" fill sizes="64px" className="object-cover" />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
