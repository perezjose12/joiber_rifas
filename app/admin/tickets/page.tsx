"use client";

import { useEffect, useState } from "react";
import TicketsChart from "@/components/charts/chartTickets";

type UserTickets = {
  user_id: number;
  user_name: string;
  user_email: string;
  ticket_numbers: number[] | null;
  total_tickets: number;
};

export default function AdminPurchasesPage() {
    const [users, setUsers] = useState<UserTickets[]>([]);
    const [offset, setOffset] = useState(0);
    const limit = 2;
    const [hasMore, setHasMore] = useState(true);

    const fetchTickets = async () => {
        const res = await fetch(`/api/admin/ticketsUsers?limit=${limit}&offset=${offset}`);
        const data: UserTickets[] = await res.json();

        setUsers(prev => [...prev, ...data]);
        setOffset(prev => prev + limit);

        if (data.length < limit) setHasMore(false);
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <div className="py-6">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Tickets por usuario</h2>
                <ul className="space-y-4">
                    {users.map(user => (
                        <li
                            key={user.user_id}
                            className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm"
                        >
                            <h3 className="font-semibold">
                                {user.user_name} ({user.user_email})
                            </h3>
                            <p>
                                <strong>Números:</strong> {(user.ticket_numbers ?? []).join(", ")}
                            </p>
                        </li>
                    ))}
                </ul>
                {hasMore && (
                    <button
                        onClick={fetchTickets}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Cargar más
                    </button>
                )}
            </div>
            <TicketsChart data={users} />
        </div>
    );
}