import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const SECTIONS: { key: string; icon: SymbolViewProps["name"] }[] = [
  {
    key: "qasr",
    icon: { ios: "arrow.down.right.and.arrow.up.left", android: "compress", web: "compress" },
  },
  { key: "jam", icon: { ios: "arrow.triangle.merge", android: "merge", web: "merge" } },
  {
    key: "when",
    icon: { ios: "location.circle.fill", android: "my_location", web: "my_location" },
  },
];

export default function TravelGuideScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <ScreenLayout
      eyebrow={t("travel.eyebrow")}
      title={t("travel.title")}
      subtitle={t("travel.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/travel" />
      <Stagger>
        {SECTIONS.map((section) => (
          <Card key={section.key} padding="three">
            <SectionHeader title={t(`travel.${section.key}.title`)} icon={section.icon} />
            <ThemedText type="small" themeColor="mutedForeground" style={styles.body}>
              {t(`travel.${section.key}.body`)}
            </ThemedText>
          </Card>
        ))}

        <View style={[styles.disclaimer, { backgroundColor: tokens.status.info.soft }]}>
          <SymbolView
            name={{ ios: "info.circle.fill", android: "info", web: "info" }}
            size={16}
            tintColor={tokens.status.info.color}
          />
          <ThemedText type="caption" style={[styles.disclaimerText, { color: colors.foreground }]}>
            {t("travel.disclaimer")}
          </ThemedText>
        </View>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: Spacing.two, lineHeight: 22 },
  disclaimer: {
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "flex-start",
    padding: Spacing.three,
    borderRadius: 14,
    borderCurve: "continuous",
  },
  disclaimerText: { flex: 1, lineHeight: 18 },
});
