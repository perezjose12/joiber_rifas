import { supabaseServer } from '@/lib/supabaseServer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }
  const { purchaseId } = await req.json()

  const { data, error } = await supabaseServer
    .from('purchases')
    .update({
      status: 'cancelled',
      proof_url: null
    })
    .eq('id', purchaseId)
    .select()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ success: true, data }), { status: 200 })
}