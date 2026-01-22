"use client"
import Image from "next/image"
export default function HomePage() {

  return (
    <div className="min-h-screen relative">
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center text-white z-50">
          <Image
            src="/img/logo_2.png"
            alt="Logo Rifas JyM"
            width={200}
            height={200}
            className="border border-gray-500 rounded-full bg-black w-26 h-26 object-cover pl-1"
          />
          <h1 className="text-4xl font-bold mt-4">Plataforma cerrada</h1>
        </div>
    </div>
  )
}
