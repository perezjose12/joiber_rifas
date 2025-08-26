import { Gift } from "lucide-react";
import Swiper from "./swiper";
import Image from "next/image";
export function Hero() {
  return (
    <section id="inicio" className="py-10 px-4 dark:bg-gray-900">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center items-center">
            <Image
              src="/img/logo_4.png"
              alt="Logo"
              width={120}
              height={120}
              className="border border-gray-500 rounded-full bg-black w-26 h-26 object-cover pl-1"
            />
          </div>
          <h1 className="font-serif font-bold text-5xl md:text-6xl text-text-light dark:text-text-dark mb-6 pb-3 mt-7">
            MOTO BRF 0KM + IPhone 16 de Estrenar
          </h1>

          <Swiper />

          <div className="mt-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-green-600 dark:text-green-300" />
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  Por tan solo $1 por ticket
                </span>{" "}
              </p>
            </div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mt-6">
            Juega apenas se venda el 100% de los números. Todo depende de ustedes!!
          </p>


        </div>
      </div>
    </section>
  );
}