import { getConfiguracion } from './queries'

// Datos del vendedor que la ley exige mostrar en la tienda (Ley 1480 de 2011,
// art. 50, literal a): nombre o razón social, NIT, dirección de notificación
// judicial, teléfono y correo electrónico.
//
// Se leen de variables de entorno (ver .env.local.example) para NO inventar
// datos: si una falta, simplemente no se muestra y aparece en la lista de
// "faltantes" (visible en desarrollo y con `npm run verificar-legal`).
// Si el titular es persona natural, "razón social" es su nombre completo y
// "NIT" su NIT o cédula, según esté registrado en el RUT.

export type DatosNegocio = {
  nombreComercial: string
  razonSocial?: string
  nit?: string
  direccion?: string
  ciudad?: string
  email?: string
  telefono?: string
  whatsapp?: string
  horarios?: string
  infoEntrega?: string
  mediosPago?: string
  faltantes: string[]
}

function limpio(valor: string | null | undefined): string | undefined {
  const v = (valor ?? '').trim()
  return v ? v : undefined
}

export async function getDatosNegocio(): Promise<DatosNegocio> {
  const config = await getConfiguracion().catch(() => null)

  const razonSocial = limpio(process.env.NEGOCIO_RAZON_SOCIAL)
  const nit = limpio(process.env.NEGOCIO_NIT)
  const direccion = limpio(process.env.NEGOCIO_DIRECCION)
  const email = limpio(process.env.NEGOCIO_EMAIL)
  const telefono = limpio(process.env.NEGOCIO_TELEFONO)

  const faltantes: string[] = []
  if (!razonSocial) faltantes.push('NEGOCIO_RAZON_SOCIAL (nombre o razón social)')
  if (!nit) faltantes.push('NEGOCIO_NIT (NIT o cédula del titular)')
  if (!direccion) faltantes.push('NEGOCIO_DIRECCION (dirección de notificación)')
  if (!email) faltantes.push('NEGOCIO_EMAIL (correo electrónico de contacto)')
  if (!telefono) faltantes.push('NEGOCIO_TELEFONO (teléfono de contacto)')

  return {
    nombreComercial: limpio(config?.nombre_tienda) ?? 'Zoar Beauty Shop',
    razonSocial,
    nit,
    direccion,
    ciudad: limpio(process.env.NEGOCIO_CIUDAD),
    email,
    telefono,
    whatsapp: limpio(config?.whatsapp_numero) ?? limpio(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
    horarios: limpio(config?.horarios),
    infoEntrega: limpio(config?.info_entrega),
    mediosPago: limpio(process.env.NEGOCIO_MEDIOS_PAGO),
    faltantes,
  }
}
