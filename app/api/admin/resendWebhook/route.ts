import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("resend-signature") || "";
    const rawBody = await req.text();

    const secret = process.env.RESEND_WEBHOOK_SECRET! as string;
    const hmac = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
    const digest = `sha256=${hmac}`;
    
    console.log("Firma recibida:", signature);
    console.log("Firma calculada:", digest);
    console.log("Raw body:", rawBody);
    
    if(digest !== signature) {
      console.error("❌ Firma no valida");
      return NextResponse.json({ error: "Firma no valida" }, { status: 401 });
    }
    // Parsear JSON
    const body = JSON.parse(rawBody);
    const { type, data } = body;

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

    // ✅ Evento guardado correctamente
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("❌ Error en webhook:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
