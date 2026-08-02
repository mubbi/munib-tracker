import type { MizanDeedCategory, MizanDeedItem } from "@munib-tracker/shared/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
import { JannahCallout } from "@/components/jannah/primitives";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
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

/** Deed catalog for Last Day heavy-on-the-scale (Scale metaphor via icon + copy only). */
export function BalancePansBlock({ deeds }: { deeds: MizanDeedItem[] }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <View style={styles.stack}>
      <View style={styles.intro}>
        <IconWell
          icon={{ ios: "scalemass.fill", android: "balance", web: "balance" }}
          tint={colors.accent}
          background={tokens.accentSoft}
          well={48}
          size={22}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.caption}>
          {t("lastDay.mizan.pansCaption")}
        </ThemedText>
      </View>

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
  intro: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  caption: {
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 320,
  },
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
