import { Button } from "@/components/ui/button"
import { Gift, Trophy, Users } from "lucide-react"

export function Hero() {
  return (
    <section id="inicio" className="py-20 px-4">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif font-bold text-5xl md:text-6xl text-gray-900 mb-6">
            ¡Participa y Gana!
            <span className="block text-red-600">Rifas de Productos Exclusivos</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Métodos de pago seguros y accesibles en Latinoamérica. Contáctanos directamente para más información y
            futuras rifas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-4">
              <Gift className="mr-2 h-5 w-5" />
              Ver Rifa Actual
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50 font-semibold px-8 py-4 bg-transparent"
            >
              Contactar Ahora
            </Button>
          </div>

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
