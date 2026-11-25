import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AqeedahTopicAside } from "@/components/aqeedah/aqeedah-aside";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnProgressSummary } from "@/components/learn-guide/learn-hub-screen";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { ensureAqeedahContent, getAqeedahLessonCount, isAqeedahContentReady } from "@/lib/aqeedah";
import { buildAqeedahProgress } from "@/lib/aqeedah-progress";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useAqeedahCompletedCount,
  useEnsureAqeedahProgressLoaded,
} from "@/stores/aqeedah-progress-store";

/**
 * Lesson progress for the module. The summary is the same `LearnProgressSummary`
 * the hub shows as its progress row (P5-40, G-37); reassurance copy uses the
 * neutral tone (G-38). The old "Explore" links repeated the hub and are gone.
 */
export default function AqeedahProgressScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t } = useTranslation();
  useEnsureAqeedahProgressLoaded();
  const completedCount = useAqeedahCompletedCount();

  const content = useEnsureContent(ensureAqeedahContent, isAqeedahContentReady);
  const contentVersion = content.version;
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const snapshot = useMemo(
    () =>
      buildAqeedahProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getAqeedahLessonCount(),
      }),
    [completedCount, contentVersion],
  );

  return (
    <ScreenLayout
      eyebrow={t("aqeedah.eyebrow")}
      title={t("aqeedah.progressTitle")}
      subtitle={t("aqeedah.progressSubtitle")}
      onBack={() => goBackOrReplace(router, "/aqeedah" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/aqeedah/progress" />
      <LearnContentGate ready={content.ready} error={content.error} onRetry={content.retry}>
        <LearnSplitLayout aside={<AqeedahTopicAside />}>
          <Stagger>
            <JannahCallout tone="info">{t("aqeedah.progressIntro")}</JannahCallout>
            <LearnProgressSummary
              title={t("aqeedah.lessonsTitle")}
              completed={snapshot.lessonsCompleted}
              total={snapshot.lessonsTotal}
              hint={t("aqeedah.lessonsHint")}
            />
            <JannahDisclaimer textKey="aqeedah.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      </LearnContentGate>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/aqeedah/progress");
