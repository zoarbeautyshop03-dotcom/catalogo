import Link from 'next/link'
import { getDatosNegocio } from '@/lib/negocio'

export default async function Footer() {
  const datos = await getDatosNegocio()
  const direccion = [datos.direccion, datos.ciudad].filter(Boolean).join(', ')

  return (
    <footer className="mt-20 border-t border-lavender-magenta-100 bg-white">
      <div className="section-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-2xl font-bold text-lavender-magenta-800">ZOAR BEAUTY</p>
          <p className="mt-1 font-script text-2xl text-lavender-magenta-700">Shop</p>
          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">
            Un espacio para descubrir productos de belleza y cuidado que encajen contigo y con tu rutina.
          </p>
        </div>

        <nav aria-label="Explora">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-magenta-700">Explora</p>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <Link href="/" className="block hover:text-lavender-magenta-700">Inicio</Link>
            <Link href="/catalogo" className="block hover:text-lavender-magenta-700">Catálogo</Link>
            <Link href="/catalogo?oferta=1" className="block hover:text-lavender-magenta-700">Ofertas</Link>
            <Link href="/catalogo?nuevo=1" className="block hover:text-lavender-magenta-700">Novedades</Link>
          </div>
        </nav>

        <nav aria-label="Información legal">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-magenta-700">Información legal</p>
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <Link href="/terminos" className="block hover:text-lavender-magenta-700">Términos y condiciones</Link>
            <Link href="/privacidad" className="block hover:text-lavender-magenta-700">Política de privacidad</Link>
            <Link href="/cookies" className="block hover:text-lavender-magenta-700">Política de cookies</Link>
            <Link href="/devoluciones" className="block hover:text-lavender-magenta-700">Retracto, garantía y devoluciones</Link>
          </div>
        </nav>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-magenta-700">Datos del vendedor</p>
          <ul className="mt-4 space-y-1.5 text-sm leading-6 text-gray-600">
            {datos.razonSocial && <li>{datos.razonSocial}</li>}
            {datos.nit && <li>NIT {datos.nit}</li>}
            {direccion && <li>{direccion}</li>}
            {datos.email && (
              <li>
                <a href={`mailto:${datos.email}`} className="hover:text-lavender-magenta-700">{datos.email}</a>
              </li>
            )}
            {datos.telefono && <li>Tel. {datos.telefono}</li>}
            {datos.horarios && <li>{datos.horarios}</li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-lavender-magenta-100">
        <div className="section-shell flex flex-col gap-2 py-5 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Zoar Beauty Shop. Todos los derechos reservados.</p>
          <p>By Daniela Perez</p>
        </div>
      </div>
    </footer>
  )
}
