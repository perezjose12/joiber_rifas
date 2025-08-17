import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    // Recibimos el FormData
    const formData = await req.formData();

    // Obtenemos el archivo
    const file = formData.get("archivo");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validación de tipo
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      return NextResponse.json({ error: "Solo se permiten imágenes JPG o PNG" }, { status: 400 });
    }

    // Validación de tamaño (< 1 MB)
    if (file.size > 1 * 1024 * 1024) {
      return NextResponse.json({ error: "El archivo debe ser menor a 1 MB" }, { status: 400 });
    }

    // Convertimos a Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Nombre único dentro de la carpeta sbr
    const fileName = `sbr/${Date.now()}-${file.name}`;

    // Subimos al bucket privado rifas_jym
    const { error } = await supabaseServer.storage
      .from("rifas_jym")
      .upload(fileName, buffer, { contentType: file.type });

    if (error) throw error;

    // Obtenemos la URL pública
    const { data: publicData } = supabaseServer.storage
      .from("rifas_jym")
      .getPublicUrl(fileName);

    return NextResponse.json({ url: publicData.publicUrl });
  } catch (err) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}