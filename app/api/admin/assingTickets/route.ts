import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { purchaseId } = await req.json();

    if (!purchaseId) {
      return NextResponse.json(
        { error: "purchaseId es requerido" },
        { status: 400 }
      );
    }

    // Llamada a la función SQL, que ahora devuelve los tickets asignados
    const { data: tickets, error: rpcError } = await supabaseServer
      .rpc("assign_tickets_to_purchase", { p_purchase_id: purchaseId });

    if (rpcError) throw rpcError;
    // Actualizamos la compra (ejemplo: limpiar proof_url)

    await supabaseServer
      .from("purchases")
      .update({
        proof_url: null,   
        status: 'approved' 
      })
      .eq("id", purchaseId);
    const assignedTickets = Array.isArray(tickets) ? tickets : [];

    return NextResponse.json({ tickets: assignedTickets });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}