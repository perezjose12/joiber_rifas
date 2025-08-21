import { Gift } from "lucide-react";
import Swiper from "./swiper";

export function Hero() {
  return (
    <section id="inicio" className="py-20 px-4 dark:bg-gray-900">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif font-bold text-5xl md:text-6xl text-text-light dark:text-text-dark mb-6 pb-3">
            MOTO BRF 0KM + IPhone 16 de Estrenar
          </h1>

          <Swiper />

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed mt-4">
            Juega apenas se venda el 100% de los números. Todo depende de ustedes!!
          </p>

          <div className="mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <h3 className="font-serif font-bold text-lg text-text-light dark:text-text-dark mb-2">
                Pagos Seguros
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Múltiples métodos de pago regionales
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}