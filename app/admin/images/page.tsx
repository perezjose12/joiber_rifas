"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import AcceptReservationButton from "@/components/acceptPurchase/acceptReservationButton";
type Purchase = {
    id: number;
    tickets: number;
    total_amount: number;
    moneda_pago: string;
    proof_url: string;
    status: string;
    users: {
        name: string;
        email: string;
        phone: string;
    };
    banks: {
        name: string;
    };
};
const statusOptions = [
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Cancelled", value: "cancelled" },
];

export default function AdminPurchasesPage() {
    const [status, setStatus] = useState("pending");
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 2; // cuantos quieres traer por página

    const fetchPurchases = useCallback(
        async (reset = false) => {
            setLoading(true);
            try {
                const res = await fetch(
                    `/api/admin/purcharses?status=${status}&page=${reset ? 1 : page}&limit=${LIMIT}`
                );
                const data = await res.json();

                if (reset) {
                    setPurchases(data.purchases || []);
                    setPage(2);
                } else {
                    setPurchases((prev) => {
                        const combined = [...prev, ...(data.purchases || [])];
                        const unique = combined.filter(
                            (p, index, self) => index === self.findIndex((x) => x.id === p.id)
                        );
                        return unique;
                    });
                    setPage((prev) => prev + 1);
                }

                // si devuelve menos del límite, significa que no hay más
                setHasMore((data.purchases || []).length === LIMIT);
            } catch (err) {
                console.error(err);
                if (reset) setPurchases([]);
            } finally {
                setLoading(false);
            }
        },
        [status, page] // dependencias del useCallback
    );

    useEffect(() => {
        fetchPurchases(true);
    }, [status, fetchPurchases]);

    return (
        <div className="px-4 py-8 bg-gray-100 dark:bg-gray-900">
            <h1 className="text-2xl font-bold mb-4">Reservas</h1>

            {/* Filtro de status */}
            <div className="mb-6 w-full max-w-xs">
                <label
                    htmlFor="status"
                    className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200"
                >
                    Filtrar por estado
                </label>
                <div className="relative">
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={loading}
                        className="block w-full appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {loading && purchases.length === 0 && <p>Cargando...</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {purchases.map((p) => (
                    <div
                        key={p.id}
                        className="border rounded p-4 shadow hover:shadow-lg transition"
                    >
                        <h2 className="font-semibold text-lg">{p.users.name}</h2>
                        <p>Email: {p.users.email}</p>
                        <p>Tel: {p.users.phone}</p>
                        <p>Tickets reservados: {p.tickets}</p>
                        <p>
                            Total pagado: {p.total_amount} {p.moneda_pago}
                        </p>
                        <p>Banco: {p.banks.name}</p>

                        {p.proof_url && (
                            <Image
                                width={500}
                                height={500}
                                src={p.proof_url}
                                alt="Comprobante"
                                className="mt-2 h-100 rounded"
                            />
                        )}
                        {p.status === "pending" && (
                            <div className="mt-4 flex justify-between">
                                <AcceptReservationButton purchaseId={p.id} />
                                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                                    Rechazar reserva
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Botón de cargar más */}
            {hasMore && (
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={() => fetchPurchases()}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow disabled:opacity-50"
                    >
                        {loading ? "Cargando..." : "Cargar más"}
                    </button>
                </div>
            )}
        </div>
    );
}