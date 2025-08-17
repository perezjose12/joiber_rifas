"use client"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={() => signIn("google", { callbackUrl: "/admin" })}
        className="rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
      >
        Iniciar sesión con Google
      </button>
    </div>
  )
}