import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnDuaTopicAside } from "@/components/learn-dua/learn-dua-aside";
import { LearnProgressSummary } from "@/components/learn-guide/learn-hub-screen";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Stagger } from "@/components/ui/stagger";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import {
  ensureLearnDuaContent,
  getLearnDuaLessonCount,
  isLearnDuaContentReady,
} from "@/lib/learn-dua";
import { buildLearnDuaProgress } from "@/lib/learn-dua-progress";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureLearnDuaProgressLoaded,
  useLearnDuaCompletedCount,
} from "@/stores/learn-dua-progress-store";

/**
 * Lesson progress for the module. The summary is the same `LearnProgressSummary`
 * the hub shows as its progress row (P5-40, G-37); reassurance copy uses the
 * neutral tone (G-38). The old "Explore" links repeated the hub and are gone.
 */
export default function LearnDuaProgressScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t } = useTranslation();
  useEnsureLearnDuaProgressLoaded();
  const completedCount = useLearnDuaCompletedCount();

  const content = useEnsureContent(ensureLearnDuaContent, isLearnDuaContentReady);
  const contentVersion = content.version;
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const snapshot = useMemo(
    () =>
      buildLearnDuaProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getLearnDuaLessonCount(),
      }),
    [completedCount, contentVersion],
  );

  return (
    <ScreenLayout
      reportKind="learn_dua"
      eyebrow={t("learnDua.eyebrow")}
      title={t("learnDua.progressTitle")}
      subtitle={t("learnDua.progressSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-dua" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/learn-dua/progress" />
      <LearnContentGate ready={content.ready} error={content.error} onRetry={content.retry}>
        <LearnSplitLayout aside={<LearnDuaTopicAside />}>
          <Stagger>
            <JannahCallout tone="info">{t("learnDua.progressIntro")}</JannahCallout>
            <LearnProgressSummary
              title={t("learnDua.lessonsTitle")}
              completed={snapshot.lessonsCompleted}
              total={snapshot.lessonsTotal}
              hint={t("learnDua.lessonsHint")}
            />
            <JannahDisclaimer textKey="learnDua.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      </LearnContentGate>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-dua/progress");
