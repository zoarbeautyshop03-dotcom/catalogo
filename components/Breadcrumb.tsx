import Link from 'next/link'

export type MigaDePan = { etiqueta: string; href?: string }

// Ruta de navegación (Inicio › Catálogo › Categoría › Producto): ayuda a
// ubicarse y a volver un paso atrás sin usar el botón del navegador.
export default function Breadcrumb({ items }: { items: MigaDePan[] }) {
  return (
    <nav aria-label="Ruta de navegación" className="mb-5">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600">
        {items.map((item, i) => {
          const ultimo = i === items.length - 1
          return (
            <li key={`${item.etiqueta}-${i}`} className="flex min-w-0 items-center gap-2">
              {item.href && !ultimo ? (
                <Link href={item.href} className="font-medium hover:text-lavender-magenta-700 hover:underline">
                  {item.etiqueta}
                </Link>
              ) : (
                <span aria-current={ultimo ? 'page' : undefined} className={`truncate ${ultimo ? 'max-w-[18rem] font-semibold text-lavender-magenta-950' : ''}`}>
                  {item.etiqueta}
                </span>
              )}
              {!ultimo && <span aria-hidden="true" className="text-gray-400">›</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
