type LogoSize = 'sm' | 'md' | 'lg'

const SIZES: Record<LogoSize, { icon: string; word: string; by: string; gap: string }> = {
  sm: {
    icon: 'h-7 w-7',
    word: 'text-lg sm:text-xl',
    by: 'text-[7px]',
    gap: 'gap-1.5',
  },
  md: {
    icon: 'h-9 w-9 sm:h-10 sm:w-10',
    word: 'text-2xl sm:text-[30px]',
    by: 'text-[9px]',
    gap: 'gap-2',
  },
  lg: {
    icon: 'h-14 w-14 sm:h-20 sm:w-20',
    word: 'text-4xl sm:text-6xl',
    by: 'text-[11px] sm:text-xs',
    gap: 'gap-3',
  },
}

// Silueta de mariposa extraída del banner original de Zoar, redibujada como
// SVG (vectorial, nunca se ve pixelada al agrandarla).
function ButterflyMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="zoarButterflyGradient" x1="4" y1="6" x2="58" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ff94f4" />
          <stop offset="100%" stopColor="#b4179a" />
        </linearGradient>
      </defs>
      <path d="M31 30C26 17 14 6 7 8.3c-5.3 1.7-6.6 8-3 13.4C8.4 29.4 19.6 32 31 30Z" fill="url(#zoarButterflyGradient)" />
      <path d="M33 30c5-13 17-24 24-21.7 5.3 1.7 6.6 8 3 13.4C55.6 29.4 44.4 32 33 30Z" fill="url(#zoarButterflyGradient)" />
      <path d="M31 33c-1.6 10-9.6 19-16.8 17.7-4.2-0.8-6.1-5-4.3-9.6 2.8-7 11-10.4 21.1-8.1Z" fill="url(#zoarButterflyGradient)" opacity="0.82" />
      <path d="M33 33c1.6 10 9.6 19 16.8 17.7 4.2-0.8 6.1-5 4.3-9.6-2.8-7-11-10.4-21.1-8.1Z" fill="url(#zoarButterflyGradient)" opacity="0.82" />
      <rect x="30.4" y="25.5" width="3.2" height="19" rx="1.6" fill="#510141" />
      <circle cx="32" cy="24.5" r="1.9" fill="#510141" />
    </svg>
  )
}

/**
 * Logotipo de Zoar Beauty Shop en texto real (no imagen), extraído del banner
 * original: "ZOAR BEAUTY" en degradado rosa-magenta + "Shop" en script, con la
 * mariposa como acento vectorial y la firma "By: Daniela Pérez" debajo. Al ser
 * texto y SVG, se ve nítido en cualquier tamaño.
 */
export default function Logo({
  size = 'md',
  className = '',
  showBy = true,
}: {
  size?: LogoSize
  className?: string
  showBy?: boolean
}) {
  const s = SIZES[size]
  return (
    <span className={`inline-flex flex-col ${className}`}>
      <span className={`flex flex-wrap items-center ${s.gap}`}>
        <ButterflyMark className={`${s.icon} shrink-0`} />
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span
            className={`font-display ${s.word} font-extrabold uppercase leading-none tracking-tight bg-gradient-to-br from-lavender-magenta-400 to-lavender-magenta-700 bg-clip-text text-transparent`}
          >
            Zoar Beauty
          </span>
          <span className={`font-script ${s.word} leading-none text-gray-900`}>Shop</span>
        </span>
      </span>
      {showBy && (
        <span className={`${s.by} mt-1.5 pl-1 font-body font-medium uppercase tracking-[0.32em] text-dorado`}>
          By: Daniela Pérez
        </span>
      )}
    </span>
  )
}
