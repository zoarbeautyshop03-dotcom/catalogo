import type { ReactNode } from 'react'
import BotonVolver from './BotonVolver'
import type { DatosNegocio } from '@/lib/negocio'

// Marco común de las páginas legales (privacidad, términos, cookies y
// devoluciones): título, fecha de actualización y contenido legible.
export default function PaginaLegal({
  titulo,
  actualizado,
  datos,
  children,
}: {
  titulo: string
  actualizado: string
  datos: DatosNegocio
  children: ReactNode
}) {
  const mostrarAviso = process.env.NODE_ENV !== 'production' && datos.faltantes.length > 0

  return (
    <div className="section-shell pb-16 pt-5 sm:pt-8">
      <BotonVolver label="Volver" />

      <article className="premium-card relative mt-3 overflow-hidden rounded-boutique p-6 sm:p-10 lg:p-12">
        {/* Filete dorado superior: único acento del color secundario en la cabecera. */}
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gold-hairline" />

        <header className="max-w-2xl">
          <p className="eyebrow">Documento legal</p>
          <h1 className="section-title mt-3">{titulo}</h1>
          <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-gray-600">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 shrink-0 text-dorado-oscuro"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            <span>Última actualización: {actualizado}</span>
          </p>
        </header>

        <div aria-hidden="true" className="hairline-gold mt-8" />

        {mostrarAviso && (
          <div
            role="note"
            className="mt-6 flex gap-3 rounded-boutique bg-amber-50 p-4 text-sm leading-6 text-amber-900 ring-1 ring-amber-200"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
            <div>
              <p className="font-bold">Aviso solo visible en desarrollo: faltan datos del negocio.</p>
              <p className="mt-1">Completa estas variables de entorno antes de publicar (ver PENDIENTES-LEGALES.md):</p>
              <ul className="mt-2 list-disc pl-5">
                {datos.faltantes.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="legal-texto mt-8 max-w-[70ch]">{children}</div>
      </article>
    </div>
  )
}

// Datos del vendedor (se muestran solo los que existen).
export function BloqueVendedor({ datos }: { datos: DatosNegocio }) {
  const filas: [string, string | undefined][] = [
    ['Nombre comercial', datos.nombreComercial],
    ['Razón social / titular', datos.razonSocial],
    ['NIT', datos.nit],
    ['Dirección de notificación', [datos.direccion, datos.ciudad].filter(Boolean).join(', ') || undefined],
    ['Correo electrónico', datos.email],
    ['Teléfono', datos.telefono],
    ['WhatsApp', datos.whatsapp ? `+${datos.whatsapp.replace(/^\+/, '')}` : undefined],
    ['Horario de atención', datos.horarios],
  ]

  return (
    <dl className="mt-4 grid gap-x-6 gap-y-2.5 rounded-boutique bg-lavender-magenta-50/70 p-4 text-sm ring-1 ring-lavender-magenta-100 sm:grid-cols-[auto_1fr] sm:p-5">
      {filas
        .filter(([, valor]) => Boolean(valor))
        .map(([etiqueta, valor]) => (
          <div key={etiqueta} className="contents">
            <dt className="font-semibold text-lavender-magenta-950">{etiqueta}</dt>
            <dd className="break-words text-gray-700">{valor}</dd>
          </div>
        ))}
    </dl>
  )
}
