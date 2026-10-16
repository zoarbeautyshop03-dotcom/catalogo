import { createServerSupabase } from '@/lib/supabase/server'
import { guardarConfiguracion } from '@/lib/actions/configuracion'
import { SelectorImagenesPortada } from '@/components/admin/SelectorImagenesPortada'
import { esUrlPermitida } from '@/lib/imagenes-url'

export const dynamic = 'force-dynamic'

export default async function ConfiguracionPage() {
  const supabase = createServerSupabase()
  const { data: config } = await supabase.from('configuracion').select('*').eq('id', 1).maybeSingle()

  // ¿Ya se corrió supabase/portada-imagen.sql? Si todavía no, se avisa aquí en
  // el panel en vez de dejar que el guardado falle sin explicación.
  const { error: errorColumna } = await supabase.from('configuracion').select('hero_imagenes').limit(1)
  const faltaColumna = Boolean(errorColumna)

  // Fotos que ya están subidas a los productos, para poder elegir sin salir del
  // panel.
  const { data: imagenes } = await supabase
    .from('producto_imagenes')
    .select('url, texto_alt')
    .order('es_principal', { ascending: false })
    .order('orden')
    .limit(80)

  const sugeridas: { url: string; alt: string }[] = []
  const vistas = new Set<string>()
  for (const imagen of imagenes ?? []) {
    const url = String(imagen.url ?? '').trim()
    if (!url || vistas.has(url) || !esUrlPermitida(url)) continue
    vistas.add(url)
    sugeridas.push({ url, alt: imagen.texto_alt ?? '' })
    if (sugeridas.length >= 12) break
  }

  return (
    <div>
      <header className="mb-6">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-lavender-magenta-700"><span aria-hidden="true" className="h-px w-6 bg-dorado" />Cuenta</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-lavender-magenta-950">Configuración</h1>
        <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">Datos de contacto y preferencias de la tienda.</p>
        <div className="hairline-gold mt-5" aria-hidden="true" />
      </header>
      <form action={guardarConfiguracion} className="max-w-2xl space-y-4 rounded-boutique-lg border border-lavender-magenta-100 bg-white p-5 shadow-card sm:p-6">
        <Campo label="Nombre de la tienda" name="nombre_tienda" defaultValue={config?.nombre_tienda ?? 'ZOAR BEAUTY SHOP'} />
        <Campo label="WhatsApp (con indicativo, sin +)" name="whatsapp_numero" defaultValue={config?.whatsapp_numero ?? ''} />
        <Campo label="Instagram" name="instagram" defaultValue={config?.instagram ?? ''} />
        <Campo label="Facebook" name="facebook" defaultValue={config?.facebook ?? ''} />
        <Campo label="TikTok" name="tiktok" defaultValue={config?.tiktok ?? ''} />
        <Campo label="Horarios de atención" name="horarios" defaultValue={config?.horarios ?? ''} />
        <Campo label="Información de entrega" name="info_entrega" defaultValue={config?.info_entrega ?? ''} />
        <label className="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2.5 text-sm text-gray-600">
          <input type="checkbox" name="mostrar_agotados" defaultChecked={config?.mostrar_agotados ?? true} className="h-4 w-4 accent-lavender-magenta-600" />
          Mostrar productos agotados en el catálogo público
        </label>
        <SelectorImagenesPortada
          valorInicial={config?.hero_imagenes ?? []}
          sugeridas={sugeridas}
          faltaColumna={faltaColumna}
        />
        <button className="inline-flex items-center gap-2 rounded-full bg-lavender-magenta-700 px-6 py-2.5 font-semibold text-white shadow-card transition-all duration-200 ease-boutique hover:-translate-y-0.5 hover:bg-lavender-magenta-800">Guardar</button>
      </form>
      <p className="text-xs leading-5 text-gray-400 mt-3 max-w-lg">
        Nota: el catálogo público (Fase 3) todavía lee el número de WhatsApp desde una
        variable de entorno, no desde aquí — conectarlo a esta tabla es un ajuste
        pequeño pendiente para que puedas cambiarlo sin volver a desplegar.
      </p>
    </div>
  )
}

function Campo({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-gray-600">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-1.5 w-full rounded-2xl border border-rosa-pastel bg-white px-3 py-2 text-sm text-gray-700 transition-colors duration-200 ease-boutique focus:border-lavender-magenta-400 focus:outline-none"
      />
    </label>
  )
}
