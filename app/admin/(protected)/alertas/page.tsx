import Link from 'next/link'
import { createServerSupabase } from '@/lib/supabase/server'
import { Icono } from '@/components/admin/Iconos'
export const dynamic='force-dynamic'
export default async function AlertasPage({searchParams}:{searchParams:{tipo?:string}}){
 const tipo=searchParams.tipo||'todas'; const {data}=await createServerSupabase().from('productos').select('id,nombre,sku,cantidad_stock,stock_minimo,precio,estado_inventario').order('nombre'); const items=data??[]
 const agotados=items.filter(p=>Number(p.cantidad_stock||0)<=0||p.estado_inventario==='agotado'); const minimo=items.filter(p=>Number(p.cantidad_stock||0)>0&&p.stock_minimo!=null&&Number(p.cantidad_stock)<=Number(p.stock_minimo)); const precio=items.filter(p=>!p.precio||Number(p.precio)<=0); const lista=tipo==='agotados'?agotados:tipo==='minimo'?minimo:tipo==='precio'?precio:Array.from(new Map([...agotados,...minimo,...precio].map(p=>[p.id,p])).values())
 return <div className="mx-auto max-w-7xl pb-10">
  <header className="mb-6">
   <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
    <div>
     <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-lavender-magenta-700"><span aria-hidden="true" className="h-px w-6 bg-dorado" />Centro de atención</p>
     <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-lavender-magenta-950">Alertas</h1>
     <p className="mt-1 text-sm leading-6 text-gray-500">Productos que necesitan revisión.</p>
    </div>
    <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-bold text-lavender-magenta-700 transition-colors duration-200 ease-boutique hover:underline"><Icono nombre="flechaIzq" className="h-4 w-4" />Dashboard</Link>
   </div>
   <div className="hairline-gold mt-5" aria-hidden="true" />
  </header>
  <div className="flex flex-wrap gap-2">{[['todas','Todas',lista.length],['agotados','Agotados',agotados.length],['minimo','Bajo mínimo',minimo.length],['precio','Sin precio',precio.length]].map(([v,l,n])=><Link key={String(v)} href={`/admin/alertas?tipo=${v}`} className={`rounded-full px-4 py-2 text-sm font-bold transition-colors duration-200 ease-boutique ${tipo===v?'bg-lavender-magenta-700 text-white':'bg-white text-gray-600 ring-1 ring-lavender-magenta-100 hover:bg-lavender-magenta-50'}`}>{l} · {n}</Link>)}</div>
  <div className="mt-6 overflow-hidden rounded-boutique-lg border border-lavender-magenta-100 bg-white shadow-card">
   <div className="hidden grid-cols-[1fr_80px_90px_110px] gap-3 border-b border-gray-100 px-5 py-4 text-xs font-bold uppercase tracking-wide text-gray-400 sm:grid"><span>Producto</span><span>Stock</span><span>Mínimo</span><span>Estado</span></div>
   {lista.length?lista.map(p=><Link href={`/admin/productos/${p.id}`} key={p.id} className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 transition-colors duration-150 ease-boutique last:border-0 hover:bg-lavender-magenta-50 sm:grid sm:grid-cols-[1fr_80px_90px_110px] sm:items-center sm:gap-3">
    <div className="min-w-0"><p className="truncate text-sm font-bold text-gray-800">{p.nombre}</p><p className="truncate text-xs text-gray-400">{p.sku||'Sin SKU'}</p></div>
    <div><span className="text-xs font-semibold uppercase tracking-wide text-gray-400 sm:hidden">Stock: </span><span className="text-sm font-semibold text-gray-700">{p.cantidad_stock??0}</span></div>
    <div><span className="text-xs font-semibold uppercase tracking-wide text-gray-400 sm:hidden">Mínimo: </span><span className="text-sm text-gray-500">{p.stock_minimo??'—'}</span></div>
    <div><span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-bold ${Number(p.cantidad_stock||0)<=0?'bg-red-100 text-red-700':!p.precio?'bg-lavender-magenta-100 text-lavender-magenta-700':'bg-amber-100 text-amber-700'}`}>{Number(p.cantidad_stock||0)<=0?'Agotado':!p.precio?'Sin precio':'Bajo mínimo'}</span></div>
   </Link>):<div className="flex items-center justify-center gap-2 p-8 text-center text-sm text-gray-500"><Icono nombre="check" className="h-4 w-4 text-green-600" />No hay alertas en esta categoría.</div>}
  </div>
 </div>
}
