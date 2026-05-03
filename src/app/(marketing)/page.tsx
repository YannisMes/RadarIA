import { Hero } from "@/components/marketing/Hero";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { SolutionSteps } from "@/components/marketing/SolutionSteps";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { Differentiation } from "@/components/marketing/Differentiation";
import { ExampleResult } from "@/components/marketing/ExampleResult";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FAQ } from "@/components/marketing/FAQ";
import { CTASection } from "@/components/marketing/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <SolutionSteps />
      <FeaturesSection />
      <Differentiation />
      <ExampleResult />
      <PricingSection />
      <FAQ />
      <CTASection />
    </>
  );
}
