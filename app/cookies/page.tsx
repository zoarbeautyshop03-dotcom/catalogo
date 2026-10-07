import type { Metadata } from 'next'
import Link from 'next/link'
import PaginaLegal from '@/components/PaginaLegal'
import { getDatosNegocio } from '@/lib/negocio'

export const metadata: Metadata = {
  title: 'Política de cookies | Zoar Beauty Shop',
  description: 'Qué cookies y almacenamiento local usa Zoar Beauty Shop y para qué.',
}

export const revalidate = 3600

export default async function CookiesPage() {
  const datos = await getDatosNegocio()

  return (
    <PaginaLegal titulo="Política de cookies" actualizado="7 de octubre de 2026" datos={datos}>
      <p>
        Las cookies son pequeños archivos que un sitio guarda en tu navegador. También existe el «almacenamiento local», que cumple una función parecida. Esta
        página explica qué usamos en {datos.nombreComercial} y para qué.
      </p>

      <h2>1. Lo que usamos</h2>
      <ul>
        <li>
          <strong>Carrito de compras (almacenamiento local, clave «zoar-carrito»):</strong> guarda en tu dispositivo los productos que agregas para que no se
          pierdan si cierras la página. Es técnico y necesario para que el carrito funcione, no se envía a nuestros servidores y se conserva hasta que vacíes el
          carrito o borres los datos del navegador.
        </li>
        <li>
          <strong>Cookies de sesión del panel administrativo:</strong> se crean solo cuando el personal autorizado inicia sesión en la sección de administración.
          Son estrictamente necesarias para la autenticación y no se usan con visitantes de la tienda.
        </li>
      </ul>

      <h2>2. Lo que no usamos</h2>
      <p>
        En la tienda pública no usamos cookies de analítica o medición, de publicidad ni de seguimiento, no usamos píxeles de redes sociales y no incrustamos
        contenido de terceros (mapas, videos o botones sociales). Las fuentes tipográficas se sirven desde este mismo sitio.
      </p>

      <h2>3. ¿Necesito aceptar cookies?</h2>
      <p>
        No. Solo usamos almacenamiento técnico necesario para que el carrito funcione y no lo empleamos para tratar datos personales ni para perfilarte, por lo
        que no te mostramos un aviso para aceptar o rechazar cookies. Si en el futuro agregamos cookies de medición o publicidad, te pediremos tu autorización
        previa antes de activarlas, podrás rechazarlas y actualizaremos esta página.
      </p>

      <h2>4. Servicios de terceros</h2>
      <p>
        Al tocar los botones de WhatsApp, Instagram, Facebook o TikTok sales de este sitio y pasas a las plataformas de esos terceros, que aplican sus propias
        políticas de privacidad y cookies. Además, el servicio que aloja el sitio puede registrar datos técnicos (como la dirección IP) en sus registros de
        seguridad; consulta nuestra <Link href="/privacidad">Política de privacidad</Link>.
      </p>

      <h2>5. Cómo borrar o bloquear estos datos</h2>
      <p>
        Puedes borrar tu carrito con el botón «Vaciar carrito» o eliminar los datos del sitio desde la configuración de tu navegador. Si bloqueas el
        almacenamiento local, la tienda seguirá funcionando, pero tu carrito no se conservará al cerrar la página.
      </p>
    </PaginaLegal>
  )
}
