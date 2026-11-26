import type { DurudItem, ZikrHadithContext } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { duroodGradeClass } from "@/components/duroods/durood-browse";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { loadDuroodHadith } from "@/lib/content-loaders";
import {
  arabicReadingLayout,
  resolveReadingFontSizes,
  translationReadingStyle,
} from "@/lib/reading-typography";
import { resolveHadithTranslation } from "@/lib/translation-locale";
import { usePreferences } from "@/stores/preferences-store";

/** Lazily loaded source-hadith map (own chunk — fetched only when a reader opens). */
function useDuroodHadith(id: string): ZikrHadithContext | null | undefined {
  const [state, setState] = useState<{ id: string; data: ZikrHadithContext | null }>();
  useEffect(() => {
    let active = true;
    void loadDuroodHadith()
      .then((map) => {
        if (active) setState({ id, data: map[id] ?? null });
      })
      .catch(() => {
        if (active) setState({ id, data: null });
      });
    return () => {
      active = false;
    };
  }, [id]);
  // `undefined` while loading this id; `null` when it has no dataset narration.
  return state?.id === id ? state.data : undefined;
}

function GradePill({ grade }: { grade: string }) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const kind = duroodGradeClass(grade);
  if (!kind) return null;
  return (
    <View accessible accessibilityLabel={`${t(`duroods.grade.${kind}`)} — ${grade}`}>
      <Pill
        compact
        label={t(`duroods.grade.${kind}`)}
        color={tokens.status.success.color}
        background={tokens.status.success.soft}
      />
    </View>
  );
}

/**
 * Where a durood comes from: each citation with its published grade, and the
 * full narration (verbatim Arabic + the reader's dataset translation) one tap
 * away. Items sourced outside the six books show their own citation only.
 */
export function DuroodSourceCard({
  item,
  defaultExpanded = false,
}: {
  item: DurudItem;
  /** Open the narrations straight away (the list's info button). */
  defaultExpanded?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs, translationLocale } = usePreferences();
  const context = useDuroodHadith(item.id);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const sizes = resolveReadingFontSizes("hadith", fontPrefs);

  // Collapse again when the reader pages to another durood.
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset per durood id
  useEffect(() => {
    setExpanded(defaultExpanded);
  }, [item.id]);

  const sources = context?.sources ?? [];
  const reference = item.reference?.trim();
  if (sources.length === 0 && !reference) return null;

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
          {t("duroods.sourceTitle")}
        </ThemedText>
      </View>

      {sources.length > 0 ? (
        <View style={styles.citations}>
          {sources.map((source) => (
            <View key={`${source.collection}-${source.hadithNumber}`} style={styles.citationRow}>
              <ThemedText type="caption" style={styles.citation}>
                {source.reference}
              </ThemedText>
              {source.grade ? <GradePill grade={source.grade} /> : null}
            </View>
          ))}
        </View>
      ) : reference ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {reference}
        </ThemedText>
      ) : null}

      {expanded && sources.length > 0 ? (
        <View style={styles.sources}>
          {sources.map((source) => (
            <View
              key={`${source.collection}-${source.hadithNumber}`}
              style={[styles.source, { borderTopColor: tokens.hairline }]}
            >
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.citation}>
                {source.reference}
                {source.grade ? ` · ${source.grade}` : ""}
              </ThemedText>
              {translationLocale !== "ar" ? (
                <ThemedText
                  type="arabic"
                  accessibilityLanguage="ar"
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
            {expanded ? t("duroods.hideHadith") : t("duroods.readHadith")}
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
  citations: { gap: Spacing.two },
  citationRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  citation: { fontWeight: "600" },
  sources: { gap: Spacing.three },
  source: {
    gap: Spacing.two,
    paddingTop: Spacing.three,
    borderTopWidth: BorderWidth.hairline,
  },
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.twoHalf,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
});
