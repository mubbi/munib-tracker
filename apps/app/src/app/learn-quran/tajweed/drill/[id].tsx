import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { QuranGuideClipPlayButton } from "@/components/quran-guide/ayah-play-button";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { DrillTakeCard } from "@/components/tajweed-coaching/drill-take-card";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { LESSON_DRILL_HEAD } from "@/lib/quran-companion/pronunciation/judge";
import {
  ensureQuranGuideContent,
  getQuranGuideTajweedLesson,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { recordCoachingDrill } from "@/lib/tajweed-coaching/actions";

export function generateStaticParams(): Array<{ id: string }> {
  return Object.keys(LESSON_DRILL_HEAD).map((id) => ({ id }));
}

/**
 * Phase 6 "Practise this sound" (§11 Phase 6). Plays the lesson's reference
 * audio, then listens through Quran Lab's SDK (`listen()` owns the microphone).
 * Feedback is one of three lines and never names a rule as broken. Only heads
 * the loaded calibration validates are scored. No Tilawa session runs here.
 * Each verdict is also recorded for NF-3.15 coaching (counts + spacing only).
 */
export default function TajweedDrillScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lessonId = Array.isArray(id) ? id[0] : id;
  const head = lessonId ? LESSON_DRILL_HEAD[lessonId] : undefined;
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or corpus is ready
  const lesson = useMemo(
    () => (contentReady ? getQuranGuideTajweedLesson(lessonId) : undefined),
    [lessonId, i18n.language, contentReady],
  );
  const lessonHref = (
    lessonId ? `/learn-quran/tajweed/${lessonId}` : "/learn-quran/tajweed"
  ) as Href;

  useEffect(() => {
    if (!isPracticeAvailable() || !head) router.replace(lessonHref);
  }, [head, lessonHref, router]);

  if (!head || !isPracticeAvailable()) return null;

  return (
    <ScreenLayout
      eyebrow={t("learnQuran.eyebrow")}
      title={t("quranCompanion.pronunciation.drillTitle")}
      subtitle={lesson?.title}
      onBack={() => goBackOrReplace(router, lessonHref)}
    >
      <Seo path={`/learn-quran/tajweed/drill/${lessonId}`} index={false} />
      <Card padding="four">
        <ThemedText type="small">{t("quranCompanion.pronunciation.drillIntro")}</ThemedText>
        {lesson?.practiceAudio ? (
          <View style={styles.row}>
            <QuranGuideClipPlayButton
              audio={lesson.practiceAudio}
              sourceHref={`/learn-quran/tajweed/drill/${lessonId}`}
            />
          </View>
        ) : null}
        {lesson?.practice ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.gap}>
            {lesson.practice}
          </ThemedText>
        ) : null}
      </Card>

      <DrillTakeCard head={head} onVerdict={(verdict) => void recordCoachingDrill(head, verdict)} />

      <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
        {t("quranCompanion.privacy.practiceAid")}
      </ThemedText>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  row: { marginTop: Spacing.three, alignItems: "flex-start" },
  gap: { marginTop: Spacing.two },
  center: { textAlign: "center", marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/tajweed/drill/[id]");
