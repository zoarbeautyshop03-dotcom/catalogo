import Link from 'next/link'
import Logo from './Logo'
import RedesSociales from './RedesSociales'
import { getDatosNegocio } from '@/lib/negocio'
import { getConfiguracion } from '@/lib/queries'

export default async function Footer() {
  const datos = await getDatosNegocio()
  // getConfiguracion va envuelto en cache() y getDatosNegocio ya lo lee, así que
  // esta llamada se resuelve con la misma caché de la petición (sin viaje extra).
  const config = await getConfiguracion()
  const direccion = [datos.direccion, datos.ciudad].filter(Boolean).join(', ')
  const hayRedes = !!(config?.instagram || config?.facebook || config?.tiktok)

  return (
    <footer className="relative overflow-hidden border-t border-lavender-magenta-200/70 bg-gradient-to-b from-white via-blush-pink-50/70 to-lavender-magenta-50 text-gray-700">
      {/* Halos decorativos suaves */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-lavender-magenta-200/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-dorado-100/50 blur-3xl"
      />
      <div aria-hidden="true" className="hairline-gold absolute inset-x-0 top-0" />

      <div className="section-shell relative grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.15fr] lg:gap-10">
        {/* Bloque de marca con firma */}
        <div className="max-w-sm">
          <Link href="/" className="group inline-block rounded-2xl">
            <Logo size="md" />
          </Link>
          <p className="mt-5 text-sm leading-7 text-gray-600">
            Un espacio para descubrir productos de belleza y cuidado que encajen contigo y con tu rutina.
          </p>
          <div aria-hidden="true" className="hairline-gold mt-6 max-w-[11rem]" />
          <p className="mt-6 font-script text-3xl leading-none text-lavender-magenta-700">Belleza que se siente</p>

          {hayRedes && (
            <div className="mt-7">
              <p className="eyebrow">Síguenos</p>
              <div className="mt-3">
                <RedesSociales config={config} variant="footer" />
              </div>
            </div>
          )}
        </div>

        <nav aria-label="Explora">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lavender-magenta-950">Explora</h2>
          <div className="mt-5 space-y-3 text-sm text-gray-600">
            <Link
              href="/"
              className="block w-fit transition-all duration-200 ease-boutique hover:translate-x-0.5 hover:text-lavender-magenta-700"
            >
              Inicio
            </Link>
            <Link
              href="/catalogo"
              className="block w-fit transition-all duration-200 ease-boutique hover:translate-x-0.5 hover:text-lavender-magenta-700"
            >
              Catálogo
            </Link>
            <Link
              href="/catalogo?oferta=1"
              className="block w-fit transition-all duration-200 ease-boutique hover:translate-x-0.5 hover:text-lavender-magenta-700"
            >
              Ofertas
            </Link>
            <Link
              href="/catalogo?nuevo=1"
              className="block w-fit transition-all duration-200 ease-boutique hover:translate-x-0.5 hover:text-lavender-magenta-700"
            >
              Novedades
            </Link>
          </div>
        </nav>

        <nav aria-label="Información legal">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lavender-magenta-950">
            Información legal
          </h2>
          <div className="mt-5 space-y-3 text-sm text-gray-600">
            <Link
              href="/terminos"
              className="block w-fit transition-all duration-200 ease-boutique hover:translate-x-0.5 hover:text-lavender-magenta-700"
            >
              Términos y condiciones
            </Link>
            <Link
              href="/privacidad"
              className="block w-fit transition-all duration-200 ease-boutique hover:translate-x-0.5 hover:text-lavender-magenta-700"
            >
              Política de privacidad
            </Link>
            <Link
              href="/cookies"
              className="block w-fit transition-all duration-200 ease-boutique hover:translate-x-0.5 hover:text-lavender-magenta-700"
            >
              Política de cookies
            </Link>
            <Link
              href="/devoluciones"
              className="block w-fit transition-all duration-200 ease-boutique hover:translate-x-0.5 hover:text-lavender-magenta-700"
            >
              Retracto, garantía y devoluciones
            </Link>
          </div>
        </nav>

        <div>
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-lavender-magenta-950">
            Datos del vendedor
          </h2>
          <ul className="mt-5 space-y-2 text-sm leading-6 text-gray-600">
            {datos.razonSocial && <li>{datos.razonSocial}</li>}
            {datos.nit && <li>NIT {datos.nit}</li>}
            {direccion && <li>{direccion}</li>}
            {datos.email && (
              <li>
                <a
                  href={`mailto:${datos.email}`}
                  className="transition-colors duration-200 ease-boutique hover:text-lavender-magenta-700"
                >
                  {datos.email}
                </a>
              </li>
            )}
            {datos.telefono && <li>Tel. {datos.telefono}</li>}
            {datos.horarios && <li>{datos.horarios}</li>}
          </ul>
        </div>
      </div>

      {/* Zona de pagos y entrega */}
      {(datos.mediosPago || datos.infoEntrega) && (
        <div className="section-shell relative">
          <div aria-hidden="true" className="hairline-gold" />
          <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            {datos.mediosPago && (
              <p className="text-xs leading-5 text-gray-600">
                <span className="font-semibold uppercase tracking-[0.18em] text-dorado-oscuro">Medios de pago: </span>
                {datos.mediosPago}
              </p>
            )}
            {datos.infoEntrega && (
              <p className="max-w-xl text-xs leading-5 text-gray-600 sm:text-right">{datos.infoEntrega}</p>
            )}
          </div>
        </div>
      )}

      {/* Línea final de copyright */}
      <div className="relative border-t border-lavender-magenta-200/50 bg-white/50">
        <div className="section-shell flex flex-col items-center gap-2 py-5 text-xs text-gray-600 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Zoar Beauty Shop. Todos los derechos reservados.</p>
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="h-px w-6 bg-dorado/60" />
            By Daniela Perez
          </p>
        </div>
      </div>
    </footer>
  )
}
