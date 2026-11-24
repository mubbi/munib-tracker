import { LearnGuideHubScreen } from "@/components/learn-guide/learn-guide-screens";
import { islamicFinanceGuideConfig } from "@/lib/islamic-finance";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { routeMetadata } from "@/lib/seo/route-metadata";

const SECTION_ICONS: Record<string, AppIcon> = {
  principles: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  riba: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  trade: { ios: "banknote.fill", android: "payments", web: "payments" },
  giving: {
    ios: "hands.and.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
  takaful: { ios: "person.3.fill", android: "groups", web: "groups" },
  faq: { ios: "questionmark.circle", android: "help", web: "help" },
};

export default function FinanceScreen() {
  return <LearnGuideHubScreen config={islamicFinanceGuideConfig} sectionIcons={SECTION_ICONS} />;
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/finance");
