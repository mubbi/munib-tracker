import type { Href } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { LearnTopicAside } from "@/components/learn-guide/learn-topic-aside";
import {
  getQuranGuideJourneyOrder,
  getQuranGuideTopicRoute,
  getQuranGuideTopicsByJourney,
} from "@/lib/quran-guide";
import { useStore } from "@/stores/create-store";
import { quranGuideProgressStore } from "@/stores/quran-guide-progress-store";

/**
 * Desktop aside for every Learn Qur'an page (generic articles and dedicated
 * screens like Revelation / Letters): module progress + topic list in hub order.
 */
export function QuranGuideTopicAside({ currentId }: { currentId?: string }) {
  const { t, i18n } = useTranslation();
  const completedIds = useStore(quranGuideProgressStore, (s) => s.completedTopicIds);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize on language change
  const topics = useMemo(() => {
    const byJourney = getQuranGuideTopicsByJourney();
    return getQuranGuideJourneyOrder()
      .flatMap((phase) => byJourney[phase] ?? [])
      .filter((topic) => !topic.comingSoon)
      .map((topic) => ({
        id: topic.id,
        title: topic.title,
        href: getQuranGuideTopicRoute(topic.id) as Href,
      }));
  }, [i18n.language]);

  return (
    <LearnTopicAside
      title={t("learnQuran.title")}
      hubHref={"/learn-quran" as Href}
      topics={topics}
      currentId={currentId}
      completedIds={completedIds}
    />
  );
}
