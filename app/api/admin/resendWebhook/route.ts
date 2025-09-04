import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    // ⚠️ Leemos el body crudo
    const rawBody = await req.text();

    // Parseamos JSON
    const body = JSON.parse(rawBody);
    const { type, data } = body;

    console.log("📩 Webhook recibido (sin firma):", type);
    console.log("📦 Datos:", data);

    // Insert en Supabase
    const { error } = await supabaseServer.from("resend_events").insert([
      {
        event_type: type,
        email_id: data?.email_id,
        to_email: Array.isArray(data?.to) ? data.to.join(", ") : data?.to || "",
        subject: data?.subject || "",
        status: data?.status || "pending",
        payload: JSON.stringify(data),
      },
    ]);

    if (error) {
      console.error("❌ Error guardando en Supabase:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    console.log("✅ Evento guardado en Supabase");
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("❌ Error en webhook:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}