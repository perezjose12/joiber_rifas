import { supabase } from "@/lib/supabase";

export async function GET() {
  const hoy = new Date().toISOString().slice(0, 10);

  // Revisar si ya existe la tasa de hoy
  const { data, error } = await supabase
    .from("conversiones")
    .select("*")
    .eq("fecha", hoy)
    .eq("moneda", "VES")
    .single();

  if (error && error.code !== "PGRST116") {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  let tasa = data?.tasa;

  // Si no existe, traemos la tasa de la API externa
  if (!tasa) {
    try {
      const res = await fetch("https://ve.dolarapi.com/v1/dolares/oficial");
      const json = await res.json();
      tasa = parseFloat(json.promedio);

      // Guardar en Supabase
      await supabase.from("conversiones").insert({ fecha: hoy, tasa });
    } catch (e) {
      console.error("Error obteniendo tasa externa:", e);
      tasa = 1; // fallback
    }
  }

  return new Response(JSON.stringify({ fecha: hoy, tasa }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}