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
// Hook personalizado para paginación
function useTickets(limit = 2, filter: "all" | "today" = "all") {
    const [users, setUsers] = useState<UserTickets[]>([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const fetchTickets = async (reset = false) => {
        if (loading) return;
        setLoading(true);

        const currentOffset = reset ? 0 : offset;
        const dateParam = filter === "today" ? `&date=today` : "";
        try {
            const res = await fetch(`/api/admin/ticketsUsers?limit=${limit}&offset=${currentOffset}${dateParam}`);
            const json = await res.json();
            const data: UserTickets[] = json.data ?? [];

            setUsers(prev => {
                const merged = reset ? data : [...prev, ...data];
                const unique = Array.from(new Map(merged.map((item) => [item.user_id, item])).values());
                return unique;
            });

            setOffset(currentOffset + limit);
            setHasMore(data.length === limit); // Si trae menos que limit, no hay más
        } catch (err) {
            console.error("Error fetching tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets(true); // Cargar primera página al montar
    }, [filter]);

    return { users, hasMore, loading, fetchTickets };
}
export default function AdminPurchasesPage() {
    const [filter, setFilter] = useState<"all" | "today">("all");
    const { users, hasMore, loading, fetchTickets } = useTickets(2, filter);

    return (
        <div className="py-6">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Tickets por usuario</h2>
                <div className="mb-4">
                    <label htmlFor="filter" className="mr-2 font-semibold">Filtrar:</label>
                    <select
                        id="filter"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as "all" | "today")}
                        className="px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all" className="dark:bg-gray-700 bg-white">Todos</option>
                        <option value="today" className="dark:bg-gray-700 bg-white">Top de hoy</option>
                    </select>
                </div>
                <ul className="space-y-4">
                    {users.filter(
                        (user): user is UserTickets & { ticket_numbers: number[] } =>
                            Array.isArray(user.ticket_numbers) &&
                            user.ticket_numbers.filter((n) => n != null).length > 0
                    ).map((user, index) => (
                        <li
                            key={`${user.user_id}-${index}`}
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
                        disabled={loading}
                        onClick={() => fetchTickets()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {loading ? "Cargando..." : "Cargar más"}
                    </button>
                )}
            </div>
            <TicketsChart data={users} />
        </div>
    );
}