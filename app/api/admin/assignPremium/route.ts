import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import {auth} from "@/lib/auth";

export async function POST(req: Request) {
    const { raffleId } = await req.json();

  // 1. Verificar si ya hay 4 premium
  const { data: premiumTickets, error } = await supabaseServer
    .from("tickets")
    .select(`
      id,
      numero,
      raffle_id,
      purchase_id,
      purchases (
        id,
        user_id,
        users (
          email
        )
      )
    `)
    .eq("raffle_id", raffleId)
    .eq("is_premium", true)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (premiumTickets && premiumTickets.length >= 4) {
    return NextResponse.json({
      message: "Ya existen tickets premium",
      tickets: premiumTickets,
    });
  }

  // 2. Ejecutar la función para asignar los que faltan
  const { error: rpcError } = await supabaseServer.rpc(
    "assign_premium_tickets",
    { p_raffle_id: raffleId }
  );

  if (rpcError) {
    return NextResponse.json({ error: rpcError.message }, { status: 500 });
  }

  // 3. Volver a consultar los premium (ahora sí con JOIN al usuario)
  const { data: finalPremium, error: fetchError } = await supabaseServer
    .from("tickets")
    .select(`
      id,
      numero,
      raffle_id,
      purchase_id,
      purchases (
        id,
        user_id,
        users (
          email
        )
      )
    `)
    .eq("raffle_id", raffleId)
    .eq("is_premium", true)
    .not("purchase_id", "is", null);
  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json({
    message: "Tickets premium asignados",
    tickets: finalPremium,
  });
}

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

  const { data: tickets, error } = await supabaseServer
    .from("tickets")
    .select(`
      id,
      numero,
      raffle_id,
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
    .eq("is_premium", true) 

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ tickets });
}