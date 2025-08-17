"use client"
import { AdminHeader } from "@/components/admin/adminHeader"
import { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header fijo arriba */}
        <AdminHeader />

        {/* Contenido */}
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}