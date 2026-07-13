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
  ensureIslamicFinanceContent,
  getIslamicFinanceSectionOrder,
  getIslamicFinanceTopicsBySection,
} from "@/lib/islamic-finance";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";

const SECTION_ICONS: Record<string, AppIcon> = {
  principles: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  riba: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  trade: { ios: "banknote.fill", android: "payments", web: "payments" },
  giving: {
    ios: "hands.and.sparkles.fill",
    android: "volunteer_activism",
    web: "volunteer_activism",
  },
  takaful: { ios: "person.3.fill", android: "groups", web: "groups" },
  faq: { ios: "questionmark.circle", android: "help", web: "help" },
};

export default function FinanceScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { version: contentVersion } = useEnsureContent(ensureIslamicFinanceContent);
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const topicsBySection = useMemo(
    () => getIslamicFinanceTopicsBySection(),
    [i18n.language, contentVersion],
  );
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes or content finishes loading
  const sectionOrder = useMemo(
    () => getIslamicFinanceSectionOrder(),
    [i18n.language, contentVersion],
  );

  return (
    <ScreenLayout
      eyebrow={t("finance.eyebrow")}
      title={t("finance.title")}
      subtitle={t("finance.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/finance" />
      <Stagger key={`finance-${contentVersion}`}>
        <JannahCallout tone="info">{t("finance.intro")}</JannahCallout>

        {sectionOrder.map((section) => {
          const topics = topicsBySection[section];
          if (!topics?.length) return null;
          return (
            <Card key={section} padding="three">
              <SectionHeader
                title={t(`finance.section.${section}`)}
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
                        pathname: "/finance/[topic]",
                        params: { topic: topic.id },
                      } as Href)
                    }
                  />
                ))}
              </View>
            </Card>
          );
        })}

        <JannahDisclaimer textKey="finance.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
