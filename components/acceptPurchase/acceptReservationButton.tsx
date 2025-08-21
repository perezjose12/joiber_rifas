import { useState } from "react";
import Swal from "sweetalert2";

interface Props {
    purchaseId: number;
}

interface Ticket {
    ticket_id: number;
    numero: number;
}

export default function AcceptReservationButton({ purchaseId }: Props) {
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        const result = await Swal.fire({
            title: "¿Está seguro?",
            text: "Se asignarán los tickets de esta compra y se eliminará el comprobante de pago (imagen).",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, aceptar",
            cancelButtonText: "Cancelar",
        });

        if (!result.isConfirmed) return;
        setLoading(true);

        try {
            const res = await fetch("/api/admin/assingTickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ purchaseId }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error(data.error || "Error asignando tickets");
                alert(data.error || "Error asignando tickets");
            } else {
                // Aseguramos que tickets sea siempre array
                const tickets: Ticket[] = data.tickets ?? [];

                Swal.fire({
                    title: "¡Aceptado con éxito!",
                    text: tickets.length
                        ? `Tickets asignados: ${tickets.map((t) => t.numero).join(", ")}`
                        : "No se asignaron tickets (ya no había disponibles)",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    // Recarga la página
                    window.location.reload();
                });
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Error en la petición";
            console.error(message);
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleAccept}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer disabled:opacity-50"
        >
            {loading ? "Procesando..." : "Aceptar reserva"}
        </button>
    );
}