import { useState } from "react";
import Swal from "sweetalert2";

interface AcceptReservationButtonProps {
    purchaseId: number;
    p_status: string;
    p_name: string;
    p_email: string;
    p_payment_ref: string;
    p_proof_url: string;
}

interface Ticket {
    ticket_id: number;
    numero: number;
}

export default function AcceptReservationButton({ purchaseId, p_status,p_name, p_email, p_payment_ref, p_proof_url }: AcceptReservationButtonProps) {
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
            const resTickets = await fetch("/api/admin/assingTickets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ purchaseId }),
            });

            const dataTickets = await resTickets.json();

            if (!resTickets.ok) {
                throw new Error(dataTickets.error || "Error asignando tickets");
            }
            // Aseguramos que tickets sea siempre array
            const tickets: Ticket[] = dataTickets.tickets ?? [];

            // 1️⃣ Enviar correo con Resend
            const resCorreo = await fetch("/api/admin/correoAdmin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    p_status: p_status,
                    p_tickets: tickets?.map(t => t.numero) ?? [],
                    p_name: p_name,
                    p_email: p_email,
                    p_payment_ref: p_payment_ref
                }),
            });
            const dataCorreo = await resCorreo.json();
            if (!resCorreo.ok) {
                throw new Error(dataCorreo.error || "Error enviando correo");
            }
            const res = await fetch('/api/admin/deleteImg', {
                method: 'POST',
                body: JSON.stringify({ imageUrl: p_proof_url }),
            });

            const dataImg = await res.json();

            if (!res.ok || (Array.isArray(dataImg) && dataImg.length === 0)) {
                console.error(dataImg.error || "Error al eliminar la imagen");
                alert(dataImg.error || "Error al eliminar la imagen");
            } else {
                console.log("Imagen eliminada:", dataImg);
            }
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