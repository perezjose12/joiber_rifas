"use client";

import { useState } from "react";
import Image from "next/image";
import FormularioPago from "./formularioPago";
import { VerifyTicket } from "./verifyTicket";
type Dato = { label: string; valor: string };
type Metodo = {
  id: string;
  nombre: string;
  icono: string;
  datos: Dato[];
};

export function PaymentMethods() {
  const [open, setOpen] = useState<string | null>(null);
  const ticketPrice = 1;
  const [tickets, setTickets] = useState(2);
  const [inputValue, setInputValue] = useState("2");
  const maxTickets = 100;
  const minTickets = 2;
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const quickSelect = [2, 5, 10, 20, 30, 50, 70, 100];
  const validate = (val: string) => {
    const num = Number(val);
    if (val === "" || isNaN(num)) return `El número mínimo de tickets es ${minTickets}`;
    if (num < minTickets) return `El número mínimo de tickets es ${minTickets}`;
    if (num > maxTickets) return `El número máximo de tickets es ${maxTickets}`;
    return "";
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    // permitir que escriba solo números
    if (/^\d*$/.test(val)) {
      setInputValue(val);
      // Validación visual
      const num = Number(val);
      if (!isNaN(num)) {
        setTickets(num);
        setError("");
      }
      // validar
      const err = validate(val);
      setError(err);
    }
  };

  const increment = () => {
    const newVal = Math.min(maxTickets, tickets + 1);
    setTickets(newVal);
    setInputValue(String(newVal));
    setError(validate(String(newVal)));
  };

  const decrement = () => {
    const newVal = Math.max(minTickets, tickets - 1);
    setTickets(newVal);
    setInputValue(String(newVal));
    setError(validate(String(newVal)));
  };
  const selectTickets = (num: number) => {
    const clamped = Math.min(maxTickets, Math.max(minTickets, num));
    setTickets(clamped);
    setInputValue(String(clamped));
    setError(validate(String(clamped)));
  }
  const tasa_ves = 190.00;
  const metodos: Metodo[] = [
    {
      id: "bancoVenezuela",
      nombre: "Banco de Venezuela",
      icono: "/banco_venezuela.png",
      datos: [
        { label: "BDV", valor: "0102" },
        { label: "Tipo de cuenta", valor: "Pago móvil" },
        { label: "Número de teléfono", valor: "04127904821" },
        { label: "C.I", valor: "7416045" },
        { label: "Total a pagar en VES", valor: "" },
      ],
    },
    {
      id: "bancolombia",
      nombre: "Bancolombia",
      icono: "/bancolombia2.png",
      datos: [
        { label: "Cuenta Ahorros", valor: "23676047301" },
        { label: "Total a pagar en COP", valor: "" },
      ],
    },
    {
      id: "zelle",
      nombre: "Zelle",
      icono: "/zelle.png",
      datos: [
        { label: "Titular", valor: "Maria Montes" },
        { label: "Email", valor: "Marya18.m.4@gmail.com" },
        { label: "Total a pagar en USD", valor: "" },
      ],
    },
    {
      id: "binance",
      nombre: "Binance",
      icono: "/binance.png",
      datos: [
        { label: "Email", valor: "Joibersevillano15@gmail.com" },
        { label: "Binance ID: ", valor: "745620994" },
        { label: "Total a pagar en USDT", valor: "" },
      ],
    }
  ];
  const calcularTotal = (metodoId: string) => {
    switch (metodoId) {
      case "bancoVenezuela":
        return (tickets * ticketPrice * Number((tasa_ves) || 190.00)).toFixed(2);
      case "bancolombia":
        return (tickets * 4000).toFixed(2);
      case "zelle":
        return (tickets * ticketPrice);
      case "binance":
        return (tickets * ticketPrice);
      default:
        return "";
    }
  };


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
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-500" id="metodosPago">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-4xl text-gray-900 dark:text-gray-100 mb-4">Métodos de Pago</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">Opciones seguras y accesibles para toda Latinoamérica</p>
        </div>

        <div className="flex flex-col items-center justify-center p-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">COMPRAR TUS TICKETS</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-bold">Cada ticket cuesta $1</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Mínimo {minTickets} y Máximo {maxTickets} Tickets por Compra
          </p>
          {/* Mensaje de error */}
          {error && <p className="text-red-500 text-sm mt-1 mb-2">{error}</p>}
          {/* Selector +/- */}
          <div className="flex items-center space-x-4 my-2">
            <button onClick={decrement} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded">
              -
            </button>
            <input
              type="number"
              value={inputValue}
              onChange={handleChange}
              className={`w-16 text-center border rounded px-2 py-1 ${error ? "border-red-900 bg-red-800" : "border-gray-900"}`}
              min={minTickets}
              max={maxTickets}
            />
            <button onClick={increment} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded">
              +
            </button>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Selecciona una cantidad de Tickets</p>

          {/* Botones rápidos */}
          <div className="flex justify-center flex-wrap gap-3 mt-2">
            {quickSelect.map((num) => (
              <button
                key={num}
                onClick={() => selectTickets(num)}
                className={`px-3 py-1 rounded border ${tickets === num
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600"
                  } transition-colors duration-300`}
              >
                {num}
              </button>
            ))}
          </div>

          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Tickets seleccionados: <strong>{tickets}</strong>
          </p>
        </div>

      </div>

      {/* Métodos de pago */}
      <div className="max-w-7xl mx-auto space-y-4 mt-12">
        {metodos.map((m) => (
          <div key={m.id} className="border rounded-lg flex flex-col bg-white dark:bg-gray-800 transition-colors duration-500">
            <button
              onClick={() => setOpen(open === m.id ? null : m.id)}
              className="flex items-center gap-3 p-3 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300"
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
              <span className="font-medium text-gray-900 dark:text-gray-100">{m.nombre}</span>
            </button>

            {open === m.id && (
              <div
                id={`panel-${m.id}`}
                className="bg-gray-100 dark:bg-gray-700 p-3 border-t space-y-3 text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300"
              >
                {m.datos.map((d, idx) => {
                  const rowId = `${m.id}-${idx}`;
                  const isCopied = copiadoId === rowId;
                  const valorFinal = d.label.startsWith("Total a pagar") ? calcularTotal(m.id) : d.valor;

                  return (
                    <div
                      key={rowId}
                      className="flex items-center justify-between gap-3 bg-white dark:bg-gray-800 rounded-md px-3 py-2 border transition-colors duration-300"
                    >
                      <div className="truncate">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{d.label}:</span>{" "}
                        <span className="break-all text-gray-700 dark:text-gray-300">{valorFinal}</span>
                      </div>
                      <button
                        onClick={() => handleCopy(String(valorFinal), rowId)}
                        className={`shrink-0 text-xs rounded px-2 py-1 border ${isCopied
                          ? "bg-green-500 text-white border-green-500"
                          : "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                          } transition-colors duration-300`}
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
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Ten en cuenta que el proceso de verificación y validación de tu compra puede tardar entre
          24 y 48 horas aproximadamente. Los tickets se enviarán a tu correo electrónico.
        </p>
      </div>
      <div className="text-center mb-10 mt-10">
        <h2 className="font-serif font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">
          ¿Ya transferiste?
          Llena este formulario
          ⬇️
        </h2>
      </div>
      <FormularioPago tickets={tickets} tasaVes={tasa_ves} />
      <VerifyTicket />
      <div className="flex justify-center items-center gap-8 mt-12">
        <div className="w-18 h-18 relative">
          <a href="https://tripletachira.com/" target="_blank" className="cursor-pointer">
            <Image
              src="/img/tachira_logo.png"
              alt="tachira logo"
              fill
              className="object-contain"
            />
          </a>
        </div>
        <div className="w-30 h-30 relative">
          <a href="https://supergana.com.ve/" target="_blank" className="cursor-pointer">
            <Image
              src="/img/super_gana.png"
              alt="Super Gana"
              fill
              className="object-contain"
            />
          </a>
        </div>
        <div className="w-30 h-30 relative">
          <a href="https://www.instagram.com/conalot_ve/" target="_blank" className="cursor-pointer">
            <Image
              src="/img/conalot.png"
              alt="Conalot"
              fill
              className="object-contain"
            />
          </a>
        </div>
      </div>
    </section>
  );
}