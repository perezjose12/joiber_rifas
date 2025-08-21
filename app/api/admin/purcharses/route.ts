import { supabaseServer } from "@/lib/supabaseServer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
// Tipos
type SupaUser = { name: string; email: string; phone: string };
type SupaBank = { name: string };

type Purchase = {
  id: number;
  tickets: number;
  total_amount: number;
  moneda_pago: string;
  proof_url: string | null;
  status: string;
  users: SupaUser;
  banks: SupaBank;
};
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const statusFilter = url.searchParams.get("status");
    // Obtener purchases y hacer join con users y banks
    const { data: purchases, error } = await supabaseServer
      .from("purchases")
      .select(`
        id,
        tickets,
        total_amount,
        moneda_pago,
        proof_url,
        status,
        users:users(name,email,phone),
        banks:banks(name)
      `)
      .eq("status", statusFilter);

    if (error) throw error;

    const purchasesSingle: Purchase[] = (purchases ?? []).map((p) => {
      const userObj = Array.isArray(p.users) ? p.users?.[0] : p.users;
      const bankObj = Array.isArray(p.banks) ? p.banks?.[0] : p.banks;

      return {
        id: p.id,
        tickets: p.tickets,
        total_amount: p.total_amount,
        moneda_pago: p.moneda_pago,
        proof_url: p.proof_url,
        status: p.status,
        users: userObj ?? { name: "", email: "", phone: "" },
        banks: bankObj ?? { name: "" },
      };
    });
    // Generar signed URLs si bucket privado
    const purchasesWithUrls = await Promise.all(
      purchasesSingle.map(async (p: Purchase) => {
        let proofUrl = p.proof_url;
        if (proofUrl && !proofUrl.startsWith("http")) {
          const { data, error } = await supabaseServer
            .storage
            .from("rifas_jym")
            .createSignedUrl(proofUrl, 60); // 60 segundos de expiración
          if (!error && data) proofUrl = data.signedUrl;
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