import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import {
  ensureEidGuideContent,
  getEidGuideSectionOrder,
  getEidGuideTopicsBySection,
} from "@/lib/eid-guide";
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
  const { version: contentVersion } = useEnsureContent(ensureEidGuideContent);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const topicsBySection = useMemo(
    () => getEidGuideTopicsBySection(),
    [i18n.language, contentVersion],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const sectionOrder = useMemo(() => getEidGuideSectionOrder(), [i18n.language, contentVersion]);

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
