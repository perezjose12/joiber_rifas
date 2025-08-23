"use client";

import { useEffect, useState } from "react";

export function useEuroToVES() {
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch(
          `https://api.exchangeratesapi.io/v1/latest?access_key=TU_API_KEY&base=EUR&symbols=VES`
        );
        const data = await res.json();
        if (data.success) {
          setRate(data.rates.VES);
        }
      } catch (error) {
        console.error("Error fetching rate:", error);
      }
    };

    fetchRate();
  }, []);

  return rate;
}