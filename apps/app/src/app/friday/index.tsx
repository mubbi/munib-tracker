import { useTranslation } from "react-i18next";
import { LearnGuideHubScreen } from "@/components/learn-guide/learn-guide-screens";
import { ReciteAlongCard } from "@/components/quran/recite-along-card";
import { fridayGuideConfig } from "@/lib/friday-guide";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { fridayHubPassages } from "@/lib/recite-along/guides";
import { routeMetadata } from "@/lib/seo/route-metadata";

const SECTION_ICONS: Record<string, AppIcon> = {
  virtues: { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
  obligation: { ios: "building.columns.fill", android: "mosque", web: "mosque" },
  prepare: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  kahf: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  salawat: { ios: "heart.fill", android: "favorite", web: "favorite" },
  dua: { ios: "hands.sparkles.fill", android: "volunteer_activism", web: "volunteer_activism" },
};

export default function FridayScreen() {
  const { t } = useTranslation();
  return (
    <LearnGuideHubScreen config={fridayGuideConfig} sectionIcons={SECTION_ICONS}>
      {/* D68: recite al-Kahf along with the on-device listener (hidden on TV). */}
      <ReciteAlongCard
        passages={fridayHubPassages()}
        title={t("reciteAlong.kahf.title")}
        body={t("reciteAlong.kahf.body")}
      />
    </LearnGuideHubScreen>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/friday");
