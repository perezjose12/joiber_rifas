import { supabasePublic } from "./supabasePublic";
export async function getRaffleProgress(raffleId: number) {
  const { data, error } = await supabasePublic.rpc("get_raffle_progress", { rid: raffleId });

  if (error) {
    console.error("Error obteniendo progreso:", error);
    return null;
  }

  // data es un array con 1 fila [{ total, vendidos, disponibles }]
  return data?.[0] ?? null;
}