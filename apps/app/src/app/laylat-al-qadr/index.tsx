import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import { getLaylatAlQadrSectionOrder, getLaylatAlQadrTopicsBySection } from "@/lib/laylat-al-qadr";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

const SECTION_ICONS: Record<string, AppIcon> = {
  virtues: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  when: { ios: "clock.fill", android: "schedule", web: "schedule" },
  dua: {
    ios: "hands.and.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
  ibadah: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
  reminders: { ios: "info.circle.fill", android: "info", web: "info" },
};

export default function LaylatAlQadrScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const wide = useLearnHubLayout();
  // Wide web / tablets: topic rows flow into 2–3 columns inside each section card.
  const navCols = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 280, max: 3 });
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const topicsBySection = useMemo(
    () => getLaylatAlQadrTopicsBySection(),
    [i18n.language, overlayVersion],
  );
  const sectionOrder = getLaylatAlQadrSectionOrder();

  return (
    <ScreenLayout
      eyebrow={t("laylatAlQadr.eyebrow")}
      title={t("laylatAlQadr.title")}
      subtitle={t("laylatAlQadr.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/laylat-al-qadr" />
      <Stagger>
        <JannahCallout tone="info">{t("laylatAlQadr.intro")}</JannahCallout>

        <LearnQuizNavRow
          quizPath={"/laylat-al-qadr/quiz" as Href}
          titleKey="common.learnQuiz.title"
          subtitleKey="common.learnQuiz.hint"
        />

        {sectionOrder.map((section) => {
          const topics = topicsBySection[section];
          if (!topics?.length) return null;
          return (
            <Card key={section} padding="three">
              <SectionHeader
                title={t(`laylatAlQadr.section.${section}`)}
                icon={
                  SECTION_ICONS[section] ?? {
                    ios: "book.fill",
                    android: "menu_book",
                    web: "menu_book",
                  }
                }
              />
              <LearnColumnsGrid columns={navCols} style={styles.gridTop}>
                {topics.map((topic) => (
                  <JannahNavRow
                    key={topic.id}
                    icon={{ ios: "text.book.closed", android: "article", web: "article" }}
                    title={topic.title}
                    subtitle={topic.summary}
                    onPress={() =>
                      router.push({
                        pathname: "/laylat-al-qadr/[topic]",
                        params: { topic: topic.id },
                      } as Href)
                    }
                  />
                ))}
              </LearnColumnsGrid>
            </Card>
          );
        })}

        <JannahDisclaimer textKey="laylatAlQadr.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  gridTop: { marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/laylat-al-qadr");
