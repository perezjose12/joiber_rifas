import { useState } from 'react'
import Swal from 'sweetalert2'

type Ticket = {
  id: number
  raffle_id: number
  numero: number
  status: string
  is_premium: boolean
  is_winner: boolean
  purchase_id: number
}

type PurchaseWithTickets = {
  purchaseId: number
  status: string
  createdAt: string
  tickets: Ticket[]
}
export function VerifyTicket() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [ticketsByPurchase, setTicketsByPurchase] = useState<PurchaseWithTickets[]>([])

  const verificarTickets = async () => {
    if (!email) return Swal.fire('Error', 'Ingresa un email', 'error')

    setLoading(true)
    try {
      const res = await fetch('/api/verifyTicket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!data.exists || data.ticketsByPurchase.length === 0) {
        Swal.fire('No encontrado', 'No se encontraron tickets para este email', 'info')
        setTicketsByPurchase([])
      } else {
        Swal.fire('Éxito', 'Tickets encontrados', 'success')
        setTicketsByPurchase(data.ticketsByPurchase)
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido ❌'
      Swal.fire('Error', errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 text-center space-y-4 mt-12 dark:bg-gray-900">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        ¿Quieres verificar tus tickets? <br />
        <span className="text-gray-600 dark:text-gray-100 font-normal">
          Ingresa el correo aquí:
        </span>
      </h4>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Ingrese email para la verificación"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />

      <button
        type="button"
        onClick={verificarTickets}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 disabled:opacity-50"
      >
        {loading ? 'Verificando...' : 'Verificar mis tickets'}
      </button>

      {/* Mostrar tickets por purchase */}
      {ticketsByPurchase.map((purchase) => (
        <div key={purchase.purchaseId} className="mb-4 p-4 border rounded-lg">
          <h5 className="font-semibold">
            Compra #{purchase.purchaseId} - Estado: {purchase.status}
          </h5>
          <p className="text-sm text-gray-600 mb-2">
            Fecha: {new Date(purchase.createdAt).toLocaleString()}
          </p>
          <ul className="list-disc list-inside">
            {purchase.tickets.map((t: Ticket) => (
              <li key={t.id}>
                Ticket #{t.numero} | {t.is_premium ? 'Premium' : 'Normal'} | Estado: {t.status}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}