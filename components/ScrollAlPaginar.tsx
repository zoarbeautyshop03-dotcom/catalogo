'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

export default function ScrollAlPaginar({ targetId }: { targetId: string }) {
  const searchParams = useSearchParams()
  const page = searchParams.get('page')
  const esPrimerRender = useRef(true)

  useEffect(() => {
    // No hacemos scroll en la primera carga de la página, solo cuando el
    // número de página cambia después (al tocar "Siguiente"/"Anterior").
    if (esPrimerRender.current) {
      esPrimerRender.current = false
      return
    }
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [page, targetId])

  return null
}
