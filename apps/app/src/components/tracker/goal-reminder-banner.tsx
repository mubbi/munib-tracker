import type { SymbolViewProps } from "expo-symbols";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, IconSize, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useArrowForward } from "@/lib/rtl";

export type GoalReminderTone = "accent" | "success" | "warning" | "info";

/** One Today's Goal reminder (Friday, White Days, hour of dua, khatm …). */
export type GoalReminderModel = {
  /** Stable id (also the React key). */
  id: string;
  icon: SymbolViewProps["name"];
  title: string;
  body: string;
  /** Optional link line under the body ("Open checklist · 2/6"). */
  link?: string;
  tone?: GoalReminderTone;
  accessibilityLabel: string;
  onPress: () => void;
};

/**
 * The one Today's Goal reminder banner (B-86): soft tone fill, AA `onSoft`
 * text, a forward arrow, one pressable. The four reminder files only build
 * the model; this owns the look.
 */
export function GoalReminderBanner({
  icon,
  title,
  body,
  link,
  tone = "accent",
  accessibilityLabel,
  onPress,
}: Omit<GoalReminderModel, "id">) {
  const { colors, tokens } = useThemeTokens();
  const arrowForward = useArrowForward();
  const palette =
    tone === "accent"
      ? {
          soft: tokens.accentSoft,
          fg: tokens.accentOnSoft,
          icon: colors.accent,
          border: tokens.accentBorder,
        }
      : {
          soft: tokens.status[tone].soft,
          fg: tokens.status[tone].onSoft,
          icon: tokens.status[tone].color,
          border: tokens.status[tone].border,
        };

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      haptic="light"
      scaleTo={0.98}
      style={[
        styles.banner,
        {
          backgroundColor: palette.soft,
          // TV: quiet edge at rest — the solid ring means D-pad focus.
          borderColor: isTV() ? tokens.hairline : palette.border,
        },
      ]}
    >
      <SymbolView name={icon} size={IconSize.lg} tintColor={palette.icon} />
      <View style={styles.copy}>
        <ThemedText type="smallBold" style={{ color: palette.fg }}>
          {title}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {body}
        </ThemedText>
        {link ? (
          <ThemedText type="caption" weight="semibold" style={{ color: palette.fg }}>
            {link}
          </ThemedText>
        ) : null}
      </View>
      <SymbolView name={arrowForward} size={IconSize.md} tintColor={palette.fg} />
    </PressableScale>
  );
}

/**
 * At most one reminder at a time (B-15): the highest-priority banner, then a
 * "+N more" control that reveals the rest in place. TV shows them all — a
 * mid-card toggle would break the D-pad flow.
 */
export function GoalReminderStack({ reminders }: { reminders: GoalReminderModel[] }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  if (reminders.length === 0) return null;
  const showAll = expanded || isTV();
  const shown = showAll ? reminders : reminders.slice(0, 1);
  const hidden = reminders.length - shown.length;

  return (
    <View style={styles.stack} testID="goal-reminders">
      {shown.map(({ id, ...reminder }) => (
        <GoalReminderBanner key={id} {...reminder} />
      ))}
      {hidden > 0 ? (
        <Button
          variant="ghost"
          size="sm"
          label={t("tracker.moreReminders", { count: hidden })}
          accessibilityHint={t("tracker.moreRemindersHint")}
          onPress={() => setExpanded(true)}
          style={styles.more}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.two,
  },
  banner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  copy: {
    flex: 1,
    gap: Spacing.half,
  },
  more: {
    alignSelf: "flex-start",
  },
});
