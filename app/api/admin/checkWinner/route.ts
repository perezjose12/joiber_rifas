// /pages/api/checkWinner.ts
import { supabaseServer } from "@/lib/supabaseServer";
import {auth} from "@/lib/auth";
import { NextRequest } from "next/server";
export async function POST(req: NextRequest) {
  const session = await auth();
    if (!session) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }
  try {
    const body = await req.json();
    const { numero, raffleId } = body;

    if (!numero || !raffleId) {
      return Response.json(
        { message: "Número y raffleId son requeridos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("tickets")
      .select(
        `
        id,
        numero,
        is_winner,
        purchase_id,
        purchases (
          id,
          payment_ref,
          status,
          users (
            id,
            name,
            email,
            phone
          )
        )
      `
      )
      .eq("numero", numero)
      .eq("raffle_id", raffleId)
      .single();

    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    if (!data) {
      return Response.json({ message: "Ticket no encontrado" }, { status: 404 });
    }

    return Response.json({
      winner: data.is_winner,
      ticket: data,
    });
  } catch (err: unknown) {
    let message = "Error inesperado";

    if (err instanceof Error) {
      message = err.message;
    }

    return Response.json({ message }, { status: 500 });
  }
}