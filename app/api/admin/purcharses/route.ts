import { supabaseServer } from "@/lib/supabaseServer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
type Purchase = {
  id: number;
  tickets: number;
  total_amount: number;
  moneda_pago: string;
  proof_url: string;
  users: { name: string; email: string; phone: string }[]; 
  banks: { name: string }[]; 
};
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    // Obtener purchases y hacer join con users y banks
    const { data: purchases, error } = await supabaseServer
      .from("purchases")
      .select(`
        id,
        tickets,
        total_amount,
        moneda_pago,
        proof_url,
        users!inner(name,email,phone),
        banks!inner(name)
      `);
    if (error) throw error;
 
    // Generar signed URLs si bucket privado
    const purchasesWithUrls = await Promise.all(
      purchases.map(async (p: Purchase) => {
        let proofUrl = p.proof_url;

        if (!proofUrl.startsWith("http")) {
          const { data, error } = await supabaseServer
            .storage
            .from("rifas_jym")
            .createSignedUrl(proofUrl, 60); 
          if (!error) proofUrl = data.signedUrl;
        }

        return { ...p, proof_url: proofUrl };
      })
    );

    return new Response(JSON.stringify({ purchases: purchasesWithUrls }), { status: 200 });
  } catch (err: unknown) {
    let message = "Error desconocido";

    if (err instanceof Error) {
      message = err.message;
    }

    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}