import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahBody, JannahDisclaimer, JannahTakeaway } from "@/components/jannah/primitives";
import { LearnContentLoading } from "@/components/learn-content-loading";
import { LearnSplitLayout, useLearnWideLayout } from "@/components/learn-guide/learn-wide-layout";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import {
  QuranExamplePlayButton,
  QuranGuideClipPlayButton,
} from "@/components/quran-guide/ayah-play-button";
import { QuranGuideTopicAside } from "@/components/quran-guide/quran-guide-aside";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useTajweedDrillAvailable } from "@/hooks/use-recite-along-available";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  ensureQuranGuideContent,
  getQuranGuideTajweedLesson,
  getQuranGuideTajweedLessons,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { articleSchema } from "@/lib/seo/structured-data";

export function generateStaticParams(): Array<{ id: string }> {
  return getQuranGuideTajweedLessons().map((item) => ({ id: item.id }));
}

function paramId(raw: string | string[] | undefined): string | undefined {
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

export default function LearnQuranTajweedDetailScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t, i18n } = useTranslation();
  const { id: idParam } = useLocalSearchParams<{ id: string }>();
  const id = paramId(idParam);
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or corpus is ready
  const lesson = useMemo(
    () => (contentReady ? getQuranGuideTajweedLesson(id) : undefined),
    [id, i18n.language, contentReady],
  );

  // Phase 6: a pronunciation drill only for sounds the loaded calibration validates.
  // Before the listener is set up the heads are unknown, so the button shows and the
  // drill screen explains; once known, unreliable sounds get no button.
  const showDrill = useTajweedDrillAvailable(lesson?.id);
  // D68: a lesson with no drill to offer (no drill head, or one this listener can't
  // judge reliably) gets a plain recite-along on its practice ayah instead.
  const practicePassage =
    lesson?.practiceAudio && !showDrill
      ? {
          surah: lesson.practiceAudio.surah,
          ayahStart: lesson.practiceAudio.ayah,
          ayahEnd: lesson.practiceAudio.ayah,
        }
      : null;

  const detailPath = lesson ? `/learn-quran/tajweed/${lesson.id}` : "/learn-quran/tajweed";
  const crumbs = lesson
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("learnQuran.title"), path: "/learn-quran" },
        { name: lesson.title, path: detailPath },
      ]
    : undefined;

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={lesson?.title ?? t("learnQuran.tajweedTitle")}
      subtitle={lesson?.summary ?? ""}
      onBack={() => goBackOrReplace(router, "/learn-quran/tajweed" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo
        path={detailPath}
        title={lesson?.title}
        description={lesson?.summary}
        type={lesson ? "article" : undefined}
        index={!!lesson}
        breadcrumbs={crumbs}
        jsonLd={
          lesson
            ? [
                articleSchema({
                  path: detailPath,
                  headline: lesson.title,
                  description: lesson.summary ?? "",
                  breadcrumbs: crumbs,
                }),
              ]
            : undefined
        }
      />
      {!contentReady ? (
        <LearnContentLoading />
      ) : !lesson ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("learnQuran.notFound")}
          actionLabel={t("learnQuran.tajweedTitle")}
          onAction={() => router.replace("/learn-quran/tajweed" as Href)}
        />
      ) : (
        <LearnSplitLayout aside={<QuranGuideTopicAside currentId="tajweed" />}>
          <Stagger>
            <LearnReadingChrome surface="learn_quran">
              <JannahTakeaway text={lesson.summary} />
              <JannahBody paragraphs={lesson.explanation} />
              <Card>
                <SectionHeader
                  title={t("learnQuran.examplesTitle")}
                  icon={{ ios: "textformat.abc", android: "abc", web: "abc" }}
                />
                <View style={styles.examples}>
                  {lesson.examples.map((ex) => (
                    <View key={ex} style={styles.exampleRow}>
                      <ThemedText type="arabic" style={styles.exampleArabic}>
                        {ex}
                      </ThemedText>
                      <QuranExamplePlayButton
                        example={ex}
                        sourceHref={`/learn-quran/tajweed/${lesson.id}`}
                      />
                    </View>
                  ))}
                </View>
              </Card>
              {lesson.practice ? (
                <Card>
                  <SectionHeader
                    title={t("learnQuran.practiceTitle")}
                    icon={{
                      ios: "figure.walk",
                      android: "directions_walk",
                      web: "directions_walk",
                    }}
                  />
                  <View style={styles.practiceHeader}>
                    {/* TV: practice prose is a D-pad stop (no wrapper on phone/web). */}
                    <TvReadableBlock style={styles.practiceText}>
                      <ThemedText
                        type="small"
                        themeColor="mutedForeground"
                        style={isTV() ? undefined : styles.practiceText}
                      >
                        {lesson.practice}
                      </ThemedText>
                    </TvReadableBlock>
                    {lesson.practiceAudio ? (
                      <QuranGuideClipPlayButton
                        audio={lesson.practiceAudio}
                        sourceHref={`/learn-quran/tajweed/${lesson.id}`}
                      />
                    ) : null}
                  </View>
                  {showDrill ? (
                    <Button
                      label={t("quranCompanion.pronunciation.practiseSound")}
                      variant="secondary"
                      size="sm"
                      icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
                      onPress={() =>
                        router.push({
                          pathname: "/learn-quran/tajweed/drill/[id]",
                          params: { id: lesson.id },
                        })
                      }
                      style={styles.drillButton}
                    />
                  ) : null}
                  {practicePassage ? (
                    <ReciteAlongButton
                      passage={practicePassage}
                      size="sm"
                      style={styles.drillButton}
                    />
                  ) : null}
                </Card>
              ) : null}
            </LearnReadingChrome>
            <JannahDisclaimer textKey="learnQuran.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  drillButton: { marginTop: Spacing.three, alignSelf: "flex-start" },
  examples: { gap: Spacing.two, marginTop: Spacing.three },
  exampleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  exampleArabic: { fontSize: 22, lineHeight: 36, flex: 1 },
  practiceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  practiceText: { flex: 1 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/tajweed/[id]");
