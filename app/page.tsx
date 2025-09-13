"use client"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { RaffleSection } from "@/components/raffleSection"
import { PaymentMethods } from "@/components/paymentMethods"
import { Footer } from "@/components/footer"
import SplashLoader from "@/components/SplashLoader";
import { useEffect, useState } from "react";
import { getRaffleProgress } from "@/lib/getRaffleProgress";
import Image from "next/image"

function useLockBodyScroll(lock: boolean) {
  useEffect(() => {
    if (lock) {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
      document.documentElement.style.overflow = ""
    }
  }, [lock])
}

export default function HomePage() {
  const raffleId = 1;
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    total: 0,
    vendidos: 0,
    disponibles: 0,
    porcentaje_vendido: 0,
  });

  useEffect(() => {
    async function fetchProgress() {
      const data = await getRaffleProgress(raffleId);

      const porcentaje = data.total > 0 ? Math.floor((data.vendidos / data.total) * 100) : 0;
      setProgress({ ...data, porcentaje_vendido: porcentaje });

      setLoading(false); // quitar splash solo cuando se cargue la rifa
    }

    fetchProgress();
  }, [raffleId]);

  const porcentaje = progress.porcentaje_vendido;
  const isSoldOut = porcentaje >= 100;

  useLockBodyScroll(isSoldOut);

  return (
    <div className="min-h-screen relative">
      {loading && isSoldOut && <SplashLoader />}
      <Header />
      <main>
        <Hero />
        <RaffleSection />
        <PaymentMethods />
      </main>
      <Footer />
      {isSoldOut && (
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
      )}
    </div>
  )
}
