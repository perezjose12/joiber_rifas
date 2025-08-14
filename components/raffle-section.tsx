import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Gift } from "lucide-react"
import Image from "next/image"
export function RaffleSection() {
  return (
    <section id="rifas" className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-4xl text-gray-900 mb-4">Rifa Actual</h2>
          <p className="text-xl text-gray-600">¡No te pierdas esta increíble oportunidad!</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-xl border-0">
            <div className="relative">
              <Image
                src="/kbr.png"
                alt="Productos de la rifa actual"
                className="w-full h-64 md:h-80 object-cover"
                width={500}
                height={500}
              />
              <Badge className="absolute top-4 left-4 bg-red-600 text-white font-semibold px-3 py-1">¡ACTIVA!</Badge>
            </div>

            <CardHeader className="pb-4">
              <CardTitle className="font-serif text-2xl md:text-3xl text-gray-900">
                Gran Rifa 2025 J Y M
              </CardTitle>
              <div className="">
                <p className="text-gray-600 mb-4">
                  Juega apenas se venda el 100% de los números, Todo depende de ustedes!!
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Números vendidos</p>
                    <p className="text-sm text-gray-600">1 / 4000</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Gift className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Precio</p>
                    <p className="text-sm text-gray-600">$1 por ticket</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-serif font-bold text-lg mb-4">Productos Incluidos:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                    <span>Moto KBR 600</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold">
                  Participar Ahora
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  Más Información
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
