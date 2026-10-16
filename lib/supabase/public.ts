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
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
