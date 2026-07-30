import type { MizanDeedCategory, MizanDeedItem } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
import { JannahCallout } from "@/components/jannah/primitives";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

const CATEGORY_TONE: Record<MizanDeedCategory, "accent" | "success" | "info" | "warning"> = {
  "heavy-on-scale": "accent",
  "fills-the-scale": "success",
  "best-beloved": "info",
  "equal-reward": "warning",
};

function categoryPalette(
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
  colors: ReturnType<typeof useThemeTokens>["colors"],
  category: MizanDeedCategory,
) {
  const tone = CATEGORY_TONE[category];
  if (tone === "accent") return { color: colors.accent, soft: tokens.accentSoft };
  return tokens.status[tone];
}

function deedReference(deed: MizanDeedItem): string | undefined {
  if (deed.quran?.label) return deed.quran.label;
  if (deed.hadith) return `${deed.hadith.collection} ${deed.hadith.citation}`;
  return undefined;
}

/** Dual soft pans + deed cards for Last Day heavy-on-the-scale. */
export function BalancePansBlock({ deeds }: { deeds: MizanDeedItem[] }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <View style={styles.stack}>
      <View style={styles.hero}>
        <View
          style={[
            styles.pan,
            { backgroundColor: tokens.accentSoft, borderColor: tokens.accentBorder },
          ]}
        >
          <ThemedText type="smallBold" style={{ color: colors.accentText, textAlign: "center" }}>
            {t("lastDay.mizan.panHeavy")}
          </ThemedText>
        </View>
        <View style={[styles.fulcrum, { backgroundColor: tokens.hairline }]} />
        <View
          style={[
            styles.pan,
            { backgroundColor: colors.muted, borderColor: withAlpha(colors.mutedForeground, 0.2) },
          ]}
        >
          <ThemedText type="smallBold" themeColor="mutedForeground" style={{ textAlign: "center" }}>
            {t("lastDay.mizan.panLight")}
          </ThemedText>
        </View>
      </View>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.caption}>
        {t("lastDay.mizan.pansCaption")}
      </ThemedText>

      <JannahCallout tone="accent">{t("lastDay.mizan.noLeaderboard")}</JannahCallout>

      <Card padding="three">
        <SectionHeader
          title={t("lastDay.mizan.deedsTitle")}
          icon={{ ios: "scalemass.fill", android: "balance", web: "balance" }}
        />
        <View style={styles.list}>
          {deeds.map((deed) => {
            const palette = categoryPalette(tokens, colors, deed.category);
            const ref = deedReference(deed);
            return (
              <View
                key={deed.id}
                style={[
                  styles.deedCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: tokens.hairline,
                    borderStartColor: palette.color,
                  },
                ]}
              >
                <View style={styles.deedHeader}>
                  <ThemedText type="smallBold" style={{ flex: 1 }}>
                    {deed.title}
                  </ThemedText>
                  <Pill
                    label={t(`lastDay.mizan.category.${deed.category}`)}
                    compact
                    color={palette.color}
                    background={palette.soft}
                  />
                </View>
                {deed.arabic ? (
                  <ThemedText
                    type="default"
                    style={[styles.arabic, { color: colors.foreground, writingDirection: "rtl" }]}
                  >
                    {deed.arabic}
                  </ThemedText>
                ) : null}
                <ThemedText type="small" themeColor="mutedForeground" style={styles.summary}>
                  {deed.summary}
                </ThemedText>
                {ref ? <ReferenceLine reference={ref} /> : null}
              </View>
            );
          })}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  hero: {
    flexDirection: "row",
    alignItems: "stretch",
    gap: Spacing.two,
  },
  pan: {
    flex: 1,
    minHeight: 72,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
    justifyContent: "center",
  },
  fulcrum: {
    width: 3,
    borderRadius: 2,
    alignSelf: "center",
    height: 40,
  },
  caption: { textAlign: "center", lineHeight: 18 },
  list: { gap: Spacing.two, marginTop: Spacing.three },
  deedCard: {
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderStartWidth: 3,
    borderCurve: "continuous",
    gap: Spacing.two,
  },
  deedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  arabic: {
    textAlign: "right",
    fontSize: 18,
    lineHeight: 28,
  },
  summary: { lineHeight: 20 },
});
