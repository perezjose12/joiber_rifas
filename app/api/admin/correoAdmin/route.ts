import { Resend } from "resend";
import {auth} from "@/lib/auth";
import { getFechaHoyFormateada } from "@/lib/getFecha"; 
import { NextRequest } from "next/server";
const resend = new Resend(process.env.RESEND_API_KEY);
// Define la interface
export async function POST(req: NextRequest) {
    const session = await auth();
    if (!session) {
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    try {
        const data = await req.json();
        const status = data.p_status;
        const ticketNumbers = Array.isArray(data.p_tickets) ? data.p_tickets : [];
        const ticketsHtml = ticketNumbers.length
            ? ticketNumbers
                .map(
                    (ticket: string, i: number) =>
                        `<div style="margin-bottom: 8px; background: #36373d; color: #fff; border-radius: 5px; padding: 10px;">
             🎟️ Ticket ${i + 1}: <strong>${ticket}</strong>
           </div>`
                )
                .join("")
            : "<p>No hay números comprados</p>";
        let html = "";
        if (status === "approved") {
            html = `
      <div style="font-family: Arial, sans-serif; color: #333; text-align: center;">
        <p>¡Hola <strong>${data.p_name}</strong>! Gracias por tu compra en las rifas JyM 🏆</p>
        <h1 style="color: #27F52E; font-size: 16.5px; padding-top: 20px">✅ ¡Felicidades, tus tickets han sido aprobados con éxito!</h1>
        <p style="padding-top: 20px;">✉️ <strong>Correo:</strong> ${data.p_email}</p>
        <p style="padding-top: 20px;">📅 <strong>Fecha de aprobación:</strong> ${getFechaHoyFormateada()}</p>
        <p style="padding-top: 20px;">Tickets comprados ${ticketNumbers.length}:</p>
        ${ticketsHtml}
        <p style="font-weight: bold; margin-top: 20px; padding-top: 20px;">
            ⚠️ Juega apenas se venda el 100% de los números. ¡Todo depende de ustedes!
        </p>
        </div>
    `;
        } else {
            html = `
      <h2>❌ Pedido de compra cancelado</h2>
      <p><strong>Reserva ID: </strong> ${data.p_payment_ref}</p>
      <p><strong>Algo falló: </strong></p>
      <p>Puede ser por la cantidad de dinero insuficiente para reservar la cantidad de tickets o datos erroneos</p>
      <p>El pedido de compra ha sido cancelado</p>
      <p><strong>Por favor ponte en contacto con nosotros. </strong></p>
      <hr>
      <p>⚠️ Juega apenas se venda el 100% de los números. Todo depende de ustedes!!</p>
    `;
        }
        await resend.emails.send({
            from: "Rifas JM <noreply@rifas-jm.com>",
            to: data.p_email,
            subject: "Pedido de tickets verificados",
            html,
        });

        return Response.json({ message: "Correo enviado" });
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Error enviando correo" }, { status: 500 });
    }
}