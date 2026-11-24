import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import {
  LearnSplitLayout,
  LearnTopicGrid,
  useLearnWideLayout,
} from "@/components/learn-guide/learn-wide-layout";
import { QuranGuideTopicAside } from "@/components/quran-guide/quran-guide-aside";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { CoachingPanel } from "@/components/tajweed-coaching/coaching-panel";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideTajweedLessons,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";
import { routeMetadata } from "@/lib/seo/route-metadata";

type TajweedTab = "lessons" | "coaching";

export default function LearnQuranTajweedScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t, i18n } = useTranslation();
  // NF-3.15: "Lessons" | "Coaching" (deep link: ?tab=coaching from the practice summary).
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<TajweedTab>(params.tab === "coaching" ? "coaching" : "lessons");
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or corpus is ready
  const lessons = useMemo(
    () => (contentReady ? getQuranGuideTajweedLessons() : []),
    [i18n.language, contentReady],
  );

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.tajweedTitle")}
      subtitle={t("learnQuran.tajweedSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/learn-quran/tajweed" />
      <LearnContentGate ready={contentReady}>
        <LearnSplitLayout aside={<QuranGuideTopicAside currentId="tajweed" />}>
          <Stagger>
            <SegmentedControl<TajweedTab>
              options={[
                { id: "lessons", label: t("tajweedCoaching.tab.lessons") },
                { id: "coaching", label: t("tajweedCoaching.tab.coaching") },
              ]}
              value={tab}
              onChange={setTab}
            />
            {tab === "coaching" ? (
              <CoachingPanel />
            ) : (
              <>
                <JannahCallout tone="info">{t("learnQuran.tajweedIntro")}</JannahCallout>

                <Card padding="three">
                  <SectionHeader
                    title={t("learnQuran.tajweedListTitle")}
                    icon={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
                  />
                  <LearnTopicGrid
                    style={styles.rows}
                    maxColumns={2}
                    items={lessons.map((lesson) => ({
                      id: lesson.id,
                      icon: { ios: "music.note", android: "music_note", web: "music_note" },
                      title: lesson.title,
                      subtitle: lesson.summary,
                      onPress: () =>
                        router.push({
                          pathname: "/learn-quran/tajweed/[id]",
                          params: { id: lesson.id },
                        }),
                    }))}
                  />
                </Card>
              </>
            )}

            <JannahDisclaimer textKey="learnQuran.disclaimer" />
          </Stagger>
        </LearnSplitLayout>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/learn-quran/tajweed");
