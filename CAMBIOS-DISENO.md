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
