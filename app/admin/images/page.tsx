"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AcceptReservationButton from "@/components/acceptPurchase/acceptReservationButton";
import Swal from "sweetalert2";
type Purchase = {
    id: number;
    tickets: number;
    total_amount: number;
    moneda_pago: string;
    proof_url: string | null;
    status: string;
    payment_ref: string;
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
    { label: "Pendiente", value: "pending" },
    { label: "Aprobada", value: "approved" },
    { label: "Cancelada", value: "cancelled" },
];

export default function AdminPurchasesPage() {
    const [status, setStatus] = useState("pending");
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 5; // cuantos quieres traer por página

    const fetchPurchases = async (reset = false) => {
        if (loading) return;
        setLoading(true);

        try {
            const currentPage = reset ? 1 : page;
            const res = await fetch(`/api/admin/purcharses?status=${status}&page=${currentPage}&limit=${LIMIT}`);
            const data = await res.json();

            if (res.ok) {
                const newPurchases: Purchase[] = data.purchases ?? [];
                setPurchases((prev) => reset ? newPurchases : [...prev, ...newPurchases]);

                // Si la cantidad traída es menor que el límite, no hay más
                if (newPurchases.length < LIMIT) setHasMore(false);
                else setHasMore(true);

                setPage(currentPage + 1);
            } else {
                console.error(data.error);
            }
        } catch (err) {
            console.error("Error fetching purchases:", err);
        } finally {
            setLoading(false);
        }
    };
    async function cancelarCompra(purchaseId: number, p_email: string, p_payment_ref: string) {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/cancelPurchase', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ purchaseId }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Error al cancelar la compra');
            }
            // 2️⃣ Enviar correo al usuario notificando la cancelación
            await fetch("/api/admin/correoAdmin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    p_status: "cancelled",
                    p_email: p_email,
                    p_payment_ref: p_payment_ref
                }),
            });
            // actualizar el estado local
            setPurchases((prev) =>
                prev.map((p) =>
                    p.id === purchaseId ? { ...p, status: 'cancelled', proof_url: null } : p
                )
            );
            Swal.fire({
                title: "Compra cancelada!",
                icon: "success",
                draggable: true
            });
            fetchPurchases();
        } catch (err) {
            if (err instanceof Error) {
                console.error('Error al cancelar compra:', err);
                alert(err.message);
            } else {
                console.error('Error inesperado:', err);
                alert('Error desconocido ❌');
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchPurchases(true);
    }, [status]);

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
                        <p>Referencia de pago: {p.payment_ref}</p>
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
                                <AcceptReservationButton
                                    purchaseId={p.id}
                                    p_status="approved"
                                    p_name={p.users.name}
                                    p_email={p.users.email}
                                    p_payment_ref={p.payment_ref}
                                    p_proof_url={p.proof_url ?? ""}
                                />
                                <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 
                                rounded cursor-pointer"
                                    onClick={() => cancelarCompra(p.id, p.users.email, p.payment_ref)}
                                    disabled={loading}>
                                    {loading ? "Cancelando..." : "Cancelar compra"}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Botón de cargar más */}
            {hasMore && !loading && (
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