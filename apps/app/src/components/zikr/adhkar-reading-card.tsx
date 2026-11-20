import type { ZikrItem } from "@munib-tracker/shared/types";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ReferenceLine } from "@/components/content/reference-line";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useScriptureTranslation } from "@/hooks/use-scripture-translation";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  arabicReadingLayout,
  resolveReadingFontSizes,
  translationReadingStyle,
} from "@/lib/reading-typography";
import { usePreferences } from "@/stores/preferences-store";
import { useReadingTextVisibility } from "@/stores/reading-text-visibility-store";

type AdhkarReadingCardProps = {
  item: ZikrItem;
  position: number;
  total: number;
  target: number;
  done: boolean;
  optional: boolean;
  /** Wide / TV: a touch more Arabic size — there is room, and it is the hero. */
  emphasis?: boolean;
  /** Trailing controls in the header (favorite, details). */
  actions?: ReactNode;
  footer?: ReactNode;
};

/**
 * The zikr itself, as the hero of the session: where it sits in the set, how
 * many times to say it, then the Arabic, transliteration and meaning with the
 * reader's typography preferences.
 */
export function AdhkarReadingCard({
  item,
  position,
  total,
  target,
  done,
  optional,
  emphasis = false,
  actions,
  footer,
}: AdhkarReadingCardProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { fontPrefs, translationLocale } = usePreferences();
  const { showTransliteration, showTranslation } = useReadingTextVisibility();
  const translation = useScriptureTranslation(item).trim();
  const sizes = resolveReadingFontSizes("dua_zikr", fontPrefs);
  const arabicSize = Math.round(sizes.arabic * (emphasis ? 1.18 : 1));
  const transliteration = item.transliteration?.trim() ?? "";
  const success = tokens.status.success;

  return (
    <Card
      variant="muted"
      padding="four"
      style={[
        styles.card,
        done && { borderColor: withAlpha(success.color, 0.55), borderWidth: 1.5 },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.meta}>
          <View style={[styles.position, { backgroundColor: colors.card }]}>
            <ThemedText type="caption" style={styles.positionText}>
              {t("zikrSession.position", { current: position, total })}
            </ThemedText>
          </View>
          <Pill
            compact
            label={target > 1 ? `×${target}` : t("zikrSession.once")}
            color={colors.accent}
            background={tokens.accentSoft}
          />
          {optional ? (
            <Pill
              compact
              label={t("zikrSession.optional")}
              color={tokens.status.warning.color}
              background={tokens.status.warning.soft}
              icon={{ ios: "info.circle", android: "info", web: "info" }}
            />
          ) : null}
          {done ? (
            <Pill
              compact
              label={t("zikrSession.recited")}
              color={success.color}
              background={success.soft}
              icon={{ ios: "checkmark", android: "check", web: "check" }}
            />
          ) : null}
        </View>
        {actions ? <View style={styles.actions}>{actions}</View> : null}
      </View>

      <ThemedText type="smallBold" style={styles.title} accessibilityRole="header">
        {item.title}
      </ThemedText>

      <ThemedText type="arabic" style={[styles.arabic, arabicReadingLayout(arabicSize, "center")]}>
        {item.arabic}
      </ThemedText>

      {showTransliteration && transliteration ? (
        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          style={[
            styles.translit,
            {
              fontSize: sizes.transliteration,
              lineHeight: sizes.transliteration * 1.4,
            },
          ]}
        >
          {transliteration}
        </ThemedText>
      ) : null}

      {showTranslation && translation ? (
        <ThemedText
          type="default"
          style={[
            styles.translation,
            translationReadingStyle(translationLocale, sizes.translation),
          ]}
        >
          {translation}
        </ThemedText>
      ) : null}

      {optional ? (
        <View style={[styles.note, { backgroundColor: tokens.status.warning.soft }]}>
          <ThemedText type="caption" style={{ color: tokens.status.warning.color }}>
            {t("zikrSession.optionalNote")}
          </ThemedText>
        </View>
      ) : null}

      {item.reference ? (
        <ReferenceLine reference={item.reference} style={styles.reference} />
      ) : null}
      {footer}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.three, borderWidth: 1, borderColor: "transparent" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.one + 2,
    flex: 1,
  },
  actions: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  position: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  positionText: { fontWeight: "700", fontVariant: ["tabular-nums"] },
  title: { textAlign: "center" },
  arabic: { textAlign: "center", writingDirection: "rtl", paddingVertical: Spacing.one },
  translit: { textAlign: "center", fontStyle: "italic", alignSelf: "center", maxWidth: 560 },
  translation: { textAlign: "center", alignSelf: "center", maxWidth: 600 },
  note: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  reference: { textAlign: "center" },
});
