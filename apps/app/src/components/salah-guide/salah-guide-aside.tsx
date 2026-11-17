import type { Href } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { LearnTopicAside } from "@/components/learn-guide/learn-topic-aside";
import { getSalahGuideTopicsByJourney } from "@/lib/salah-guide";
import { useStore } from "@/stores/create-store";
import { salahGuideProgressStore } from "@/stores/salah-guide-progress-store";

/** Desktop aside for Salah Guide pages: progress + topic list in journey order. */
export function SalahGuideTopicAside({ currentId }: { currentId?: string }) {
  const { t, i18n } = useTranslation();
  const completedIds = useStore(salahGuideProgressStore, (s) => s.completedTopicIds);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize on language change
  const topics = useMemo(
    () =>
      Object.values(getSalahGuideTopicsByJourney())
        .flat()
        .map((topic) => ({
          id: topic.id,
          title: topic.title,
          href: (topic.id === "adhan" ? "/salah-guide/adhan" : `/salah-guide/${topic.id}`) as Href,
        })),
    [i18n.language],
  );

  return (
    <LearnTopicAside
      title={t("salahGuide.title")}
      hubHref={"/salah-guide" as Href}
      topics={topics}
      currentId={currentId}
      completedIds={completedIds}
    />
  );
}
