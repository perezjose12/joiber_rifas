"use client";
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
    const [winnerTickets, setWinnerTickets] = useState<PremiumTicket[]>([]);
    const [loadingWinner, setLoadingWinner] = useState(false);
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

    // --- Función para cargar tickets ganadores ---
    const fetchWinnerTickets = async () => {
        setLoadingWinner(true);
        try {
            const res = await fetch(`/api/admin/assignWinner?raffleId=${raffleId}`);
            const data = await res.json();
            if (data.winners) setWinnerTickets(data.winners);
        } catch (err) {
            console.error(err);
            setWinnerTickets([]);
        } finally {
            setLoadingWinner(false);
        }
    };

    // --- Cargar ambos al montar ---
    useEffect(() => {
        fetchPremiumTickets();
        fetchWinnerTickets();
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
    // --- Crear ganador ---
    const handleCreateWinner = async () => {
        setLoadingWinner(true);
        try {
            const res = await fetch("/api/admin/assignWinner", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ raffleId, winnerCount: 1 }),
            });
            const data = await res.json();
            if (data.winners) {
                await fetchWinnerTickets();
                Swal.fire({
                    title: "Ticket ganador creado!",
                    icon: "success",
                    draggable: true
                });
            } else {
                alert(data.message || "Error al asignar ganador");
            }
        } catch (err) {
            alert(`Error al asignar ganador ${err}`);
        } finally {
            setLoadingWinner(false);
        }
    };
    return (
        <div className="pt-6 px-6">
            <h1 className="text-2xl font-bold mb-4">Ganadores del ticket premium: </h1>
            {premiumTickets.length > 0 ? (
                <div className="mb-4 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                    <h2 className="font-semibold mb-2">Tickets Premium Existentes:</h2>
                    <ul>
                        {premiumTickets.map((t) => (
                            <li key={t.id}>
                                Ticket Nº {t.numero}
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
                {winnerTickets.length > 0 ? (
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-800">
                        <h2 className="font-semibold mb-2">Ganador existente:</h2>
                        <ul>
                            {winnerTickets.map((w) => (
                                <li key={w.id}>
                                    Ticket Nº {w.numero}
                                    <p>{w.purchases?.users?.name ?? ""}</p>
                                    <p>{w.purchases?.users?.email ?? ""}</p>
                                    <p>{w.purchases?.users?.phone ?? ""}</p>
                                </li>

                            ))}
                        </ul>
                    </div>
                ) : (
                    <button
                        onClick={handleCreateWinner}
                        disabled={loadingWinner}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700"
                    >
                        {loadingWinner ? "Creando..." : "Asignar Ganador"}
                    </button>
                )}
            </div>
        </div>
    )
}