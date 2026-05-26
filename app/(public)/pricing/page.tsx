import type { Metadata } from "next";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for event organizers of all sizes.",
};

export default function PricingPage() {
  return (
    <>
      <PricingSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
