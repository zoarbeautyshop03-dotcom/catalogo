export default function Footer() {
  return (
    <footer className="mt-16 border-t border-rosa-pastel bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-gray-500 flex flex-col gap-2">
        <p className="font-display text-fucsia">ZOAR BEAUTY SHOP</p>
        <p>© {new Date().getFullYear()} Zoar Beauty Shop. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
