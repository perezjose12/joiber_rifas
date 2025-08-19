"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
type Purchase = {
    id: number;
    tickets: number;
    total_amount: number;
    moneda_pago: string;
    proof_url: string;
    users: {
        name: string;
        email: string;
        phone: string;
    };
    banks: {
        name: string;
    };
};

export default function AdminPurchasesPage() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPurchases = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/purcharses");
            const data = await res.json();
            setPurchases(data.purchases || []);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Reservas</h1>

            {loading && <p>Cargando...</p>}

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
                        <p>Total pagado: {p.total_amount} {p.moneda_pago}</p>
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
                        <div className="mt-4 flex justify-between">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer">Aceptar reserva</button>
                            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded cursor-pointer">Rechazar reserva</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}