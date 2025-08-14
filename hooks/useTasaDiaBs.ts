"use client";
import { useState, useEffect } from "react";

export function useTasa() {
  const [tasa, setTasa] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTasa() {
      try {
        const res = await fetch("/api/conversiones");
        const data = await res.json();
        setTasa(data.tasa);
      } catch (error) {
        console.error("Error obteniendo la tasa:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTasa();
  }, []);

  return { tasa, loading };
}