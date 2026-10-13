import Link from 'next/link'

export type MigaDePan = { etiqueta: string; href?: string }

// Ruta de navegación (Inicio › Catálogo › Categoría › Producto): ayuda a
// ubicarse y a volver un paso atrás sin usar el botón del navegador.
export default function Breadcrumb({ items }: { items: MigaDePan[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-5">
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs">
        {items.map((item, i) => {
          const ultimo = i === items.length - 1
          return (
            <li key={`${item.etiqueta}-${i}`} className="flex min-w-0 items-center gap-2.5">
              {item.href && !ultimo ? (
                <Link
                  href={item.href}
                  className="rounded-sm font-medium text-gray-600 underline-offset-2 transition-colors duration-200 ease-boutique hover:text-lavender-magenta-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender-magenta-400"
                >
                  {item.etiqueta}
                </Link>
              ) : (
                <span
                  aria-current={ultimo ? 'page' : undefined}
                  className={`truncate ${ultimo ? 'max-w-[18rem] font-semibold text-lavender-magenta-950' : ''}`}
                >
                  {item.etiqueta}
                </span>
              )}
              {!ultimo && (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3.5 w-3.5 shrink-0 text-gray-400"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
