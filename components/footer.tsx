import { Instagram, Facebook } from "lucide-react"
import { TikTokIcon } from "@/components/ui/icons/TikTokIcon";
export function Footer() {
  return (
    <footer id="contacto" className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-lg">JS</span>
              </div>
              <div>
                <h3 className="font-serif font-bold text-xl">Joiber Sevillano</h3>
                <p className="text-gray-400 text-sm">Rifas Exclusivas</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Organizamos rifas transparentes y emocionantes con productos exclusivos. Contacto directo y métodos de
              pago seguros para toda Latinoamérica.
            </p>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg mb-4">Contacto Directo</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Instagram className="h-5 w-5 text-red-400" />
                
                <div>
                  <p className="font-semibold">Instagram</p>
                  <a href="https://www.instagram.com/joiber_prueba123/" className="text-gray-300 hover:text-white transition-colors">
                    @joiber_prueba123
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Facebook className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-semibold">Telegram</p>
                  <a href="https://t.me/joibersevillano" className="text-gray-300 hover:text-white transition-colors">
                    @joibersevillano
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <TikTokIcon className="w-6 h-6 text-black" />
                <div>
                  <p className="font-semibold">Email</p>
                  <a href="mailto:joiber@rifas.com" className="text-gray-300 hover:text-white transition-colors">
                    @joiber@rifas.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Métodos de pago */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg mb-4">Métodos de Pago</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="text-gray-300">Bancolombia</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span className="text-gray-300">Zelle</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                <span className="text-gray-300">Binance</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-300">Venezuela</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-300">
                <strong className="text-white">Importante:</strong> Todos los pagos son procesados de forma manual.
                Contáctanos directamente para confirmar tu participación.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">© 2025 Joiber Sevillano - Rifas Exclusivas. Todos los derechos reservados.</p>
          <p className="text-sm text-gray-500 mt-2">Proceso no automatizado - Contacto directo requerido</p>
        </div>
      </div>
    </footer>
  )
}
