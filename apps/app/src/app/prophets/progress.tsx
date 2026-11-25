import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnProgressSummary } from "@/components/learn-guide/learn-hub-screen";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { ProphetsTopicAside } from "@/components/prophets/prophets-aside";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureProphetsContent,
  getProphetsLessonCount,
  isProphetsContentReady,
} from "@/lib/prophets";
import { buildProphetsProgress } from "@/lib/prophets-progress";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureProphetsProgressLoaded,
  useProphetsCompletedCount,
} from "@/stores/prophets-progress-store";

/**
 * Lesson progress for the module. The summary is the same `LearnProgressSummary`
 * the hub shows as its progress row (P5-40, G-37); reassurance copy uses the
 * neutral tone (G-38). The old "Explore" links repeated the hub and are gone.
 */
export default function ProphetsProgressScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t } = useTranslation();
  useEnsureProphetsProgressLoaded();
  const completedCount = useProphetsCompletedCount();

  const content = useEnsureContent(ensureProphetsContent, isProphetsContentReady);
  const contentVersion = content.version;
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const snapshot = useMemo(
    () =>
      buildProphetsProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getProphetsLessonCount(),
      }),
    [completedCount, contentVersion],
  );

  return (
    <ScreenLayout
      eyebrow={t("prophets.eyebrow")}
      title={t("prophets.progressTitle")}
      subtitle={t("prophets.progressSubtitle")}
      onBack={() => goBackOrReplace(router, "/prophets" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/prophets/progress" />
      <LearnContentGate ready={content.ready} error={content.error} onRetry={content.retry}>
        <LearnSplitLayout aside={<ProphetsTopicAside />}>
          <Stagger>
            <JannahCallout tone="info">{t("prophets.progressIntro")}</JannahCallout>
            <LearnProgressSummary
              title={t("prophets.lessonsTitle")}
              completed={snapshot.lessonsCompleted}
              total={snapshot.lessonsTotal}
              hint={t("prophets.lessonsHint")}
            />
            <JannahDisclaimer textKey="prophets.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      </LearnContentGate>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/prophets/progress");
