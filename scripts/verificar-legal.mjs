// Revisa que estén completos los datos legales del negocio antes de publicar.
// Uso: npm run verificar-legal   (lee .env.local y las variables del entorno)
import { readFileSync, existsSync } from 'node:fs'

const requeridas = [
  ['NEGOCIO_RAZON_SOCIAL', 'Nombre o razón social del titular'],
  ['NEGOCIO_NIT', 'NIT o cédula del titular'],
  ['NEGOCIO_DIRECCION', 'Dirección de notificación'],
  ['NEGOCIO_EMAIL', 'Correo electrónico de contacto'],
  ['NEGOCIO_TELEFONO', 'Teléfono de contacto'],
  ['NEXT_PUBLIC_WHATSAPP_NUMBER', 'Número de WhatsApp (con indicativo, sin +)'],
  ['NEXT_PUBLIC_SITE_URL', 'URL pública del sitio (https://...)'],
]

const valores = { ...process.env }
if (existsSync('.env.local')) {
  for (const linea of readFileSync('.env.local', 'utf8').split(/\r?\n/)) {
    const m = linea.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) valores[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const faltan = requeridas.filter(([clave]) => !String(valores[clave] ?? '').trim())
const url = String(valores.NEXT_PUBLIC_SITE_URL ?? '')

if (url && !url.startsWith('https://')) {
  console.warn(`⚠ NEXT_PUBLIC_SITE_URL (${url}) no usa https://. En producción el sitio debe servirse por HTTPS.`)
}

if (faltan.length === 0) {
  console.log('✔ Datos legales completos. Revisa también PENDIENTES-LEGALES.md.')
} else {
  console.error('✘ Faltan datos antes de publicar:')
  for (const [clave, descripcion] of faltan) console.error(`  - ${clave}: ${descripcion}`)
  process.exitCode = 1
}
