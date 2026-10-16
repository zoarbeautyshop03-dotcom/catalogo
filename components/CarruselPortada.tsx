'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

// Carrusel de la portada: muestra las imágenes elegidas en el panel, con un
// desenfoque suave, turnándose con un fundido cada 5 segundos. Es decorativo
// (va oculto a los lectores de pantalla) y se queda quieto si el sistema pide
// menos animación.
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

  return (
    <div className="zoar-hero-portada relative aspect-[4/5] w-[min(100%,360px)] overflow-hidden rounded-boutique">
      {imagenes.map((url, indice) => (
        <Image
          key={indice}
          src={url}
          alt=""
          aria-hidden="true"
          fill
          sizes="360px"
          className={`scale-105 object-cover blur-[3px] transition-opacity duration-1000 ease-boutique ${
            indice === activo ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div aria-hidden="true" className="zoar-hero-portada-velo absolute inset-0" />
    </div>
  )
}
