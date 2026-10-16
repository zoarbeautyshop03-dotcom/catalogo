// Muñequito (silueta de persona) para el acceso al panel de administración.
// Va en SVG de trazo, igual que el resto de iconos del sitio, para que combine
// con ellos y no desentone con la línea gráfica.
export function IconoUsuario({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8.2" r="3.7" />
      <path d="M4.9 20.2c.7-3.7 3.6-5.7 7.1-5.7s6.4 2 7.1 5.7" />
    </svg>
  )
}
