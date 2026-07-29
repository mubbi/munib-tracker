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
import { getEidGuideSectionOrder, getEidGuideTopicsBySection } from "@/lib/eid-guide";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";

const SECTION_ICONS: Record<string, AppIcon> = {
  fitr: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
  adha: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
  prayer: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  sunnah: { ios: "star.fill", android: "star", web: "star" },
  "zakat-fitr": { ios: "banknote.fill", android: "payments", web: "payments" },
  udhiyah: { ios: "leaf.fill", android: "park", web: "park" },
};

export default function EidScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  // Topic list is sync; overlay version re-localizes titles when a locale pack lands.
  const overlayVersion = getContentOverlaysReadyVersion();
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when language or overlay packs change
  const topicsBySection = useMemo(
    () => getEidGuideTopicsBySection(),
    [i18n.language, overlayVersion],
  );
  const sectionOrder = getEidGuideSectionOrder();

  return (
    <ScreenLayout
      eyebrow={t("eid.eyebrow")}
      title={t("eid.title")}
      subtitle={t("eid.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/eid" />
      <Stagger>
        <JannahCallout tone="info">{t("eid.intro")}</JannahCallout>

        <LearnQuizNavRow
          quizPath={"/eid/quiz" as Href}
          titleKey="common.learnQuiz.title"
          subtitleKey="common.learnQuiz.hint"
        />

        {sectionOrder.map((section) => {
          const topics = topicsBySection[section];
          if (!topics?.length) return null;
          return (
            <Card key={section} padding="three">
              <SectionHeader
                title={t(`eid.section.${section}`)}
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
                      router.push({ pathname: "/eid/[topic]", params: { topic: topic.id } } as Href)
                    }
                  />
                ))}
              </View>
            </Card>
          );
        })}

        <JannahDisclaimer textKey="eid.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
