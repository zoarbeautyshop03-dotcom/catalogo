'use client'

import { useMemo, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import {
  actualizarInventarioMasivo,
  actualizarPrecioMasivo,
  confirmarImportacionInventario,
  previsualizarInventario,
  type FilaCambio,
  type ResultadoConfirmacion,
  type ResultadoMovimiento,
  type ResultadoPrevisualizacion,
} from '@/lib/actions/inventario'

export type InventarioProducto = {
  id: string
  nombre: string
  slug: string
  sku: string | null
  codigo_barras: string | null
  cantidad_stock: number | null
  stock_minimo: number | null
  precio: number | null
  estado_inventario: string | null
  estado_publicacion: string | null
  activo: boolean | null
  marca_id: string | null
  categoria_id: string | null
}

export type InventarioFiltro = 'todos' | 'disponibles' | 'bajo' | 'agotados'
type Opcion = { id: string; nombre: string }

const INITIAL_MOV: ResultadoMovimiento = { ok: true }
const INITIAL_IMPORT: ResultadoPrevisualizacion = { ok: true }

export default function InventarioClient({
  productos,
  marcas,
  categorias,
  resumen,
  filtroInicial,
  errorInicial,
  actualizado,
  movimientos = [],
}: {
  productos: InventarioProducto[]
  marcas: Opcion[]
  categorias: Opcion[]
  resumen: { total: number; disponibles: number; bajos: number; agotados: number }
  filtroInicial: InventarioFiltro
  errorInicial?: string
  actualizado?: boolean
  movimientos?: Array<{ id: string; producto_id: string; tipo: string; cantidad_anterior: number; cantidad_movimiento: number; cantidad_nueva: number; motivo: string | null; creado_en: string; productos?: { nombre?: string } | null }>
}) {
  const [busqueda, setBusqueda] = useState('')
  const [filtro, setFiltro] = useState<InventarioFiltro>(filtroInicial)
  const [marca, setMarca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [pagina, setPagina] = useState(1)
  const [seleccionados, setSeleccionados] = useState<Set<string>>(new Set())
  const [borradores, setBorradores] = useState<Record<string, number>>({})
  const [modo, setModo] = useState<'entrada' | 'salida' | 'establecer'>('entrada')
  const [cantidadMasiva, setCantidadMasiva] = useState('1')
  const [motivo, setMotivo] = useState('')
  const [importState, importAction] = useFormState(previsualizarInventario, INITIAL_IMPORT)
  const [massState, massAction] = useFormState(actualizarInventarioMasivo, INITIAL_MOV)
  const [priceState, priceAction] = useFormState(actualizarPrecioMasivo, INITIAL_MOV)
  const [precioMasivo, setPrecioMasivo] = useState('')

  const porId = useMemo(() => new Map(productos.map((p) => [p.id, p])), [productos])
  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    return productos.filter((p) => {
      const stock = p.cantidad_stock ?? 0
      const minimo = p.stock_minimo ?? 0
      const coincideTexto = !q || [p.nombre, p.sku, p.codigo_barras, p.slug].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
      const coincideEstado = filtro === 'todos' || (filtro === 'agotados' ? stock <= 0 : filtro === 'bajo' ? stock > 0 && stock <= minimo : stock > minimo)
      const coincideMarca = !marca || p.marca_id === marca
      const coincideCategoria = !categoria || p.categoria_id === categoria
      return coincideTexto && coincideEstado && coincideMarca && coincideCategoria
    })
  }, [productos, busqueda, filtro, marca, categoria])

  const PAGE_SIZE = 40
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE))
  const paginaSegura = Math.min(pagina, totalPaginas)
  const visibles = filtrados.slice((paginaSegura - 1) * PAGE_SIZE, paginaSegura * PAGE_SIZE)
  const idsVisibles = visibles.map((p) => p.id)
  const todosVisibles = idsVisibles.length > 0 && idsVisibles.every((id) => seleccionados.has(id))
  const tieneCambios = Object.keys(borradores).length > 0

  function cambiarFiltro(next: InventarioFiltro) {
    setFiltro(next); setPagina(1); setSeleccionados(new Set())
  }
  function seleccionarVisible(checked: boolean) {
    const next = new Set(seleccionados)
    idsVisibles.forEach((id) => checked ? next.add(id) : next.delete(id))
    setSeleccionados(next)
  }
  function setDraft(id: string, value: number) {
    if (!Number.isFinite(value) || value < 0) return
    setBorradores((prev) => ({ ...prev, [id]: Math.floor(value) }))
  }
  function descartarCambios() { setBorradores({}) }

  const cambiosRapidos: FilaCambio[] = Object.entries(borradores).map(([id, stockNuevo]) => {
    const p = porId.get(id)!
    return { id, slug: p.slug, nombre: p.nombre, sku: p.sku, stockActual: p.cantidad_stock, stockNuevo, precioActual: p.precio, precioNuevo: null }
  })

  return (
    <div className="space-y-6 pb-12">
      <header>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="eyebrow">Control de existencias</span>
            <h1 className="mt-3 font-display text-3xl font-bold text-lavender-magenta-950">Inventario</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Actualiza cantidades en segundos, aplica movimientos a varios productos y conserva Excel para cargas grandes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/inventario/plantilla" className="rounded-full border border-fucsia bg-white px-4 py-2 text-sm font-semibold text-fucsia hover:bg-rosa-pastel/30">⬇️ Excel</a>
            <a href="#importar" className="rounded-full bg-fucsia px-4 py-2 text-sm font-semibold text-white shadow-soft-pink hover:-translate-y-0.5">📊 Importar</a>
          </div>
        </div>
      </header>

      {(actualizado || massState.ok && massState !== INITIAL_MOV) && !massState.error && (
        <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 ring-1 ring-green-100">✓ Inventario actualizado correctamente.</div>
      )}
      {errorInicial && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">No pude cargar el inventario: {errorInicial}</div>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Resumen label="Productos" value={resumen.total} icon="📦" />
        <Resumen label="Disponibles" value={resumen.disponibles} icon="🟢" />
        <Resumen label="Bajo mínimo" value={resumen.bajos} icon="⚠️" />
        <Resumen label="Agotados" value={resumen.agotados} icon="🔴" />
      </div>

      <section className="premium-card p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_180px_180px]">
          <label className="relative block">
            <span className="sr-only">Buscar</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">🔎</span>
            <input value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }} placeholder="Buscar nombre, SKU, código o slug..." className="w-full rounded-2xl border border-rosa-pastel bg-white py-3 pl-11 pr-4 text-sm text-gray-700 outline-none focus:border-fucsia" />
          </label>
          <select value={marca} onChange={(e) => { setMarca(e.target.value); setPagina(1) }} className="rounded-2xl border border-rosa-pastel bg-white px-4 py-3 text-sm text-gray-600 outline-none focus:border-fucsia">
            <option value="">Todas las marcas</option>
            {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
          <select value={categoria} onChange={(e) => { setCategoria(e.target.value); setPagina(1) }} className="rounded-2xl border border-rosa-pastel bg-white px-4 py-3 text-sm text-gray-600 outline-none focus:border-fucsia">
            <option value="">Todas las categorías</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Filtro label={`Todos · ${resumen.total}`} activo={filtro === 'todos'} onClick={() => cambiarFiltro('todos')} />
          <Filtro label={`Disponibles · ${resumen.disponibles}`} activo={filtro === 'disponibles'} onClick={() => cambiarFiltro('disponibles')} />
          <Filtro label={`Bajo mínimo · ${resumen.bajos}`} activo={filtro === 'bajo'} onClick={() => cambiarFiltro('bajo')} />
          <Filtro label={`Agotados · ${resumen.agotados}`} activo={filtro === 'agotados'} onClick={() => cambiarFiltro('agotados')} />
        </div>
      </section>

      {seleccionados.size > 0 && (
        <section className="rounded-[28px] bg-lavender-magenta-950 p-4 text-white shadow-soft-pink sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-lavender-magenta-200">Acciones masivas</p>
              <p className="mt-1 text-lg font-semibold">{seleccionados.size} productos seleccionados</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-end">
              <form action={massAction} className="contents">
                <input type="hidden" name="ids" value={[...seleccionados].join(',')} />
                <div>
                  <label className="mb-1 block text-[11px] text-lavender-magenta-200">Movimiento</label>
                  <select name="modo" value={modo} onChange={(e) => setModo(e.target.value as typeof modo)} className="rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-gray-700">
                    <option value="entrada">+ Entrada</option><option value="salida">− Salida</option><option value="establecer">= Establecer stock</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-lavender-magenta-200">Cantidad</label>
                  <input name="cantidad" type="number" min="0" step="1" value={cantidadMasiva} onChange={(e) => setCantidadMasiva(e.target.value)} className="w-28 rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-gray-700" />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] text-lavender-magenta-200">Motivo</label>
                  <input name="motivo" value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ej. Nueva compra" className="w-44 rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-gray-700" />
                </div>
                <MassButton />
              </form>
              <form action={priceAction} className="flex items-end gap-2">
                <input type="hidden" name="ids" value={[...seleccionados].join(',')} />
                <div>
                  <label className="mb-1 block text-[11px] text-lavender-magenta-200">Nuevo precio</label>
                  <input name="precio" type="number" min="0" step="1" value={precioMasivo} onChange={(e) => setPrecioMasivo(e.target.value)} placeholder="COP" className="w-32 rounded-xl border-0 bg-white px-3 py-2.5 text-sm text-gray-700" />
                </div>
                <PriceButton />
              </form>
              <button type="button" onClick={() => setSeleccionados(new Set())} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm text-white hover:bg-white/10">Cancelar</button>
            </div>
          </div>
          {massState.error && <p className="mt-3 text-sm text-red-200">{massState.error}</p>}
          {priceState.error && <p className="mt-3 text-sm text-red-200">{priceState.error}</p>}
        </section>
      )}

      {tieneCambios && (
        <section className="sticky top-3 z-20 rounded-2xl bg-white/95 p-3 shadow-xl ring-1 ring-lavender-magenta-100 backdrop-blur sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><strong className="text-fucsia">{Object.keys(borradores).length}</strong> cambios pendientes de guardar.</div>
            <div className="flex gap-2">
              <button type="button" onClick={descartarCambios} className="rounded-full border border-rosa-pastel px-4 py-2 text-sm text-gray-600">Descartar</button>
              <GuardarCambios cambios={cambiosRapidos} />
            </div>
          </div>
        </section>
      )}

      <section className="premium-card overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-rosa-pastel/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-semibold text-gray-800">Existencias</h2><p className="text-xs text-gray-400">Mostrando {filtrados.length ? (paginaSegura - 1) * PAGE_SIZE + 1 : 0}-{Math.min(paginaSegura * PAGE_SIZE, filtrados.length)} de {filtrados.length}</p></div>
          <label className="flex items-center gap-2 text-xs text-gray-500"><input type="checkbox" checked={todosVisibles} onChange={(e) => seleccionarVisible(e.target.checked)} className="h-4 w-4 accent-fucsia" /> Seleccionar página</label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-rosa-pastel/30 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr><th className="px-4 py-3 w-10"></th><th className="px-4 py-3">Producto</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Mínimo</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Acción</th></tr>
            </thead>
            <tbody>
              {visibles.map((p) => <Fila key={p.id} producto={p} seleccionado={seleccionados.has(p.id)} onSelect={(checked) => { const next = new Set(seleccionados); checked ? next.add(p.id) : next.delete(p.id); setSeleccionados(next) }} draft={borradores[p.id]} onDraft={(value) => setDraft(p.id, value)} />)}
            </tbody>
          </table>
        </div>
        {visibles.length === 0 && <div className="px-6 py-14 text-center text-sm text-gray-400">No hay productos que coincidan con esos filtros.</div>}
        {totalPaginas > 1 && <Paginacion pagina={paginaSegura} total={totalPaginas} onChange={(p) => { setPagina(p); setSeleccionados(new Set()); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />}
      </section>

      {movimientos.length > 0 && (
        <section className="premium-card overflow-hidden">
          <div className="border-b border-rosa-pastel/50 px-5 py-4"><h2 className="font-semibold text-gray-800">Últimos movimientos</h2><p className="mt-1 text-xs text-gray-400">Historial reciente de entradas, salidas y ajustes.</p></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead className="bg-rosa-pastel/30 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Producto</th><th className="px-4 py-3">Movimiento</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Motivo</th></tr></thead><tbody>{movimientos.map((m) => <tr key={m.id} className="border-t border-rosa-pastel/40"><td className="px-4 py-3 text-xs text-gray-500">{new Date(m.creado_en).toLocaleString('es-CO')}</td><td className="px-4 py-3 font-medium text-gray-700">{m.productos?.nombre || 'Producto'}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m.tipo === 'entrada' ? 'bg-green-50 text-green-700' : m.tipo === 'salida' ? 'bg-red-50 text-red-600' : 'bg-lavender-magenta-50 text-lavender-magenta-700'}`}>{m.tipo === 'entrada' ? '+' : m.tipo === 'salida' ? '−' : '↕'} {Math.abs(m.cantidad_movimiento)}</span></td><td className="px-4 py-3 text-gray-600">{m.cantidad_anterior} → <strong>{m.cantidad_nueva}</strong></td><td className="px-4 py-3 text-xs text-gray-500">{m.motivo || '—'}</td></tr>)}</tbody></table></div>
        </section>
      )}

      <section id="importar" className="premium-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div><span className="eyebrow">Carga grande</span><h2 className="mt-3 font-display text-2xl font-bold text-gray-800">Importar desde Excel</h2><p className="mt-1 max-w-2xl text-sm text-gray-500">Ideal para actualizar decenas o cientos de productos. Primero previsualizamos y luego confirmas.</p></div>
          <a href="/admin/inventario/plantilla" className="text-sm font-semibold text-fucsia hover:underline">Descargar plantilla →</a>
        </div>
        {!importState.cambios ? (
          <form action={importAction} className="mt-5 rounded-2xl border border-dashed border-rosa-pastel bg-rosa-pastel/10 p-5">
            <label className="block text-sm font-semibold text-gray-700">Selecciona .xlsx, .xls o .csv</label>
            <input type="file" name="archivo" accept=".xlsx,.xls,.csv" required className="mt-3 block w-full text-sm" />
            <p className="mt-2 text-xs text-gray-400">La plantilla reconoce <strong>slug</strong> o <strong>SKU</strong>. No cambies esos identificadores.</p>
            <ImportButton />
            {importState.error && <p className="mt-3 text-sm text-red-500">{importState.error}</p>}
          </form>
        ) : <Previsualizacion resultado={importState} />}
      </section>
    </div>
  )
}

