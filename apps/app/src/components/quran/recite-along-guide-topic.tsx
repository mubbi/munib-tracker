import type { LearnGuideTopic } from "@munib-tracker/shared/types";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ModuleTopicAside } from "@/components/jannah/module-topic-aside";
import { LearnGuideTopicContent } from "@/components/learn-guide/learn-guide-topic-content";
import { LearnTopicArticle } from "@/components/learn-guide/learn-topic-article";
import { ReciteAlongCard } from "@/components/quran/recite-along-card";
import { FatihahCheckCard } from "@/components/quran/recite-along-fatihah-card";
import { ReciteAlongInlineScope } from "@/components/quran/recite-along-inline";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import type { Passage } from "@/lib/quran-companion/types";
import type { LearnGuideConfig } from "@/lib/sectioned-guide";

/**
 * The shared sectioned-guide topic screen (`LearnGuideTopicScreen`) plus a
 * recite-along card under the article for topics that show passages to recite
 * (D68) — e.g. Friday → al-Kahf, Ruqyah → al-Fatihah / Ayat al-Kursi / the three
 * Quls. `passagesFor` decides per topic; an empty list renders no card. Where a
 * card is shown, the inline per-ayah buttons in the article are turned off so the
 * same ayahs aren't offered twice. `fatihahCheck` adds the compact "Check my
 * al-Fatihah" card on topics that teach a Salah recited with al-Fatihah.
 */
export function ReciteAlongGuideTopicScreen<S extends string>({
  config,
  passagesFor,
  cardTitle,
  fatihahCheck,
}: {
  config: LearnGuideConfig<S>;
  passagesFor: (topic: LearnGuideTopic) => Passage[];
  cardTitle?: (topic: LearnGuideTopic) => string | undefined;
  fatihahCheck?: (topic: LearnGuideTopic) => boolean;
}) {
  const { ns, basePath, guide } = config;
  const { t, i18n } = useTranslation();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const topics = useMemo(() => guide.getTopics(), [guide, i18n.language, overlayVersion]);
  const topic = topicId ? topics.find((item) => item.id === topicId) : undefined;
  const sectionTitle = t(`${ns}.title`);

  return (
    <LearnTopicArticle
      ns={ns}
      basePath={basePath}
      topic={topic}
      surface="jannah"
      aside={(current) => (
        <ModuleTopicAside
          title={sectionTitle}
          basePath={basePath}
          topics={topics}
          currentId={current.id}
        />
      )}
      // An array (not a fragment) so `Stagger` spaces the two cards apart.
      afterContent={(current) => [
        fatihahCheck?.(current) ? <FatihahCheckCard key="fatihah" compact /> : null,
        <ReciteAlongCard
          key="recite"
          passages={passagesFor(current)}
          title={cardTitle?.(current)}
        />,
      ]}
    >
      {(current) => (
        <ReciteAlongInlineScope enabled={passagesFor(current).length === 0}>
          <LearnGuideTopicContent topic={current} ns={ns} sectionTitle={sectionTitle} />
        </ReciteAlongInlineScope>
      )}
    </LearnTopicArticle>
  );
}
