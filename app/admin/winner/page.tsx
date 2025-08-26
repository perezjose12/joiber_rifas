"use client";
import CheckWinner from "@/components/checkWinner/checkWinner";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
type PremiumTicket = {
    id: number;
    numero: number;
    raffle_id: number;
    purchase_id: number | null;
    purchases?: {
        id: number;
        user_id: number;
        users?: {
            phone: string;
            email: string;
            name?: string; // si también lo quieres traer
        } | null;
    } | null;
};
export default function AdminWinnerPage() {
    const [premiumTickets, setPremiumTickets] = useState<PremiumTicket[]>([]);
    const [loadingPremium, setLoadingPremium] = useState(false);

    const raffleId = 1;

    // --- Función para cargar tickets premium ---
    const fetchPremiumTickets = async () => {
        setLoadingPremium(true);
        try {
            const res = await fetch(`/api/admin/assignPremium?raffleId=${raffleId}`);
            const data = await res.json();

            if (data.tickets) setPremiumTickets(data.tickets);
        } catch (err) {
            console.error(err);
            setPremiumTickets([]);
        } finally {
            setLoadingPremium(false);
        }
    };

    // --- Cargar ambos al montar ---
    useEffect(() => {
        fetchPremiumTickets();
    }, []);

    const handleCreate = async () => {
        setLoadingPremium(true);
        try {
            const res = await fetch("/api/admin/assignPremium", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ raffleId }),
            });
            const data = await res.json();

            if (data.tickets) {
                await fetchPremiumTickets();
                Swal.fire({
                    title: "Tickets premium creados!",
                    icon: "success",
                    draggable: true
                });
            } else {
                alert(data.message || "Error");
            }
        } catch (err) {
            alert(`Error al crear tickets premium ${err}`);
        } finally {
            setLoadingPremium(false);
        }
    };
    return (
        <div className="pt-6 px-6">
            <h1 className="text-2xl font-bold mb-4">Ganadores del ticket premium: </h1>
            {premiumTickets.length > 0 ? (
                <div className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h2 className="font-semibold mb-2">Tickets Premium Existentes:</h2>
                    <ul>
                        {premiumTickets.map((t, index) => (
                            <li key={`${t.id}-${index}`}>
                                <p>Ticket Nº {t.numero}</p>
                                <p>{t.purchases?.users?.name ?? ""}</p>
                                <p>{t.purchases?.users?.email ?? ""}</p>
                                <p>{t.purchases?.users?.phone ?? ""}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <button
                    onClick={handleCreate}
                    disabled={loadingPremium}
                    className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
                >
                    {loadingPremium ? "Creando..." : "Crear Tickets Premium"}
                </button>
            )}
            {/* Ganador */}
            <div>
                <h1 className="text-2xl font-bold mb-2">Ganador de la rifa:</h1>
                <CheckWinner raffleId={raffleId} />
            </div>
        </div>
    )
}