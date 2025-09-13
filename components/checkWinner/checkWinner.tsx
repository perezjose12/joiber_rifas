import { useState } from "react";
type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
};

type Purchase = {
    id: number;
    payment_ref: string;
    status: string;
    users: User;
};

type Ticket = {
    id: number;
    numero: string;
    is_winner: boolean;
    purchase_id: number | null;
    purchases: Purchase | null;
};

type CheckWinnerResponse =
    | { error: string }
    | {
        winner: boolean;
        ticket: Ticket;
    };
export default function CheckWinner({ raffleId }: { raffleId: number }) {
    const [numero, setNumero] = useState("");
    const [resultado, setResultado] = useState<CheckWinnerResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        if (!numero) return alert("Ingresa un número de ticket");

        setLoading(true);
        try {
            const res = await fetch("/api/admin/checkWinner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ numero: numero, raffleId }),
            });

            const data = await res.json();

            if (data.ticket) {
                setResultado(data);
            } else {
                setResultado({ error: "Ticket no encontrado" });
            }
        } catch (err) {
            setResultado({ error: `Error en la búsqueda, ${err}` });
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="p-4 border rounded-xl shadow-md">
            <h2 className="text-lg font-bold mb-2">Buscar Ticket Ganador</h2>
            <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="Número del ticket"
                className="border p-2 rounded mr-2"
            />
            <button
                onClick={handleCheck}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded"
            >
                {loading ? "Buscando..." : "Buscar"}
            </button>

            {resultado && "error" in resultado && (
                <p className="mt-3 text-red-600">{resultado.error}</p>
            )}

            {resultado && "ticket" in resultado && (
                <div className="mt-3 p-3 border rounded bg-gray-50 dark:bg-gray-800">
                   <p>{`Ticket #${resultado.ticket.numero}`}</p>
                    {resultado.ticket.purchases?.users ?(
                        <div className="mt-2">
                            <p><b>Nombre:</b> {resultado.ticket.purchases.users.name}</p>
                            <p><b>Email:</b> {resultado.ticket.purchases.users.email}</p>
                            <p><b>Teléfono:</b> {resultado.ticket.purchases.users.phone}</p>
                        </div>
                    ): (
                        <p className="mt-2 text-red-600">Ticket todavia no comprado</p>
                    )}
                </div>
            )}
        </section>
    );
}