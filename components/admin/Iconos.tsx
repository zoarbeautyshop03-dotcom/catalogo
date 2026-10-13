import type { ReactNode } from 'react'

// Iconos de línea (mismo estilo que Lucide) dibujados aquí mismo para no
// depender de una librería externa.
const TRAZOS: Record<string, ReactNode> = {
  inicio: <><path d="M3 11.5 12 4l9 7.5" /><path d="M5.5 10v9.5h13V10" /><path d="M10 19.5v-5h4v5" /></>,
  productos: <><path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" /><path d="m4 7.5 8 4.5 8-4.5M12 12v9" /></>,
  inventario: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  alertas: <><path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
  alerta: <><path d="M12 4 3 19.5h18L12 4Z" /><path d="M12 10v4.5M12 17.2v.1" /></>,
  reportes: <path d="M5 20v-6M12 20V5M19 20v-9" />,
  categorias: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 12.5 9 5 9-5" /><path d="m3 17 9 5 9-5" /></>,
  marcas: <><path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7a1 1 0 0 1 .7.3l8 8a1 1 0 0 1 0 1.4l-7.7 7.7a1 1 0 0 1-1.4 0l-8-8a1 1 0 0 1-.3-.7Z" /><circle cx="8" cy="8" r="1.3" /></>,
  configuracion: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></>,
  tienda: <><path d="M4 9.5 5.5 4h13L20 9.5" /><path d="M4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" /><path d="M5 12.5V20h14v-7.5" /><path d="M10 20v-4.5h4V20" /></>,
  luna: <path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" />,
  sol: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  chevrons: <path d="m6 17 5-5-5-5M13 17l5-5-5-5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  cerrar: <path d="m7 7 10 10M17 7 7 17" />,
  salir: <><path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" /><path d="m16 8 4 4-4 4M20 12H9" /></>,
  mas: <path d="M12 5v14M5 12h14" />,
  menos: <path d="M5 12h14" />,
  flecha: <path d="M5 12h14M13 6l6 6-6 6" />,
  flechaIzq: <path d="M19 12H5M11 6l-6 6 6 6" />,
  chevronIzq: <path d="m15 18-6-6 6-6" />,
  chevronDer: <path d="m9 18 6-6-6-6" />,
  buscar: <><circle cx="11" cy="11" r="7" /><path d="m20.5 20.5-3.6-3.6" /></>,
  check: <path d="m5 13 4 4L19 7" />,
  descargar: <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>,
  importar: <><path d="M12 15V3" /><path d="m7 8 5-5 5 5" /><path d="M5 21h14" /></>,
  intercambio: <><path d="M8 4v13M8 17l-3-3M8 17l3-3" /><path d="M16 20V7M16 7l3 3M16 7l-3 3" /></>,
  hoja: <><path d="M6 3h9l4 4v14H6Z" /><path d="M15 3v4h4" /><path d="M9 13h6M9 17h6" /></>,
  etiqueta: <><path d="M4 7V4h3l11 11-3 3Z" /><circle cx="7" cy="7" r="0.8" /></>,
  estrella: <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.7l5.4-.8Z" />,
  papelera: <><path d="M4 7h16" /><path d="M9 7V4.5h6V7" /><path d="M6 7v13h12V7" /><path d="M10 11v5M14 11v5" /></>,
  agotado: <><circle cx="12" cy="12" r="8" /><path d="m6.4 6.4 11.2 11.2" /></>,
}

export type NombreIcono = keyof typeof TRAZOS

export function Icono({ nombre, className = 'h-5 w-5' }: { nombre: NombreIcono; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {TRAZOS[nombre]}
    </svg>
  )
}
