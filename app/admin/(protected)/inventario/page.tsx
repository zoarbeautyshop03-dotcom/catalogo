'use client'

import { useFormState, useFormStatus } from 'react-dom'
import {
  previsualizarInventario,
  confirmarImportacionInventario,
  type ResultadoPrevisualizacion,
  type ResultadoConfirmacion,
  type FilaCambio,
} from '@/lib/actions/inventario'

const ESTADO_INICIAL: ResultadoPrevisualizacion = { ok: true }

export default function InventarioPage() {
  const [estado, accionPrevisualizar] = useFormState(previsualizarInventario, ESTADO_INICIAL)

  return (
    <div>
      <h1 className="font-display text-2xl mb-2">Inventario</h1>
      <p className="text-sm text-gray-500 mb-6 max-w-lg">
        Descarga la plantilla, cambia las cantidades (y el precio si quieres) en Excel,
        y súbela aquí. Antes de aplicar nada te muestro qué va a cambiar.
      </p>

      <a
        href="/admin/inventario/plantilla"
        className="inline-block mb-6 rounded-full border border-fucsia text-fucsia px-5 py-2 text-sm font-medium"
      >
        ⬇️ Descargar plantilla (Excel)
      </a>

      {!estado.cambios && (
        <form action={accionPrevisualizar} className="bg-white rounded-2xl shadow-sm p-5 max-w-md">
          <label className="block text-sm mb-2 text-gray-600">Sube tu Excel o CSV actualizado</label>
          <input type="file" name="archivo" accept=".xlsx,.xls,.csv" required className="text-sm" />
          <p className="text-xs text-gray-400 mt-2">
            No cambies la columna &quot;slug&quot; — es la que uso para reconocer cada producto.
          </p>
          <BotonSubir />
          {estado.error && <p className="text-sm text-red-500 mt-2">{estado.error}</p>}
        </form>
      )}

      {estado.cambios && <Previsualizacion resultado={estado} />}
    </div>
  )
}

function BotonSubir() {
  const { pending } = useFormStatus()
  return (
    <button
      disabled={pending}
      className="mt-3 block rounded-full bg-fucsia text-white px-5 py-2 text-sm disabled:opacity-60"
    >
      {pending ? 'Leyendo archivo...' : 'Previsualizar cambios'}
    </button>
  )
}

function Previsualizacion({ resultado }: { resultado: ResultadoPrevisualizacion }) {
  const cambios = resultado.cambios ?? []
  const noReconocidos = resultado.noReconocidos ?? []
  const ESTADO_CONFIRMACION_INICIAL: ResultadoConfirmacion = { ok: true }
  const [estadoConfirmacion, accionConfirmar] = useFormState(
    confirmarImportacionInventario,
    ESTADO_CONFIRMACION_INICIAL
  )

  return (
    <div className="mt-2 space-y-4">
      <p className="text-sm text-gray-600">
        <strong className="text-fucsia">{cambios.length}</strong> productos van a cambiar
        {typeof resultado.sinCambios === 'number' ? `, ${resultado.sinCambios} sin cambios` : ''}
        {noReconocidos.length > 0 ? `, ${noReconocidos.length} no reconocidos` : ''}.
      </p>

      {cambios.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-rosa-pastel/30 text-left text-gray-600">
              <tr>
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Stock</th>
                <th className="px-4 py-2">Precio</th>
              </tr>
            </thead>
            <tbody>
              {cambios.map((c) => (
                <tr key={c.slug} className="border-t border-rosa-pastel/40">
                  <td className="px-4 py-2">{c.nombre}</td>
                  <td className="px-4 py-2">
                    {c.stockNuevo !== null ? (
                      <span>
                        {c.stockActual} → <strong className="text-fucsia">{c.stockNuevo}</strong>
                      </span>
                    ) : (
                      <span className="text-gray-300">sin cambio</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {c.precioNuevo !== null ? (
                      <span>
                        {c.precioActual} → <strong className="text-fucsia">{c.precioNuevo}</strong>
                      </span>
                    ) : (
                      <span className="text-gray-300">sin cambio</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {noReconocidos.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">
            No reconocidos (el slug no coincide con ningún producto):
          </p>
          <p className="text-xs text-gray-500 break-words">{noReconocidos.join(', ')}</p>
        </div>
      )}

      {cambios.length > 0 && (
        <form action={accionConfirmar}>
          <input type="hidden" name="cambios" value={JSON.stringify(cambios satisfies FilaCambio[])} />
          <ConfirmarBoton />
          {estadoConfirmacion.error && (
            <p className="text-sm text-red-500 mt-2 max-w-md">{estadoConfirmacion.error}</p>
          )}
        </form>
      )}
    </div>
  )
}

function ConfirmarBoton() {
  const { pending } = useFormStatus()
  return (
    <button
      disabled={pending}
      className="rounded-full bg-fucsia text-white px-6 py-2.5 font-medium disabled:opacity-60"
    >
      {pending ? 'Aplicando...' : 'Confirmar y actualizar'}
    </button>
  )
}
