'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export type FilaCambio = {
  slug: string
  nombre: string
  stockActual: number | null
  stockNuevo: number | null
  precioActual: number | null
  precioNuevo: number | null
}

type ResultadoPrevisualizacion = {
  ok: boolean
  error?: string
  cambios?: FilaCambio[]
  noReconocidos?: string[]
  sinCambios?: number
}

export default function InventarioPage() {
  const router = useRouter()
  const [estado, setEstado] = useState<ResultadoPrevisualizacion>({ ok: true })
  const [cargando, setCargando] = useState(false)
  const [confirmando, setConfirmando] = useState(false)

  async function handlePrevisualizar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCargando(true)
    setEstado({ ok: true })

    try {
      const form = e.currentTarget
      const archivo = form.elements.namedItem('archivo') as HTMLInputElement | null
      if (!archivo?.files?.[0]) {
        setEstado({ ok: false, error: 'Selecciona un archivo primero.' })
        return
      }

      const formData = new FormData(form)
      const response = await fetch('/api/admin/inventario/previsualizar', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
      })

      const data = await leerRespuesta<ResultadoPrevisualizacion>(response)
      if (!response.ok) {
        setEstado({ ok: false, error: data.error ?? 'No pude procesar el archivo.' })
        return
      }

      setEstado(data)
    } catch {
      setEstado({
        ok: false,
        error: 'No se pudo conectar con el servidor. Recarga la página e inténtalo nuevamente.',
      })
    } finally {
      setCargando(false)
    }
  }

  async function handleConfirmar() {
    const cambios = estado.cambios ?? []
    if (cambios.length === 0) return

    setConfirmando(true)
    setEstado((actual) => ({ ...actual, error: undefined }))

    try {
      const response = await fetch('/api/admin/inventario/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ cambios }),
      })

      const data = await leerRespuesta<{ error?: string }>(response)
      if (!response.ok) {
        setEstado((actual) => ({ ...actual, error: data.error ?? 'No se pudieron aplicar los cambios.' }))
        return
      }

      router.push('/admin/inventario?ok=1')
      router.refresh()
    } catch {
      setEstado((actual) => ({
        ...actual,
        error: 'No se pudo conectar con el servidor. Los cambios no se aplicaron.',
      }))
    } finally {
      setConfirmando(false)
    }
  }

  const mostrandoFormulario = !estado.cambios
  const hayCambios = (estado.cambios?.length ?? 0) > 0

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

      {mostrandoFormulario && (
        <form onSubmit={handlePrevisualizar} className="bg-white rounded-2xl shadow-sm p-5 max-w-md">
          <label className="block text-sm mb-2 text-gray-600">Sube tu Excel o CSV actualizado</label>
          <input
            type="file"
            name="archivo"
            accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
            required
            className="text-sm"
          />
          <p className="text-xs text-gray-400 mt-2">
            No cambies la columna &quot;slug&quot; — es la que uso para reconocer cada producto.
          </p>
          <button
            type="submit"
            disabled={cargando}
            className="mt-3 block rounded-full bg-fucsia text-white px-5 py-2 text-sm disabled:opacity-60"
          >
            {cargando ? 'Leyendo archivo...' : 'Previsualizar cambios'}
          </button>
          {estado.error && <p className="text-sm text-red-500 mt-2">{estado.error}</p>}
        </form>
      )}

      {estado.cambios && (
        <Previsualizacion
          resultado={estado}
          confirmando={confirmando}
          hayCambios={hayCambios}
          onConfirmar={handleConfirmar}
          onVolver={() => {
            setEstado({ ok: true })
            setConfirmando(false)
          }}
        />
      )}
    </div>
  )
}

function Previsualizacion({
  resultado,
  confirmando,
  hayCambios,
  onConfirmar,
  onVolver,
}: {
  resultado: ResultadoPrevisualizacion
  confirmando: boolean
  hayCambios: boolean
  onConfirmar: () => void
  onVolver: () => void
}) {
  const cambios = resultado.cambios ?? []
  const noReconocidos = resultado.noReconocidos ?? []

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

      {resultado.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{resultado.error}</p>
      )}

      <div className="flex flex-wrap gap-3">
        {hayCambios && (
          <button
            type="button"
            disabled={confirmando}
            onClick={onConfirmar}
            className="rounded-full bg-fucsia text-white px-6 py-2.5 font-medium disabled:opacity-60"
          >
            {confirmando ? 'Aplicando...' : 'Confirmar y actualizar'}
          </button>
        )}
        <button
          type="button"
          disabled={confirmando}
          onClick={onVolver}
          className="rounded-full border border-gray-200 bg-white px-6 py-2.5 text-gray-700 disabled:opacity-60"
        >
          Elegir otro archivo
        </button>
      </div>
    </div>
  )
}

async function leerRespuesta<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return (await response.json()) as T
  }

  const texto = await response.text()
  return ({ error: texto || 'Respuesta inesperada del servidor.' } as T)
}
