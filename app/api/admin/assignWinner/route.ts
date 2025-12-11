import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import {auth} from "@/lib/auth";
// ---------------------- GET ----------------------
export async function GET(req: NextRequest) {
  const session = await auth();
    if (!session) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }
  const url = new URL(req.url);
  const raffleId = Number(url.searchParams.get("raffleId"));

  if (!raffleId) {
    return NextResponse.json({ error: "raffleId es requerido" }, { status: 400 });
  }

  const { data, error } = await supabaseServer
    .from("tickets")
    .select(`
      id,
      numero,
      raffle_id,
      is_winner,
      purchase_id,
      purchases (
        id,
        user_id,
        users (
          phone,
          email,
          name
        )
      )
    `)
    .eq("raffle_id", raffleId)
    .eq("is_winner", true)
    .not("purchase_id", "is", null); // solo tickets con comprador

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ winners: data });
}
// ---------------------- POST ----------------------
export async function POST(req: NextRequest) {
  const { raffleId, winnerCount } = await req.json();

  if (!raffleId) {
    return NextResponse.json({ error: "raffleId es requerido" }, { status: 400 });
  }

  // Llamar a la función PostgreSQL
  const { data, error } = await supabaseServer.rpc(
    "assign_winner_ticket",
    { p_raffle_id: raffleId, p_winner_count: winnerCount ?? 1 }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ winners: data });
}

