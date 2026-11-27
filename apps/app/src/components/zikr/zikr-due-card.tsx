import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { CategoryHue } from "@/components/ui/use-category-hue";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { TimedAdhkarSet } from "@/lib/adhkar-session";
import type { AppIcon as AppIconName } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";

type ZikrDueCardProps = {
  set: TimedAdhkarSet;
  /** "Morning Adhkar" / "After Fajr". */
  title: string;
  icon: AppIconName;
  hue: CategoryHue;
  onPress: () => void;
  preferredFocus?: boolean;
};

/**
 * A set whose time is now: status, progress and a Start / Continue call to
 * action in one tap target (the button is drawn, not nested — a <button> inside
 * a <button> is invalid HTML on web).
 */
export function ZikrDueCard({ set, title, icon, hue, onPress, preferredFocus }: ZikrDueCardProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const tv = isTV();
  const { completed, total, status } = set.state;
  const started = status === "inProgress";
  const action = started
    ? t("zikrSession.continueSet", { remaining: total - completed })
    : t("zikrSession.startSet");
  const progressLabel = t("zikrSession.progressShort", { completed, total });

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${t(`zikrSession.status.${status}`)}, ${progressLabel}. ${action}`}
      onPress={onPress}
      {...(tv && preferredFocus ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.card,
        tv && styles.cardTv,
        { backgroundColor: colors.card, borderColor: hue.border },
      ]}
    >
      <View style={styles.header}>
        <IconWell
          icon={icon}
          tint={hue.icon}
          background={hue.soft}
          well={tv ? 56 : 46}
          size={tv ? 26 : 22}
        />
        <View style={styles.headerText}>
          <ThemedText weight="bold" type="caption" style={[styles.eyebrow, { color: hue.text }]}>
            {t(`zikrSession.status.${status}`)}
          </ThemedText>
          <ThemedText type="smallBold" numberOfLines={2}>
            {title}
          </ThemedText>
        </View>
      </View>

      <View style={styles.progressRow}>
        <ProgressBar
          value={total > 0 ? completed / total : 0}
          accessibilityLabel={title}
          height={tv ? 8 : 6}
          color={hue.icon}
          style={styles.bar}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.count}>
          {`${completed}/${total}`}
        </ThemedText>
      </View>

      <View
        style={[styles.cta, tv && styles.ctaTv, { backgroundColor: colors.accent }]}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <AppIcon
          icon={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
          size={tv ? 18 : 14}
          tintColor={colors.accentForeground}
        />
        <ThemedText type="smallBold" style={{ color: colors.accentForeground }}>
          {action}
        </ThemedText>
      </View>
    </PressableScale>
  );
}

type ZikrCaughtUpCardProps = {
  title: string;
  body: string;
};

/** Shown in place of due cards once every open set is finished. */
export function ZikrCaughtUpCard({ title, body }: ZikrCaughtUpCardProps) {
  const { colors, tokens } = useThemeTokens();
  return (
    <View
      style={[
        styles.caughtUp,
        { backgroundColor: tokens.status.success.soft, borderColor: tokens.status.success.border },
      ]}
    >
      <IconWell
        icon={{ ios: "checkmark.seal.fill", android: "verified", web: "verified" }}
        tint={tokens.status.success.color}
        background={colors.card}
      />
      <View style={styles.headerText}>
        <ThemedText type="smallBold">{title}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {body}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexGrow: 1,
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
  cardTv: { padding: Spacing.four },
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  headerText: { flex: 1, minWidth: 0, gap: Spacing.half },
  eyebrow: { letterSpacing: 0.4, textTransform: "uppercase" },
  progressRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  bar: { flex: 1 },
  count: { fontVariant: ["tabular-nums"] },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    minHeight: tvDp(44),
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  ctaTv: { minHeight: TvLayout.minFocusTarget },
  caughtUp: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
  },
});
