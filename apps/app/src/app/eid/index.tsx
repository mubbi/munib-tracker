import { LearnGuideHubScreen } from "@/components/learn-guide/learn-guide-screens";
import { eidGuideConfig } from "@/lib/eid-guide";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";

const SECTION_ICONS: Record<string, AppIcon> = {
  fitr: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
  adha: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
  prayer: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  sunnah: { ios: "star.fill", android: "star", web: "star" },
  "zakat-fitr": { ios: "banknote.fill", android: "payments", web: "payments" },
  udhiyah: { ios: "leaf.fill", android: "park", web: "park" },
};

export default function EidScreen() {
  return <LearnGuideHubScreen config={eidGuideConfig} sectionIcons={SECTION_ICONS} showQuiz />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/eid");