function Resumen({ label, value, icon }: { label: string; value: number; icon: string }) { return <div className="premium-card p-4"><div className="flex items-center justify-between"><span className="text-xl">{icon}</span><span className="text-2xl font-bold text-lavender-magenta-950">{value}</span></div><p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p></div> }
function Filtro({ label, activo, onClick }: { label: string; activo: boolean; onClick: () => void }) { return <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-xs font-semibold transition ${activo ? 'bg-fucsia text-white shadow-soft-pink' : 'border border-rosa-pastel bg-white text-gray-600 hover:border-fucsia hover:text-fucsia'}`}>{label}</button> }

function Fila({ producto, seleccionado, onSelect, draft, onDraft }: { producto: InventarioProducto; seleccionado: boolean; onSelect: (v: boolean) => void; draft?: number; onDraft: (v: number) => void }) {
  const stock = draft ?? producto.cantidad_stock ?? 0
  const minimo = producto.stock_minimo ?? 0
  const estado = stock <= 0 ? ['🔴', 'Agotado', 'text-red-600 bg-red-50'] : stock <= minimo ? ['🟡', 'Bajo mínimo', 'text-amber-700 bg-amber-50'] : ['🟢', 'Disponible', 'text-green-700 bg-green-50']
  return <tr className={`border-t border-rosa-pastel/40 ${seleccionado ? 'bg-lavender-magenta-50/50' : ''}`}>
    <td className="px-4 py-3"><input type="checkbox" checked={seleccionado} onChange={(e) => onSelect(e.target.checked)} className="h-4 w-4 accent-fucsia" /></td>
    <td className="px-4 py-3"><div className="font-medium text-gray-800">{producto.nombre}</div><div className="mt-0.5 text-[11px] text-gray-400">{producto.codigo_barras || producto.slug}</div></td>
    <td className="px-4 py-3 text-xs text-gray-500">{producto.sku || '—'}</td>
    <td className="px-4 py-3"><div className="inline-flex items-center rounded-xl border border-rosa-pastel bg-white p-1"><button type="button" onClick={() => onDraft(Math.max(0, stock - 1))} className="h-8 w-8 rounded-lg text-lg text-gray-500 hover:bg-rosa-pastel/50">−</button><input aria-label={`Stock de ${producto.nombre}`} type="number" min="0" step="1" value={stock} onChange={(e) => onDraft(Number(e.target.value))} className="w-14 border-0 bg-transparent text-center text-sm font-bold text-lavender-magenta-950 outline-none" /><button type="button" onClick={() => onDraft(stock + 1)} className="h-8 w-8 rounded-lg text-lg text-fucsia hover:bg-rosa-pastel/50">+</button></div></td>
    <td className="px-4 py-3 text-gray-500">{minimo}</td>
    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${estado[2]}`}><span>{estado[0]}</span>{estado[1]}</span></td>
    <td className="px-4 py-3 text-right"><a href={`/admin/productos/${producto.id}?returnTo=/admin/inventario`} className="text-xs font-semibold text-fucsia hover:underline">Editar producto</a></td>
  </tr>
}

