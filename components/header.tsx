"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import ThemeSwitcher from "./theme/ThemeSwitcher";
import Image from "next/image"
import Link from "next/link"
export function Header() {
  return (
    <header className="sticky top-0 z-50 dark:bg-gray-900 backdrop-blur-sm border-b border-red-100"
      >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex justify-center items-center">
            <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-black dark:bg-transparent
                    pl-1">
              <Link href="/">
                <Image
                  src="/img/logo_4.png"
                  alt="Logo"
                  width={60}
                  height={60}
                  className="object-contain"
                />
              </Link>
            </div>
          </div>

          {/* Navegación Desktop */}
          <ThemeSwitcher />
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Inicio
            </Link>
            <Link href="#metodosPago" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Rifas
            </Link>
            <Link href="#contacto" className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Contacto
            </Link>
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
                <DropdownMenuItem asChild>
                  <Link href="/">Inicio</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#metodosPago">Rifas</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#contacto">Contacto</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
