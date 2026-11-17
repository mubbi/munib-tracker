import type { Href } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { LearnTopicAside } from "@/components/learn-guide/learn-topic-aside";
import { getLearnDuaTopicsBySection } from "@/lib/learn-dua";
import { useStore } from "@/stores/create-store";
import { learnDuaProgressStore } from "@/stores/learn-dua-progress-store";

/** Desktop aside for Learn Dua pages: progress + topic list in hub order. */
export function LearnDuaTopicAside({ currentId }: { currentId?: string }) {
  const { t, i18n } = useTranslation();
  const completedIds = useStore(learnDuaProgressStore, (s) => s.completedTopicIds);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize on language change
  const topics = useMemo(
    () =>
      Object.values(getLearnDuaTopicsBySection())
        .flat()
        .map((topic) => ({
          id: topic.id,
          title: topic.title,
          href: `/learn-dua/${topic.id}` as Href,
        })),
    [i18n.language],
  );

  return (
    <LearnTopicAside
      title={t("learnDua.title")}
      hubHref={"/learn-dua" as Href}
      topics={topics}
      currentId={currentId}
      completedIds={completedIds}
    />
  );
}
