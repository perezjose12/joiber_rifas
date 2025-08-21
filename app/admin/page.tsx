"use client"
import { useSession } from "next-auth/react" 
export default function AdminPage() {
  const { data: session } = useSession()
  return (
    <div className="pt-3">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <p className="text-gray-600 dark:text-gray-300">Bienvenido, aquí puedes gestionar rifas, tickets e imágenes.</p>
      {session?.user?.email && (
        <p className="mt-4 text-gray-800 dark:text-gray-100">
          Sesión iniciada como: <span className="font-semibold">{session.user.email}</span>
        </p>
      )}
    </div>
  )
}