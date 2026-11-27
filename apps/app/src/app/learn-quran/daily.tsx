import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScriptureMeaning } from "@/components/content/scripture-meaning";
import { JannahActionSteps, JannahTakeaway } from "@/components/jannah/primitives";
import { JannahCallout, LearnTopicArticle } from "@/components/learn-guide";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { QuranAyahPlayButton } from "@/components/quran-guide/ayah-play-button";
import { QuranGuideTopicAside } from "@/components/quran-guide/quran-guide-aside";
import { LearnProseText } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useGuideContentReportRef } from "@/hooks/use-guide-content-report-ref";
import {
  ensureQuranGuideContent,
  getQuranGuideDailyLessonForDate,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { passageFromRef } from "@/lib/recite-along/passages";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function LearnQuranDailyScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureQuranGuideContent, isQuranGuideContentReady);
  const lesson = getQuranGuideDailyLessonForDate();
  const recitePassage = lesson ? passageFromRef(lesson) : null;
  const dailyTitle = t("learnQuran.dailyTitle");
  const dailySubtitle = t("learnQuran.dailySubtitle");
  const topic = useMemo(
    () => (lesson ? { id: "daily", title: dailyTitle, summary: dailySubtitle } : undefined),
    [lesson, dailyTitle, dailySubtitle],
  );
  // "Report a mistake" link (route /learn-quran/daily), as before the redesign.
  const contentRef = useGuideContentReportRef("learn_quran", topic, "/learn-quran");

  return (
    <LearnTopicArticle
      ns="learnQuran"
      basePath="/learn-quran"
      topic={topic}
      ready={contentReady}
      error={contentError}
      onRetry={retryContent}
      surface="learn_quran"
      contentRef={contentRef}
      aside={() => <QuranGuideTopicAside currentId="daily-lessons" />}
    >
      {() =>
        lesson ? (
          <>
            <JannahCallout tone="info">{t("learnQuran.dailyIntro")}</JannahCallout>

            <Card>
              <View style={styles.excerptHeader}>
                <ThemedText type="caption" themeColor="mutedForeground" style={styles.excerptLabel}>
                  {lesson.label}
                </ThemedText>
                <QuranAyahPlayButton
                  surah={lesson.surah}
                  ayahFrom={lesson.ayahFrom}
                  ayahTo={lesson.ayahTo}
                  sourceHref="/learn-quran/daily"
                />
              </View>
              <ThemedText type="arabic" style={styles.arabic}>
                {lesson.excerpt}
              </ThemedText>
              <ScriptureMeaning english={lesson.translation} quranRef={lesson}>
                {(text) => <LearnProseText style={styles.translation}>{text}</LearnProseText>}
              </ScriptureMeaning>
            </Card>

            <JannahTakeaway text={lesson.context} />

            <TvReadableBlock>
              <Card>
                <SectionHeader
                  title={t("learnQuran.reflectionTitle")}
                  icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
                />
                <LearnProseText themeColor="mutedForeground" style={styles.block}>
                  {lesson.reflection}
                </LearnProseText>
              </Card>
            </TvReadableBlock>

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
            {/* D68: recite today's ayahs with the on-device listener (hidden on TV). */}
            {recitePassage ? <ReciteAlongButton passage={recitePassage} fullWidth /> : null}
          </>
        ) : null
      }
    </LearnTopicArticle>
  );
}

const styles = StyleSheet.create({
  excerptHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  excerptLabel: { flex: 1 },
  arabic: { fontSize: 26, lineHeight: 44, marginTop: Spacing.two },
  translation: { marginTop: Spacing.two },
  block: { marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/daily");
