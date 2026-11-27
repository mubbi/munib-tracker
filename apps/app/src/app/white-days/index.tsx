import { LearnGuideHubScreen } from "@/components/learn-guide/learn-guide-screens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { whiteDaysGuideConfig } from "@/lib/white-days-guide";

const SECTION_ICONS: Record<string, AppIcon> = {
  what: { ios: "moon.circle.fill", android: "brightness_3", web: "brightness_3" },
  virtue: { ios: "star.fill", android: "star", web: "star" },
  practice: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
  related: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
  track: { ios: "checklist", android: "checklist", web: "checklist" },
};

export default function WhiteDaysScreen() {
  return (
    <LearnGuideHubScreen config={whiteDaysGuideConfig} sectionIcons={SECTION_ICONS} showQuiz />
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/white-days");
