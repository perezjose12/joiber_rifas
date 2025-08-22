"use client"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import ThemeSwitcher from "../theme/ThemeSwitcher"
import Link from "next/link"
import Image from "next/image"
export function AdminHeader() {

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div>
            <Image
              src="/img/logo_2.png"
              alt="Logo"
              width={120}
              height={120}
            />
          </div>
        </div>
        <ThemeSwitcher />
        {/* Navegación Desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300">
            Inicio
          </Link>
          <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300">
            Dashboard
          </Link>

          <Link href="/admin/tickets" className="text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300">
            Tickets
          </Link>

          <Link href="/admin/images" className="text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300">
            Imágenes
          </Link>

          <Link href="/admin/users" className="text-gray-700 hover:text-blue-600 transition-colors dark:text-gray-300">
            Usuarios
          </Link>
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Cerrar sesión
          </Button>
        </nav>

        {/* Navegación Mobile */}
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
                <a href="/admin">Dashboard</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/admin/tickets">Tickets</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/admin/images">Imágenes</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/admin/usuarios">Usuarios</a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                🚪 Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
