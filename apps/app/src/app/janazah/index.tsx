import { LearnGuideHubScreen } from "@/components/learn-guide/learn-guide-screens";
import { janazahGuideConfig } from "@/lib/janazah-guide";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";

const SECTION_ICONS: Record<string, AppIcon> = {
  obligation: { ios: "person.3.fill", android: "groups", web: "groups" },
  prepare: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  salah: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  burial: { ios: "leaf.fill", android: "park", web: "park" },
  duas: {
    ios: "hands.and.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
  reminders: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
};

export default function JanazahScreen() {
  return <LearnGuideHubScreen config={janazahGuideConfig} sectionIcons={SECTION_ICONS} />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/janazah");
