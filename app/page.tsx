import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { RaffleSection } from "@/components/raffle-section"
import { PaymentMethods } from "@/components/payment-methods"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white">
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
