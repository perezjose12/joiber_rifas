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
    const statusFilter = url.searchParams.get("status") ?? undefined;
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 5); 
    const offset = (page - 1) * limit;
    // Obtener purchases con join
    const { data: purchases, error } = await supabaseServer
      .from("purchases")
      .select(`
        id,
        tickets,
        total_amount,
        moneda_pago,
        proof_url,
        status,
        payment_ref,
        users:users!inner(name,email,phone),
        banks:banks!inner(name)
      `)
      .eq("status", statusFilter || "pending") // filtro opcional
      .range(offset, offset + limit - 1); // paginación

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
        payment_ref: p.payment_ref,
        users: userObj ?? { name: "", email: "", phone: "" },
        banks: bankObj ?? { name: "" },
      };
    });
    console.log(purchasesSingle);
    return new Response(JSON.stringify({ purchases: purchasesSingle }), { status: 200 });
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
}