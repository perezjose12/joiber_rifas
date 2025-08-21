import { supabaseServer } from '@/lib/supabaseServer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 🔹 Validaciones
    if (!body.p_raffle_id || typeof body.p_raffle_id !== "number") {
      return NextResponse.json({ error: "Raffle ID inválido" }, { status: 400 });
    }

    if (!body.p_tickets || typeof body.p_tickets !== "number" || body.p_tickets < 2 || body.p_tickets > 100) {
      return NextResponse.json({ error: "Número de tickets inválido (mínimo 2, máximo 100)" }, { status: 400 });
    }

    if (!body.p_user_email || typeof body.p_user_email !== "string" || !body.p_user_email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (!body.p_user_name || typeof body.p_user_name !== "string" || body.p_user_name.trim().length < 2) {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }

    if (!body.p_user_phone || typeof body.p_user_phone !== "string" || body.p_user_phone.trim().length < 6) {
      return NextResponse.json({ error: "Teléfono inválido" }, { status: 400 });
    }

    if (!body.p_payment_ref || typeof body.p_payment_ref !== "string" || body.p_payment_ref.trim().length < 4) {
      return NextResponse.json({ error: "Referencia de pago inválida" }, { status: 400 });
    }

    if (!body.p_proof_url || typeof body.p_proof_url !== "string" || !body.p_proof_url.startsWith("http")) {
      return NextResponse.json({ error: "URL de comprobante inválida" }, { status: 400 });
    }

    if (!body.p_bank_id || typeof body.p_bank_id !== "number") {
      return NextResponse.json({ error: "Banco inválido" }, { status: 400 });
    }

    if (!body.p_moneda_pago || typeof body.p_moneda_pago !== "string") {
      return NextResponse.json({ error: "Moneda de pago inválida" }, { status: 400 });
    }

    if (!body.p_total_amount || typeof body.p_total_amount !== "number" || body.p_total_amount <= 0) {
      return NextResponse.json({ error: "Monto total inválido" }, { status: 400 });
    }

    // 🔹 Llamada al procedimiento
    const { data, error } = await supabaseServer.rpc("reserve_tickets", body);

    if (error) {
      console.error("Error reservando tickets:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ tickets: data });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Error desconocido" }, { status: 500 });
  }
}