import type { Metadata } from "next";
import { AiPracticeHighlight } from "@/components/ai-practice-highlight";
import { CtaBand } from "@/components/cta-band";
import { FaqPreview } from "@/components/faq-preview";
import { Hero } from "@/components/hero";
import {
  AudienceTeaser,
  CompareAndGuides,
  FeatureHub,
  HowItWorksTeaser,
  PrivacyBand,
} from "@/components/home/home-sections";
import { ProductTour } from "@/components/home/product-tour";
import { SoftwareJsonLd } from "@/components/json-ld";
import { LearnHighlight } from "@/components/learn-highlight";
import { StatsSection } from "@/components/stats-section";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/",
  title: "Munib Tracker: Salah Tracker, Qaza, Zikr & Qur'an Practice App",
  description:
    "A free Islamic app with no ads: track your five daily Salah, make up Qaza, keep daily Zikr, and read, learn and practise the Qur'an with on-device AI.",
});

export default function Home() {
  return (
    <>
      <SoftwareJsonLd />
      <Hero />
      <StatsSection />
      <ProductTour />
      <FeatureHub />
      <AiPracticeHighlight />
      <HowItWorksTeaser />
      <PrivacyBand />
      <AudienceTeaser />
      <LearnHighlight />
      <CompareAndGuides />
      <FaqPreview />
      <CtaBand />
    </>
  );
}
