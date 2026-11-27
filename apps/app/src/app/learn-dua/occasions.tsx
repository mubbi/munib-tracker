import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnDuaTopicAside } from "@/components/learn-dua/learn-dua-aside";
import {
  LearnSplitLayout,
  LearnTopicGrid,
  useLearnWideLayout,
} from "@/components/learn-guide/learn-wide-layout";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { tTv } from "@/lib/i18n/t-tv";
import {
  ensureLearnDuaContent,
  getLearnDuaOccasions,
  isLearnDuaContentReady,
} from "@/lib/learn-dua";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

const CATEGORY_ORDER = ["daily", "situational", "quranic"] as const;

export default function LearnDuaOccasionsScreen() {
  const router = useRouter();
  const { maxContentWidth } = useLearnWideLayout();
  const { t } = useTranslation();
  const {
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureLearnDuaContent, isLearnDuaContentReady);
  const occasions = getLearnDuaOccasions();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_dua"
      eyebrow={t("learnDua.eyebrow")}
      title={t("learnDua.occasionsTitle")}
      subtitle={t("learnDua.occasionsSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-dua" as Href)}
      maxContentWidth={maxContentWidth}
    >
      <Seo path="/learn-dua/occasions" />
      <LearnContentGate ready={contentReady} error={contentError} onRetry={retryContent}>
        <LearnSplitLayout aside={<LearnDuaTopicAside />}>
          <Stagger>
            <JannahCallout tone="info">
              {tTv(t, "learnDua.occasionsIntro", "learnDua.occasionsIntroTv")}
            </JannahCallout>

            {CATEGORY_ORDER.map((category) => {
              const items = occasions.filter((occasion) => occasion.category === category);
              if (!items?.length) return null;
              return (
                <Card key={category}>
                  <SectionHeader
                    title={t(`learnDua.occasionsCategory.${category}`)}
                    icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
                  />
                  <LearnTopicGrid
                    style={styles.rows}
                    maxColumns={2}
                    items={items.map((occasion) => ({
                      id: occasion.id,
                      icon: {
                        ios: occasion.topicId ? "text.book.closed.fill" : "hands.sparkles.fill",
                        android: occasion.topicId ? "auto_stories" : "volunteer_activism",
                        web: occasion.topicId ? "auto_stories" : "volunteer_activism",
                      },
                      title: occasion.title,
                      subtitle: occasion.summary,
                      onPress: () =>
                        occasion.topicId
                          ? router.push({
                              pathname: "/learn-dua/[topic]",
                              params: { topic: occasion.topicId },
                            })
                          : router.push("/dua"),
                    }))}
                  />
                </Card>
              );
            })}

            <JannahDisclaimer textKey="learnDua.disclaimer" />
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
export const generateMetadata = routeMetadata("/learn-dua/occasions");
