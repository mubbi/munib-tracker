import { AchievementsSection } from "@/components/achievements-section";
import { Benefits } from "@/components/benefits";
import { CtaBand } from "@/components/cta-band";
import { FaqPreview } from "@/components/faq-preview";
import { FeatureBento } from "@/components/feature-bento";
import { FeaturePillars } from "@/components/feature-pillars";
import { Hero } from "@/components/hero";
import { LearnHighlight } from "@/components/learn-highlight";
import { OpenSourceBand } from "@/components/open-source-band";
import { StatsSection } from "@/components/stats-section";
import { TestimonialsSection } from "@/components/testimonials-section";

export default function Home() {
  return (
    <>
      <Hero />
      <StatsSection />
      <Benefits />
      <FeatureBento />
      <LearnHighlight />
      <FeaturePillars limit={6} />
      <TestimonialsSection />
      <AchievementsSection />
      <OpenSourceBand />
      <FaqPreview />
      <CtaBand />
    </>
  );
}
