import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const html = `
      <h2>Nuevo formulario de compra</h2>
      <p><strong>Nombre:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Teléfono:</strong> ${data.telefono}</p>
      <p><strong>Número de compra:</strong> ${data.numberCompra}</p>
    `;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "perezjosemiguel079@gmail.com", // debe ser una dirección válida para pruebas
      subject: "Prueba Resend",
      html
    });

    return Response.json({ message: "Correo enviado" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Error enviando correo" }, { status: 500 });
  }
}