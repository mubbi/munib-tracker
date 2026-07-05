import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { computeZakat, type ZakatAssets } from "@/lib/zakat";

const ASSET_FIELDS: (keyof ZakatAssets)[] = [
  "cash",
  "gold",
  "silver",
  "business",
  "otherAssets",
  "debts",
];

function num(v: string): number {
  const n = Number.parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export default function ZakatScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const locale = i18n.language?.split("-")[0];

  const [values, setValues] = useState<Record<string, string>>({});
  const [nisab, setNisab] = useState("");

  const result = useMemo(() => {
    const assets: ZakatAssets = {};
    for (const field of ASSET_FIELDS) assets[field] = num(values[field] ?? "");
    return computeZakat(assets, num(nisab));
  }, [values, nisab]);

  const money = (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 2 });

  const field = (key: string, value: string, onChange: (v: string) => void, labelKey: string) => (
    <View key={key} style={styles.fieldRow}>
      <ThemedText type="small" style={styles.fieldLabel}>
        {t(labelKey)}
      </ThemedText>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={colors.mutedForeground}
        accessibilityLabel={t(labelKey)}
        style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
      />
    </View>
  );

  return (
    <ScreenLayout
      eyebrow={t("zakat.eyebrow")}
      title={t("zakat.title")}
      subtitle={t("zakat.subtitle")}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}
    >
      <Seo path="/zakat" />
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("zakat.assetsTitle")}
            icon={{ ios: "banknote.fill", android: "payments", web: "payments" }}
          />
          <View style={styles.fields}>
            {ASSET_FIELDS.map((key) =>
              field(
                key,
                values[key] ?? "",
                (v) => setValues((prev) => ({ ...prev, [key]: v })),
                `zakat.field.${key}`,
              ),
            )}
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("zakat.nisabTitle")}
            icon={{ ios: "scalemass.fill", android: "balance", web: "balance" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
            {t("zakat.nisabHint")}
          </ThemedText>
          <View style={styles.fields}>{field("nisab", nisab, setNisab, "zakat.field.nisab")}</View>
        </Card>

        <Card
          padding="three"
          style={{ backgroundColor: result.meetsNisab ? tokens.status.success.soft : colors.muted }}
        >
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("zakat.netWealth")}: {money(result.netWealth)}
          </ThemedText>
          <ThemedText
            type="header"
            style={{
              color: result.meetsNisab ? tokens.status.success.color : colors.mutedForeground,
            }}
          >
            {money(result.due)}
          </ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {result.meetsNisab ? t("zakat.dueLabel") : t("zakat.belowNisab")}
          </ThemedText>
        </Card>

        <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
          {t("zakat.disclaimer")}
        </ThemedText>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  fields: { gap: Spacing.two, marginTop: Spacing.three },
  hint: { marginTop: Spacing.two },
  fieldRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  fieldLabel: { flex: 1 },
  input: {
    width: 120,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    fontSize: 15,
    textAlign: "right",
  },
  disclaimer: { textAlign: "center", paddingHorizontal: Spacing.two },
});
