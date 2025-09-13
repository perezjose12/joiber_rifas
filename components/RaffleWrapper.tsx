"use client";
import { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import { getRaffleProgress } from "@/lib/getRaffleProgress";

interface RaffleWrapperProps {
  raffleId: number;
  children: ReactNode;
}

export default function RaffleWrapper({ raffleId, children }: RaffleWrapperProps) {
  const [progress, setProgress] = useState({
    total: 0,
    vendidos: 0,
    disponibles: 0,
    porcentaje_vendido: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      const data = await getRaffleProgress(raffleId);

      const porcentaje = data.total > 0 ? Math.round((data.vendidos / data.total) * 100) : 0;

      setProgress({ ...data, porcentaje_vendido: porcentaje });
      setLoading(false);
    }

    fetchProgress();
  }, [raffleId]);

  if (loading) return <div>Cargando...</div>;

  if (progress.porcentaje_vendido >= 100) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white z-50">
        <Image src="/img/logo_4.png" alt="Logo Rifas JyM" width={200} height={200} />
        <h1 className="text-4xl font-bold mt-4">Plataforma cerrada</h1>
      </div>
    );
  }

  return <>{children}</>;
}