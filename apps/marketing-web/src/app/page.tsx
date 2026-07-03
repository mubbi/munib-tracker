import { AchievementsSection } from "@/components/achievements-section";
import { CtaBand } from "@/components/cta-band";
import { FaqPreview } from "@/components/faq-preview";
import { FeatureGrid } from "@/components/feature-grid";
import { FeaturePillars } from "@/components/feature-pillars";
import { Hero } from "@/components/hero";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ValueProps } from "@/components/value-props";

export default function Home() {
  return (
    <>
      <Hero />
      <ValueProps />
      <FeatureGrid />
      <FeaturePillars limit={3} />
      <TestimonialsSection />
      <AchievementsSection />
      <FaqPreview />
      <CtaBand />
    </>
  );
}