function GuardarCambios({ cambios }: { cambios: FilaCambio[] }) {
  const [state, action] = useFormState(confirmarImportacionInventario, { ok: true } as ResultadoConfirmacion)
  return <form action={action}><input type="hidden" name="cambios" value={JSON.stringify(cambios)} /><button className="rounded-full bg-fucsia px-5 py-2 text-sm font-semibold text-white">Guardar cambios</button>{state.error && <span className="ml-3 text-xs text-red-500">{state.error}</span>}</form>
}

function PriceButton() { const { pending } = useFormStatus(); return <button disabled={pending} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 disabled:opacity-60">{pending ? 'Guardando…' : 'Cambiar precio'}</button> }
function MassButton() { const { pending } = useFormStatus(); return <button disabled={pending} className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-lavender-magenta-950 disabled:opacity-60">{pending ? 'Aplicando…' : 'Aplicar'}</button> }
function ImportButton() { const { pending } = useFormStatus(); return <button disabled={pending} className="mt-4 rounded-full bg-fucsia px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{pending ? 'Leyendo…' : 'Previsualizar cambios'}</button> }

function Previsualizacion({ resultado }: { resultado: ResultadoPrevisualizacion }) {
  const [state, action] = useFormState(confirmarImportacionInventario, { ok: true } as ResultadoConfirmacion)
  const cambios = resultado.cambios ?? []
  return <div className="mt-5 space-y-4"><div className="rounded-2xl bg-lavender-magenta-50 p-4 text-sm text-gray-600"><strong className="text-fucsia">{cambios.length}</strong> cambios · {resultado.sinCambios ?? 0} sin cambios · {(resultado.noReconocidos ?? []).length} no reconocidos</div>{cambios.length > 0 && <div className="overflow-x-auto rounded-2xl border border-rosa-pastel"><table className="w-full min-w-[650px] text-sm"><thead className="bg-rosa-pastel/30 text-left text-gray-600"><tr><th className="px-4 py-3">Producto</th><th className="px-4 py-3">SKU</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Precio</th></tr></thead><tbody>{cambios.map((c) => <tr key={c.id || c.slug} className="border-t border-rosa-pastel/40"><td className="px-4 py-2">{c.nombre}</td><td className="px-4 py-2 text-xs text-gray-500">{c.sku || '—'}</td><td className="px-4 py-2">{c.stockNuevo !== null ? <>{c.stockActual} → <strong className="text-fucsia">{c.stockNuevo}</strong></> : '—'}</td><td className="px-4 py-2">{c.precioNuevo !== null ? <>{c.precioActual} → <strong className="text-fucsia">{c.precioNuevo}</strong></> : '—'}</td></tr>)}</tbody></table></div>}{(resultado.noReconocidos ?? []).length > 0 && <div className="rounded-2xl bg-amber-50 p-4 text-xs text-amber-800"><strong>No reconocidos:</strong> {(resultado.noReconocidos ?? []).join(', ')}</div>}{cambios.length > 0 && <form action={action}><input type="hidden" name="cambios" value={JSON.stringify(cambios)} /><button className="rounded-full bg-fucsia px-6 py-2.5 text-sm font-semibold text-white">Confirmar y actualizar</button>{state.error && <p className="mt-2 text-sm text-red-500">{state.error}</p>}</form>}</div>
}

function Paginacion({ pagina, total, onChange }: { pagina: number; total: number; onChange: (p: number) => void }) { return <div className="flex items-center justify-center gap-2 border-t border-rosa-pastel/50 p-4"><button disabled={pagina === 1} onClick={() => onChange(pagina - 1)} className="rounded-full border border-rosa-pastel px-4 py-2 text-sm text-gray-600 disabled:opacity-30">← Anterior</button><span className="rounded-full bg-rosa-pastel/40 px-4 py-2 text-xs font-semibold text-lavender-magenta-800">Página {pagina} de {total}</span><button disabled={pagina === total} onClick={() => onChange(pagina + 1)} className="rounded-full border border-rosa-pastel px-4 py-2 text-sm text-gray-600 disabled:opacity-30">Siguiente →</button></div> }
