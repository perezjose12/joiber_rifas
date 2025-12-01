import { Card, CardContent } from "@/components/ui/card";
import { Users, Gift } from "lucide-react";
import RaffleProgress from "./progress/raffleProgress";
export function RaffleSection() {
  return (
    <section id="rifas" className="py-0 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-xl border-0 pt-3 bg-white dark:bg-slate-800 transition-colors duration-500">
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-amber-600" />
                  <div className="w-full">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Números vendidos
                    </p>
                    <RaffleProgress raffleId={1} />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Gift className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Precio</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">100 bs por ticket</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}