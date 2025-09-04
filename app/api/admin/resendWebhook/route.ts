import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseServer } from "@/lib/supabaseServer";

// 🛡️ Verificación de firma
function verifySignature(payload: string, signature: string) {
  const secret = process.env.RESEND_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return hmac === signature;
}

export async function POST(req: NextRequest) {
  try {
    // 📝 Obtener cabecera con la firma
    const signature = req.headers.get("resend-signature") || "";

    // ⚠️ El body se debe leer como texto crudo antes de parsear
    const rawBody = await req.text();

    // ✅ Verificar firma
    if (!verifySignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 📦 Parsear JSON una vez verificada la firma
    const body = JSON.parse(rawBody);
    const { type, data } = body;

    console.log("📩 Webhook recibido:", type);

    // 💾 Guardar en Supabase
    const { error } = await supabaseServer.from("resend_events").insert([
      {
        event_type: type,
        email_id: data?.id,
        to_email: data?.to,
        subject: data?.subject,
        status: data?.status,
        payload: data, // guardamos todo el JSON por si acaso
      },
    ]);

    if (error) {
      console.error("❌ Error guardando en Supabase:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}