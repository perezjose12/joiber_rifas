"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-red-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-20 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-lg">J Y M</span>
            </div>
            <div>
              <h1 className="font-serif font-bold text-xl text-gray-900">Rifas J Y M</h1>
            </div>
          </div>

          {/* Navegación Desktop */}
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

          {/* Botón menú móvil */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <a href="#inicio">Inicio</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="#rifas">Rifas</a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="#contacto">Contacto</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
