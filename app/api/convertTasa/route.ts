import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET() {
  try {
    // 1️⃣ Fecha de hoy en formato YYYY-MM-DD
    const today = new Date().toISOString().split("T")[0];

    // 2️⃣ Verificar si ya hay registro para hoy
    const { data: existing, error: selectError } = await supabaseServer
      .from("conversiones")
      .select("*")
      .eq("fecha", today)
      .eq("moneda", "VES")
      .single();

    if (selectError && selectError.code !== "PGRST116") throw selectError;

    if (existing) {
      // Ya existe la tasa de hoy
      return NextResponse.json({ rate: existing.tasa, date: existing.fecha, source: "db" });
    }

    // 3️⃣ No hay registro → obtenemos la tasa desde CurrencyAPI
    const res = await fetch(
      `https://api.currencyapi.com/v3/latest?apikey=${process.env.EXCHANGE_API_KEY}&base_currency=EUR&currencies=VES`
    );

    if (!res.ok) throw new Error("Error al obtener la tasa de CurrencyAPI");

    const data = await res.json();
    const rate = data.data?.VES?.value;

    if (!rate) throw new Error("No se obtuvo la tasa de CurrencyAPI");

    // 4️⃣ Insertar la nueva tasa en la base de datos
    const { error: insertError } = await supabaseServer
      .from("conversiones")
      .insert({
        fecha: today,
        moneda: "VES",
        tasa: rate,
      });

    if (insertError) throw insertError;

    // 5️⃣ Devolver la tasa recién insertada
    return NextResponse.json({ rate, date: today, source: "api" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}