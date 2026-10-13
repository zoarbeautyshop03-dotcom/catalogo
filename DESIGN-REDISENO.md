# Rediseño editorial Zoar — "Boutique 2026"

Especificación compartida para todo el rediseño visual del sitio. Debe respetarse
al tocar cualquier página o componente.

## Paleta (CONSERVAR)

Marca rosa / magenta / dorado. No introducir colores de marca nuevos ni cambiar
los existentes:

- `blush-pink` (50–950) — rosa principal.
- `lavender-magenta` (50–950) — magenta/fucsia principal. `600` = `#d11fb8`
  (AA con texto blanco).
- `dorado` (DEFAULT `#b78b3c`, + escala 50–900) — acento secundario y filetes.
- `ink` `#2b1d29`, `plum` `#510141` — tintas.
- `gray` (50–950) — neutro con matiz ciruela (ya no gris puro).

## Tipografía

- Display: **Playfair Display** → `font-display`.
- Cuerpo: **Inter** → `font-body`.
- Firma: **Playball** → `font-script` (uso muy puntual: firma/acento).

Escala editorial fluida ya definida: `text-display-sm|md|lg|xl`.

## Tokens de forma (Tailwind, ya en tailwind.config.ts)

- Radios: `rounded-boutique` (1.75rem, tarjetas), `rounded-boutique-lg`
  (2.25rem, paneles/hero), `rounded-full` (chips y botones píldora).
- Sombras: `shadow-card` (reposo), `shadow-card-hover` (hover),
  `shadow-float` (flotantes), `shadow-gold-line` (filete interior dorado),
  `shadow-soft-card`.
- Animación: `animate-fade-up`, `animate-scale-in`, `animate-float`,
  easing `ease-boutique` = `cubic-bezier(.22,1,.36,1)`.
- Fondos: `bg-brand-gradient`, `bg-brand-gradient-soft`, `bg-page-wash`.

## Clases CSS ya disponibles (globals.css)

`section-shell`, `eyebrow` (lleva filete dorado), `section-title`, `section-copy`,
`premium-card`, `card-editorial`, `hairline-gold`, `hairline-magenta`,
`glass-panel`, `reveal-up`, `reveal-on-scroll`, `animate-float-soft`,
`catalog-*`, `zoar-*`, `campo-pill`, `badge`, `legal-texto`.

## Patrón de cabecera de sección

```tsx
<div className="section-shell">
  <header className="max-w-2xl">
    <p className="eyebrow">Colección</p>
    <h2 className="section-title mt-3">Título de la sección</h2>
    <p className="section-copy">Descripción breve de una o dos líneas.</p>
  </header>
  <div className="hairline-gold mt-8" />
  {/* contenido */}
</div>
```

## Iconografía

- **SVG inline** estilo Lucide (stroke `currentColor`, `strokeWidth` 1.5–2,
  `aria-hidden`, tamaño `h-5 w-5` o similar). **Nunca emojis** ni símbolos
  tipográficos como iconos (✦ ♡ ✧) — reemplazar por SVG.

## Movimiento

- Transiciones 150–300ms con `ease-boutique`.
- Aparición al hacer scroll con la clase `reveal-on-scroll` (mejora progresiva).
- Respetar `prefers-reduced-motion` (ya hay guardas globales).

## Reglas de oro (no romper)

1. **No cambiar lógica, props, tipos, consultas, rutas, ni `"use client"`.**
   Solo cambia la capa visual (JSX/estructura y clases).
2. Mantener `aria-*`, `alt`, `role`, textos en español y accesibilidad.
3. No añadir dependencias nuevas (nada de framer-motion, lucide-react, etc.).
4. Iconos siempre SVG inline.
5. Responsive real: 375 / 768 / 1024 / 1440. Sin overflow horizontal.
6. Contraste AA (texto normal 4.5:1; titulares grandes ≥3:1).
7. No ejecutar build ni tsc (lo verifica el agente principal al final).
8. Español (Colombia) en todo el copy.
