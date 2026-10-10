import type { Metadata } from 'next'
import Link from 'next/link'
import PaginaLegal, { BloqueVendedor } from '@/components/PaginaLegal'
import { getDatosNegocio } from '@/lib/negocio'

export const metadata: Metadata = {
  title: 'Términos y condiciones | Zoar Beauty Shop',
  description: 'Condiciones de uso del sitio y de compra de Zoar Beauty Shop.',
}

export const revalidate = 3600

export default async function TerminosPage() {
  const datos = await getDatosNegocio()
  const canal = datos.email ?? 'nuestro WhatsApp'

  return (
    <PaginaLegal titulo="Términos y condiciones" actualizado="7 de octubre de 2026" datos={datos}>
      <p>
        Al usar este sitio y hacer pedidos a {datos.nombreComercial} aceptas estos términos. Si no estás de acuerdo, por favor no uses el sitio. Estos términos se
        suman a tus derechos como consumidor, que nada en este documento limita (Ley 1480 de 2011, Estatuto del Consumidor).
      </p>

      <h2>1. Quién vende</h2>
      <BloqueVendedor datos={datos} />

      <h2>2. Cómo funciona la compra</h2>
      <p>
        El sitio es un catálogo con un carrito que arma un mensaje de pedido para enviarlo por WhatsApp. Agregar productos al carrito o enviar el mensaje no
        completa la compra por sí solo: la compra se perfecciona cuando te confirmamos por WhatsApp la disponibilidad, el precio total (producto, impuestos
        aplicables y costo de envío), el plazo de entrega y el medio de pago, y tú aceptas esas condiciones. Antes de pagar siempre recibirás esa información.
      </p>
      <p>Para comprar debes ser mayor de 18 años y tener capacidad legal. Si eres menor, la compra debe hacerla tu representante legal.</p>

      <h2>3. Precios y promociones</h2>
      <ul>
        <li>Los precios se muestran en pesos colombianos (COP).</li>
        <li>El precio total que pagarás, con impuestos y envío, se te informa antes de confirmar el pago.</li>
        <li>
          Si un producto aparece con descuento, el «precio anterior» es el valor al que se ofreció antes. Las ofertas aplican mientras estén publicadas y hasta
          agotar existencias, salvo que se indique otra fecha.
        </li>
        <li>
          Si detectamos un error evidente en un precio publicado, te lo informaremos antes de confirmar el pedido para que decidas si deseas continuar.
        </li>
      </ul>

      <h2>4. Disponibilidad</h2>
      <p>
        Las existencias pueden cambiar. Si un producto de tu pedido no está disponible te lo informaremos de inmediato y, si lo prefieres, podemos acordar una
        segunda fecha de entrega. Si el producto no está disponible o la entrega supera el plazo pactado, puedes terminar el contrato y recibir la devolución
        de todo lo pagado, sin retenciones, en un máximo de quince (15) días calendario.
      </p>

      <h2>5. Medios de pago</h2>
      <p>
        {datos.mediosPago
          ? `Medios de pago disponibles: ${datos.mediosPago}.`
          : 'Los medios de pago disponibles se te informan por WhatsApp al confirmar tu pedido.'}{' '}
        Este sitio no recibe pagos ni datos de tarjetas. Confirma siempre con nosotros por nuestros canales oficiales los datos de pago antes de transferir.
      </p>

      <h2>6. Envíos y entrega</h2>
      <p>{datos.infoEntrega ?? 'La cobertura, el costo de envío y el plazo estimado de entrega se te informan por WhatsApp antes de que pagues.'}</p>
      <p>
        Entregaremos tu pedido dentro del plazo que aceptes antes de pagar. Si no se pacta uno distinto, el plazo máximo es de treinta (30) días calendario
        contados desde el día siguiente a tu pedido. Revisa el paquete al recibirlo y avísanos si llega abierto, dañado o incompleto.
      </p>

      <h2>7. Retracto, garantía y devoluciones</h2>
      <p>
        Tienes derecho de retracto en las compras a distancia y garantía legal sobre los productos. Las condiciones, plazos y el procedimiento para solicitar la
        devolución de tu dinero están en la página <Link href="/devoluciones">Retracto, garantía y devoluciones</Link>.
      </p>

      <h2>8. Información de los productos</h2>
      <p>
        Mostramos la información que suministran los fabricantes y proveedores (descripciones, ingredientes, modo de uso y advertencias). Las fotografías son
        referenciales: el color, tamaño o empaque pueden variar levemente. Lee siempre la etiqueta antes de usar un producto. Si tienes piel sensible, alergias o
        estás en tratamiento, haz una prueba en una zona pequeña y consulta a un profesional de la salud. La información del sitio no es consejo médico ni
        promete resultados terapéuticos.
      </p>

      <h2>9. Peticiones, quejas y reclamos</h2>
      <p>
        Puedes radicar una petición, queja o reclamo por WhatsApp o escribiendo a {canal}. A cada solicitud le asignamos un número de radicado con fecha y hora
        y te permitimos hacerle seguimiento. Si no estás conforme con nuestra respuesta, puedes acudir a la Superintendencia de Industria y Comercio (
        <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer">www.sic.gov.co</a>).
      </p>

      <h2>10. Propiedad intelectual</h2>
      <p>
        El nombre, logo, diseño, textos y demás elementos propios del sitio pertenecen a su titular y no pueden copiarse ni usarse sin autorización. Los nombres
        y marcas de los productos pertenecen a sus respectivos dueños y se muestran solo para identificar los productos que vendemos. Si crees que algún
        contenido del sitio infringe tus derechos de autor o de marca, escríbenos a {canal} indicando cuál es y por qué, y lo revisaremos de inmediato para
        retirarlo si corresponde.
      </p>

      <h2>11. Uso del sitio</h2>
      <p>
        No puedes usar el sitio para fines ilícitos, intentar acceder a áreas restringidas, interferir con su funcionamiento ni extraer su contenido de forma
        masiva. Podemos suspender el acceso a quien lo haga.
      </p>

      <h2>12. Datos personales</h2>
      <p>
        El tratamiento de tus datos se rige por nuestra <Link href="/privacidad">Política de privacidad</Link> y el uso de almacenamiento local por la{' '}
        <Link href="/cookies">Política de cookies</Link>.
      </p>

      <h2>13. Ley aplicable y cambios</h2>
      <p>
        Estos términos se rigen por las leyes de la República de Colombia. Cualquier controversia podrá resolverse ante las autoridades de protección al
        consumidor o los jueces competentes. Podemos actualizar estos términos; los cambios aplican a los pedidos posteriores a su publicación, con la fecha de
        actualización indicada arriba.
      </p>
    </PaginaLegal>
  )
}
