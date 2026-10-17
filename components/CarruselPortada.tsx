'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

// Carrusel de la portada: muestra las imágenes elegidas en el panel, turnándose
// con un fundido cada 5 segundos.
//
// La foto va nítida y grande, enmarcada. El desenfoque quedó alrededor, a modo
// de bordado: detrás del marco hay una copia de la misma foto, borrosa y un poco
// más grande, que asoma por los bordes como un halo de color.
//
// Es decorativo (va oculto a los lectores de pantalla) y se queda quieto si el
// sistema pide menos animación.
export function CarruselPortada({
  imagenes,
  intervaloMs = 5000,
}: {
  imagenes: string[]
  intervaloMs?: number
}) {
  const [activo, setActivo] = useState(0)

  useEffect(() => {
    if (imagenes.length <= 1) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => {
      setActivo((indice) => (indice + 1) % imagenes.length)
    }, intervaloMs)
    return () => window.clearInterval(id)
  }, [imagenes.length, intervaloMs])

  // El fundido del carrusel. El halo usa opacidades más bajas para que se lea
  // como un borde y no como una segunda foto.
  const fundido = (indice: number, visible: string) =>
    `transition-opacity duration-1000 ease-boutique ${indice === activo ? visible : 'opacity-0'}`

  return (
    <div className="relative aspect-[4/5] w-[min(100%,440px)]">
      {/* Halo: copia borrosa y agrandada de la misma foto, asomando por los bordes. */}
      <div aria-hidden="true" className="absolute inset-0">
        {imagenes.map((url, indice) => (
          <Image
            key={indice}
            src={url}
            alt=""
            fill
            sizes="440px"
            className={`zoar-hero-portada-halo rounded-[2.2rem] object-cover ${fundido(indice, 'opacity-80')}`}
          />
        ))}
      </div>

      {/* Foto nítida, con margen para que el halo se vea alrededor. */}
      <div className="zoar-hero-portada-marco absolute inset-[13px] overflow-hidden rounded-[1.35rem]">
        {imagenes.map((url, indice) => (
          <Image
            key={indice}
            src={url}
            alt=""
            aria-hidden="true"
            fill
            sizes="420px"
            className={`object-cover ${fundido(indice, 'opacity-100')}`}
          />
        ))}
        <div aria-hidden="true" className="zoar-hero-portada-velo absolute inset-0" />
      </div>
    </div>
  )
}
