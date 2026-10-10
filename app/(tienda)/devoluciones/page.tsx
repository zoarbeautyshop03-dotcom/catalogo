import type { Metadata } from 'next'
import Link from 'next/link'
import PaginaLegal from '@/components/PaginaLegal'
import { getDatosNegocio } from '@/lib/negocio'

export const metadata: Metadata = {
  title: 'Retracto, garantía y devoluciones | Zoar Beauty Shop',
  description: 'Cómo ejercer el derecho de retracto, la garantía legal y la devolución de tu dinero en Zoar Beauty Shop.',
}

export const revalidate = 3600

export default async function DevolucionesPage() {
  const datos = await getDatosNegocio()
  const canal = datos.email ?? 'nuestro WhatsApp'

  return (
    <PaginaLegal titulo="Retracto, garantía y devoluciones" actualizado="7 de octubre de 2026" datos={datos}>
      <p>
        Esta política explica cómo puedes arrepentirte de una compra, qué hacer si un producto llega con problemas y cómo te devolvemos tu dinero. Se basa en la
        Ley 1480 de 2011 (Estatuto del Consumidor) y la Ley 2439 de 2024 sobre comercio electrónico.
      </p>

      <h2>1. Derecho de retracto (arrepentimiento)</h2>
      <p>
        Como tus compras se hacen a distancia (sitio web y WhatsApp), puedes retractarte sin tener que dar explicaciones dentro de los{' '}
        <strong>cinco (5) días hábiles siguientes a la entrega</strong> del producto.
      </p>
      <ul>
        <li>Para ejercerlo, escríbenos por WhatsApp o a {canal} diciendo que deseas retractarte e indicando tu nombre y el pedido.</li>
        <li>
          El producto debe devolverse en las mismas condiciones en que lo recibiste: sin abrir ni usar, con su empaque, sellos y etiquetas.
        </li>
        <li>Los costos de transporte de la devolución del producto son a cargo de quien se retracta.</li>
      </ul>
      <p>
        La ley exceptúa del retracto algunos casos, entre ellos los bienes de uso personal, los bienes que por su naturaleza no pueden devolverse o pueden
        deteriorarse rápidamente y los bienes personalizados. Si tu producto de cuidado personal ya fue abierto o usado, te explicaremos si tu caso está
        cubierto. Esto no afecta tu derecho a la garantía.
      </p>

      <h2>2. Devolución de tu dinero</h2>
      <p>
        Cuando ejerces el retracto y cumples lo necesario (nos das los datos correctos y completos para hacer la devolución y nos devuelves el producto), te
        devolvemos el dinero en un <strong>máximo de quince (15) días calendario</strong>, por el medio de pago que prefieras entre los que te informemos al
        momento de la solicitud (por ejemplo, el mismo medio con el que pagaste o una transferencia).
      </p>

      <h2>3. Garantía legal: producto defectuoso o diferente</h2>
      <p>
        Si el producto llega dañado, derramado, vencido, con defectos de calidad o no corresponde a lo que pediste, tienes derecho a la garantía legal: te
        ofreceremos un cambio por un producto igual o la devolución de tu dinero, conforme a la ley. Escríbenos lo antes posible por WhatsApp o a {canal} con tu
        nombre, el pedido y fotos del producto y del empaque, y conserva el empaque original. En estos casos no te cobramos el envío de la devolución.
      </p>

      <h2>4. Si tu pedido no llega o no está disponible</h2>
      <p>
        Si el producto no está disponible o la entrega supera el plazo acordado (o treinta días calendario si no se acordó otro), puedes terminar el contrato y
        te devolvemos todo lo pagado, sin retenciones, en un máximo de quince (15) días calendario.
      </p>

      <h2>5. Reversión del pago</h2>
      <p>
        Si pagaste con tarjeta u otro instrumento de pago electrónico y hubo fraude, una operación que no autorizaste, un producto que no recibiste, que no
        corresponde a lo pedido o que llegó defectuoso, también puedes pedir a tu entidad financiera la reversión del pago dentro de los cinco (5) días hábiles
        siguientes a que tengas conocimiento del hecho (artículo 51 de la Ley 1480 de 2011).
      </p>

      <h2>6. Peticiones, quejas y reclamos</h2>
      <p>
        Puedes radicar cualquier petición, queja o reclamo por WhatsApp o a {canal}. Le asignamos un número de radicado con fecha y hora, te lo informamos y
        puedes consultarnos su estado cuando quieras. Respondemos dentro de los quince (15) días hábiles siguientes a la radicación.
      </p>
      <p>
        Si no estás conforme, puedes acudir a la Superintendencia de Industria y Comercio (SIC) en{' '}
        <a href="https://www.sic.gov.co" target="_blank" rel="noopener noreferrer">
          www.sic.gov.co
        </a>
        .
      </p>

      <p>
        Consulta también los <Link href="/terminos">Términos y condiciones</Link> y la <Link href="/privacidad">Política de privacidad</Link>.
      </p>
    </PaginaLegal>
  )
}
