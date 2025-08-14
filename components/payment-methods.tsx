"use client";

import { useState } from "react";
import Image from "next/image";
import FormularioPago from "./formulario-pago";
import { useTasa } from "../hooks/useTasaDiaBs";
import { VerifyTicket } from "./verifyTicket";
type Dato = { label: string; valor: string };
type Metodo = {
  id: string;
  nombre: string;
  icono: string;
  datos: Dato[];
};

export function PaymentMethods() {
  const { tasa } = useTasa();
  const [open, setOpen] = useState<string | null>(null);
  const ticketPrice = 1;
  const [tickets, setTickets] = useState(1);
  const maxTickets = 100;
  const minTickets = 1;
  const [copiadoId, setCopiadoId] = useState<string | null>(null);

  const quickSelect = [2, 5, 10, 20, 50, 100];

  const increment = () => setTickets((prev) => Math.min(prev + 1, maxTickets));
  const decrement = () => setTickets((prev) => Math.max(prev - 1, minTickets));
  const selectTickets = (value: number) =>
    setTickets(Math.min(Math.max(value, minTickets), maxTickets));
  const metodos: Metodo[] = [
    {
      id: "bancolombia",
      nombre: "Bancolombia",
      icono: "/bancolombia.png",
      datos: [
        { label: "Titular", valor: "Joiber Sevillano" },
        { label: "Cuenta Ahorros", valor: "01234567890" },
        { label: "Cédula", valor: "1012345678" },
        { label: "Total a pagar", valor: `${(tickets * ticketPrice).toFixed(2)} COP` },
      ],
      
    },
    {
      id: "zelle",
      nombre: "Zelle",
      icono: "/zelle.png",
      datos: [
        { label: "Titular", valor: "Joiber Sevillano" },
        { label: "Email", valor: "joiberSevillano@example.com" },
        { label: "Total a pagar", valor: `${(tickets * ticketPrice)} USD` },
      ],
    },
    {
      id: "binance",
      nombre: "Binance",
      icono: "/binance.png",
      datos: [
        { label: "Usuario", valor: "cryptoJoiber" },
        { label: "Email", valor: "Joiber@example.com" },
        { label: "Red", valor: "TRC20" },
        { label: "Total a pagar", valor: `${(tickets * ticketPrice)} USDT` },
      ],
    },
    {
      id: "bancoVenezuela",
      nombre: "Banco de Venezuela",
      icono: "/banco_venezuela.png",
      datos: [
        { label: "BDV", valor: "0102" },
        { label: "Titular", valor: "Joiber Sevillano" },
        { label: "Tipo de cuenta", valor: "Pago móvil" },
        { label: "Número de teléfono", valor: "0424435357" },
        { label: "C.I.", valor: "V-12345678" },
        { label: "Total a pagar", valor: `${(tickets * ticketPrice * (tasa || 1)).toFixed(2)} Bs` },
      ],
    },
  ];



  const handleCopy = async (texto: string, id: string) => {
    try {
      if (!navigator.clipboard) {
        // Fallback para navegadores antiguos
        const ta = document.createElement("textarea");
        ta.value = texto;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      } else {
        await navigator.clipboard.writeText(texto);
      }
      setCopiadoId(id);
      setTimeout(() => setCopiadoId(null), 1500);
    } catch {
      alert("No se pudo copiar. Intenta manualmente.");
    }
  };

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-4xl text-gray-900 mb-4">Métodos de Pago</h2>
          <p className="text-xl text-gray-600">Opciones seguras y accesibles para toda Latinoamérica</p>
        </div>

        <div className="flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-bold">COMPRAR TUS TICKETS</h2>
          <p className="text-sm text-gray-600 font-bold">Cada ticket cuesta $1</p>
          <p className="text-sm text-gray-600">
            Mínimo {minTickets} y Máximo {maxTickets} Tickets por Compra
          </p>

          {/* Selector +/- */}
          <div className="flex items-center space-x-4 my-2">
            <button onClick={decrement} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
              -
            </button>
            <input
              type="number"
              value={tickets}
              readOnly
              className="w-16 text-center border rounded px-2 py-1"
            />
            <button onClick={increment} className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
              +
            </button>
          </div>

          <p className="text-sm text-gray-600 mt-2">Selecciona una cantidad de Tickets</p>

          {/* Botones rápidos */}
          <div className="flex flex-wrap gap-2 mt-2">
            {quickSelect.map((num) => (
              <button
                key={num}
                onClick={() => selectTickets(num)}
                className={`px-3 py-1 rounded border ${
                  tickets === num ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <p className="text-gray-700 mt-2">
            Tickets seleccionados: <strong>{tickets}</strong>
          </p>
        </div>
      </div>

      {/* Métodos de pago */}
      <div className="max-w-7xl mx-auto space-y-4 mt-12">
        {metodos.map((m) => (
          <div key={m.id} className="border rounded-lg flex flex-col">
            <button
              onClick={() => setOpen(open === m.id ? null : m.id)}
              className="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-50"
              aria-expanded={open === m.id}
              aria-controls={`panel-${m.id}`}
            >
              <Image
                src={m.icono}
                alt={m.nombre}
                width={32}
                height={32}
                className="w-8 h-8 object-contain"
              />
              <span className="font-medium">{m.nombre}</span>
            </button>

            {open === m.id && (
              <div
                id={`panel-${m.id}`}
                className="bg-gray-100 p-3 border-t space-y-3 text-sm text-[1.0475rem]"
              >
                {/* Cada fila con su botón de copiar */}
                {m.datos.map((d, idx) => {
                  const rowId = `${m.id}-${idx}`;
                  const isCopied = copiadoId === rowId;
                  return (
                    <div
                      key={rowId}
                      className="flex items-center justify-between gap-3 bg-white rounded-md px-3 py-2 border"
                    >
                      <div className="truncate">
                        <span className="font-semibold">{d.label}:</span>{" "}
                        <span className="break-all">{d.valor}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(d.valor, rowId)}
                        className={`shrink-0 text-xs rounded px-2 py-1 border ${
                          isCopied
                            ? "bg-green-500 text-white border-green-500"
                            : "text-blue-600 hover:text-blue-800"
                        }`}
                        aria-label={`Copiar ${d.label}`}
                      >
                        {isCopied ? "Copiado" : "Copiar"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-600 mb-4">
          Ten en cuenta que el proceso de verificación y validación de tu compra puede tardar entre
          24 y 48 horas aproximadamente. Los tickets se enviarán a tu correo electrónico.
        </p>
      </div>

      <FormularioPago />
      <VerifyTicket />
    </section>
  );
}