"use client"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { RaffleSection } from "@/components/raffleSection"
import { PaymentMethods } from "@/components/paymentMethods"
import { Footer } from "@/components/footer"

import SplashLoader from "@/components/SplashLoader";
import { useEffect, useState } from "react";
export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500); 
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashLoader />; 
  }
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
