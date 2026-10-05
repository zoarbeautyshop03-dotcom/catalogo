# ZOAR — Inventario optimizado

## Qué se agregó

- Buscador instantáneo por nombre, SKU, código de barras o slug.
- Filtros por disponibilidad, bajo mínimo y agotados.
- Filtros por marca y categoría.
- Paginación de 40 productos para que el administrador sea más cómodo con catálogos grandes.
- Edición rápida del stock con `−`, `+` o escribiendo la cantidad.
- Guardado de varios cambios de stock en una sola acción.
- Acciones masivas: entrada, salida y establecer stock.
- Cambio de precio para varios productos seleccionados.
- Indicadores de productos disponibles, bajo mínimo y agotados.
- Historial de movimientos de inventario.
- Importación de Excel/CSV conservada y mejorada: reconoce `slug` o `sku`.
- Previsualización antes de aplicar Excel.
- Aplicación transaccional de movimientos mediante funciones de Supabase.

## Paso obligatorio en Supabase

Entra a **Supabase → SQL Editor → New query**, copia/abre el contenido de:

`supabase/inventario.sql`

y pulsa **Run**.

Esto crea la tabla del historial y las funciones que permiten hacer acciones masivas de forma segura y mucho más rápida.

## Después de ejecutar el SQL

1. Abre `/admin/inventario`.
2. Selecciona varios productos.
3. Prueba una entrada o salida pequeña.
4. Comprueba que aparezca en “Últimos movimientos”.
5. Prueba una edición rápida de stock.
6. Descarga la plantilla Excel y verifica que puedas volver a importarla.

## Importante

La página anterior no se elimina ni se reemplaza el Excel. El Excel queda como herramienta para cargas grandes y la nueva tabla como herramienta para el trabajo diario.
