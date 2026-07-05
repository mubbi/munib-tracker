import { PRAYER_RAKATS } from "@munib-tracker/shared/content";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSalahGuideTopics } from "@/lib/salah-guide";

const TOPICS = getSalahGuideTopics();

const TOPIC_ICONS: Record<string, Parameters<typeof NavRow>[0]["icon"]> = {
  overview: { ios: "checklist", android: "checklist", web: "checklist" },
  wudu: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  "how-to-pray": { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
};

export default function SalahGuideScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <ScreenLayout
      eyebrow={t("salahGuide.eyebrow")}
      title={t("salahGuide.title")}
      subtitle={t("salahGuide.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/salah-guide" />
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("salahGuide.topicsTitle")}
            icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
          />
          <View style={styles.rows}>
            {TOPICS.map((topic) => (
              <NavRow
                key={topic.id}
                icon={
                  TOPIC_ICONS[topic.id] ?? {
                    ios: "text.book.closed",
                    android: "article",
                    web: "article",
                  }
                }
                label={topic.title}
                onPress={() =>
                  router.push({ pathname: "/salah-guide/[topic]", params: { topic: topic.id } })
                }
              />
            ))}
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("salahGuide.rakatsTitle")}
            icon={{
              ios: "list.number",
              android: "format_list_numbered",
              web: "format_list_numbered",
            }}
          />
          <View style={styles.tableHead}>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.colName}>
              {t("salahGuide.prayer")}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.colNum}>
              {t("salahGuide.fard")}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.colNum}>
              {t("salahGuide.sunnah")}
            </ThemedText>
          </View>
          {PRAYER_RAKATS.map((row) => (
            <View key={row.prayerId} style={[styles.tableRow, { borderTopColor: tokens.hairline }]}>
              <ThemedText type="small" style={styles.colName}>
                {t(`prayers.${row.prayerId}`)}
              </ThemedText>
              <ThemedText type="small" style={styles.colNum}>
                {row.fard || "—"}
              </ThemedText>
              <ThemedText type="small" style={styles.colNum}>
                {row.sunnahBefore + row.sunnahAfter || "—"}
              </ThemedText>
            </View>
          ))}
        </Card>

        <Card
          padding="three"
          onPress={() => router.push("/travel")}
          accessibilityLabel={t("travel.title")}
        >
          <View style={styles.pointerRow}>
            <SymbolView
              name={{ ios: "airplane", android: "flight", web: "flight" }}
              size={18}
              tintColor={colors.accent}
            />
            <View style={styles.pointerCopy}>
              <ThemedText type="smallBold">{t("travel.title")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("salahGuide.travelPointer")}
              </ThemedText>
            </View>
          </View>
        </Card>

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
          {t("salahGuide.disclaimer")}
        </ThemedText>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  tableHead: {
    flexDirection: "row",
    marginTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.two + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  colName: { flex: 1 },
  colNum: { width: 64, textAlign: "center" },
  pointerRow: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  pointerCopy: { flex: 1, gap: 2 },
  disclaimer: { textAlign: "center", paddingHorizontal: Spacing.two, borderRadius: Radius.md },
});
