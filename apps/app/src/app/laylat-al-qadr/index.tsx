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
  ensureLaylatAlQadrContent,
  getLaylatAlQadrSectionOrder,
  getLaylatAlQadrTopicsBySection,
} from "@/lib/laylat-al-qadr";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";

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
  const { version: contentVersion } = useEnsureContent(ensureLaylatAlQadrContent);
  // Recompute per locale (and once content finishes loading) so translated
  // topic titles/summaries render on switch instead of staying empty/English.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const topicsBySection = useMemo(
    () => getLaylatAlQadrTopicsBySection(),
    [i18n.language, contentVersion],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const sectionOrder = useMemo(
    () => getLaylatAlQadrSectionOrder(),
    [i18n.language, contentVersion],
  );

  return (
    <ScreenLayout
      eyebrow={t("laylatAlQadr.eyebrow")}
      title={t("laylatAlQadr.title")}
      subtitle={t("laylatAlQadr.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/laylat-al-qadr" />
      <Stagger>
        <JannahCallout tone="info">{t("laylatAlQadr.intro")}</JannahCallout>

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
              <View style={styles.rows}>
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
              </View>
            </Card>
          );
        })}

        <JannahDisclaimer textKey="laylatAlQadr.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
