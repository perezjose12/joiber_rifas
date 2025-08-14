"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
type FormData = {
  email: string;
  name: string;
  telefono: string;
  numberCompra: string;
  archivo: FileList;
};
export default function FormularioPago() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const onSubmit = (data: FormData) => {
    if (!data.archivo || data.archivo.length === 0) {
      console.log("No se seleccionó archivo");
      return;
    }

    const file = data.archivo[0];
    console.log(file);
    alert("Formulario enviado correctamente!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow space-y-4"
    noValidate>
      <div>
        <label htmlFor="name" className="block mb-1 font-medium"><span className="text-red-500">* </span>Nombre Completo</label>
        <input
          type="text"
          id="name"
          placeholder="Joiber Sevillano"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("name", { required: "El nombre es obligatorio", })}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block mb-1 font-medium"><span className="text-red-500">* </span>Correo Electrónico</label>
        <input
          type="email"
          id="email"
          placeholder="joiber@example.com"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <label htmlFor="telefono" className="block mb-1 font-medium"><span className="text-red-500">* </span>Teléfono</label>
        <input
          type="tel"
          id="telefono"
          placeholder="3001234567"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("telefono", { required: "El teléfono es obligatorio" })}
        />
        {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
      </div>

      <div>
        <label htmlFor="comprobante" className="block mb-1 font-medium"><span className="text-red-500">* </span>Nº de Comprobante</label>
        <input
          type="text"
          id="comprobante"
          placeholder="3001234567"
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register("numberCompra", { required: "El Nº de Comprobante es obligatorio" })}
          onChange={(e) => { handleFileChange(e); }}
        />
        {errors.numberCompra&& <p className="text-red-500 text-sm mt-1">{errors.numberCompra.message}</p>}
      </div>

      <div>
        <label className="block mb-1 font-medium">
          <span className="text-red-500">* </span>Comprobante de Pago
        </label>

        {/* Contenedor clicable */}
        <label
          htmlFor="archivo"
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40 cursor-pointer hover:border-blue-500 transition"
        >
          <Upload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-gray-500">Haz click para subir una imagen</span>
          <input
            id="archivo"
            required
            type="file"
            accept="image/*"
            {...register("archivo", { required: "La imagen es obligatoria" })}
            onChange={(e) => { handleFileChange(e); }}
            className="hidden"
          />
        </label>
        {errors.archivo && <p className="text-red-500 text-sm mt-1">{errors.archivo.message}</p>}
        {preview && (
          <Image src={preview} alt="Preview" className="mt-2 max-h-40 rounded border" />
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded hover:bg-red-500 transition"
      >
        Enviar
      </button>
    </form>
    
  );
}