"use client";
import { useEffect, useState } from "react";
import { getRaffleProgress } from "@/lib/getRaffleProgress";

export default function RaffleProgress({ raffleId }: { raffleId: number }) {
  const [progress, setProgress] = useState({ total: 0, vendidos: 0, disponibles: 0 });

  useEffect(() => {
    getRaffleProgress(raffleId).then(setProgress);
  }, [raffleId]);

  const percentage = progress.total > 0 
    ? Math.round((progress.vendidos / progress.total) * 100) 
    : 0;

  return (
    <div className="w-full max-w-lg">
      <div className="flex justify-between mb-2 text-sm text-gray-600 dark:text-gray-100">
        <span>{progress.vendidos} vendidos</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
        <div
          className="text-green-600 dark:text-gray-100 h-6 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{progress.disponibles} disponibles</p>
    </div>
  );
}