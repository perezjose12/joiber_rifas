"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import ThemeSwitcher from "./theme/ThemeSwitcher";
import Image from "next/image"
export function Header() {
  return (
    <header className="sticky top-0 z-50 dark:bg-gray-900 backdrop-blur-sm border-b border-red-100"
    style={{ zIndex: 9999999 }}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div>
              <Image
                src="/img/logo_4.png"
                alt="Logo"
                width={60}
                height={60}
              />
            </div>
          </div>

          {/* Navegación Desktop */}
          <ThemeSwitcher />
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#inicio" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Inicio
            </a>
            <a href="#rifas" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Rifas
            </a>
            <a href="#contacto" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
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
