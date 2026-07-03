import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import * as WebBrowser from "expo-web-browser";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import manifest from "@/assets/data/manifest.json";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

interface CreditRow {
  name: string;
  license: string;
  attribution: string;
  sourceUrl: string;
  note?: string;
}

// Runtime (non-bundled) sources are not in the build manifest — list them here.
const RUNTIME_SOURCES: CreditRow[] = [
  {
    name: "Extra Qur'an translations",
    license: "Free to use, © respective authors",
    attribution: "Saheeh International & Clear Qur'an (Khattab) fetched on demand.",
    sourceUrl: "https://github.com/fawazahmed0/quran-api",
  },
  {
    name: "Full hadith collections",
    license: "Public domain (classical text)",
    attribution: "The six books via fawazahmed0/hadith-api.",
    sourceUrl: "https://github.com/fawazahmed0/hadith-api",
  },
  {
    name: "Qur'an recitation audio",
    license: "Free to stream",
    attribution: "Per-ayah recitations from everyayah.com.",
    sourceUrl: "https://everyayah.com/",
  },
  {
    name: "Audio translation & adhkar audio",
    license: "Free to stream",
    attribution: "QuranicAudio.com and Internet Archive.",
    sourceUrl: "https://archive.org/",
  },
  {
    name: "Adhan call audio",
    license: "Bundled clip, © reciter",
    attribution: "Bundled call-to-prayer clip.",
    sourceUrl: "https://github.com/itsnavee/prayeraudio",
  },
];

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
    <Pressable
      key={`${row.name}-${row.sourceUrl}`}
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
    </Pressable>
  );

  return (
    <ScreenLayout
      eyebrow={t("credits.eyebrow")}
      title={t("credits.title")}
      subtitle={t("credits.subtitle")}
      onBack={router.canGoBack() ? () => router.back() : undefined}
    >
      <Stagger>
        <Card padding="three">
          <View style={styles.list}>{bundledRows.map(renderRow)}</View>
        </Card>
        <Card padding="three">
          <View style={styles.list}>{RUNTIME_SOURCES.map(renderRow)}</View>
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
