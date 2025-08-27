import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
// Define la interface
interface Banco {
  id: number;
  name: string;
}

// Mapa de bancos
const bancos: Record<number, Banco> = {
  1: { id: 1, name: "Banco de Venezuela" },
  2: { id: 2, name: "Bancolombia" },
  3: { id: 3, name: "Zelle" },
  4: { id: 4, name: "Binance" },
};
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const numeroBanco = data.p_bank_id; // viene de tu body
    const bancoSeleccionado = bancos[numeroBanco] || { id: 0, name: "Banco desconocido" };
    const html = `
      <h1>🎉 Nuevo pedido de compra</h1>
      <p><strong>Reserva ID: </strong> ${data.p_payment_ref}</p>
      <p><strong>Cantidad de tickets reservados: </strong> ${data.p_tickets}</p>
      <p><strong>Monto pagado: </strong> ${data.p_total_amount}</p>
      <p><strong>Moneda pago: </strong> ${data.p_moneda_pago}</p>
      <p><strong>Banco pago: </strong> ${bancoSeleccionado.name}</p>
      <p><strong>Estado: </strong> Pendiente de confirmación</p>
      <hr>
      <p>👉 Para ver los detalles completos del comprador entra al panel administrativo</p>
    `;

    await resend.emails.send({
      from: `${process.env.NEXT_PUBLIC_EMAIL_RESEND}`, 
      to: "perezjosemiguel079@gmail.com",
      subject: "Nuevo pedido de compra",
      html,
    });

    return Response.json({ message: "Correo enviado" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error enviando correo" }, { status: 500 });
  }
}