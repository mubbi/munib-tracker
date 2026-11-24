import { LearnGuideHubScreen } from "@/components/learn-guide/learn-guide-screens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { newMuslimGuideConfig } from "@/lib/new-muslim";
import { routeMetadata } from "@/lib/seo/route-metadata";

const SECTION_ICONS: Record<string, AppIcon> = {
  start: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  pillars: { ios: "checklist", android: "checklist", web: "checklist" },
  faith: { ios: "circle.hexagongrid.fill", android: "hub", web: "hub" },
  prayer: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  "next-steps": {
    ios: "chart.line.uptrend.xyaxis",
    android: "trending_up",
    web: "trending_up",
  },
  faq: { ios: "questionmark.circle", android: "help", web: "help" },
};

export default function NewMuslimScreen() {
  return (
    <LearnGuideHubScreen config={newMuslimGuideConfig} sectionIcons={SECTION_ICONS} showQuiz />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/new-muslim");
