import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer"; 
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
interface RequestQuery {
  searchParams: {
    limit?: string;
    offset?: string;
  };
}

export async function GET(req: Request & RequestQuery) {
  const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }
  try {
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") || "2");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const { data, error } = await supabaseServer.rpc("tickets_users");

    if (error) {
      console.error("❌ Supabase RPC error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Nos aseguramos que data sea un array
    const safeData = Array.isArray(data) ? data : [];

    // Aplicamos paginación con slice
    const paginatedData = safeData.slice(offset, offset + limit);
    console.log(paginatedData);
    return NextResponse.json(paginatedData, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}