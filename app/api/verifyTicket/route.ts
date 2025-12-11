import { supabaseServer } from '@/lib/supabaseServer'
import { NextRequest } from 'next/server'
export async function POST(req: NextRequest) {
  const { email } = await req.json()

  // 1️⃣ Buscar usuario por email
  const { data: user, error: userError } = await supabaseServer
    .from('users')
    .select('id, email')
    .eq('email', email)
    .single()

  if (userError || !user) {
    return new Response(JSON.stringify({ exists: false, ticketsByPurchase: [] }), { status: 200 })
  }

  // 2️⃣ Buscar purchases activas del usuario
  const { data: purchases } = await supabaseServer
    .from('purchases')
    .select('id, status, tickets, created_at')
    .eq('user_id', user.id)
    .in('status', ['pending', 'approved', 'cancelled']) // solo compras activas

  if (!purchases || purchases.length === 0) {
    return new Response(JSON.stringify({ exists: false, ticketsByPurchase: [] }), { status: 200 })
  }

  // 3️⃣ Obtener tickets asociados a esas purchases
  const purchaseIds = purchases.map((p) => p.id)
  const { data: tickets } = await supabaseServer
    .from('tickets')
    .select('id, raffle_id, numero, status, is_premium, is_winner, purchase_id')
    .in('purchase_id', purchaseIds)

  // 4️⃣ Agrupar tickets por purchase
  const ticketsByPurchase = purchases.map((p) => ({
    purchaseId: p.id,
    status: p.status,
    createdAt: p.created_at,
    tickets: tickets?.filter((t) => t.purchase_id === p.id) || []
  }))

  return new Response(
    JSON.stringify({ exists: true, ticketsByPurchase }),
    { status: 200 }
  )
}