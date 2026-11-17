'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import {
  actualizarInventarioMasivo,
  actualizarPrecioMasivo,
  confirmarImportacionInventario,
  confirmarSincronizacionInventario,
  previsualizarInventario,
  type FilaCambio,
  type ResultadoConfirmacion,
  type ResultadoMovimiento,
  type ResultadoPrevisualizacion,
} from '@/lib/actions/inventario'
import { Icono, type NombreIcono } from './Iconos'

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
const INITIAL_CONF: ResultadoConfirmacion = { ok: true }

// Colombia no usa horario de verano (UTC−5 todo el año). Se formatea a mano para que el servidor
// y el navegador generen EXACTAMENTE el mismo texto; con toLocaleString() cada uno daba una hora
// distinta y React lanzaba un error de hidratación al mostrar el historial.
function formatearFecha(iso: string) {
  const t = new Date(iso).getTime()
  if (Number.isNaN(t)) return '—'
  const d = new Date(t - 5 * 60 * 60 * 1000)
  const dos = (n: number) => String(n).padStart(2, '0')
  return `${dos(d.getUTCDate())}/${dos(d.getUTCMonth() + 1)}/${d.getUTCFullYear()} ${dos(d.getUTCHours())}:${dos(d.getUTCMinutes())}`
}

const CAMPO = 'rounded-2xl border border-rosa-pastel bg-white px-4 py-3 text-sm text-gray-700 outline-none transition-colors duration-200 ease-boutique focus:border-lavender-magenta-400'

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
  const [mensajeOk, setMensajeOk] = useState(actualizado ? 'Inventario actualizado correctamente.' : '')
  const [importKey, setImportKey] = useState(0)
  const [massState, massAction] = useFormState(actualizarInventarioMasivo, INITIAL_MOV)
  const [priceState, priceAction] = useFormState(actualizarPrecioMasivo, INITIAL_MOV)
  const [precioMasivo, setPrecioMasivo] = useState('')

  // Al terminar bien una acción masiva se limpia la selección y se avisa al usuario.
  useEffect(() => {
    if (massState !== INITIAL_MOV && massState.ok) {
      setSeleccionados(new Set())
      setMensajeOk('Inventario actualizado correctamente.')
    }
  }, [massState])
  useEffect(() => {
    if (priceState !== INITIAL_MOV && priceState.ok) {
      setSeleccionados(new Set())
      setPrecioMasivo('')
      setMensajeOk('Precio actualizado correctamente.')
    }
  }, [priceState])

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
    const entero = Math.floor(value)
    const original = porId.get(id)?.cantidad_stock ?? 0
    setBorradores((prev) => {
      const next = { ...prev }
      if (entero === original) delete next[id]
      else next[id] = entero
      return next
    })
  }
  function descartarCambios() { setBorradores({}) }

  const cambiosRapidos: FilaCambio[] = Object.entries(borradores).map(([id, stockNuevo]) => {
    const p = porId.get(id)!
    return { id, slug: p.slug, nombre: p.nombre, sku: p.sku, stockActual: p.cantidad_stock, stockNuevo, precioActual: p.precio, precioNuevo: null }
  })

  return (
    <div className="space-y-6 pb-12">
      <header>
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-lavender-magenta-700">
          <span aria-hidden="true" className="h-px w-6 bg-dorado" />
          Control de existencias
        </p>
        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-lavender-magenta-950">Inventario</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Actualiza cantidades en segundos, aplica movimientos a varios productos y conserva Excel para cargas grandes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/admin/inventario/plantilla" className="inline-flex items-center gap-2 rounded-full border border-rosa-pastel bg-white px-4 py-2 text-sm font-semibold text-lavender-magenta-700 transition-colors duration-200 ease-boutique hover:bg-lavender-magenta-50">
              <Icono nombre="descargar" className="h-4 w-4" />
              Excel
            </a>
            <a href="#importar" className="inline-flex items-center gap-2 rounded-full bg-lavender-magenta-700 px-4 py-2 text-sm font-semibold text-white shadow-card transition-all duration-200 ease-boutique hover:-translate-y-0.5 hover:bg-lavender-magenta-800">
              <Icono nombre="importar" className="h-4 w-4" />
              Importar
            </a>
          </div>
        </div>
        <div className="hairline-gold mt-5" aria-hidden="true" />
      </header>

      {mensajeOk && (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700 ring-1 ring-green-100">
          <span className="flex items-center gap-2"><Icono nombre="check" className="h-4 w-4 shrink-0" />{mensajeOk}</span>
          <button type="button" onClick={() => setMensajeOk('')} className="text-xs font-semibold transition-colors duration-200 ease-boutique hover:underline">Cerrar</button>
        </div>
      )}
      {errorInicial && <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 ring-1 ring-red-100">No pude cargar el inventario: {errorInicial}</div>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Resumen label="Productos" value={resumen.total} icono="productos" />
        <Resumen label="Disponibles" value={resumen.disponibles} icono="check" />
        <Resumen label="Bajo mínimo" value={resumen.bajos} icono="alerta" />
        <Resumen label="Agotados" value={resumen.agotados} icono="agotado" />
      </div>

      <section className="rounded-boutique-lg border border-lavender-magenta-100 bg-white p-4 shadow-card sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(280px,1fr)_180px_180px]">
          <label className="relative block">
            <span className="sr-only">Buscar</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"><Icono nombre="buscar" className="h-4 w-4" /></span>
            <input value={busqueda} onChange={(e) => { setBusqueda(e.target.value); setPagina(1) }} placeholder="Buscar nombre, SKU, código o slug..." className={`w-full ${CAMPO} pl-11 pr-4`} />
          </label>
          <select value={marca} onChange={(e) => { setMarca(e.target.value); setPagina(1) }} className={`${CAMPO} text-gray-600`}>
            <option value="">Todas las marcas</option>
            {marcas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
          <select value={categoria} onChange={(e) => { setCategoria(e.target.value); setPagina(1) }} className={`${CAMPO} text-gray-600`}>
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
        <section className="rounded-boutique bg-lavender-magenta-950 p-4 text-white shadow-soft-pink sm:p-5">
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
              <button type="button" onClick={() => setSeleccionados(new Set())} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm text-white transition-colors duration-200 ease-boutique hover:bg-white/10">Cancelar</button>
            </div>
          </div>
          {massState.error && <p className="mt-3 text-sm text-red-200">{massState.error}</p>}
          {priceState.error && <p className="mt-3 text-sm text-red-200">{priceState.error}</p>}
        </section>
      )}

      {tieneCambios && (
        <section className="sticky top-[4.25rem] z-20 rounded-2xl bg-white/95 p-3 shadow-xl ring-1 ring-lavender-magenta-100 backdrop-blur sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div><strong className="text-lavender-magenta-700">{Object.keys(borradores).length}</strong> cambios pendientes de guardar.</div>
            <div className="flex gap-2">
              <button type="button" onClick={descartarCambios} className="rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors duration-200 ease-boutique hover:bg-gray-50">Descartar</button>
              <GuardarCambios cambios={cambiosRapidos} onGuardado={() => { setBorradores({}); setMensajeOk('Stock guardado correctamente.') }} />
            </div>
          </div>
        </section>
      )}

      <section className="overflow-hidden rounded-boutique-lg border border-lavender-magenta-100 bg-white shadow-card">
        <div className="flex flex-col gap-2 border-b border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-display text-lg font-semibold text-lavender-magenta-950">Existencias</h2><p className="text-xs text-gray-400">Mostrando {filtrados.length ? (paginaSegura - 1) * PAGE_SIZE + 1 : 0}-{Math.min(paginaSegura * PAGE_SIZE, filtrados.length)} de {filtrados.length}</p></div>
          <label className="flex items-center gap-2 text-xs text-gray-500"><input type="checkbox" checked={todosVisibles} onChange={(e) => seleccionarVisible(e.target.checked)} className="h-4 w-4 accent-lavender-magenta-600" /> Seleccionar página</label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
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
        <section id="historial" className="rounded-boutique-lg border border-lavender-magenta-100 bg-white shadow-card overflow-hidden">
          <div className="border-b border-gray-100 px-5 py-4"><h2 className="font-display text-lg font-semibold text-lavender-magenta-950">Últimos movimientos</h2><p className="mt-1 text-xs text-gray-400">Historial reciente de entradas, salidas y ajustes.</p></div>
          <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-sm"><thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"><tr><th className="px-4 py-3">Fecha</th><th className="px-4 py-3">Producto</th><th className="px-4 py-3">Movimiento</th><th className="px-4 py-3">Stock</th><th className="px-4 py-3">Motivo</th></tr></thead><tbody>{movimientos.map((m) => <tr key={m.id} className="border-t border-gray-100"><td className="px-4 py-3 text-xs text-gray-500">{formatearFecha(m.creado_en)}</td><td className="px-4 py-3 font-medium text-gray-700">{m.productos?.nombre || 'Producto'}</td><td className="px-4 py-3"><span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${m.tipo === 'entrada' ? 'bg-green-50 text-green-700' : m.tipo === 'salida' ? 'bg-red-50 text-red-600' : 'bg-lavender-magenta-50 text-lavender-magenta-700'}`}><Icono nombre={m.tipo === 'entrada' ? 'mas' : m.tipo === 'salida' ? 'menos' : 'intercambio'} className="h-3.5 w-3.5" />{Math.abs(m.cantidad_movimiento)}</span></td><td className="px-4 py-3 text-gray-600">{m.cantidad_anterior} <Icono nombre="flecha" className="inline h-3.5 w-3.5 align-middle text-gray-400" /> <strong>{m.cantidad_nueva}</strong></td><td className="px-4 py-3 text-xs text-gray-500">{m.motivo || '—'}</td></tr>)}</tbody></table></div>
        </section>
      )}

      <section id="importar" className="rounded-boutique-lg border border-lavender-magenta-100 bg-white shadow-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-lavender-magenta-700"><span aria-hidden="true" className="h-px w-6 bg-dorado" />Carga grande</p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-lavender-magenta-950">Importar desde Excel</h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Ideal para actualizar decenas o cientos de productos. Primero previsualizamos y luego confirmas.</p>
          </div>
          <a href="/admin/inventario/plantilla" className="shrink-0 text-sm font-semibold text-lavender-magenta-700 transition-colors duration-200 ease-boutique hover:underline">Descargar plantilla</a>
        </div>
        <div className="hairline-gold mt-4" aria-hidden="true" />
        <Importador
          key={importKey}
          onReiniciar={() => setImportKey((k) => k + 1)}
          onTerminado={(n) => {
            setImportKey((k) => k + 1)
            setMensajeOk(`Sincronización aplicada: ${n} ${n === 1 ? 'cambio realizado' : 'cambios realizados'} en el catálogo.`)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      </section>
    </div>
  )
}

function Resumen({ label, value, icono }: { label: string; value: number; icono: NombreIcono }) { return <div className="rounded-boutique-lg border border-lavender-magenta-100 bg-white shadow-card p-4"><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender-magenta-50 text-lavender-magenta-700"><Icono nombre={icono} className="h-5 w-5" /></span><span className="font-display text-2xl font-bold text-lavender-magenta-950">{value}</span></div><p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p></div> }
function Filtro({ label, activo, onClick }: { label: string; activo: boolean; onClick: () => void }) { return <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-200 ease-boutique ${activo ? 'bg-lavender-magenta-700 text-white shadow-card' : 'border border-rosa-pastel bg-white text-gray-600 hover:border-lavender-magenta-400 hover:text-lavender-magenta-700'}`}>{label}</button> }

function Fila({ producto, seleccionado, onSelect, draft, onDraft }: { producto: InventarioProducto; seleccionado: boolean; onSelect: (v: boolean) => void; draft?: number; onDraft: (v: number) => void }) {
  const stock = draft ?? producto.cantidad_stock ?? 0
  const minimo = producto.stock_minimo ?? 0
  const estado = stock <= 0 ? ['bg-red-500', 'Agotado', 'text-red-600 bg-red-50'] : stock <= minimo ? ['bg-amber-500', 'Bajo mínimo', 'text-amber-700 bg-amber-50'] : ['bg-green-500', 'Disponible', 'text-green-700 bg-green-50']
  return <tr className={`border-t border-gray-100 transition-colors duration-150 ease-boutique ${seleccionado ? 'bg-lavender-magenta-50/50' : ''}`}>
    <td className="px-4 py-3"><input type="checkbox" checked={seleccionado} onChange={(e) => onSelect(e.target.checked)} className="h-4 w-4 accent-lavender-magenta-600" /></td>
    <td className="px-4 py-3"><div className="font-medium text-gray-800">{producto.nombre}</div><div className="mt-0.5 text-[11px] text-gray-400">{producto.codigo_barras || producto.slug}</div></td>
    <td className="px-4 py-3 text-xs text-gray-500">{producto.sku || '—'}</td>
    <td className="px-4 py-3"><div className="inline-flex items-center rounded-xl border border-rosa-pastel bg-white p-1"><button type="button" onClick={() => onDraft(Math.max(0, stock - 1))} aria-label={`Quitar una unidad de ${producto.nombre}`} className="grid h-8 w-8 place-content-center rounded-lg text-gray-500 transition-colors duration-150 ease-boutique hover:bg-gray-100"><Icono nombre="menos" className="h-4 w-4" /></button><input aria-label={`Stock de ${producto.nombre}`} type="number" min="0" step="1" value={stock} onChange={(e) => onDraft(Number(e.target.value))} className="w-14 border-0 bg-transparent text-center text-sm font-bold text-lavender-magenta-950 outline-none" /><button type="button" onClick={() => onDraft(stock + 1)} aria-label={`Agregar una unidad a ${producto.nombre}`} className="grid h-8 w-8 place-content-center rounded-lg text-lavender-magenta-700 transition-colors duration-150 ease-boutique hover:bg-gray-100"><Icono nombre="mas" className="h-4 w-4" /></button></div></td>
    <td className="px-4 py-3 text-gray-500">{minimo}</td>
    <td className="px-4 py-3"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${estado[2]}`}><span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${estado[0]}`} />{estado[1]}</span></td>
    <td className="px-4 py-3 text-right"><a href={`/admin/productos/${producto.id}?returnTo=/admin/inventario`} className="text-xs font-semibold text-lavender-magenta-700 transition-colors duration-200 ease-boutique hover:underline">Editar producto</a></td>
  </tr>
}

