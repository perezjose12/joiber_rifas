import { Resend } from "resend";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
const resend = new Resend(process.env.RESEND_API_KEY);
// Define la interface
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    try {
        const data = await req.json();
        const status = data.p_status;
        const ticketNumbers = Array.isArray(data.p_tickets) ? data.p_tickets : [];

        let html = "";
        if (status === "approved") {
            html = `
      <h2>🎉 Pedido de compra de tickets aceptado</h2>
      <p><strong>Reserva ID: </strong> ${data.p_payment_ref}</p>
      <p><strong>Números comprados:</strong> ${ticketNumbers.join(", ") || "No hay números"}</p>
      <hr>
      <p>⚠️ Juega apenas se venda el 100% de los números. Todo depende de ustedes!!</p>
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