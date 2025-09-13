"use client"

import { AdminHeader } from "@/components/admin/adminHeader"
import { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header fijo arriba */}
        <AdminHeader />

        {/* Contenido */}
        <main className="">
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}