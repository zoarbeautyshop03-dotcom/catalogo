# Zoar Beauty Shop — catálogo web (Fase 3)

Catálogo público en Next.js (App Router) + Supabase. Sin login: cualquiera puede
entrar y navegar libremente; el login queda reservado para el panel admin (Fase 4,
todavía no construido).

## Qué incluye esta versión

- Inicio: hero, categorías, secciones "Más vendidos" / "Recién llegados" / "Ofertas" / "Destacados".
- `/catalogo`: listado con buscador por nombre y filtro por categoría.
- `/producto/[slug]`: ficha de producto con galería, precio, estado de inventario,
  descripción, modo de uso, ingredientes, advertencias y botón de WhatsApp con
  mensaje pre-armado.
- Toda la data sale de la vista `productos_publicos` (nunca de `productos`
  directamente), tal como quedó definido en la arquitectura: el frontend público
  jamás toca costo, stock exacto ni nada privado.
- Paleta de marca (rosa pastel / fucsia de acento / dorado) ya cargada en Tailwind.

## Cómo correrlo

1. `npm install`
2. Copia `.env.local.example` a `.env.local` y completa:
   - `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase → Project
     Settings → API — usa la **anon/public key**, nunca la `service_role`).
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` (con indicativo, sin espacios ni "+", ej. `573001234567`).
   - `NEXT_PUBLIC_SITE_URL` (por ahora `http://localhost:3000`).
3. `npm run dev` y abre `http://localhost:3000`.

No pude instalar dependencias ni correr esto desde el chat (el entorno donde lo
escribí no tiene salida a internet), así que este código no se probó ejecutándose
de verdad todavía. Para correrlo, depurarlo y ajustarlo en vivo, Claude Code va a
rendir mucho más que seguir por chat — puede instalar, levantar el servidor y
corregir errores sobre la marcha.

## Simplificaciones a propósito de esta primera versión (no son errores)

- **Sin fotos todavía**: tu Excel no traía URLs de imágenes, así que todo se ve con
  un placeholder "Foto pendiente" hasta que subas fotos reales (por ahora
  directamente en la tabla `producto_imagenes` de Supabase; el panel para subirlas
  cómodamente es Fase 4).
- **Filtros**: solo categoría y buscador por nombre están en la interfaz. La capa de
  datos (`lib/queries.ts`) ya soporta filtrar por marca y rango de precio
  (`?marca=`, `?min=`, `?max=`) — falta la UI para esos controles, que es rápido de
  agregar cuando quieras.
- **Número de WhatsApp**: se lee de una variable de entorno, no de la tabla
  `configuracion`. Funciona, pero significa que si cambias el número hay que
  redesplegar en vez de solo editarlo en el panel. Se puede conectar a la base de
  datos más adelante sin mucho esfuerzo.
- **Sin sitemap.xml / robots.txt** todavía (punto 29 del prompt original) — se
  agrega junto con SEO en una pasada posterior.
- **Sin "compartir producto" ni favoritos** — quedan para cuando volvamos a esos
  puntos del prompt original.

## Fase 4 — Panel admin (`/admin`)

### Antes de probarlo

1. Debes haber corrido ya `zoar_fase1b_seguridad_rls.sql` (el parche de seguridad de
   la Fase 1). Sin eso, crear/editar/borrar desde el panel puede fallar con un
   error de permisos.
2. Crea tu primer usuario admin en **Supabase → Authentication → Users → Add user**
   (correo + contraseña). No hay registro público a propósito — el panel no tiene
   un formulario de "crear cuenta", solo login.

### Qué incluye

- Login en `/admin/login` (sin esto no se puede entrar a nada bajo `/admin`).
- Dashboard con conteos (total, disponibles, últimas unidades, agotados,
  categorías, marcas).
- Productos: listar con búsqueda, crear, editar (todos los campos del esquema),
  duplicar, eliminar, y gestión de fotos (agregar por URL, marcar principal,
  quitar) dentro de la ficha de edición.
- Categorías y Marcas: crear, editar en línea, activar/desactivar, eliminar.
- Configuración: nombre de la tienda, WhatsApp, redes sociales, horarios,
  información de entrega, y si mostrar o no productos agotados.

### Cómo funciona la seguridad (para que confíes en esto)

El panel no usa ninguna clave secreta especial — usa tu sesión de Supabase Auth
normal. Cuando inicias sesión, tu usuario queda como `authenticated`, y son
exactamente las políticas RLS que ya definimos (`admin acceso total` /
`admin todo ...`) las que te dejan escribir. Un visitante sin sesión sigue
viendo exactamente lo mismo que antes: nada bajo `/admin`, y del catálogo
público solo lo que la vista `productos_publicos` expone.

### Simplificaciones de esta primera versión

- El campo "Subcategoría" del formulario de producto lista todas las
  subcategorías sin filtrarlas por la categoría elegida (falta ese detalle de
  interactividad — rápido de agregar después).
- No hay subida de archivos de imagen: se pega la URL ya subida a Cloudinary/
  ImageKit. Conectar un botón de "subir foto" directo es una mejora natural del
  siguiente paso.
- El número de WhatsApp del catálogo público todavía no lee de `configuracion`
  (ver nota en esa página).

## Inventario por Excel (`/admin/inventario`)

Flujo pensado para cuando haces un conteo de inventario completo y no quieres
editar producto por producto:

1. **Descargar plantilla** genera un `.xlsx` con todos tus productos actuales
   (slug, nombre, sku, código de barras, cantidad en stock, precio).
2. Editas las columnas `cantidad_stock` y/o `precio` en Excel — el resto son
   solo referencia, no las toques.
3. Subes el archivo. **No se aplica nada todavía**: primero ves una tabla de
   "esto va a cambiar de X a Y", más los slugs que no reconoció (por si hay un
   error de tipeo).
4. Solo al presionar "Confirmar y actualizar" se escribe en la base de datos.

El cruce se hace por `slug` (no por SKU, porque tu Excel original nunca trajo
SKU). Acepta `.xlsx`, `.xls` y `.csv`; si algo no carga bien con CSV, usa el
Excel que descargaste como plantilla — es el formato más probado.

## Estructura

```
app/
  layout.tsx          layout raíz (Header + Footer + fuentes)
  page.tsx             inicio
  catalogo/page.tsx     listado + buscador + filtro por categoría
  producto/[slug]/page.tsx  ficha de producto
lib/
  supabase.ts           cliente de Supabase
  queries.ts             todas las consultas a productos_publicos/categorias/marcas
  whatsapp.ts             genera el link wa.me con el mensaje pre-armado
  types.ts                 tipos TypeScript
components/
  Header.tsx, Footer.tsx, ProductCard.tsx, CategoryCard.tsx, WhatsAppButton.tsx
app/admin/
  login/page.tsx                     login (fuera de la protección)
  (protected)/layout.tsx              exige sesión, muestra el sidebar
  (protected)/page.tsx                 dashboard
  (protected)/productos/page.tsx        listado
  (protected)/productos/nuevo/page.tsx   crear
  (protected)/productos/[id]/page.tsx    editar + fotos
  (protected)/categorias/page.tsx        categorías
  (protected)/marcas/page.tsx            marcas
  (protected)/configuracion/page.tsx     configuración
components/admin/
  AdminSidebar.tsx, ProductoForm.tsx, DeleteButton.tsx
lib/supabase/
  server.ts (Server Components/Actions), client.ts (login desde el navegador)
lib/actions/
  productos.ts, categorias.ts, marcas.ts, configuracion.ts, imagenes.ts, auth.ts
middleware.ts                          protege todo /admin/* excepto /admin/login
```
