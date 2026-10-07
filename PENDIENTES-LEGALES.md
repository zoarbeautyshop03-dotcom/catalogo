# Pendientes legales y de cumplimiento (Zoar Beauty Shop)

> Este documento lista lo que **solo tú puedes completar o confirmar**. Las páginas legales (`/privacidad`, `/terminos`, `/cookies`, `/devoluciones`) están redactadas con base en la normativa colombiana verificada en octubre de 2026, pero **no sustituyen la revisión de un abogado** y ninguna página legal te protege por sí sola de una reclamación: lo que te protege es **cumplir lo que dicen**.

## 1. Datos del negocio (obligatorio antes de publicar)

La Ley 1480 de 2011 (art. 50) exige mostrar en el sitio: nombre o razón social, NIT, dirección de notificación, teléfono y correo electrónico. Se configuran como variables de entorno (en `.env.local` y en el panel de tu hosting):

| Variable | Qué poner |
|---|---|
| `NEGOCIO_RAZON_SOCIAL` | Nombre completo (persona natural) o razón social, como figura en el RUT |
| `NEGOCIO_NIT` | NIT o cédula del titular |
| `NEGOCIO_DIRECCION` y `NEGOCIO_CIUDAD` | Dirección de notificación |
| `NEGOCIO_EMAIL` | Correo de contacto (también recibe solicitudes de datos personales) |
| `NEGOCIO_TELEFONO` | Teléfono de contacto |
| `NEGOCIO_MEDIOS_PAGO` | (Opcional) medios de pago, ej. «Transferencia bancaria y Nequi» |

Verifica con `npm run verificar-legal`. En el panel **Configuración** completa también *Horarios* e *Información de entrega* (se muestran en los términos): cobertura, costo y tiempo de envío.

## 2. Afirmaciones que debes confirmar que son ciertas

- «Envíos a todo el país» (inicio). Si no es cierto, cámbialo.
- Plazo de respuesta a PQR de **15 días hábiles** (`/devoluciones`).
- Que **no cobras el envío de la devolución** cuando el producto llega defectuoso o diferente (`/devoluciones`, sección 3).
- Los marcadores «Nuevo», «Oferta» y «Favorito» de cada producto: actívalos solo si es verdad.
- **Precios con descuento:** el «precio anterior» debe ser el precio real al que vendiste antes. Inflar el precio anterior para simular un descuento es publicidad engañosa.
- No escribas en descripciones promesas de resultados («elimina la caspa», «crece el cabello en 30 días», «100 % natural», «dermatológicamente probado») si no tienes soporte.

## 3. Productos cosméticos (riesgo alto)

Los cosméticos y productos de cuidado capilar necesitan **Notificación Sanitaria Obligatoria (NSO) ante el INVIMA** para venderse en Colombia (Decisión Andina 833). El INVIMA publica alertas contra productos sin NSO y pide a los comercializadores abstenerse de publicitarlos y venderlos.

- Antes de publicar cada producto, consulta su NSO en <https://www.invima.gov.co/consulta-registros-sanitarios> y **guarda una captura** como evidencia.
- No vendas ni publiques productos sin NSO, de procedencia dudosa o sin etiqueta en español.
- Pide a tus proveedores factura y, si te la dan, copia de la NSO.
- Completa siempre ingredientes, modo de uso y advertencias en la ficha (Ley 1480, art. 50: información suficiente y veraz).

## 4. Imágenes y derechos de autor

- Usa solo fotos **tuyas** o con **autorización escrita** de la marca o proveedor. Copiar fotos de otras tiendas, Google o Instagram puede ser infracción de derechos de autor.
- El logo y la mariposa son propios del negocio; confirma que quien los diseñó te cedió los derechos.
- Las fuentes del sitio (Playfair Display, Inter y Playball) tienen licencia libre (SIL OFL) y se pueden usar comercialmente.
- El panel admin ahora recuerda esto al subir fotos y pide describirlas (texto alternativo).

## 5. Procesos que la ley te exige operar (el código no los hace solo)

- **Radicado de PQR** (Ley 2439 de 2024, art. 50-g): cada petición, queja o reclamo debe recibir un número de radicado con fecha y hora y permitir seguimiento. Sugerencia mínima: una hoja de cálculo con `ZOAR-2026-0001`, fecha/hora, cliente, tema, estado y respuesta; responder el radicado por WhatsApp o correo.
- **Retracto:** atender las solicitudes dentro de 5 días hábiles de la entrega y devolver el dinero en máximo 15 días calendario.
- **Datos personales:** responder consultas en 10 días hábiles y reclamos en 15 días hábiles; conservar la conversación de WhatsApp como prueba de la autorización; no usar los datos para promociones sin autorización expresa.
- **Plazo de entrega:** informar el plazo antes del pago; máximo 30 días calendario si no se pactó otro.
- Informar siempre el **precio total** (con impuestos y envío) y los medios de pago antes de cobrar.
- Si eres responsable de IVA, factura electrónica y obligaciones tributarias: consúltalo con tu contador (no lo cubre el sitio).

## 6. Registro Nacional de Bases de Datos (RNBD)

Solo deben inscribirse las sociedades y entidades sin ánimo de lucro con activos totales superiores a 100.000 UVT; las personas naturales están excluidas del registro (pero siguen obligadas a cumplir la Ley 1581: política, autorización y atención de derechos). Confirma tu caso con tu contador o abogado.

## 7. Si algún día agregas analítica, píxeles o publicidad

Hoy el sitio **no** usa Google Analytics, Meta Pixel ni similares (verificado en el código), por eso no hay aviso de cookies. Si activas cualquiera de ellos (incluido «Web Analytics» desde el panel de tu hosting), debes: pedir autorización **antes** de activarlos, ofrecer «Rechazar», actualizar `/cookies` y `/privacidad`.

## 8. Seguridad (otros riesgos detectados)

- **Dependencia `xlsx` 0.18.5** (importación de inventario): tiene vulnerabilidades conocidas (prototype pollution CVE-2023-30533 y ReDoS CVE-2024-22363) corregidas solo en versiones nuevas que SheetJS no publica en npm. Solo la usa el panel autenticado, pero conviene migrar a la versión del CDN de SheetJS o a otra librería.
- Las **acciones del panel (`lib/actions/*`) no verifican sesión en el código**; dependen de las políticas RLS de Supabase. Revisa que todas las tablas tengan RLS activa y que anónimos solo puedan **leer** lo público.
- Activa verificación en dos pasos en tu cuenta de Supabase y de tu hosting; usa una contraseña única y fuerte para el panel.
- Se agregaron cabeceras de seguridad en `next.config.mjs`. Considera ocultar el enlace «Administración» del menú público.
- Confirma que el sitio se sirve por **HTTPS** y que `NEXT_PUBLIC_SITE_URL` empieza por `https://`.

## 9. Revisión por un abogado (recomendado)

Pídele que revise especialmente: (a) la redacción del retracto frente a productos de «uso personal» (la excepción del art. 47 se interpreta de forma restrictiva; hoy la política no la usa como negativa automática); (b) la autorización por conducta inequívoca para datos personales en WhatsApp; (c) transmisión/transferencia internacional de datos a proveedores (Supabase, hosting); (d) si debes inscribirte en el RNBD o designar un oficial de protección de datos.

*Nota:* en agosto de 2025 el Gobierno radicó un proyecto de ley para actualizar la Ley 1581 de 2012. Revisa si ya fue aprobado antes de publicar y actualiza `/privacidad` si cambia algo.
