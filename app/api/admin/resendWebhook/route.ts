import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { type, data } = body;

    const { error } = await supabaseServer.from("resend_events").insert([
      {
        event_type: type,
        email_id: data?.id,
        to_email: data?.to,
        subject: data?.subject,
        status: data?.status,
        payload: data, 
      },
    ]);

    if (error) {
      console.error("Error guardando en supabase:", error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error en webhook:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}