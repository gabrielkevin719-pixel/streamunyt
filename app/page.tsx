"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { HowItWorks } from "@/components/how-it-works";
import { PricingSection } from "@/components/pricing-section";
import { CalculatorSection } from "@/components/calculator-section";
import { FaqSection } from "@/components/faq-section";
import { Footer } from "@/components/footer";
import { CheckoutModal } from "@/components/checkout-modal";

export default function Home() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setCheckoutOpen(true);
  };

  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <PricingSection onSelectPlan={handleSelectPlan} />
      <CalculatorSection />
      <FaqSection />
      <Footer />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        planId={selectedPlan}
      />
    </main>
  );
}
