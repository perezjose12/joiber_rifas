import { useState, useEffect } from "react";

type Conversion = {
  rate: number;
  date: string;
  source: "db" | "api";
};

export function useEurToVes() {
  const [conversion, setConversion] = useState<Conversion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversion = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/convertTasa");
        const data = await res.json();
        if (!res.ok || data.error) {
          setError(data.error || "Error desconocido");
        } else {
          setConversion({
            rate: data.rate,
            date: data.date,
            source: data.source,
          });
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchConversion();
  }, []);

  return { conversion, loading, error };
}