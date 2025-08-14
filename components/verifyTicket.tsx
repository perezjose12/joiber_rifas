export function VerifyTicket() {
  return (
    <section className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 text-center space-y-4 mt-12">
      <h4 className="text-lg font-semibold text-gray-800">
        ¿Quieres verificar tus tickets? <br />
        <span className="text-gray-600 font-normal">
          Ingresa el correo aquí:
        </span>
      </h4>

      <input
        type="email"
        name="email"
        id="email"
        placeholder="Ingrese email para la verificación"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
      >
        Verificar mis tickets
      </button>
    </section>
  );
}