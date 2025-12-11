import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer"; 
import {auth} from "@/lib/auth";
interface RequestQuery {
  searchParams: {
    limit?: string;
    offset?: string;
    date?: string;
  };
}

export async function GET(req: Request & RequestQuery) {
  const session = await auth();
  if (!session) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "2");
    const offset = parseInt(url.searchParams.get("offset") || "0");
    const dateParam = url.searchParams.get("date") || "";

    // Convertimos "today" a formato YYYY-MM-DD
    const p_date = dateParam === "today" 
      ? new Date().toISOString().split("T")[0] 
      : null;
    // Llamamos a la RPC con parámetros de paginación
    const { data, error } = await supabaseServer.rpc("tickets_users", {
      p_limit: limit,
      p_offset: offset,
      p_date
    });

    if (error) {
      console.error("❌ Supabase RPC error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Nos aseguramos que data sea un array
    const safeData = Array.isArray(data) ? data : [];

    return NextResponse.json({ data: safeData }, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}