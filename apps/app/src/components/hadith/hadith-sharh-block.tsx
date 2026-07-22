import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { arabicReadingLayout } from "@/lib/reading-typography";
import { usePreferences } from "@/stores/preferences-store";

type HadithSharhBlockProps = {
  sharhArabic: string;
  /** Reading size for Arabic body. */
  arabicSize?: number;
  /** Start expanded (collection reader defaults collapsed). */
  defaultExpanded?: boolean;
};

/** Cap so a 10k-char Nawawi sharh does not blow up FlatList row height. */
const SHARH_MAX_HEIGHT = 280;

/**
 * Collapsible classical Arabic sharh (NF-2.8). Matches the prayer-schedule
 * disclosure pattern (muted / accentSoft, continuous radius) rather than a
 * nested Card. English meaning locales keep an honest Arabic-only note.
 */
export function HadithSharhBlock({
  sharhArabic,
  arabicSize = 18,
  defaultExpanded = false,
}: HadithSharhBlockProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { translationLocale } = usePreferences();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const showArabicOnlyNote = translationLocale !== "ar";
  const body = sharhArabic.trim();

  if (!body) return null;

  return (
    <View style={styles.wrap}>
      <PressableScale
        haptic="selection"
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={t("hadith.sharh")}
        accessibilityHint={showArabicOnlyNote ? t("hadith.sharhArabicOnly") : undefined}
        scaleTo={0.985}
        onPress={() => setExpanded((v) => !v)}
        style={[
          styles.header,
          {
            backgroundColor: expanded ? colors.muted : tokens.accentSoft,
            borderColor: expanded ? colors.border : colors.accent,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.background }]}>
          <SymbolView
            name={{
              ios: expanded ? "chevron.up.circle.fill" : "text.book.closed.fill",
              android: expanded ? "expand_less" : "menu_book",
              web: expanded ? "expand_less" : "menu_book",
            }}
            size={16}
            tintColor={expanded ? colors.mutedForeground : colors.accent}
          />
        </View>
        <ThemedText type="smallBold" style={styles.headerLabel}>
          {t("hadith.sharh")}
        </ThemedText>
        {!expanded ? (
          <View style={[styles.showPill, { backgroundColor: colors.accent }]}>
            <ThemedText
              type="caption"
              style={{ color: colors.accentForeground, fontWeight: "600" }}
            >
              {t("common.show")}
            </ThemedText>
            <SymbolView
              name={{
                ios: "chevron.down",
                android: "keyboard_arrow_down",
                web: "keyboard_arrow_down",
              }}
              size={12}
              tintColor={colors.accentForeground}
            />
          </View>
        ) : (
          <SymbolView
            name={{ ios: "chevron.up", android: "keyboard_arrow_up", web: "keyboard_arrow_up" }}
            size={16}
            tintColor={colors.mutedForeground}
          />
        )}
      </PressableScale>

      {expanded ? (
        <View
          style={[
            styles.body,
            {
              borderColor: tokens.hairline,
              backgroundColor: colors.muted,
            },
          ]}
        >
          {showArabicOnlyNote ? (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
              {t("hadith.sharhArabicOnly")}
            </ThemedText>
          ) : null}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            <ThemedText type="arabic" style={arabicReadingLayout(arabicSize)}>
              {body}
            </ThemedText>
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: Spacing.three,
    gap: Spacing.two,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLabel: { flex: 1 },
  showPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  body: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  note: { fontStyle: "italic" },
  scroll: { maxHeight: SHARH_MAX_HEIGHT },
  scrollContent: { paddingBottom: Spacing.one },
});
