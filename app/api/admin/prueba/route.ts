import { NextResponse } from "next/server";
import crypto from "crypto";

// Función de verificación de firma
function verifySignature(payload: string, signature: string) {
  const secret = process.env.RESEND_WEBHOOK_SECRET!;
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return hmac.trim().toLowerCase() === signature.trim().toLowerCase();
}

export async function POST() {
  try {
    // 🔹 Payload exacto de prueba
    const payloadObj = {
      created_at: "2025-09-04T23:29:47.864Z",
      data: {
        created_at: "2025-09-04",
        email_id: "b49354b7",
        from: "Rifas JM <noreply@rifas-jm.com>",
        subject: "Nuevo pedido de compra",
        to: ["rohyller@gmail.com"]
      },
      type: "email.sent"
    };

    const payload = JSON.stringify(payloadObj);

    // 🔹 Generar firma como lo haría Resend
    const signature = crypto.createHmac("sha256", process.env.RESEND_WEBHOOK_SECRET!).update(payload).digest("hex");

    // 🔹 Verificar firma
    const esValida = verifySignature(payload, signature);

    console.log("Payload:", payloadObj);
    console.log("Firma generada:", signature);
    console.log("Firma válida:", esValida);

    return NextResponse.json({
      payload: payloadObj,
      signature,
      valid: esValida
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    console.error("Error verificando firma:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}