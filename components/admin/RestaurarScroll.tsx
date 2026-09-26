'use client'

import { useEffect } from 'react'

const STORAGE_KEY = 'zoar-admin-product-scroll'

export default function RestaurarScroll() {
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    if (saved !== null) {
      const y = Number(saved)
      sessionStorage.removeItem(STORAGE_KEY)
      requestAnimationFrame(() => {
        window.scrollTo({ top: y, behavior: 'instant' as ScrollBehavior })
      })
    }

    const saveScroll = () => {
      sessionStorage.setItem(STORAGE_KEY, String(window.scrollY))
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const link = target?.closest('a[data-preserve-scroll="true"]') as HTMLAnchorElement | null
      if (link) saveScroll()
    }

    window.addEventListener('click', handleClick, true)
    return () => {
      window.removeEventListener('click', handleClick, true)
    }
  }, [])

  return null
}
