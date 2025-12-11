import { NextResponse, NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer"; 
import {auth} from "@/lib/auth";


export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "5");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    // Llamamos a la RPC que devuelve todos los usuarios de hoy
    const { data, error } = await supabaseServer.rpc("get_top_purchases_today");

    if (error) {
      console.error("❌ Supabase RPC error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Paginamos manualmente con slice
    const safeData = Array.isArray(data) ? data.slice(offset, offset + limit) : [];

    return NextResponse.json({ data: safeData }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}