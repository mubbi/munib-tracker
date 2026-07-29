import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { LearnQuizNavRow } from "@/components/quiz/learn-quiz-nav-row";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { getContentOverlaysReadyVersion } from "@/lib/content-overlay-registry";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import {
  getWhiteDaysGuideSectionOrder,
  getWhiteDaysGuideTopicsBySection,
} from "@/lib/white-days-guide";

const SECTION_ICONS: Record<string, AppIcon> = {
  what: { ios: "moon.circle.fill", android: "brightness_3", web: "brightness_3" },
  virtue: { ios: "star.fill", android: "star", web: "star" },
  practice: { ios: "fork.knife", android: "restaurant", web: "restaurant" },
  related: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
  track: { ios: "checklist", android: "checklist", web: "checklist" },
};

export default function WhiteDaysScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const topicsBySection = useMemo(
    () => getWhiteDaysGuideTopicsBySection(),
    [i18n.language, overlayVersion],
  );
  const sectionOrder = getWhiteDaysGuideSectionOrder();

  return (
    <ScreenLayout
      eyebrow={t("whiteDays.eyebrow")}
      title={t("whiteDays.title")}
      subtitle={t("whiteDays.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/white-days" />
      <Stagger>
        <JannahCallout tone="info">{t("whiteDays.intro")}</JannahCallout>

        <LearnQuizNavRow
          quizPath={"/white-days/quiz" as Href}
          titleKey="common.learnQuiz.title"
          subtitleKey="common.learnQuiz.hint"
        />

        {sectionOrder.map((section) => {
          const topics = topicsBySection[section];
          if (!topics?.length) return null;
          return (
            <Card key={section} padding="three">
              <SectionHeader
                title={t(`whiteDays.section.${section}`)}
                icon={
                  SECTION_ICONS[section] ?? {
                    ios: "book.fill",
                    android: "menu_book",
                    web: "menu_book",
                  }
                }
              />
              <View style={styles.rows}>
                {topics.map((topic) => (
                  <JannahNavRow
                    key={topic.id}
                    icon={{ ios: "text.book.closed", android: "article", web: "article" }}
                    title={topic.title}
                    subtitle={topic.summary}
                    onPress={() =>
                      router.push({
                        pathname: "/white-days/[topic]",
                        params: { topic: topic.id },
                      } as Href)
                    }
                  />
                ))}
              </View>
            </Card>
          );
        })}

        <JannahDisclaimer textKey="whiteDays.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
