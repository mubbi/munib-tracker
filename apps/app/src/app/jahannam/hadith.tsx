import { type Href, useRouter } from "expo-router";
import type { SymbolViewProps } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { HadithCitationBookmarkButton } from "@/components/jannah/bookmark-button";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getJahannamHadith } from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";

const THEME_ORDER = ["warning", "mercy", "repentance", "accountability", "protection"] as const;

const THEME_ICONS: Record<(typeof THEME_ORDER)[number], SymbolViewProps["name"]> = {
  warning: { ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" },
  mercy: { ios: "heart.fill", android: "favorite", web: "favorite" },
  repentance: { ios: "arrow.uturn.backward.circle.fill", android: "undo", web: "undo" },
  accountability: { ios: "scalemass.fill", android: "balance", web: "balance" },
  protection: { ios: "shield.fill", android: "shield", web: "shield" },
};

export default function JahannamHadithScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();
  const entries = getJahannamHadith();

  const grouped = useMemo(() => {
    const map = new Map<string, typeof entries>();
    for (const theme of THEME_ORDER) {
      map.set(
        theme,
        entries.filter((e) => e.theme === theme),
      );
    }
    return map;
  }, [entries]);

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.hadithTitle")}
      subtitle={t("jahannam.hadithSubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
    >
      <Seo path="/jahannam/hadith" />
      <Stagger>
        <LearnReadingChrome surface="jahannam">
          <JannahCallout tone="info">{t("jahannam.hadithLead")}</JannahCallout>
          {THEME_ORDER.map((theme) => {
            const items = grouped.get(theme) ?? [];
            if (items.length === 0) return null;
            return (
              <Card key={theme} padding="three">
                <SectionHeader
                  title={t(`jahannam.hadithTheme.${theme}`)}
                  icon={THEME_ICONS[theme]}
                />
                <View style={styles.list}>
                  {items.map((entry) => (
                    <View
                      key={entry.id}
                      style={[styles.quote, { backgroundColor: tokens.accentSoft }]}
                    >
                      <View style={styles.quoteMeta}>
                        <ThemedText type="caption" style={{ color: colors.accent, flex: 1 }}>
                          {entry.hadith.collection} · {entry.hadith.citation}
                        </ThemedText>
                        <View style={styles.quoteMetaActions}>
                          {entry.hadith.grade ? (
                            <Pill
                              label={t(`jahannam.grade.${entry.hadith.grade}`)}
                              compact
                              color={tokens.status.success.color}
                              background={tokens.status.success.soft}
                            />
                          ) : null}
                          <HadithCitationBookmarkButton
                            collection={entry.hadith.collection}
                            citation={entry.hadith.citation}
                          />
                        </View>
                      </View>
                      <ThemedText
                        type="small"
                        themeColor="mutedForeground"
                        style={{
                          fontSize: sizes.translation,
                          lineHeight: sizes.translation * 1.45,
                          fontStyle: "italic",
                        }}
                      >
                        "{entry.hadith.excerpt}"
                      </ThemedText>
                      {entry.context ? (
                        <ThemedText type="caption" themeColor="mutedForeground">
                          {entry.context}
                        </ThemedText>
                      ) : null}
                    </View>
                  ))}
                </View>
              </Card>
            );
          })}
        </LearnReadingChrome>
        <JannahDisclaimer textKey="jahannam.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.two, gap: Spacing.three },
  quote: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: Spacing.two,
  },
  quoteMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  quoteMetaActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
});
