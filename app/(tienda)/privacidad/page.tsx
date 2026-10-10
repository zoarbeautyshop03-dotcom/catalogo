import type { Metadata } from 'next'
import Link from 'next/link'
import PaginaLegal, { BloqueVendedor } from '@/components/PaginaLegal'
import { getDatosNegocio } from '@/lib/negocio'

export const metadata: Metadata = {
  title: 'Política de privacidad y tratamiento de datos personales | Zoar Beauty Shop',
  description: 'Cómo Zoar Beauty Shop trata tus datos personales y cómo puedes ejercer tus derechos.',
}

export const revalidate = 3600

export default async function PrivacidadPage() {
  const datos = await getDatosNegocio()
  const canal = datos.email ?? 'nuestro WhatsApp'

  return (
    <PaginaLegal titulo="Política de privacidad y tratamiento de datos personales" actualizado="7 de octubre de 2026" datos={datos}>
      <p>
        En {datos.nombreComercial} respetamos tu privacidad. Esta política explica qué datos personales tratamos, para qué, con quién los compartimos y cómo
        puedes ejercer tus derechos. Se expide conforme a la Ley 1581 de 2012 (protección de datos personales), el Decreto 1074 de 2015 (que compila el
        Decreto 1377 de 2013) y el artículo 15 de la Constitución Política de Colombia.
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <BloqueVendedor datos={datos} />

      <h2>2. Qué datos tratamos y cómo los obtenemos</h2>
      <ul>
        <li>
          <strong>Datos que tú nos das al escribirnos o hacer un pedido por WhatsApp:</strong> tu nombre, tu número de WhatsApp, ciudad, dirección y datos de
          entrega, los productos que pides y cualquier información que decidas escribirnos.
        </li>
        <li>
          <strong>Datos técnicos de navegación:</strong> como cualquier sitio web, el servicio que lo aloja puede registrar tu dirección IP, tipo de navegador y
          las páginas solicitadas, con fines de seguridad y funcionamiento.
        </li>
        <li>
          <strong>Tu carrito:</strong> se guarda únicamente en tu propio dispositivo (ver <Link href="/cookies">Política de cookies</Link>). No lo recibimos
          hasta que decides enviarnos el pedido por WhatsApp.
        </li>
        <li>
          <strong>Panel administrativo:</strong> el correo y la contraseña del personal autorizado que administra el catálogo. No aplica a los visitantes.
        </li>
      </ul>
      <p>
        No solicitamos datos sensibles (salud, origen racial, orientación sexual, convicciones, datos biométricos, etc.). Este sitio no procesa pagos ni recibe
        datos de tarjetas: por favor no nos envíes por chat el número completo de tu tarjeta ni claves.
      </p>

      <h2>3. Para qué usamos tus datos (finalidades)</h2>
      <ul>
        <li>Responder tus consultas y asesorarte sobre los productos.</li>
        <li>Gestionar tu pedido: confirmar disponibilidad, precio total, medio de pago, entrega y facturación o soporte de la compra.</li>
        <li>Atender solicitudes de retracto, garantía, cambios, devoluciones, peticiones, quejas y reclamos.</li>
        <li>Cumplir obligaciones legales, contables y tributarias.</li>
        <li>Mantener la seguridad y el buen funcionamiento del sitio.</li>
      </ul>
      <p>
        Solo usaremos tus datos para enviarte promociones u ofertas si nos lo autorizas de forma expresa, y podrás retirar esa autorización cuando quieras. No
        vendemos tus datos.
      </p>

      <h2>4. Autorización</h2>
      <p>
        Antes de enviar tu pedido o escribirnos por WhatsApp te informamos en el sitio sobre esta política. Al continuar y escribirnos, das tu autorización
        previa, expresa e informada para tratar tus datos conforme a las finalidades descritas. Conservamos la conversación como prueba de la autorización y de
        la gestión del pedido. Puedes revocar tu autorización en cualquier momento, salvo cuando exista un deber legal o contractual de conservar la información.
      </p>

      <h2>5. Con quién compartimos tus datos</h2>
      <p>Solo con quienes son necesarios para prestarte el servicio, y bajo el deber de proteger la información:</p>
      <ul>
        <li>
          <strong>Proveedores tecnológicos (encargados del tratamiento):</strong> el servicio que aloja este sitio web, Supabase (base de datos y autenticación
          del panel) y Cloudinary o ImageKit (almacenamiento de imágenes de productos). Algunos de ellos pueden operar servidores fuera de Colombia, por lo que
          tus datos pueden ser transmitidos o transferidos al exterior para esos fines.
        </li>
        <li>
          <strong>WhatsApp (Meta):</strong> cuando nos escribes, la conversación se rige también por los términos y la política de privacidad de WhatsApp.
        </li>
        <li>
          <strong>Empresas de transporte o mensajería:</strong> cuando tu pedido se envía, les compartimos nombre, teléfono y dirección de entrega.
        </li>
        <li>
          <strong>Autoridades:</strong> cuando una norma o una orden de autoridad competente lo exija.
        </li>
      </ul>

      <h2>6. Tus derechos como titular</h2>
      <ul>
        <li>Conocer, actualizar y rectificar tus datos personales.</li>
        <li>Solicitar prueba de la autorización que nos diste.</li>
        <li>Ser informado, previa solicitud, del uso que se ha dado a tus datos.</li>
        <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC) por infracciones a la ley.</li>
        <li>Revocar la autorización y/o solicitar la supresión de tus datos cuando no se respeten los principios, derechos y garantías legales.</li>
        <li>Acceder de forma gratuita a tus datos personales que hayan sido objeto de tratamiento.</li>
      </ul>

      <h2>7. Cómo ejercer tus derechos</h2>
      <p>
        Escríbenos a {canal} indicando tu nombre, un medio para responderte y qué solicitas. Si es una consulta, la responderemos en un máximo de diez (10) días
        hábiles, prorrogables por cinco (5) más si te avisamos el motivo. Si es un reclamo (corrección, actualización, supresión o revocatoria), lo atenderemos en
        un máximo de quince (15) días hábiles, prorrogables por ocho (8) más; si tu reclamo está incompleto, te pediremos que lo completes. Antes de acudir a la
        SIC debes haber agotado este trámite con nosotros.
      </p>

      <h2>8. Seguridad y conservación</h2>
      <p>
        Aplicamos medidas técnicas y organizativas razonables para proteger tus datos (acceso restringido y con autenticación al panel, conexión cifrada y
        proveedores con controles de seguridad). Ningún sistema es infalible, por lo que no podemos garantizar seguridad absoluta. Conservamos tus datos solo
        durante el tiempo necesario para cumplir las finalidades descritas y las obligaciones legales aplicables (por ejemplo, soportes contables y tributarios).
      </p>

      <h2>9. Menores de edad</h2>
      <p>
        Este sitio no está dirigido a menores de 18 años y no recolectamos datos de niños, niñas o adolescentes de forma intencional. Si eres menor, pide a tu
        padre, madre o representante legal que realice la compra. Si crees que un menor nos entregó datos, escríbenos para eliminarlos.
      </p>

      <h2>10. Cambios a esta política</h2>
      <p>
        Podemos actualizar esta política. Publicaremos la versión vigente en esta página con su fecha de actualización y, si el cambio es sustancial,
        avisaremos por los canales disponibles.
      </p>

      <h2>11. Documentos relacionados</h2>
      <p>
        <Link href="/terminos">Términos y condiciones</Link> · <Link href="/cookies">Política de cookies</Link> ·{' '}
        <Link href="/devoluciones">Retracto, garantía y devoluciones</Link>
      </p>
    </PaginaLegal>
  )
}
