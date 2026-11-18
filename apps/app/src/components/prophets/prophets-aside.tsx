import type { Href } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { LearnTopicAside } from "@/components/learn-guide/learn-topic-aside";
import { getProphetsTopicsBySection } from "@/lib/prophets";
import { useStore } from "@/stores/create-store";
import { prophetsProgressStore } from "@/stores/prophets-progress-store";

/** Desktop aside for Prophets pages: progress + topic list in hub order. */
export function ProphetsTopicAside({ currentId }: { currentId?: string }) {
  const { t, i18n } = useTranslation();
  const completedIds = useStore(prophetsProgressStore, (s) => s.completedTopicIds);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize on language change
  const topics = useMemo(
    () =>
      Object.values(getProphetsTopicsBySection())
        .flat()
        .map((topic) => ({
          id: topic.id,
          title: topic.title,
          href: `/prophets/${topic.id}` as Href,
        })),
    [i18n.language],
  );

  return (
    <LearnTopicAside
      title={t("prophets.title")}
      hubHref={"/prophets" as Href}
      topics={topics}
      currentId={currentId}
      completedIds={completedIds}
    />
  );
}
