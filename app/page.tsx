import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { RaffleSection } from "@/components/raffleSection"
import { PaymentMethods } from "@/components/paymentMethods"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <RaffleSection />
        <PaymentMethods />
      </main>
      <Footer />
    </div>
  )
}
