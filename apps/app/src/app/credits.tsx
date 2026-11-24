import {
  BUNDLED_DATA_CREDITS,
  RUNTIME_DATA_CREDITS,
  SERVICE_DATA_CREDITS,
} from "@munib-tracker/shared/constants";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import manifest from "@/assets/data/manifest.json";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { BrandQrCode } from "@/components/share/brand-qr-code";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { Sheet } from "@/components/ui/sheet";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { webPageSchema } from "@/lib/seo/structured-data";

interface CreditRow {
  name: string;
  license: string;
  attribution: string;
  sourceUrl: string;
  note?: string;
  /** Verbatim licence notice the source requires (e.g. Quranic Arabic Corpus). */
  notice?: string;
}

const RUNTIME_SOURCES: CreditRow[] = RUNTIME_DATA_CREDITS.map((c) => ({
  name: c.name,
  license: c.license,
  attribution: c.attribution,
  sourceUrl: c.url,
  note: c.note,
  notice: c.notice,
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
  const tv = isTV();
  /** TV has no in-app browser — show the source as a QR to open on a phone. */
  const [qrRow, setQrRow] = useState<CreditRow | null>(null);

  // Remote datasets in the manifest (fetched on demand) are credited under runtime sources.
  const bundledRows: CreditRow[] = manifest.datasets
    .filter((d) => d.kind !== "remote")
    .map((d) => ({
      name: d.id,
      license: d.license,
      attribution: d.attribution,
      sourceUrl: d.sourceUrl,
      note: "note" in d ? (d as { note?: string }).note : undefined,
    }));
  // Bundled assets outside the build-data manifest (e.g. CC0 tasbeeh click sounds, NF-3.19).
  for (const credit of BUNDLED_DATA_CREDITS) {
    if (manifest.datasets.some((d) => d.id === credit.id)) continue;
    bundledRows.push({
      name: credit.name,
      license: credit.license,
      attribution: credit.attribution,
      sourceUrl: credit.url,
      note: credit.note,
    });
  }

  const openRow = (row: CreditRow) => {
    if (tv) {
      setQrRow(row);
      return;
    }
    void WebBrowser.openBrowserAsync(row.sourceUrl).catch(() => {});
  };

  const renderRow = (row: CreditRow) => (
    <PressableScale
      key={`${row.name}-${row.sourceUrl}`}
      haptic="light"
      accessibilityRole="link"
      accessibilityLabel={row.name}
      onPress={() => openRow(row)}
      style={[styles.row, tv ? styles.rowTv : styles.rowFill, { backgroundColor: colors.muted }]}
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
        {row.notice ? (
          // Licence text stays in its original English, verbatim, as the terms require.
          <ThemedText type="caption" themeColor="mutedForeground" selectable style={styles.notice}>
            {row.notice}
          </ThemedText>
        ) : null}
      </View>
      <SymbolView
        name={
          tv
            ? { ios: "qrcode", android: "qr_code_2", web: "qr_code_2" }
            : { ios: "arrow.up.right.square", android: "open_in_new", web: "open_in_new" }
        }
        size={16}
        tintColor={colors.mutedForeground}
      />
    </PressableScale>
  );

  // TV keeps its flex-wrap two-up list; phones stay single-column and wider
  // windows get a 2–3 column grid so the long source list isn't one tall strip.
  const renderList = (rows: CreditRow[]) =>
    tv ? (
      <View style={[styles.list, styles.listTv]}>{rows.map(renderRow)}</View>
    ) : (
      <ResponsiveGrid maxColumns={3} gap={Spacing.two}>
        {rows.map(renderRow)}
      </ResponsiveGrid>
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
        <Card padding="three">{renderList(bundledRows)}</Card>
        <Card padding="three">{renderList(RUNTIME_SOURCES)}</Card>
        <Card padding="three">{renderList(SERVICE_SOURCES)}</Card>
        <View style={[styles.footer, { borderColor: tokens.hairline }]}>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.footerText}>
            {t("credits.openSource")}
          </ThemedText>
        </View>
      </Stagger>

      {tv ? (
        <Sheet visible={qrRow != null} onClose={() => setQrRow(null)}>
          {qrRow ? (
            <View style={styles.qrSheet}>
              <ThemedText type="subtitle">{qrRow.name}</ThemedText>
              <ThemedText type="small" themeColor="mutedForeground" style={styles.qrHint}>
                {t("about.scanOnPhoneTv")}
              </ThemedText>
              <BrandQrCode
                data={qrRow.sourceUrl}
                size={tvDp(240)}
                accessibilityLabel={qrRow.name}
              />
              <ThemedText type="caption" themeColor="mutedForeground">
                {qrRow.sourceUrl.replace(/^https?:\/\//, "")}
              </ThemedText>
              <Button
                label={t("common.done")}
                variant="secondary"
                preferredFocus
                onPress={() => setQrRow(null)}
              />
            </View>
          ) : null}
        </Sheet>
      ) : null}
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
  /** Grid cells stretch per row — fill so neighbouring tiles align. */
  rowFill: { flexGrow: 1 },
  /** TV: two-column grid so the long source list uses the landscape width. */
  listTv: { flexDirection: "row", flexWrap: "wrap" },
  rowTv: { flexBasis: "48%", flexGrow: 1, minHeight: TvLayout.minFocusTarget },
  qrSheet: { alignItems: "center", gap: Spacing.three },
  qrHint: { textAlign: "center" },
  note: { fontStyle: "italic" },
  notice: { fontSize: 11, lineHeight: 15, writingDirection: "ltr" },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.three,
    alignItems: "center",
  },
  footerText: { textAlign: "center" },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/credits");
