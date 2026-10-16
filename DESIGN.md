# Sistema de diseño — Zoar Beauty Shop

Referencia visual de la tienda. Describe el sistema **real** ya implementado en
`app/globals.css` y `tailwind.config.ts`, para que quien toque la interfaz parta
de los mismos tokens en vez de inventar valores nuevos.

Este documento complementa a `DESIGN-REDISENO.md` (la especificación "Boutique
2026") y a `CAMBIOS-DISENO.md` (el historial de cambios). **Si algo aquí
contradice al código, manda el código.**

> El archivo `DESIGN-referencia-oura.md` se conserva aparte: es la referencia
> externa de la que se tomaron algunas ideas de estructura y disciplina de color.
> Su paleta (azul de acción, gama oliva, tipografías propias) **no** forma parte
> de Zoar y no debe aplicarse.

---

## Panorama

Zoar se lee como una boutique de barrio bien cuidada. El lienzo no es blanco
sino un rosa pastel con luces suaves; las frases grandes van en serif editorial
alta y todo lo que se lee de verdad va en una sans neutra. El acento no es un
color plano sino un **degradado magenta → ciruela** que se reserva para la acción
principal. El dorado no compite: aparece en filetes de 1px, en la firma y en el
subrayado de una sola palabra clave.

El sistema vive en **tres mundos de superficie**:

- **Mundo pastel** — el lienzo por defecto de la tienda (`#fff6fb` con halos
  radiales). Es donde está todo el catálogo, la portada y las secciones.
- **Mundo blanco** — las tarjetas. Siempre blanco con un degradado apenas
  perceptible (`#ffffff → #fffafd`), borde magenta translúcido y sombra suave.
  El blanco es la señal de "esto se puede tocar o comprar".
- **Mundo ciruela** — las bandas oscuras: la franja de anuncio superior, la
  banda "Belleza pensada para tu día a día" y el cierre del pie. Sirven de
  contrapunto y de descanso visual. El panel de administración **no** usa este
  sistema.

**Rasgos clave:**

- Lienzo rosa pastel (`#fff6fb` + halos) como superficie de reposo, nunca blanco
  puro a pantalla completa.
- Dos voces tipográficas: `font-display` (Playfair Display, serif) para titulares
  y `font-body` (Inter, sans) para lectura. `font-script` (Playball) solo para la
  firma.
- Un único acento decisivo: el **degradado magenta → ciruela** de los botones
  primarios. Ningún otro elemento lo usa como relleno.
- El dorado (`#b78b3c`) es un acento de línea, no de relleno: filetes, subrayados
  y la firma.
- Botones tipo píldora (`9999px`) contra tarjetas muy redondeadas (`1.75rem`) e
  imágenes de producto dentro de marcos suaves.
- Jerarquía fotográfica: en cuanto hay foto de producto, manda la foto y la
  interfaz se retira a filetes y etiquetas discretas.
- Escala tipográfica fluida con `clamp()`: sin media queries para el tamaño.

---

## Color

### Marca y acento

- **Rosa blush** (`blush-pink`, 50–950) — la familia principal. Ancla en
  `blush-pink-600` `#db1eb1` (inicio del degradado de acción) y `blush-pink-700`
  `#b6158f`, que es el color de la palabra destacada del titular.
- **Magenta lavanda** (`lavender-magenta`, 50–950) — la familia de la marca. El
  `600` es `#d11fb8`, oscurecido a propósito para que el **texto blanco sobre él
  cumpla contraste AA (4.5:1)**. El `950` `#510141` es el ciruela profundo de las
  bandas oscuras.
- **Degradado de acción** (`bg-brand-gradient`) —
  `linear-gradient(135deg, #db1eb1 0%, #951374 62%, #510141 100%)`. Es el relleno
  **exclusivo** del botón primario. Ningún otro elemento de la interfaz lo usa.
- **Dorado** (`dorado`, DEFAULT `#b78b3c`, + escala 50–900) — acento secundario y
  de lujo. Se usa en filetes (`hairline-gold`), en el subrayado del titular
  (`rgba(183, 139, 60, 0.35)`) y en la firma. `dorado-oscuro` `#8a6520` es la
  versión legible para etiquetas pequeñas sobre fondo claro.
- **Tintas**: `ink` `#2b1d29` (texto general) y `plum` `#510141` (ciruela).

### Superficies

- **Lienzo** — `body` usa `#fff6fb` más dos halos radiales (`rgba(255,148,244,.16)`
  y `rgba(255,206,252,.42)`). Las páginas de tienda añaden `.fondo-tienda`, un
  degradado `#fff4fb → #ffe9fc → #fff1fb` con un tercer halo dorado.
- **Tarjeta** (`premium-card`, `card-editorial`, `catalog-product-card`) —
  `#ffffff → #fffafd`, borde `rgba(219, 30, 177, 0.13–0.14)`.
- **Panel de vidrio** (`glass-panel`) — `rgba(255,255,255,0.72)` con
  `backdrop-filter: blur(16px) saturate(1.2)`. Es la superficie del header.
- **Tarjeta del hero** (`zoar-hero-note`) — vidrio más presente
  (`rgba(255,255,255,0.72)` + `blur(18px)`) con borde blanco.
- **Banda ciruela** — `plum` / `lavender-magenta-950` como fondo, texto blanco.

### Texto

- **Tinta** (`ink` `#2b1d29`) — texto general del cuerpo.
- **Titular** (`#3a0f30`) — color de `.section-title`, un ciruela muy oscuro.
- **Secundario** (`.section-copy` `#6b5a6a`, `gray-600` `#5a4859`) — párrafos y
  descripciones.
- **Antetítulo** (`.eyebrow` `#93157d`) — versalitas con filete dorado.
- **Sobre oscuro** — blanco, y `blush-pink-200` para el antetítulo de la banda
  ciruela.

### Semántico

- **Dorado oscuro** (`#8a6520`) — el aviso "Últimas unidades" y etiquetas
  pequeñas. No es un color de error: es un aviso de escasez.
- **Agotado** — insignia oscura (`variant="dark"`) sobre la foto, con velo blanco
  al 80% sobre la imagen.

---

## Tipografía

### Familias

Tres familias, y la tensión entre las dos primeras es intencional.

- **Playfair Display** (`font-display`) — serif de alto contraste. Titulares,
  títulos de sección y nombres de producto. Pesos 600/700/800. Se usa en
  `font-semibold`, nunca en negro puro: los cuerpos grandes ya pesan bastante.
- **Inter** (`font-body`) — sans neutra. Todo lo que se lee: párrafos, botones,
  etiquetas, formularios, precios.
- **Playball** (`font-script`) — script. **Uso muy puntual**: la firma del pie
  ("Belleza que se siente"). No se usa para títulos ni para botones.

Las tres se cargan con `next/font/google` en `app/layout.tsx` y se exponen como
`--font-display`, `--font-body` y `--font-script`.

### Jerarquía

| Token | Familia | Tamaño | Interletrado | Uso |
|---|---|---|---|---|
| `text-display-xl` | Playfair | `clamp(2.9rem, 7vw, 4.75rem)` / 1.01 | −0.045em | Titular del hero en escritorio |
| `text-display-lg` | Playfair | `clamp(2.5rem, 5.5vw, 3.75rem)` / 1.04 | −0.035em | Titular del hero en móvil |
| `text-display-md` | Playfair | `clamp(2rem, 4vw, 2.85rem)` / 1.08 | −0.03em | Titulares de página y de banda |
| `text-display-sm` | Playfair | `clamp(1.65rem, 3vw, 2.1rem)` / 1.12 | −0.02em | Cabeceras compactas |
| `.section-title` | Playfair | `clamp(1.75rem, 3.4vw, 2.9rem)` | −0.03em | Título de cada sección |
| `.eyebrow` | Inter | `0.72rem` / 700 / versalitas | +0.16em | Antetítulo sobre cada título |
| `.section-copy` | Inter | `0.98rem` / 1.7 | — | Bajada de cada sección |
| Cuerpo | Inter | `0.875–1rem` / 1.7–1.8 | — | Párrafos |
| Etiqueta | Inter | `0.6875–0.75rem` / 600–700 | +0.14–0.22em | Precios, insignias, rótulos |

### Principios

- **Serif para sentir, sans para informar.** Si el texto quiere emoción, Playfair.
  Si quiere transmitir un dato (precio, categoría, estado), Inter.
- **El interletrado negativo es solo para Playfair.** A tamaños grandes el serif
  necesita cerrarse (−0.02 a −0.045em); Inter nunca lleva interletrado negativo.
- **Las versalitas siempre llevan interletrado positivo** (+0.14em o más) y peso
  alto. Sin eso, en 11px se leen como un error.
- **`text-wrap: balance` en h1/h2/h3 y `pretty` en párrafos**, declarado una vez
  en `globals.css`, para que los titulares no dejen palabras huérfanas.

---

## Composición

### Ritmo y contenedor

- **Contenedor**: `.section-shell` con `max-width: 82rem`, centrado y con relleno
  lateral.
- **Ritmo vertical**: las secciones de la portada usan `pt-16 sm:pt-24`. La
  separación entre secciones es siempre generosa: el aire es parte del diseño,
  no un sobrante.
- **Rejillas**: 4 columnas en catálogo (escritorio), 2 en tablet, 1–2 en móvil.
  La portada usa `lg:grid-cols-[1.05fr_.95fr]` en el hero.

### Espacio en blanco

El espacio vacío es estructura. Cada sección abre con la misma secuencia
—antetítulo, título, bajada y a veces un enlace "Ver todo"— y luego el contenido.
No se comprime esa apertura para "meter más": si algo no cabe, se recorta el
contenido, nunca el aire.

### Estrategia responsive

- Puntos de ruptura: `sm` 640px y `lg` 1024px son los que cambian la estructura.
- El tamaño de letra es fluido con `clamp()`: no hay media queries por tamaño.
- La columna derecha del hero (el escaparate) solo existe desde `lg`.
- En móvil el buscador usa **16px** a propósito: por debajo de 16px, iOS hace
  zoom automático al enfocar un campo.
- Nada puede desbordar en horizontal: se comprueba a 390, 768, 1024 y 1440px.

---

## Profundidad y elevación

Las sombras son cálidas y con tinte ciruela, nunca grises ni negras:

| Token | Valor | Uso |
|---|---|---|
| `shadow-soft-card` | `0 1px 2px rgba(81,1,65,.04), 0 10px 28px rgba(81,1,65,.06)` | Tarjetas en reposo |
| `shadow-card` | `0 1px 2px rgba(81,1,65,.04), 0 14px 32px -14px rgba(81,1,65,.16)` | Tarjeta de producto |
| `shadow-card-hover` | `0 2px 4px rgba(81,1,65,.05), 0 26px 52px -18px rgba(149,19,116,.26)` | Tarjeta al pasar el cursor |
| `shadow-float` | `0 30px 70px -24px rgba(81,1,65,.32)` | Elementos flotantes |
| `--zoar-shadow-lg` | `0 2px 6px rgba(81,1,65,.05), 0 34px 64px -24px rgba(149,19,116,.30)` | Paneles grandes |

La elevación se usa para **indicar interacción**, no para decorar. Una tarjeta
que se puede abrir se eleva al pasar el cursor; una que no, no.

### Profundidad decorativa

El hero y las bandas usan **orbes**: círculos con `radial-gradient` y
`filter: blur()`, en magenta y dorado translúcidos, colocados a los bordes y
recortados por `overflow: hidden`. Son atmósfera, no contenido: siempre
`aria-hidden="true"`.

---

## Formas

### Radios

| Token | Valor | Uso |
|---|---|---|
| `rounded-boutique-lg` | `2.25rem` | Paneles y hero |
| `rounded-boutique` | `1.75rem` | Tarjetas |
| `rounded-4xl` | `2rem` | Contenedores intermedios |
| `rounded-2xl` | `1rem` | Marcos de foto, bloques internos |
| `rounded-full` | `9999px` | Botones, chips, insignias |

Regla: **lo que se pulsa es píldora, lo que se contiene es muy redondeado.** Un
botón nunca lleva radio de tarjeta, y una tarjeta nunca lleva radio de píldora.

### Geometría de la fotografía

- Las fotos de producto van dentro de un marco `aspect-[0.8]` (vertical) en las
  tarjetas del catálogo, y `aspect-square` en el escaparate de la portada.
- El fondo del marco es un degradado rosa muy claro con un halo blanco arriba
  (`catalog-product-media`), para que el producto "flote" aunque la foto venga
  con fondo blanco.
- La imagen va en `object-contain` con relleno: **nunca se recorta un producto**.
- Si falta la foto, se muestra un marcador discreto ("Foto pendiente"), no un
  hueco roto.

---

## Componentes

### Navegación

Franja de anuncio superior en ciruela, versalitas de 10–12px con interletrado
amplio, y las redes a la derecha. Debajo, un header de vidrio (`glass-panel`)
con el logo, el buscador en píldora y el carrito. La navegación de escritorio va
en versalitas con un filete dorado que se despliega al pasar el cursor; el enlace
de administración se muestra en tono suave, deliberadamente discreto.

### Portada (hero)

Panel `zoar-hero` con radio `boutique-lg`, borde magenta translúcido y sombra
profunda. Dentro:

- Fondo: imagen de seda (`/hero-fondo.svg`) con un velo en degradado que va de
  casi opaco a la izquierda a translúcido a la derecha, más los orbes.
- **Columna izquierda**: antetítulo, titular en Playfair con **una sola palabra
  destacada** (subrayado dorado + color `#b6158f`), bajada, botón primario de
  acción, botón secundario de vidrio y dos marcas de confianza.
- **Columna derecha (desde `lg`)**: el **escaparate**. Muestra un producto real
  —etiqueta "Destacado", foto en marco blanco, nombre, precio y "Ver producto"—
  y enlaza a su ficha. Si no hay ningún destacado con foto, cae a una tarjeta
  decorativa con la firma. El escaparate reemplazó a una tarjeta que repetía el
  logo: repetir la marca no aporta, mostrar producto sí.

### Botones

- **Primario** (`variant="brand"`) — píldora con el degradado de acción, texto
  blanco, sombra magenta y elevación al pasar el cursor.
- **Vidrio** (`variant="glass"`) — píldora blanca translúcida con borde claro.
  Es el secundario, para acciones alternativas ("Ver ofertas").
- **Tamaño `lg`** en el hero y en las llamadas principales; el resto, tamaño base.
- Siempre con `font-bold` y relleno lateral generoso (`px-6`).
- Todo botón o enlace interactivo conserva un `:focus-visible` visible.

### Formularios

Campos en píldora o radio suave, fondo blanco translúcido sobre el lienzo rosa.
En móvil, **16px mínimo** en los campos de texto. Los estados de error usan el
token `destructive`, nunca el dorado (el dorado significa escasez, no error).

### Tarjetas

- **Producto** (`catalog-product-card`) — radio `boutique`, degradado blanco,
  borde magenta translúcido. Al pasar el cursor sube 4px, el borde se intensifica
  y aparece la pista "Ver producto". Etiquetas en la esquina (máximo 2, en orden
  de importancia) y velo con "Agotado" cuando corresponde.
- **La fila de precio admite salto de línea**: si el precio y la etiqueta de
  estado no caben juntos, la etiqueta baja a su propia línea. La tarjeta usa
  `overflow-hidden`, así que nada puede desbordarla.

### Componentes con firma

- **Filete dorado** (`hairline-gold`) — 1px con degradado que se desvanece en los
  extremos. Es la firma de la marca: separa bloques sin dibujar una caja.
- **Antetítulo** (`.eyebrow`) — versalitas con un filete dorado de 1.75rem antes.
- **Subrayado del titular** — banda dorada al 35% de opacidad bajo una sola
  palabra.
- **Firma** (`font-script`) — "Belleza que se siente" en el pie.

### Movimiento

- Curva de la casa: `ease-boutique` = `cubic-bezier(0.22, 1, 0.36, 1)`. Salida
  rápida, llegada suave.
- Aparición al hacer scroll (`.reveal-on-scroll`): **mejora progresiva**. Solo se
  activa si el navegador soporta `animation-timeline: view()`, y nunca oculta
  contenido de forma permanente: hay una guarda `@media print` que lo fuerza
  visible al imprimir o exportar a PDF.
- Todo movimiento se desactiva con `prefers-reduced-motion: reduce`.

---

## Accesibilidad

- **Contraste AA como mínimo.** El `lavender-magenta-600` `#d11fb8` está
  oscurecido justo para que el texto blanco encima llegue a 4.5:1. Al introducir
  cualquier par texto/fondo nuevo, se comprueba.
- Toda imagen informativa lleva `alt`; las decorativas, `alt=""` o
  `aria-hidden="true"`.
- Todo botón o enlace tiene nombre accesible (texto visible o `aria-label`).
- `lang="es"` en el documento.
- Las secciones con sentido llevan `aria-label` (por ejemplo "Por qué comprar en
  Zoar").
- El color nunca es el único portador de significado: "Agotado" lleva texto, no
  solo un color.

---

## Sí y no

### Sí

- Usar los tokens existentes antes de escribir un valor nuevo.
- Reservar el degradado de acción para **un** botón primario por pantalla.
- Dejar que el aire y los filetes hagan el trabajo de separación.
- Mostrar producto real siempre que haya foto disponible.
- Comprobar en navegador a 390, 768, 1024 y 1440px antes de dar algo por hecho.
- Mantener la curva `ease-boutique` en transiciones y elevaciones.

### No

- **No introducir colores de marca nuevos.** La paleta es rosa, magenta, dorado,
  ciruela y gris con matiz ciruela. Nada más.
- No usar el degradado de acción en enlaces, iconos, bordes ni fondos grandes.
- No usar el dorado como color de error ni de estado.
- No usar `font-script` para títulos ni botones.
- No aplicar interletrado negativo a Inter.
- No poner radio de píldora en tarjetas ni radio de tarjeta en botones.
- No recortar fotos de producto con `object-cover`.
- No cambiar la lógica, los tipos, las consultas ni las rutas para "mejorar" el
  aspecto: el rediseño vive en la capa visual.
- No dejar contenido invisible sin salida (si se anima una aparición, siempre con
  respaldo para impresión y para `prefers-reduced-motion`).

---

## Lo que no se copió de la referencia externa

Se tomaron de `DESIGN-referencia-oura.md` la disciplina de color, la idea de
mundos de superficie, el serif-para-sentir/sans-para-informar y el uso del aire
como estructura. **No** se adoptó, y no debe adoptarse:

- Su **azul de acción** `#2a72de` ni ningún azul.
- Su gama **oliva / bosque / arcilla**.
- Sus **tipografías propietarias** (Editorial New, AkkuratLL): aquí son Playfair
  Display, Inter y Playball.
- Su lienzo **crema** `#f7f1e8`: el lienzo de Zoar es rosa pastel.
- Su escenario **plateado** de producto, su imaginería y su marca.
