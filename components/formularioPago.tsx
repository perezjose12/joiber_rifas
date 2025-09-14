"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
type FormData = {
  email: string;
  name: string;
  telefono: string;
  numberCompra: string;
  archivo: FileList;
  banco: string
};
type FormularioProps = {
  tickets: number,
  tasaVes?: number
}
const bancos = [
  { id: 1, name: 'Banco de Venezuela', img: '/banco_venezuela.png', moneda: 'VES' },
  { id: 2, name: 'Bancolombia', img: '/bancolombia2.png', moneda: 'COP' },
  { id: 3, name: 'Zelle', img: '/zelle.png', moneda: 'USD' },
  { id: 4, name: 'Binance', img: '/binance.png', moneda: 'USD' },
]
const calcularTotal = (metodoId: number, tickets: number, ticketPrice: number, tasa_ves: number) => {
  switch (metodoId) {
    case 1:
      return (tickets * tasa_ves).toFixed(2);
    case 2:
      return (tickets * 4000).toFixed(2);
    case 3:
      return (tickets * ticketPrice).toFixed(2);
    case 4:
      return (tickets * ticketPrice).toFixed(2);
    default:
      return "";
  }
};
export default function FormularioPago({ tickets, tasaVes }: FormularioProps) {
  const { register, handleSubmit, setError, clearErrors, reset, formState: { errors } } = useForm<FormData>();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedBanco, setSelectedBanco] = useState(bancos[0]);
  const [moneda, setMoneda] = useState(bancos[0].moneda);
  const [loading, setLoading] = useState(false);
  const handleBancChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bancoId = Number(e.target.value); // Convertimos a número
    const banco = bancos.find(b => b.id === bancoId);
    if (banco) {
      setSelectedBanco(banco);
      setMoneda(banco.moneda); // Actualiza la moneda automáticamente
    }
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      setError("archivo", { type: "manual", message: "La imagen es obligatoria" });
      setPreview(null);
      setArchivo(null);
      return;
    }

    const file = files[0];

    // Validación de tamaño
    if (file.size > 1 * 1024 * 1024) {
      setError("archivo", { type: "manual", message: "El archivo debe ser menor a 3 MB" });
      setPreview(null);
      setArchivo(null);
      return;
    }

    // Validación de tipo
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("archivo", { type: "manual", message: "Solo se permiten imágenes JPG o PNG" });
      setPreview(null);
      setArchivo(null);
      return;
    }

    // Si pasa todas las validaciones
    clearErrors("archivo");
    setPreview(URL.createObjectURL(file));
    setArchivo(file); // 🔹 guardamos el archivo para enviarlo
  }
  const onSubmit = async (datos: FormData) => {
    if (tickets < 2 || tickets > 100) {
      Swal.fire({
        icon: "error",
        text: "No puedes comprar menos de 2 tickets o mas de 100 tickets",
      });
      return;
    }
    if (!archivo) {
      Swal.fire({
        icon: "error",
        text: "Tienes que seleccionar un archivo",
      });
      return;
    }
    setLoading(true); // 🔹 empieza el loading
    const formData = new FormData();
    formData.append('archivo', archivo);
    try {
      const res = await fetch("/api/sendImage", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      const totalAmount = calcularTotal(selectedBanco.id, tickets, 0.80, tasaVes || 190.00);
      if (res.ok && data.url) {
        setPreview(null);
        try {
          const body = {
            p_raffle_id: 1,
            p_tickets: tickets,
            p_user_email: datos.email,
            p_user_name: datos.name,
            p_user_phone: datos.telefono,
            p_payment_ref: datos.numberCompra,
            p_proof_url: data.url,
            p_bank_id: Number(selectedBanco.id),
            p_moneda_pago: moneda,
            p_total_amount: Number(totalAmount)
          };
          const reservarRes = await fetch('/api/reservar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
          });
          const result = await reservarRes.json();
          if (reservarRes.ok) {
            const totalAmount = calcularTotal(selectedBanco.id, tickets, 0.80, tasaVes || 190.00);
            const bodyTwo = {
              p_tickets: tickets,
              p_payment_ref: datos.numberCompra,
              p_bank_id: Number(selectedBanco.id),
              p_moneda_pago: moneda,
              p_total_amount: Number(totalAmount)
            };
            
            const enviarCorreoRes = await fetch('/api/correo', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyTwo) 
            });

            if (!enviarCorreoRes.ok) {
              console.error("Error enviando correo");
            }
            Swal.fire({
              title: "¡Enviado!",
              text: "Tus datos se enviaron correctamente y pendiente de revisión",
              icon: "success",
              confirmButtonText: "Aceptar"
            });
            reset();
            setPreview(null);
          } else {
            Swal.fire({
              title: "Error",
              text: result.error || "Ocurrió un error al enviar tu compra",
              icon: "error",
              confirmButtonText: "Aceptar"
            });
          }
        } catch (error) {
          console.error('Error reservando tickets:', error);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Ocurrio un error al enviar tus datos!",
          footer: '<a href="#">Error: data.error</a>'
        });
      }

    } catch (error) {
      console.error("Error al subir imagen:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow space-y-4 transition-colors duration-500"
      noValidate
    >
      <div>
        <label htmlFor="name" className="block mb-1 font-medium text-gray-900 dark:text-gray-100">
          <span className="text-red-500">* </span>Nombre Completo
        </label>
        <input
          type="text"
          id="name"
          placeholder="Juan Perez"
          className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          {...register("name", { required: "El nombre es obligatorio" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block mb-1 font-medium text-gray-900 dark:text-gray-100">
          <span className="text-red-500">* </span>Correo Electrónico
        </label>
        <input
          type="email"
          id="email"
          placeholder="juanperez@example.com"
          className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          {...register("email", {
            required: "El correo es obligatorio",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Formato de correo inválido"
            },
            minLength: {
              value: 5,
              message: "Debe tener al menos 5 caracteres"
            }
          })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="telefono" className="block mb-1 font-medium text-gray-900 dark:text-gray-100">
          <span className="text-red-500">* </span>Teléfono
        </label>
        <input
          type="tel"
          id="telefono"
          placeholder="+58416235098"
          className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          {...register("telefono", { required: "El teléfono es obligatorio" })}
        />
        {errors.telefono && (
          <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="banco" className="block mb-1 font-medium text-gray-900 dark:text-gray-100">
          <span className="text-red-500">*</span> Selecciona el banco al que hiciste la transferencia
        </label>
        <select
          id="banco"
          className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          {...register("banco", { required: "Debes seleccionar un banco" })}
          onChange={(e) => handleBancChange(e)}
        >
          {bancos.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        {errors.banco && (
          <p className="text-red-500 text-sm mt-1">{errors.banco.message}</p>
        )}
      </div>

      {/* Mostrar imagen y nombre del banco seleccionado */}
      <div className="flex items-center space-x-3 mt-2">
        <Image
          src={selectedBanco.img}
          alt={selectedBanco.name}
          className="w-10 h-10 object-contain"
          width={100} height={100}
        />
        <span className="font-medium text-gray-900 dark:text-gray-100">{selectedBanco.name}</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{moneda}</span>
      </div>

      <div>
        <label htmlFor="comprobante" className="block mb-1 font-medium text-gray-900 dark:text-gray-100">
          <span className="text-red-500">* </span>Nº de Comprobante
        </label>
        <input
          type="text"
          id="comprobante"
          placeholder="3001234567"
          className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          {...register("numberCompra", { required: "El Nº de Comprobante es obligatorio" })}
        />
        {errors.numberCompra && (
          <p className="text-red-500 text-sm mt-1">{errors.numberCompra.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-900 dark:text-gray-100">
          <span className="text-red-500">* </span>Comprobante de Pago
        </label>

        {/* Contenedor clicable */}
        <label
          htmlFor="archivo"
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-40 cursor-pointer hover:border-blue-500 transition-colors duration-300"
        >
          <Upload className="w-8 h-8 text-gray-400 dark:text-gray-300 mb-2" />
          <span className="text-gray-500 dark:text-gray-300">Haz click para subir una imagen</span>
          <input
            id="archivo"
            name="archivo"
            required
            type="file"
            accept=".jpg,.jpeg,.png,image/jpeg,image/png"
            className="hidden"
            onChange={(e) => handleFileChange(e)}
          />
        </label>
        {errors.archivo && (
          <p className="text-red-500 text-sm mt-1">{errors.archivo.message}</p>
        )}
        {preview && (
          <Image
            src={preview}
            alt="Preview"
            className="mt-2 max-h-40 rounded border"
            width={200} height={200}
          />
        )}
      </div>

      <button
        disabled={loading}
        type="submit"
        className="w-full bg-red-600 dark:bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-500 dark:hover:bg-red-400 transition-colors duration-300"
      >
        {loading ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}