function GuardarCambios({ cambios, onGuardado }: { cambios: FilaCambio[]; onGuardado: () => void }) {
  const [state, action] = useFormState(confirmarImportacionInventario, INITIAL_CONF)
  useEffect(() => {
    if (state.ok && state.aplicados) onGuardado()
  }, [state])
  return (
    <form action={action} className="flex items-center">
      <input type="hidden" name="cambios" value={JSON.stringify(cambios)} />
      <ConfirmarBoton texto="Guardar cambios" cargando="Guardando…" className="rounded-full bg-lavender-magenta-700 px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 ease-boutique hover:bg-lavender-magenta-800 disabled:opacity-60" />
      {state.error && <span className="ml-3 text-xs text-red-500">{state.error}</span>}
    </form>
  )
}

function ConfirmarBoton({ texto, cargando, className }: { texto: string; cargando: string; className: string }) {
  const { pending } = useFormStatus()
  return <button disabled={pending} className={className}>{pending ? cargando : texto}</button>
}

function PriceButton() { const { pending } = useFormStatus(); return <button disabled={pending} className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-bold text-white transition-colors duration-200 ease-boutique hover:bg-white/10 disabled:opacity-60">{pending ? 'Guardando…' : 'Cambiar precio'}</button> }
function MassButton() { const { pending } = useFormStatus(); return <button disabled={pending} className="rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-lavender-magenta-950 transition-colors duration-200 ease-boutique disabled:opacity-60">{pending ? 'Aplicando…' : 'Aplicar'}</button> }
function ImportButton() { const { pending } = useFormStatus(); return <button disabled={pending} className="mt-4 inline-flex items-center gap-2 rounded-full bg-lavender-magenta-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 ease-boutique hover:bg-lavender-magenta-800 disabled:opacity-60"><Icono nombre="importar" className="h-4 w-4" />{pending ? 'Leyendo…' : 'Previsualizar cambios'}</button> }

function Importador({ onReiniciar, onTerminado }: { onReiniciar: () => void; onTerminado: (n: number) => void }) {
  const [importState, importAction] = useFormState(previsualizarInventario, INITIAL_IMPORT)
  if (importState.cambios) return <Previsualizacion resultado={importState} onReiniciar={onReiniciar} onTerminado={onTerminado} />
  return (
    <form action={importAction} className="mt-5 rounded-boutique border border-dashed border-gray-300 bg-gray-50 p-5">
      <label className="block text-sm font-semibold text-gray-700">Selecciona .xlsx, .xls o .csv</label>
      <input type="file" name="archivo" accept=".xlsx,.xls,.csv" required className="mt-3 block w-full text-sm" />
      <p className="mt-2 text-xs text-gray-400">El Excel manda: los productos nuevos se crean, los existentes se actualizan (por <strong>slug</strong> o <strong>SKU</strong>) y los que no estén en el archivo se eliminan. Antes de aplicar verás la lista completa.</p>
      <label className="mt-3 flex items-start gap-2 text-sm text-gray-700">
        <input type="checkbox" name="eliminar_faltantes" defaultChecked className="mt-0.5 h-4 w-4 accent-lavender-magenta-600" />
        <span>Eliminar de la página los productos que <strong>no estén</strong> en el Excel</span>
      </label>
      <ImportButton />
      {importState.error && <p className="mt-3 text-sm text-red-500">{importState.error}</p>}
    </form>
  )
}

function ResumenSync({ numero, titulo, clase }: { numero: number; titulo: string; clase: string }) {
  return (
    <div className={`rounded-2xl p-4 text-center ${clase}`}>
      <div className="text-2xl font-bold">{numero}</div>
      <div className="text-xs font-semibold uppercase tracking-wide">{titulo}</div>
    </div>
  )
}

function Previsualizacion({ resultado, onReiniciar, onTerminado }: { resultado: ResultadoPrevisualizacion; onReiniciar: () => void; onTerminado: (n: number) => void }) {
  const [state, action] = useFormState(confirmarSincronizacionInventario, INITIAL_CONF)
  const cambios = resultado.cambios ?? []
  const nuevos = resultado.nuevos ?? []
  const eliminar = resultado.eliminar ?? []
  const advertencias = resultado.advertencias ?? []
  const hayAlgo = cambios.length + nuevos.length + eliminar.length > 0
  useEffect(() => {
    if (state.ok && state.aplicados) onTerminado(state.aplicados)
  }, [state])

  const plan = JSON.stringify({ cambios, nuevos, eliminar, eliminacionMasiva: resultado.eliminacionMasiva })
  const th = 'px-4 py-3'
  return (
    <div className="mt-5 space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ResumenSync numero={nuevos.length} titulo="Se crean (borrador)" clase="bg-emerald-50 text-emerald-700" />
        <ResumenSync numero={cambios.length} titulo="Se actualizan" clase="bg-lavender-magenta-50 text-lavender-magenta-700" />
        <ResumenSync numero={eliminar.length} titulo="Se eliminan" clase="bg-red-50 text-red-600" />
        <ResumenSync numero={resultado.sinCambios ?? 0} titulo="Sin cambios" clase="bg-gray-50 text-gray-500" />
      </div>

      {nuevos.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-bold text-emerald-700">Productos nuevos que se van a crear como borrador ({nuevos.length})</h3>
          <div className="max-h-72 overflow-auto rounded-2xl border border-emerald-100">
            <table className="w-full min-w-[650px] text-sm">
              <thead className="sticky top-0 bg-emerald-50 text-left text-xs font-semibold uppercase tracking-wide text-emerald-700"><tr><th className={th}>Producto</th><th className={th}>SKU</th><th className={th}>Marca / Categoría</th><th className={th}>Stock</th><th className={th}>Precio</th></tr></thead>
              <tbody>
                {nuevos.map((n) => (
                  <tr key={n.slug} className="border-t border-emerald-50">
                    <td className="px-4 py-2">{n.nombre}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{n.sku || '—'}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{[n.marca, n.categoria].filter(Boolean).join(' · ') || '—'}</td>
                    <td className="px-4 py-2">{n.stock}</td>
                    <td className="px-4 py-2">{n.precio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {eliminar.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-bold text-red-600">Productos que se van a ELIMINAR de la página ({eliminar.length})</h3>
          <p className="mb-2 text-xs text-gray-500">No están en el Excel. Esta acción es permanente.</p>
          <div className="max-h-72 overflow-auto rounded-2xl border border-red-100">
            <table className="w-full min-w-[500px] text-sm">
              <thead className="sticky top-0 bg-red-50 text-left text-xs font-semibold uppercase tracking-wide text-red-600"><tr><th className={th}>Producto</th><th className={th}>SKU</th><th className={th}>Stock actual</th></tr></thead>
              <tbody>
                {eliminar.map((e) => (
                  <tr key={e.id} className="border-t border-red-50">
                    <td className="px-4 py-2">{e.nombre}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{e.sku || '—'}</td>
                    <td className="px-4 py-2">{e.cantidad_stock ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {cambios.length > 0 && (
        <section>
          <h3 className="mb-2 text-sm font-bold text-lavender-magenta-700">Productos que se actualizan ({cambios.length})</h3>
          <div className="max-h-72 overflow-auto rounded-2xl border border-gray-100">
            <table className="w-full min-w-[650px] text-sm">
              <thead className="sticky top-0 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"><tr><th className={th}>Producto</th><th className={th}>SKU</th><th className={th}>Stock</th><th className={th}>Precio</th></tr></thead>
              <tbody>
                {cambios.map((c) => (
                  <tr key={c.id || c.slug} className="border-t border-gray-100">
                    <td className="px-4 py-2">{c.nombre}</td>
                    <td className="px-4 py-2 text-xs text-gray-500">{c.sku || '—'}</td>
                    <td className="px-4 py-2">{c.stockNuevo !== null ? <>{c.stockActual} <Icono nombre="flecha" className="inline h-3.5 w-3.5 align-middle text-gray-400" /> <strong className="text-lavender-magenta-700">{c.stockNuevo}</strong></> : '—'}</td>
                    <td className="px-4 py-2">{c.precioNuevo !== null ? <>{c.precioActual} <Icono nombre="flecha" className="inline h-3.5 w-3.5 align-middle text-gray-400" /> <strong className="text-lavender-magenta-700">{c.precioNuevo}</strong></> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {advertencias.length > 0 && (
        <div className="max-h-40 overflow-auto rounded-2xl bg-amber-50 p-4 text-xs text-amber-800">
          <strong>Avisos ({advertencias.length}):</strong>
          <ul className="mt-1 list-disc pl-4">{advertencias.map((a, i) => <li key={i}>{a}</li>)}</ul>
        </div>
      )}

      {!hayAlgo && <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">El Excel y la página ya coinciden. No hay nada que cambiar.</p>}

      <div className="flex flex-wrap items-start gap-3">
        {hayAlgo && (
          <form action={action} className="space-y-3">
            <input type="hidden" name="plan" value={plan} />
            {eliminar.length > 0 && (
              <label className="flex items-start gap-2 text-sm text-red-600">
                <input type="checkbox" name="entiendo" required className="mt-0.5 h-4 w-4 accent-red-600" />
                <span>Entiendo que se eliminarán {eliminar.length} {eliminar.length === 1 ? 'producto' : 'productos'} de forma permanente.</span>
              </label>
            )}
            {resultado.eliminacionMasiva && (
              <div>
                <p className="text-xs text-red-600">Vas a eliminar una gran parte del catálogo ({eliminar.length} de {resultado.totalCatalogo}). Escribe <strong>ELIMINAR</strong> para continuar.</p>
                <input name="palabra" required autoComplete="off" className="mt-1 w-40 rounded-lg border border-red-200 px-3 py-1.5 text-sm" />
              </div>
            )}
            <ConfirmarBoton texto={`Confirmar: crear ${nuevos.length}, actualizar ${cambios.length}, eliminar ${eliminar.length}`} cargando="Aplicando…" className="rounded-full bg-lavender-magenta-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors duration-200 ease-boutique hover:bg-lavender-magenta-800 disabled:opacity-60" />
          </form>
        )}
        <button type="button" onClick={onReiniciar} className="rounded-full border border-gray-200 px-5 py-2.5 text-sm text-gray-600 transition-colors duration-200 ease-boutique hover:border-lavender-magenta-400 hover:text-lavender-magenta-700">{hayAlgo ? 'Cancelar' : 'Subir otro archivo'}</button>
      </div>
      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
    </div>
  )
}

function Paginacion({ pagina, total, onChange }: { pagina: number; total: number; onChange: (p: number) => void }) { return <div className="flex items-center justify-center gap-2 border-t border-gray-100 p-4"><button disabled={pagina === 1} onClick={() => onChange(pagina - 1)} className="inline-flex items-center gap-1.5 rounded-full border border-rosa-pastel px-4 py-2 text-sm text-gray-600 transition-colors duration-200 ease-boutique hover:border-lavender-magenta-400 hover:text-lavender-magenta-700 disabled:opacity-30"><Icono nombre="flechaIzq" className="h-4 w-4" />Anterior</button><span className="rounded-full bg-lavender-magenta-50 px-4 py-2 text-xs font-semibold text-lavender-magenta-700">Página {pagina} de {total}</span><button disabled={pagina === total} onClick={() => onChange(pagina + 1)} className="inline-flex items-center gap-1.5 rounded-full border border-rosa-pastel px-4 py-2 text-sm text-gray-600 transition-colors duration-200 ease-boutique hover:border-lavender-magenta-400 hover:text-lavender-magenta-700 disabled:opacity-30">Siguiente<Icono nombre="flecha" className="h-4 w-4" /></button></div> }
