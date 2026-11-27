import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LearnGuideHubScreen } from "@/components/learn-guide/learn-guide-screens";
import { ReciteAlongCard } from "@/components/quran/recite-along-card";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { ruqyahHubPassages } from "@/lib/recite-along/guides";
import { getRuqyahTopics, ruqyahGuideConfig } from "@/lib/ruqyah";
import { routeMetadata } from "@/lib/seo/route-metadata";

const SECTION_ICONS: Record<string, AppIcon> = {
  basics: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  verses: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
  "daily-protection": { ios: "shield.fill", android: "shield", web: "shield" },
  reminders: { ios: "info.circle.fill", android: "info", web: "info" },
};

export default function RuqyahScreen() {
  const { t } = useTranslation();
  // Refs only (surah + ayahs) — locale overlays never change them.
  const passages = useMemo(() => ruqyahHubPassages(getRuqyahTopics()), []);
  return (
    <LearnGuideHubScreen config={ruqyahGuideConfig} sectionIcons={SECTION_ICONS} showQuiz>
      {/* D68: recite the ruqyah verses along with the on-device listener (hidden on TV). */}
      <ReciteAlongCard
        passages={passages}
        title={t("reciteAlong.ruqyah.title")}
        body={t("reciteAlong.ruqyah.body")}
      />
    </LearnGuideHubScreen>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/ruqyah");
