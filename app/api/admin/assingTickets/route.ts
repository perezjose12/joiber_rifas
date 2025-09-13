import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }
  try {
    const { purchaseId } = await req.json();
    if (!purchaseId) {
      return NextResponse.json(
        { error: "purchaseId es requerido" },
        { status: 400 }
      );
    }

    const { data: tickets, error: rpcError } = await supabaseServer
      .rpc("assign_tickets_to_purchase", { p_purchase_id: purchaseId });

    if (rpcError) throw rpcError;
    const assignedTickets = Array.isArray(tickets) ? tickets : [];
    if (assignedTickets.length === 0) {
      console.warn("No se asignaron tickets para esta compra:", purchaseId);
      return NextResponse.json(
        { error: "No se asignaron tickets para esta compra" },
        { status: 400 }
      );
    }
    await supabaseServer
      .from("purchases")
      .update({
        proof_url: null,
        status: 'approved'
      })
      .eq("id", purchaseId);


    return NextResponse.json({ tickets: assignedTickets });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}