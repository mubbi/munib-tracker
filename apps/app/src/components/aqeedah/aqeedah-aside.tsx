import type { Href } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { LearnTopicAside } from "@/components/learn-guide/learn-topic-aside";
import { getAqeedahTopicsBySection } from "@/lib/aqeedah";
import { aqeedahProgressStore } from "@/stores/aqeedah-progress-store";
import { useStore } from "@/stores/create-store";

/** Desktop aside for Aqeedah pages: progress + topic list in hub order. */
export function AqeedahTopicAside({ currentId }: { currentId?: string }) {
  const { t, i18n } = useTranslation();
  const completedIds = useStore(aqeedahProgressStore, (s) => s.completedTopicIds);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize on language change
  const topics = useMemo(
    () =>
      Object.values(getAqeedahTopicsBySection())
        .flat()
        .map((topic) => ({
          id: topic.id,
          title: topic.title,
          href: `/aqeedah/${topic.id}` as Href,
        })),
    [i18n.language],
  );

  return (
    <LearnTopicAside
      title={t("aqeedah.title")}
      hubHref={"/aqeedah" as Href}
      topics={topics}
      currentId={currentId}
      completedIds={completedIds}
    />
  );
}
