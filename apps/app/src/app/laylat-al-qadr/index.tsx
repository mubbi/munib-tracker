import { LearnGuideHubScreen } from "@/components/learn-guide/learn-guide-screens";
import { laylatAlQadrGuideConfig } from "@/lib/laylat-al-qadr";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";

const SECTION_ICONS: Record<string, AppIcon> = {
  virtues: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  when: { ios: "clock.fill", android: "schedule", web: "schedule" },
  dua: {
    ios: "hands.and.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
  ibadah: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
  reminders: { ios: "info.circle.fill", android: "info", web: "info" },
};

export default function LaylatAlQadrScreen() {
  return (
    <LearnGuideHubScreen config={laylatAlQadrGuideConfig} sectionIcons={SECTION_ICONS} showQuiz />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/laylat-al-qadr");
