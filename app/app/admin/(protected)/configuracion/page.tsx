import { createServerSupabase } from '@/lib/supabase/server'
import { guardarConfiguracion } from '@/lib/actions/configuracion'

export const dynamic = 'force-dynamic'

export default async function ConfiguracionPage() {
  const supabase = createServerSupabase()
  const { data: config } = await supabase.from('configuracion').select('*').eq('id', 1).maybeSingle()

  return (
    <div>
      <h1 className="font-display text-2xl mb-6">Configuración</h1>
      <form action={guardarConfiguracion} className="bg-white rounded-2xl shadow-sm p-5 space-y-4 max-w-lg">
        <Campo label="Nombre de la tienda" name="nombre_tienda" defaultValue={config?.nombre_tienda ?? 'ZOAR BEAUTY SHOP'} />
        <Campo label="WhatsApp (con indicativo, sin +)" name="whatsapp_numero" defaultValue={config?.whatsapp_numero ?? ''} />
        <Campo label="Instagram" name="instagram" defaultValue={config?.instagram ?? ''} />
        <Campo label="Facebook" name="facebook" defaultValue={config?.facebook ?? ''} />
        <Campo label="TikTok" name="tiktok" defaultValue={config?.tiktok ?? ''} />
        <Campo label="Horarios de atención" name="horarios" defaultValue={config?.horarios ?? ''} />
        <Campo label="Información de entrega" name="info_entrega" defaultValue={config?.info_entrega ?? ''} />
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" name="mostrar_agotados" defaultChecked={config?.mostrar_agotados ?? true} />
          Mostrar productos agotados en el catálogo público
        </label>
        <button className="rounded-full bg-fucsia text-white px-6 py-2.5 font-medium">Guardar</button>
      </form>
      <p className="text-xs text-gray-400 mt-3 max-w-lg">
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
      <span className="text-gray-600">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-1 w-full rounded-lg border border-rosa-pastel px-3 py-2"
      />
    </label>
  )
}
