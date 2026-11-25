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
import { ensureBattlesContent, getBattlesLessonCount, isBattlesContentReady } from "@/lib/battles";
import { buildBattlesProgress } from "@/lib/battles-progress";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useBattlesCompletedCount,
  useEnsureBattlesProgressLoaded,
} from "@/stores/battles-progress-store";

/**
 * Lesson progress for the module. The summary is the same `LearnProgressSummary`
 * the hub shows as its progress row (P5-40, G-37); reassurance copy uses the
 * neutral tone (G-38). The old "Explore" links repeated the hub and are gone.
 */
export default function BattlesProgressScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  useEnsureBattlesProgressLoaded();
  const completedCount = useBattlesCompletedCount();

  const content = useEnsureContent(ensureBattlesContent, isBattlesContentReady);
  const contentVersion = content.version;
  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const snapshot = useMemo(
    () =>
      buildBattlesProgress({
        lessonsCompleted: completedCount,
        lessonsTotal: getBattlesLessonCount(),
      }),
    [completedCount, contentVersion],
  );

  return (
    <ScreenLayout
      eyebrow={t("battles.eyebrow")}
      title={t("battles.progressTitle")}
      subtitle={t("battles.progressSubtitle")}
      onBack={() => goBackOrReplace(router, "/battles" as Href)}
    >
      <Seo path="/battles/progress" />
      <LearnContentGate ready={content.ready} error={content.error} onRetry={content.retry}>
        <Stagger>
          <JannahCallout tone="info">{t("battles.progressIntro")}</JannahCallout>
          <LearnProgressSummary
            title={t("battles.lessonsTitle")}
            completed={snapshot.lessonsCompleted}
            total={snapshot.lessonsTotal}
            hint={t("battles.lessonsHint")}
          />
          <JannahDisclaimer textKey="battles.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/battles/progress");
