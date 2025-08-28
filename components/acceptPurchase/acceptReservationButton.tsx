import { useState } from "react";
import Swal from "sweetalert2";

interface AcceptReservationButtonProps {
  purchaseId: number;
  p_status: string;
  p_email: string;
  p_payment_ref: string;
}

interface Ticket {
    ticket_id: number;
    numero: number;
}

export default function AcceptReservationButton({ purchaseId,p_status,p_email,p_payment_ref}: AcceptReservationButtonProps) {
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

                // 1️⃣ Enviar correo con Resend
                await fetch("/api/admin/correoAdmin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        p_status: p_status,
                        p_tickets: tickets?.map(t => t.numero) ?? [],
                        p_email: p_email,
                        p_payment_ref: p_payment_ref
                    }),
                });

                // 2️⃣ Mostrar Swal con los tickets asignados
                await Swal.fire({
                    title: "¡Aceptado con éxito!",
                    text: tickets.length
                        ? `Tickets asignados: ${tickets.map((t) => t.numero).join(", ")}`
                        : "No se asignaron tickets (ya no había disponibles)",
                    icon: "success",
                    confirmButtonText: "Aceptar"
                });

                window.location.reload();
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