import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { AiPracticeHighlight } from "@/components/ai-practice-highlight";
import { CtaBand } from "@/components/cta-band";
import { FaqPreview } from "@/components/faq-preview";
import { Hero } from "@/components/hero";
import { DeviceShowcase } from "@/components/home/device-showcase";
import {
  AudienceTeaser,
  CompareAndGuides,
  FeatureHub,
  HomeProductTour,
  HowItWorksTeaser,
  PrivacyBand,
} from "@/components/home/home-sections";
import { SoftwareJsonLd } from "@/components/json-ld";
import { LearnHighlight } from "@/components/learn-highlight";
import { StatsSection } from "@/components/stats-section";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home.meta");
  return pageMetadata({
    locale: await getLocale(),
    path: "/",
    title: t("title", { appName: APP_NAME }),
    description: t("description"),
  });
}

export default function Home() {
  return (
    <>
      <SoftwareJsonLd />
      <Hero />
      <StatsSection />
      <HomeProductTour />
      <FeatureHub />
      <AiPracticeHighlight />
      <DeviceShowcase />
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
