import { RUNTIME_DATA_CREDITS, SERVICE_DATA_CREDITS } from "@munib-tracker/shared/constants";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import * as WebBrowser from "expo-web-browser";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import manifest from "@/assets/data/manifest.json";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { webPageSchema } from "@/lib/seo/structured-data";

interface CreditRow {
  name: string;
  license: string;
  attribution: string;
  sourceUrl: string;
  note?: string;
}

const RUNTIME_SOURCES: CreditRow[] = RUNTIME_DATA_CREDITS.map((c) => ({
  name: c.name,
  license: c.license,
  attribution: c.attribution,
  sourceUrl: c.url,
  note: c.note,
}));

const SERVICE_SOURCES: CreditRow[] = SERVICE_DATA_CREDITS.map((c) => ({
  name: c.name,
  license: c.license,
  attribution: c.attribution,
  sourceUrl: c.url,
  note: c.note,
}));

export default function CreditsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  const bundledRows: CreditRow[] = manifest.datasets.map((d) => ({
    name: d.id,
    license: d.license,
    attribution: d.attribution,
    sourceUrl: d.sourceUrl,
    note: "note" in d ? (d as { note?: string }).note : undefined,
  }));

  const openUrl = (url: string) => {
    void WebBrowser.openBrowserAsync(url).catch(() => {});
  };

  const renderRow = (row: CreditRow) => (
    <PressableScale
      key={`${row.name}-${row.sourceUrl}`}
      haptic="light"
      accessibilityRole="link"
      accessibilityLabel={row.name}
      onPress={() => openUrl(row.sourceUrl)}
      style={[styles.row, { backgroundColor: colors.muted }]}
    >
      <View style={styles.rowBody}>
        <ThemedText type="smallBold">{row.name}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {row.attribution}
        </ThemedText>
        <ThemedText type="caption" style={{ color: colors.accent }}>
          {row.license}
        </ThemedText>
        {row.note ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
            {row.note}
          </ThemedText>
        ) : null}
      </View>
      <SymbolView
        name={{ ios: "arrow.up.right.square", android: "open_in_new", web: "open_in_new" }}
        size={16}
        tintColor={colors.mutedForeground}
      />
    </PressableScale>
  );

  return (
    <ScreenLayout
      eyebrow={t("credits.eyebrow")}
      title={t("credits.title")}
      subtitle={t("credits.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo
        path="/credits"
        breadcrumbs={[
          { name: t("tabs.home"), path: "/" },
          { name: t("credits.title"), path: "/credits" },
        ]}
        jsonLd={[
          webPageSchema({
            path: "/credits",
            name: "Credits & Data Sources",
            description:
              "The open datasets, translations, and recitation audio that power the app, with licenses and attribution.",
            breadcrumbs: [
              { name: t("tabs.home"), path: "/" },
              { name: t("credits.title"), path: "/credits" },
            ],
          }),
        ]}
      />
      <Stagger>
        <Card padding="three">
          <View style={styles.list}>{bundledRows.map(renderRow)}</View>
        </Card>
        <Card padding="three">
          <View style={styles.list}>{RUNTIME_SOURCES.map(renderRow)}</View>
        </Card>
        <Card padding="three">
          <View style={styles.list}>{SERVICE_SOURCES.map(renderRow)}</View>
        </Card>
        <View style={[styles.footer, { borderColor: tokens.hairline }]}>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.footerText}>
            {t("credits.openSource")}
          </ThemedText>
        </View>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowBody: { flex: 1, gap: 2 },
  note: { fontStyle: "italic" },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.three,
    alignItems: "center",
  },
  footerText: { textAlign: "center" },
});
