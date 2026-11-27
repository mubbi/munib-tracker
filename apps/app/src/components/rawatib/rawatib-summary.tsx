import type { RawatibPreset } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ArcProgressRing } from "@/components/ui/arc-progress-ring";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Control, IconSize, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";

const ICON = { ios: "sun.horizon.fill", android: "wb_sunny", web: "wb_sunny" } as const;
const RING = 22;
const RING_STROKE = 3;

type RawatibSummaryRowProps = {
  /** Mu'akkadah rakahs logged that day. */
  rakahsDone: number;
  target: RawatibPreset;
  /** Day's excused reason (hayd / nifas never reach here — the row is hidden). */
  excusedReason: string | null | undefined;
  /** Opens the rawatib hub (evidence — Sahih Muslim 728 — and settings). */
  onOpenHub: () => void;
};

/**
 * Slim footer of the Obligatory card (NF-3.1): a tiny ring + "Sunnah rawatib ·
 * 4 / 12 rakahs", today's travel / illness note, and "Evidence & settings". One
 * pressable (one D-pad stop after the last Salah card) that opens the hub.
 */
export function RawatibSummaryRow({
  rakahsDone,
  target,
  excusedReason,
  onOpenHub,
}: RawatibSummaryRowProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  const tv = isTV();
  const complete = rakahsDone >= target;
  const title = t("rawatib.card.title");
  const progress = t("rawatib.card.progress", { done: rakahsDone, total: target });
  const openHub = t("rawatib.card.openHub");
  const note =
    excusedReason === "travel"
      ? t("rawatib.card.travelHint")
      : excusedReason === "sick"
        ? t("rawatib.card.sickHint")
        : null;
  const ring = tv ? tvDp(RING) : RING;

  return (
    <PressableScale
      testID="rawatib-summary"
      haptic="light"
      scaleTo={0.98}
      accessibilityRole="button"
      accessibilityLabel={[`${title}, ${progress}`, note, openHub].filter(Boolean).join(". ")}
      onPress={onOpenHub}
      style={[styles.summary, { borderColor: colors.border }, tv ? styles.summaryTv : null]}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <ArcProgressRing
          size={ring}
          stroke={tv ? tvDp(RING_STROKE) : RING_STROKE}
          progress={target > 0 ? rakahsDone / target : 0}
          fillColor={tokens.status.success.color}
          trackColor={tokens.track}
          surfaceColor={colors.card}
        />
      </View>
      <View style={styles.copy}>
        <ThemedText type="caption">
          <ThemedText type="caption" weight="semibold">
            {title}
          </ThemedText>
          <ThemedText
            type="caption"
            style={{ color: complete ? tokens.status.success.text : colors.mutedForeground }}
          >
            {` · ${progress}`}
          </ThemedText>
        </ThemedText>
        {note ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {note}
          </ThemedText>
        ) : null}
      </View>
      <View style={styles.link}>
        <ThemedText
          type="caption"
          weight="semibold"
          numberOfLines={2}
          style={[styles.linkText, { color: colors.accentText }]}
        >
          {openHub}
        </ThemedText>
        <SymbolView name={chevronForward} size={IconSize.xs} tintColor={colors.accentText} />
      </View>
    </PressableScale>
  );
}

type RawatibFirstRunPromptProps = {
  /** Answer to the first-run question (no madhhab chosen — never silently picks one). */
  onChoose: (choice: RawatibPreset | "off") => void;
};

/**
 * One-time inline question inside the Obligatory card when no madhhab is
 * chosen: track 12 or 10 rakahs, or not now. Answering stores the preference,
 * so it never returns.
 */
export function RawatibFirstRunPrompt({ onChoose }: RawatibFirstRunPromptProps) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();

  return (
    <View
      testID="rawatib-first-run"
      style={[
        styles.prompt,
        { backgroundColor: tokens.accentSoft, borderColor: tokens.accentBorder },
      ]}
    >
      <View style={styles.promptHeader}>
        <SymbolView name={ICON} size={IconSize.md} tintColor={tokens.accentOnSoft} />
        <ThemedText type="smallBold" heading={3} style={{ color: tokens.accentOnSoft }}>
          {t("rawatib.card.title")}
        </ThemedText>
      </View>
      <ThemedText type="caption" style={{ color: tokens.accentOnSoft }}>
        {t("rawatib.card.askBody")}
      </ThemedText>
      <View style={styles.actions}>
        <Button label={t("rawatib.card.askTwelve")} size="sm" onPress={() => onChoose(12)} />
        <Button
          label={t("rawatib.card.askTen")}
          size="sm"
          variant="secondary"
          onPress={() => onChoose(10)}
        />
        <Button
          label={t("rawatib.card.askNotNow")}
          size="sm"
          variant="ghost"
          onPress={() => onChoose("off")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.twoHalf,
    minHeight: Control.md,
    marginTop: Spacing.three,
    paddingTop: Spacing.twoHalf,
    paddingBottom: Spacing.one,
    paddingHorizontal: Spacing.one,
    borderTopWidth: BorderWidth.hairline,
  },
  summaryTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
  },
  copy: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.half,
  },
  link: {
    flexShrink: 1,
    maxWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  linkText: {
    flexShrink: 1,
  },
  prompt: {
    gap: Spacing.two,
    marginTop: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  promptHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
});
