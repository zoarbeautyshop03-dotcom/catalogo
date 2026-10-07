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

      <article className="premium-card mt-4 max-w-3xl p-6 sm:p-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-lavender-magenta-950 sm:text-4xl">{titulo}</h1>
        <p className="mt-2 text-xs font-medium text-gray-600">Última actualización: {actualizado}</p>

        {mostrarAviso && (
          <div role="note" className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900 ring-1 ring-amber-200">
            <p className="font-bold">Aviso solo visible en desarrollo: faltan datos del negocio.</p>
            <p className="mt-1">Completa estas variables de entorno antes de publicar (ver PENDIENTES-LEGALES.md):</p>
            <ul className="mt-2 list-disc pl-5">
              {datos.faltantes.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="legal-texto mt-6">{children}</div>
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
    <dl className="mt-3 grid gap-x-6 gap-y-2 rounded-2xl bg-lavender-magenta-50 p-4 text-sm sm:grid-cols-[auto_1fr]">
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
