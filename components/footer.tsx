import { Instagram, Facebook } from "lucide-react"
import { TikTokIcon } from "@/components/ui/icons/TikTokIcon";
import Link from "next/link";
export function Footer() {
  return (
    <footer id="contacto" className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <p className="text-gray-300 leading-relaxed">
              Organizamos rifas transparentes y emocionantes con productos exclusivos. Contacto directo y métodos de
              pago seguros para toda Latinoamérica.
            </p>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg mb-4">Contacto Directo</h4>
            <div className="space-y-4">
              <div className="space-x-3">
                <Link href="https://www.instagram.com/rifas_jm.09/" target="_blank">
                  <Instagram className="h-7 w-7 text-red-400" />
                </Link>
              </div>

              <div className="flex items-center space-x-3">
                <Link href="https://www.facebook.com/JoiberSevillano" target="_blank">
                  <Facebook className="h-7 w-7 text-blue-400" />
                </Link>
              </div>

              <div className="flex items-center space-x-3">
                <Link href="https://www.tiktok.com/@joiber_734?_t=ZS-8zP6yw8J3xJ&_r=1" target="_blank">
                <TikTokIcon className="w-7 h-7 text-black" />
                </Link>
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
