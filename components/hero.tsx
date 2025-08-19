
import { Gift, Trophy, Users } from "lucide-react"
import Image from "next/image"
export function Hero() {
  return (
    <section id="inicio" className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif font-bold text-5xl md:text-6xl text-gray-900 mb-6 pb-3">
            ¡Participa y Gana!
          </h1>
          <Image
            src="/kbr.png"
            alt="Productos de la rifa actual"
            className="w-full h-64 md:h-80 object-cover"
            width={500}
            height={500}
          />
          <p className="text-xl text-gray-600 mb-8 leading-relaxed mt-4">
            Métodos de pago seguros y accesibles en Latinoamérica. Contáctanos directamente para más información y
            futuras rifas.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-serif font-bold text-lg mb-2">Productos Exclusivos</h3>
              <p className="text-gray-600">Rifas de productos únicos y de alta calidad</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="font-serif font-bold text-lg mb-2">Comunidad Confiable</h3>
              <p className="text-gray-600">Proceso transparente y contacto directo</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-serif font-bold text-lg mb-2">Pagos Seguros</h3>
              <p className="text-gray-600">Múltiples métodos de pago regionales</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
