"use client";

type UserTickets = {
  user_id: number;
  user_name: string;
  user_email: string;
  ticket_numbers: number[] | null;
  total_tickets: number;
};

type Props = {
  data: UserTickets[];
};

export default function SimpleTicketsBarChart({ data }: Props) {
  // Calcula el máximo de tickets para escalar las barras
  const maxTickets = Math.max(...data.map((u) => u.total_tickets), 1);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">Usuarios con más tickets</h2>

      {data.map((user) => (
        <div key={user.user_id}>
          <p className="font-semibold mb-1">
            {user.user_name} - {user.total_tickets} tickets
          </p>
          <div className="bg-gray-200 h-6 rounded">
            <div
              className="bg-blue-600 h-6 rounded"
              style={{ width: `${(user.total_tickets / maxTickets) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}