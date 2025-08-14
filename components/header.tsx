import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-red-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">JS</span>
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-gray-900">Joiber Sevillano</h1>
              <p className="text-sm text-gray-600">Rifas Exclusivas</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <a href="#inicio" className="text-gray-700 hover:text-red-600 transition-colors">
              Inicio
            </a>
            <a href="#rifas" className="text-gray-700 hover:text-red-600 transition-colors">
              Rifas
            </a>
            <a href="#contacto" className="text-gray-700 hover:text-red-600 transition-colors">
              Contacto
            </a>
          </nav>

          <Button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold">Únete a la Rifa</Button>
        </div>
      </div>
    </header>
  )
}
