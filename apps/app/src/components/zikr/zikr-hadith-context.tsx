import type {
  ZikrHadithContext as ZikrHadithContextData,
  ZikrItem,
} from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { loadZikrHadith } from "@/lib/content-loaders";
import {
  arabicReadingLayout,
  resolveReadingFontSizes,
  translationReadingStyle,
} from "@/lib/reading-typography";
import { resolveHadithTranslation } from "@/lib/translation-locale";
import { usePreferences } from "@/stores/preferences-store";

/** Lazily loaded source-hadith map (own chunk — only fetched when a reader opens it). */
function useZikrHadithContext(zikrId: string): ZikrHadithContextData | null | undefined {
  const [state, setState] = useState<{ id: string; data: ZikrHadithContextData | null }>();
  useEffect(() => {
    let active = true;
    void loadZikrHadith()
      .then((map) => {
        if (active) setState({ id: zikrId, data: map[zikrId] ?? null });
      })
      .catch(() => {
        if (active) setState({ id: zikrId, data: null });
      });
    return () => {
      active = false;
    };
  }, [zikrId]);
  // `undefined` while loading this id; `null` when there is no sourced hadith.
  return state?.id === zikrId ? state.data : undefined;
}

/**
 * "Why we recite this": the virtue in one line, then the full source hadith
 * (Arabic + the reader's translation, with citation and grade) on demand — so
 * the session stays focused but the context is one tap away.
 */
export function ZikrHadithContext({
  item,
  showVirtue = true,
}: {
  item: ZikrItem;
  /** Off where the reading card above already shows the virtue line. */
  showVirtue?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs, translationLocale } = usePreferences();
  const context = useZikrHadithContext(item.id);
  const [expanded, setExpanded] = useState(false);
  const sizes = resolveReadingFontSizes("hadith", fontPrefs);

  // Collapse again when the session moves on to another zikr.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset per zikr id
  useEffect(() => {
    setExpanded(false);
  }, [item.id]);

  const sources = context?.sources ?? [];
  const virtue = showVirtue ? item.virtues?.trim() : undefined;
  const outside = context?.outsideSixBooks === true;
  if (!virtue && sources.length === 0 && !outside) return null;

  return (
    <Card variant="outline" padding="four" style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
          <SymbolView
            name={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
            size={16}
            tintColor={colors.accent}
          />
        </View>
        <ThemedText type="smallBold" style={styles.headerTitle} accessibilityRole="header">
          {t("zikrSession.whyTitle")}
        </ThemedText>
      </View>

      {virtue ? (
        <ThemedText type="small" style={styles.virtue}>
          {virtue}
        </ThemedText>
      ) : null}

      {sources.length > 0 ? (
        expanded ? (
          <View style={styles.sources}>
            {sources.map((source) => (
              <View
                key={`${source.collection}-${source.hadithNumber}`}
                style={[styles.source, { borderTopColor: tokens.hairline }]}
              >
                <View style={styles.citationRow}>
                  <ThemedText type="caption" themeColor="mutedForeground" style={styles.citation}>
                    {source.reference}
                  </ThemedText>
                  {source.grade ? <GradePill grade={source.grade} /> : null}
                </View>
                {translationLocale !== "ar" ? (
                  <ThemedText
                    type="arabic"
                    style={arabicReadingLayout(sizes.arabic * 0.8, "right")}
                  >
                    {source.arabic}
                  </ThemedText>
                ) : null}
                <ThemedText
                  type="default"
                  style={translationReadingStyle(translationLocale, sizes.translation)}
                >
                  {resolveHadithTranslation(source, { translationLocale })}
                </ThemedText>
              </View>
            ))}
          </View>
        ) : null
      ) : outside ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("zikrSession.outsideSixBooks", { reference: item.reference ?? "" })}
        </ThemedText>
      ) : null}

      {sources.length > 0 ? (
        <PressableScale
          haptic="selection"
          accessibilityRole="button"
          accessibilityState={{ expanded }}
          onPress={() => setExpanded((open) => !open)}
          style={[styles.toggle, { backgroundColor: colors.muted }]}
        >
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
            {expanded ? t("zikrSession.hideHadith") : t("zikrSession.readHadith")}
          </ThemedText>
          <SymbolView
            name={
              expanded
                ? { ios: "chevron.up", android: "expand_less", web: "expand_less" }
                : { ios: "chevron.down", android: "expand_more", web: "expand_more" }
            }
            size={14}
            tintColor={colors.accentText}
          />
        </PressableScale>
      ) : null}
    </Card>
  );
}

type GradeClass = "sahih" | "hasan" | "daif";

/** Bucket a published grade ("Hasan Sahih", "Daif (Al-Albani); …") for the badge. */
export function hadithGradeClass(grade: string): GradeClass {
  const lead = grade.trim().toLowerCase();
  if (lead.startsWith("daif") || lead.startsWith("da'if") || lead.startsWith("weak")) return "daif";
  if (lead.startsWith("hasan")) return "hasan";
  return "sahih";
}

/** Localized grade badge; the full published grade stays in the a11y label. */
function GradePill({ grade }: { grade: string }) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const kind = hadithGradeClass(grade);
  const tone = kind === "daif" ? tokens.status.warning : tokens.status.success;
  return (
    <View
      accessibilityLabel={`${t(`zikrSession.grade.${kind}`)} — ${grade}`}
      style={[styles.gradePill, { backgroundColor: tone.soft }]}
    >
      <ThemedText type="caption" style={{ color: tone.color }} numberOfLines={1}>
        {t(`zikrSession.grade.${kind}`)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three },
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  headerTitle: { flex: 1 },
  iconWell: {
    width: 30,
    height: 30,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  virtue: { lineHeight: 21 },
  sources: { gap: Spacing.three },
  source: {
    gap: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  citationRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  citation: { fontWeight: "600" },
  gradePill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: 999,
    maxWidth: 220,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
});
