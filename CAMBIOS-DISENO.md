# Zoar Beauty Shop — actualización visual

Esta versión mantiene la arquitectura existente (Next.js 14 + React + TypeScript + Tailwind + Supabase) y cambia principalmente la capa visual.

## Paleta aplicada

Se añadieron como variables CSS y colores Tailwind los 11 tonos de `lavender-magenta`:

- 50 `#fff4fe`
- 100 `#ffe7fe`
- 200 `#ffcefc`
- 300 `#ff94f4`
- 400 `#fe74ee`
- 500 `#f540df`
- 600 `#d920bf`
- 700 `#b4179a`
- 800 `#93157d`
- 900 `#781765`
- 950 `#510141`

Los nombres antiguos (`rosa-*`, `fucsia`, `crema`, etc.) se conservaron como alias para no romper componentes existentes.

## Mejoras incluidas

- Header más limpio, con buscador central en escritorio y navegación separada.
- Menú móvil desplegable.
- Hero más editorial/premium, con jerarquía tipográfica y fondos suaves.
- Tarjetas de categorías y productos con más profundidad visual, bordes suaves, hover y mejor jerarquía de precio.
- Eliminación de emojis grandes del carrito/producto a favor de iconos visuales más consistentes donde era conveniente.
- Carrito lateral renovado y más claro.
- Ficha de producto con estructura de compra más destacada.
- Catálogo con cabecera, filtros tipo pill y estado de búsqueda más claro.
- Footer ampliado para cerrar mejor la experiencia.
- Panel administrativo y login alineados con la nueva identidad visual.
- Soporte para los enlaces existentes `?nuevo=1` y `?oferta=1` en el catálogo.
- Estados focus accesibles y soporte para usuarios que prefieren menos animaciones.

## Validación

Se realizó una comprobación sintáctica de los archivos TypeScript/TSX modificados y del resto del proyecto: 41 archivos analizados, 0 diagnósticos sintácticos.

No fue posible ejecutar `npm run build` dentro del entorno porque las dependencias npm no están disponibles localmente y el intento de instalación no pudo completarse por la conectividad del entorno.

## Ajuste solicitado — carrito y banner

- El carrito ahora abre como un panel lateral oscuro, con fondo de la página oscurecido y desenfoque suave para dar prioridad al pedido.
- Se conserva la paleta Zoar (rosa/fucsia) en acentos, contador, cantidades y botón de WhatsApp.
- Se añadieron cierre con tecla Escape, estados de accesibilidad y una entrada lateral más fluida.
- El banner principal de inicio dejó de usar el bloque gráfico derecho y ahora presenta únicamente el mensaje, botones y detalles decorativos, manteniendo el estilo premium de Zoar.

## Fase 12 — corrección del carrito y logo en texto

**Bug del carrito (causa raíz encontrada):** el `<header>` usa `backdrop-blur-xl`. Cualquier elemento con `backdrop-filter` (o `filter`/`transform`) crea, según la especificación CSS, un nuevo "containing block" para sus descendientes con `position: fixed`. Como `<CartDrawer />` se renderiza dentro del `<header>`, el overlay `fixed inset-0` del carrito quedaba encerrado dentro de la altura del header (~140px) en vez de cubrir toda la pantalla. Por eso el panel se veía como una cajita chica y recortada, y el resumen con el botón "Enviar pedido por WhatsApp" —que va más abajo en el panel— no alcanzaba a mostrarse.

- Arreglo: `CartDrawer.tsx` ahora renderiza el fondo oscuro y el panel lateral con `createPortal` directo a `document.body`, así el overlay siempre cubre toda la pantalla sin importar los estilos del header.

**Banner/logo en imagen → texto real:**

- Nuevo componente `components/Logo.tsx`: "ZOAR BEAUTY" en `font-display` con degradado rosa-magenta + "Shop" en `font-script` (cursiva), más una mariposa vectorial (SVG) extraída del banner original y la firma "By: Daniela Pérez" debajo. Al ser texto y SVG, nunca se ve borroso ni pixelado al agrandarlo.
- Se reemplazó el `<Image src="/logo-banner.png">` por `<Logo />` en el header público, el sidebar de administración y el login de administración, cada uno con un tamaño (`sm` / `md` / `lg`) ajustado a su espacio. El del header quedó más grande que antes.
- El archivo `public/logo-banner.png` se dejó intacto por si se necesita en otro lado, simplemente ya no se referencia en estos tres componentes.
