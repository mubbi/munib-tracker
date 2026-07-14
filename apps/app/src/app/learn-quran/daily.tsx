import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import {
  JannahActionSteps,
  JannahCallout,
  JannahDisclaimer,
  JannahTakeaway,
} from "@/components/jannah/primitives";
import { LearnContentLoading } from "@/components/learn-content-loading";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideDailyLessonForDate,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";

export default function LearnQuranDailyScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const lesson = getQuranGuideDailyLessonForDate();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.dailyTitle")}
      subtitle={t("learnQuran.dailySubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/daily" />
      {!contentReady ? (
        <LearnContentLoading />
      ) : !lesson ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("learnQuran.notFound")}
          actionLabel={t("learnQuran.title")}
          onAction={() => router.replace("/learn-quran" as Href)}
        />
      ) : (
        <Stagger>
          <JannahCallout tone="info">{t("learnQuran.dailyIntro")}</JannahCallout>

          <LearnReadingChrome surface="learn_quran">
            <Card padding="three">
              <ThemedText type="caption" themeColor="mutedForeground">
                {lesson.label}
              </ThemedText>
              <ThemedText type="arabic" style={styles.arabic}>
                {lesson.excerpt}
              </ThemedText>
              <ThemedText type="small" style={styles.translation}>
                {lesson.translation}
              </ThemedText>
            </Card>

            <JannahTakeaway text={lesson.context} />

            <Card padding="three">
              <SectionHeader
                title={t("learnQuran.reflectionTitle")}
                icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
              />
              <ThemedText type="small" themeColor="mutedForeground" style={styles.block}>
                {lesson.reflection}
              </ThemedText>
            </Card>

            <JannahActionSteps steps={[lesson.action]} />

            <Button
              label={t("learnQuran.openInQuran")}
              variant="primary"
              fullWidth
              onPress={() =>
                router.push({
                  pathname: "/quran/[surah]",
                  params: { surah: String(lesson.surah), ayah: String(lesson.ayahFrom) },
                })
              }
            />
          </LearnReadingChrome>

          <JannahDisclaimer textKey="learnQuran.disclaimer" />
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  arabic: { fontSize: 26, lineHeight: 44, marginTop: Spacing.two },
  translation: { lineHeight: 24, marginTop: Spacing.two },
  block: { marginTop: Spacing.three, lineHeight: 22 },
});
