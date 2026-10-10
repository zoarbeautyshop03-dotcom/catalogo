# Rosa pastel dominante + portada con imagen (octubre 2026)

- **Fondo:** las páginas de la tienda usan un rosa pastel con luces suaves (clase `fondo-tienda`, solo en la tienda; el panel de administración no cambia). Las tarjetas son blancas con borde rosa para destacar sobre el fondo.
- **Portada:** el título y el texto van sobre una imagen de fondo (`public/hero-fondo.svg`: degradado rosa, hebras de seda, mariposas y brillos). Para usar una foto propia, súbela a `public/` y cambia `HERO_IMAGEN` al inicio de `app/(tienda)/page.tsx`.
- **Selección Zoar:** nueva sección con tres destacados en tamaños distintos y una etiqueta con nombre y precio sobre la foto (solo aparece si hay tres destacados con foto).
- **Header y footer:** ambos en rosa pastel (la franja superior queda en ciruela como acento).
- **Tarjetas:** fondo degradado rosa en la foto, bordes rosa más marcados, categorías con ícono sobre rosa; "Ofertas especiales" sobre un panel rosa más intenso.

---

# Mejora estética (octubre 2026)

- **Color:** grises con matiz ciruela (reemplazan al gris puro), fondo crema más neutro (#fdf8fc), dorado solo como acento mínimo (filete de los rótulos y la firma "Shop" del pie).
- **Títulos:** Playfair en peso 600 con espaciado más ajustado, titulares equilibrados y rótulos en minúscula (sin mayúsculas separadas).
- **Inicio:** portada alineada a la izquierda con tres productos reales; los cuatro beneficios pasan a una sola franja con íconos (sin numeración); "Ofertas especiales" va sobre un fondo suave para dar ritmo; más aire entre secciones.
- **Tarjetas:** máximo dos etiquetas, un solo indicador de descuento, nombre en Inter para leer mejor, precio en ciruela (magenta solo cuando hay oferta), sin barra "Ver detalles".
- **Pie de página:** fondo ciruela oscuro con texto claro.

---

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

## Segunda pasada — catálogo (estética y experiencia visual)

Se hizo una revisión específica de la página `/catalogo`, sin cambiar la lógica de Supabase, inventario o carrito.

- Hero del catálogo rediseñado con composición editorial, profundidad y una búsqueda más protagonista.
- Panel de filtros convertido en una superficie visual única y ordenada, con encabezados diferenciados para categorías y marcas.
- Categorías y las marcas activas ahora se acomodan en varias filas y quedan visibles sin desplazamiento horizontal oculto.
- Marcas con chips compactos e iniciales para mejorar la lectura cuando existen muchas opciones.
- Filtros activos mostrados junto al contador de resultados.
- Paginación rediseñada como control compacto y más coherente con la identidad visual.
- Tarjetas de producto renovadas: imágenes completas (`object-contain`), badges más limpios, marca visible cuando existe, indicador de disponibilidad, precio mejor jerarquizado y acceso visual a “Ver detalles”.
- Estados de oferta, nuevo, favorito, últimas unidades y agotado tienen un tratamiento visual diferenciado.
- Se mejoraron sombras, radios, fondos, espacios y microinteracciones para una apariencia de tienda de belleza más cuidada y consistente.
- La versión móvil mantiene dos columnas para producto y adapta la lectura de filtros y controles sin depender de barras horizontales.

## Validación de esta segunda pasada

Los archivos TSX modificados (`app/catalogo/page.tsx` y `components/ProductCard.tsx`) fueron comprobados con el compilador TypeScript en modo de transpilación sintáctica: ambos se procesan sin errores de parseo.

La compilación completa de Next.js no pudo ejecutarse porque la instalación de dependencias npm del entorno quedó incompleta por una limitación de conectividad; por eso esta versión no se presenta como una compilación de producción verificada.


## Mejoras para compra en celular

- **Buscador siempre visible:** en celular el header muestra la barra de búsqueda debajo del logo (antes solo había una lupa que llevaba al catálogo). El campo usa 16px para que iPhone no haga zoom al tocarlo.
- **Catálogo más corto en celular:** el hero grande y la tarjeta de filtros solo se muestran desde tablet (≥640px). En celular hay un título compacto y dos botones: **Filtrar** (abre un panel desde abajo con categorías y marcas, con contador de filtros activos) y **Ordenar**.
- **Ordenar por:** nuevo parámetro `orden` en la URL (`nombre`, `precio-asc`, `precio-desc`). Funciona también en escritorio.
- **Barra inferior del carrito (celular):** cuando hay productos aparece "Ver mi carrito · N productos · $total" fijo abajo y abre el carrito con un toque. El estado abierto/cerrado del carrito ahora vive en `lib/cart-context.tsx`.
- Archivos nuevos: `components/BarraCarritoMovil.tsx`, `components/FiltrosMovil.tsx`, `components/OrdenarSelect.tsx`.
- Validación: revisión sintáctica de los archivos modificados sin errores. No se pudo correr `npm run build` en este entorno (sin dependencias instaladas).

## Cumplimiento legal, privacidad y accesibilidad

- **Páginas nuevas:** `/privacidad` (tratamiento de datos, Ley 1581 de 2012), `/terminos`, `/cookies` y `/devoluciones` (retracto, garantía, reembolsos y PQR, Leyes 1480 de 2011 y 2439 de 2024). Enlazadas desde el pie de página junto con los datos del vendedor.
- **Datos del negocio:** `lib/negocio.ts` lee variables `NEGOCIO_*` (ver `.env.local.example`); nada se inventa. `npm run verificar-legal` avisa si falta alguno. Ver `PENDIENTES-LEGALES.md`.
- **Consentimiento:** aviso con enlaces a privacidad, términos y retracto junto al botón de enviar pedido (carrito) y de WhatsApp (ficha de producto). Los formularios del sitio (buscadores) no recogen datos personales.
- **Cookies:** el sitio solo usa almacenamiento local técnico para el carrito (y cookies de sesión en `/admin`); no hay analítica ni publicidad, por lo que no se agregó banner.
- **Afirmaciones:** «Los favoritos de nuestras clientas» → «Favoritos de la tienda». No había reseñas falsas en el código.
- **Accesibilidad:** enlace «Saltar al contenido»; foco de teclado visible (#781765); carrito y filtros atrapan y devuelven el foco; etiquetas asociadas y `autocomplete` en el login; mensaje de error anunciado; texto alternativo en miniaturas; buscadores con etiqueta; navegaciones con nombre.
- **Contraste:** el magenta 600 pasó de `#d920bf` a `#d11fb8` (texto blanco ≥ 4.5:1); textos `gray-400` → `gray-500/600` y `magenta-500/600` en texto pequeño → `magenta-700`.
- **Seguridad:** cabeceras HTTP básicas en `next.config.mjs`.

## Corrección: productos con signos (+, &, %, #, tildes) en el slug

- **Causa:** el slug de cada producto se escribía a mano y el enlace `/producto/<slug>` se armaba sin codificar. Con signos como `+ & % # ?`, espacios o tildes, la URL no coincidía con el slug guardado y la ficha daba «no encontrado».
- **Arreglo:** `lib/slug.ts` (nuevo) codifica el slug al crear el enlace (`rutaProducto`), lo decodifica al leerlo (`decodificarSlug`) y lo limpia al guardar (`slugify`). `getProductoPorSlug` prueba el slug decodificado y el original.
- **Productos que ya existían** con signos en el slug funcionan sin tocarlos. Al editar un producto, el slug solo se limpia si lo cambias; el campo ahora es opcional (si lo dejas vacío se crea desde el nombre).
- Categorías y marcas también limpian su slug al guardar y el enlace de categoría ahora va codificado.
- El enlace del producto en el mensaje de WhatsApp también va codificado.

## Animación del carrito en celular

- Ahora se reproduce una vez al cargar la página y luego **cada 60 segundos** (`app/globals.css`, ciclo de 60 s con el meneo en el primer ~1.2 s).

## Ideas tomadas de repositorios de GitHub (octubre de 2026)

Se revisaron repositorios de código abierto con más de 1.000 estrellas y licencia MIT; solo se tomaron **ideas de diseño y experiencia de uso**, no se copió código.

| Repositorio | Estrellas | Idea aplicada |
|---|---|---|
| vercel/commerce (plantilla de tienda con Next.js) | 14,2 mil | Pantallas de carga con «esqueletos» (`loading.tsx`) para catálogo y producto; galería de producto interactiva; enfoque en rendimiento y SEO |
| medusajs/nextjs-starter-medusa (archivado en jul. 2026) | 2,8 mil | Ficha de producto completa: ruta de navegación (breadcrumb) y sugerencias de productos de la misma categoría |
| satnaing/shadcn-admin (panel de administración) | 15,7 mil | Menú lateral que se contrae a íconos, modo claro/oscuro, barra superior, globos de alerta y versión accesible |

### Qué cambió

- **Ficha de producto:** `ProductGallery` (miniaturas tocables, flechas, deslizar con el dedo, contador), `Breadcrumb` (Inicio › Catálogo › Categoría › Producto) y sección «También te puede interesar».
- **Carga:** `components/Skeletons.tsx` + `loading.tsx` en `/catalogo` y `/producto/[slug]`.
- **Panel admin:** nuevo marco `components/admin/AdminShell.tsx` — menú lateral plegable (se recuerda por dispositivo), cajón con foco controlado en celular, barra superior con «Ver tienda», campana de alertas con contador y **modo oscuro** con la paleta de Zoar. Íconos propios en `components/admin/Iconos.tsx` (sin librerías nuevas).
- **Estructura:** la tienda pasó al grupo de rutas `app/(tienda)/` con su propio `layout.tsx`. Antes el panel `/admin` se dibujaba debajo de la cabecera y el pie de la tienda; ahora tiene su marco propio. Las direcciones (URLs) no cambian.


## Rediseño visual — octubre de 2026

Se añadió la paleta exacta `blush-pink` (50–950) a Tailwind y a las variables CSS, manteniendo los nombres anteriores como compatibilidad. También se actualizó la portada pública con una dirección visual más editorial y contemporánea, inspirada en patrones de tiendas modernas y sistemas de componentes de código abierto:

- Hero con titular de mayor impacto, etiqueta superior, botones con jerarquía clara y panel decorativo de marca en escritorio.
- Degradados suaves y formas ambientales que mantienen el rosa como identidad sin saturar toda la pantalla.
- Cabecera más limpia, translúcida y con una sombra discreta para separar la navegación del contenido.
- Tarjetas de producto con superficie más delicada, bordes menos pesados y elevación al pasar el cursor.
- Adaptación del hero a móvil, con animaciones reducidas para usuarios que así lo prefieren.
- No se agregaron dependencias y no se cambió la lógica de Supabase, precios, inventario, carrito ni rutas.

### Referencias de código abierto consultadas

- [shadcn/ui](https://github.com/shadcn-ui/ui) — más de 100.000 estrellas. Referencia para jerarquía visual, componentes personalizables, estados de interacción y accesibilidad.
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) — más de 90.000 estrellas. Referencia para composición responsive y estilos mediante utilidades.
- [Vercel Commerce](https://github.com/vercel/commerce) — más de 10.000 estrellas. Referencia de estructura de tienda moderna basada en Next.js.

Las referencias se usaron como inspiración de patrones; no se copiaron repositorios completos ni se añadió código de terceros como dependencia.


## shadcn/ui aplicado a la tienda (octubre de 2026)

Se incorporó shadcn/ui (componentes copiados al proyecto en `components/ui/`, sobre Radix UI) solo donde cambia de verdad lo que se ve y cómo se siente la tienda. Los colores de shadcn (`primary`, `secondary`, `accent`, `border`, `ring`…) están conectados a la paleta Zoar en `app/globals.css` y `tailwind.config.ts`.

**Después de descomprimir hay que ejecutar `npm install`** (se agregaron dependencias nuevas: `@radix-ui/react-dialog`, `@radix-ui/react-accordion`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `sonner`, `tailwindcss-animate`).

| Componente | Dónde se usa | Qué mejora |
|---|---|---|
| **Sheet** | Carrito, filtros del celular, menú del celular | Paneles que se deslizan con animación fluida; Radix maneja foco, Escape, bloqueo del scroll y accesibilidad. El menú pasa de un desplegable pequeño a un panel lateral con enlaces grandes. |
| **Sonner (toast)** | Al agregar un producto | Aviso «Agregado al carrito» con botón «Ver carrito», arriba y centrado. |
| **Button** | Botones de portada, carrito, ficha, filtros, WhatsApp | Un solo estilo coherente con variantes (principal, degradado Zoar, contorno, cristal, oscuro). |
| **Badge** | Etiquetas de tarjetas, descuento, disponibilidad | Etiquetas uniformes; la disponibilidad ahora usa color (verde / ámbar / oscuro). |
| **Accordion** | Ficha de producto | «Modo de uso» e «Ingredientes destacados» como secciones plegables; la ficha queda más corta en celular. |
| **Skeleton** | Pantallas de carga | Marcadores de carga con el mismo componente. |

- `CartDrawer`, `FiltrosMovil` y `MenuMovil` ya no necesitan su propio código de foco/Escape/scroll (lo hace Radix). `lib/use-dialogo.ts` se conserva porque el panel de administración todavía lo usa.
- Se agregó `components.json` para poder sumar más componentes con `npx shadcn@latest add <nombre>`.
- El panel de administración **no se tocó**: su modo oscuro depende de clases CSS y los paneles de Radix salen en un portal fuera de ese contenedor.
- Se dejó el selector «Ordenar por» nativo a propósito: en el celular abre el selector del sistema, que es más cómodo que una lista personalizada.
- Validación: revisión sintáctica de los 79 archivos TS/TSX sin errores. No se pudo ejecutar `npm run build` en este entorno (sin acceso a internet para instalar dependencias).
