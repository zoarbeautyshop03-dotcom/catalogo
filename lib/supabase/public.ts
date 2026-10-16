import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.warn('Faltan NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local')
}

// Cliente de solo lectura publica (sin sesion) para el catalogo. Para el panel
// admin con login usar lib/supabase/server.ts o lib/supabase/client.ts en su lugar.
//
// Cache de datos de la tienda:
// - Next.js guarda las respuestas de Supabase para que la tienda cargue rapido.
//   Aqui indicamos que cada respuesta se renueve como maximo cada 60 segundos,
//   para que una respuesta vieja (por ejemplo vacia) no se quede guardada.
// - El encabezado "x-zoar-cache" forma parte de la llave de ese cache. Cambiar
//   su valor ("v2" -> "v3") descarta de golpe todas las respuestas guardadas.
//   Util si algun dia la tienda queda mostrando datos viejos.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: { 'x-zoar-cache': 'v2' },
    fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 60 } }),
  },
})
