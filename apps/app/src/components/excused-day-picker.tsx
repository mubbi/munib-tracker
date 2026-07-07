import { EXCUSED_GUIDE_ROUTES } from "@munib-tracker/shared/content";
import type { ExcusedReason } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useDayExcused, useTrackerActions } from "@/stores/tracker-store";

const EXCUSED_REASONS = ["hayd", "sick", "travel"] as const satisfies readonly ExcusedReason[];

const EXCUSED_REASON_ICONS: Record<ExcusedReason, SymbolViewProps["name"]> = {
  hayd: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  sick: { ios: "cross.case.fill", android: "medical_services", web: "medical_services" },
  travel: { ios: "airplane", android: "flight", web: "flight" },
};

type ExcusedDayPickerProps = {
  /** Inline sits inside another card; section renders its own title row. */
  variant?: "inline" | "section";
};

export function ExcusedDayPicker({ variant = "section" }: ExcusedDayPickerProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const excusedReason = useDayExcused();
  const { setDayExcused } = useTrackerActions();

  const handleChipPress = (reason: ExcusedReason, active: boolean) => {
    if (active) {
      void setDayExcused(null);
      return;
    }
    router.push(EXCUSED_GUIDE_ROUTES[reason] as Href);
  };

  const chips = (
    <View style={styles.row}>
      {EXCUSED_REASONS.map((reason) => {
        const active = excusedReason === reason;
        const tint = active ? tokens.status.info.color : colors.mutedForeground;
        return (
          <PressableScale
            key={reason}
            haptic="selection"
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={t(`tracker.excusedReason.${reason}`)}
            onPress={() => handleChipPress(reason, active)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? tokens.status.info.soft : colors.muted,
                borderColor: active ? tokens.status.info.color : "transparent",
              },
            ]}
          >
            <View style={styles.chipContent}>
              <SymbolView name={EXCUSED_REASON_ICONS[reason]} size={16} tintColor={tint} />
              <ThemedText type="smallBold" style={{ color: tint }}>
                {t(`tracker.excusedReason.${reason}`)}
              </ThemedText>
            </View>
          </PressableScale>
        );
      })}
    </View>
  );

  const hint = (
    <ThemedText
      type="caption"
      themeColor="mutedForeground"
      style={variant === "section" ? styles.sectionHint : undefined}
    >
      {excusedReason ? t("tracker.excusedActive") : t("tracker.excusedHint")}
    </ThemedText>
  );

  if (variant === "inline") {
    return (
      <View style={[styles.inline, { borderTopColor: colors.border }]}>
        <ThemedText type="smallBold">{t("tracker.excusedTitle")}</ThemedText>
        {hint}
        {chips}
      </View>
    );
  }

  return (
    <>
      <SectionHeader
        title={t("tracker.excusedTitle")}
        icon={{ ios: "pause.circle.fill", android: "pause_circle", web: "pause_circle" }}
      />
      {hint}
      {chips}
    </>
  );
}

const styles = StyleSheet.create({
  inline: {
    gap: Spacing.two,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sectionHint: {
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  chip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1.5,
  },
  chipContent: {
    alignItems: "center",
    gap: Spacing.half,
  },
});
