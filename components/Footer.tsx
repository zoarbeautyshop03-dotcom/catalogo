import Link from 'next/link'
import { getDatosNegocio } from '@/lib/negocio'

export default async function Footer() {
  const datos = await getDatosNegocio()
  const direccion = [datos.direccion, datos.ciudad].filter(Boolean).join(', ')

  return (
    <footer className="mt-24 bg-lavender-magenta-950 text-lavender-magenta-200">
      <div className="section-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-2xl font-semibold tracking-wide text-white">ZOAR BEAUTY</p>
          <p className="mt-1 font-script text-2xl text-dorado-claro">Shop</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-lavender-magenta-200">
            Un espacio para descubrir productos de belleza y cuidado que encajen contigo y con tu rutina.
          </p>
        </div>

        <nav aria-label="Explora">
          <p className="text-sm font-semibold text-white">Explora</p>
          <div className="mt-4 space-y-3 text-sm text-lavender-magenta-200">
            <Link href="/" className="block hover:text-white">Inicio</Link>
            <Link href="/catalogo" className="block hover:text-white">Catálogo</Link>
            <Link href="/catalogo?oferta=1" className="block hover:text-white">Ofertas</Link>
            <Link href="/catalogo?nuevo=1" className="block hover:text-white">Novedades</Link>
          </div>
        </nav>

        <nav aria-label="Información legal">
          <p className="text-sm font-semibold text-white">Información legal</p>
          <div className="mt-4 space-y-3 text-sm text-lavender-magenta-200">
            <Link href="/terminos" className="block hover:text-white">Términos y condiciones</Link>
            <Link href="/privacidad" className="block hover:text-white">Política de privacidad</Link>
            <Link href="/cookies" className="block hover:text-white">Política de cookies</Link>
            <Link href="/devoluciones" className="block hover:text-white">Retracto, garantía y devoluciones</Link>
          </div>
        </nav>

        <div>
          <p className="text-sm font-semibold text-white">Datos del vendedor</p>
          <ul className="mt-4 space-y-1.5 text-sm leading-6 text-lavender-magenta-200">
            {datos.razonSocial && <li>{datos.razonSocial}</li>}
            {datos.nit && <li>NIT {datos.nit}</li>}
            {direccion && <li>{direccion}</li>}
            {datos.email && (
              <li>
                <a href={`mailto:${datos.email}`} className="hover:text-white">{datos.email}</a>
              </li>
            )}
            {datos.telefono && <li>Tel. {datos.telefono}</li>}
            {datos.horarios && <li>{datos.horarios}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-2 py-5 text-xs text-lavender-magenta-200 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Zoar Beauty Shop. Todos los derechos reservados.</p>
          <p>By Daniela Perez</p>
        </div>
      </div>
    </footer>
  )
}
