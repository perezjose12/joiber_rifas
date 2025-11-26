"use client";

import { useEffect, useState } from "react";

type UserPurchase = {
  user_id: number;
  name: string;
  email: string;
  total_tickets: number;
};

function useTopPurchases(limit = 5) {
  const [users, setUsers] = useState<UserPurchase[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(
        `/api/admin/topPurchasesToday?limit=${limit}&offset=${offset}`
      );
      const json = await res.json();
      const data: UserPurchase[] = json.data ?? [];

      setUsers(prev => [...prev, ...data]); // Añadimos la siguiente página
      setOffset(prev => prev + limit);
      setHasMore(data.length === limit); // Si no trae todos los datos, no hay más
    } catch (err) {
      console.error("Error fetching top purchases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); // Carga la primera página
  }, []);

  return { users, hasMore, loading, fetchUsers };
}
export default function AdminPurchasesPage() {
  const { users, hasMore, loading, fetchUsers } = useTopPurchases(5);

  const maxTickets = Math.max(...users.map(u => u.total_tickets ?? 0));

  return (
    <div className="py-6">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Top compras de hoy</h2>

        <ul className="space-y-4">
          {loading && users.length === 0 && <p>Cargando...</p>}
          {users.map((user, index) => (
            <li
              key={`${user.user_id}-${index}`}
              className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm"
            >
              <h3 className="font-semibold">{user.name} ({user.email})</h3>
              <div className="w-full bg-gray-200 rounded h-6 relative">
                <div
                  className="bg-blue-600 h-6 rounded px-2 text-white flex items-center justify-end overflow-hidden"
                  style={{
                    width: `${maxTickets > 0 ? (user.total_tickets / maxTickets) * 100 : 0}%`
                  }}
                >
                  {user.total_tickets}
                </div>
              </div>
            </li>
          ))}
        </ul>

        {hasMore && !loading &&(
          <button
            disabled={loading}
            onClick={() => fetchUsers()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Cargando..." : "Cargar más"}
          </button>
        )}
      </div>
    </div>
  );
}