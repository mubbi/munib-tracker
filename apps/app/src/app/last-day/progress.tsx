import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnProgressSummary } from "@/components/learn-guide/learn-hub-screen";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { ensureLastDayContent, getLastDayLessonCount, isLastDayContentReady } from "@/lib/last-day";
import { buildLastDayProgress } from "@/lib/last-day-progress";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureLastDayProgressLoaded,
  useLastDayCompletedCount,
} from "@/stores/last-day-progress-store";

/**
 * Detail view of the Last Day lesson progress. Renders the same
 * `LearnProgressSummary` the hub shows as a row (G-37), with neutral
 * reassurance (G-38); the hub's Tools list is the one place for destinations.
 */
export default function LastDayProgressScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureLastDayProgressLoaded();
  const completedCount = useLastDayCompletedCount();

  const content = useEnsureContent(ensureLastDayContent, isLastDayContentReady);
  const contentVersion = content.version;
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const snapshot = useMemo(
    () =>
      buildLastDayProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getLastDayLessonCount(),
      }),
    [completedCount, contentVersion],
  );

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.progressTitle")}
      subtitle={t("lastDay.progressSubtitle")}
      onBack={() => goBackOrReplace(router, "/last-day" as Href)}
    >
      <Seo path="/last-day/progress" />
      <LearnContentGate ready={content.ready} error={content.error} onRetry={content.retry}>
        <Stagger>
          <JannahCallout tone="info">{t("lastDay.progressIntro")}</JannahCallout>
          <LearnProgressSummary
            title={t("lastDay.lessonsTitle")}
            completed={snapshot.lessonsCompleted}
            total={snapshot.lessonsTotal}
            hint={t("lastDay.lessonsHint")}
          />
          <JannahDisclaimer textKey="lastDay.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/last-day/progress");
