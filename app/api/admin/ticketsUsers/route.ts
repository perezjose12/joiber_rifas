import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer"; // client con service_role

export async function GET() {
  try {
    const { data, error } = await supabaseServer.rpc("tickets_users");

    if (error) {
      console.error("❌ Supabase RPC error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}