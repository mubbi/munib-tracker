import type { PrayerCombineMode, PrayerId } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useMadhhab } from "@/hooks/use-madhhab";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import {
  COMBINE_MODES,
  type CombineContext,
  combineHostPrayer,
  combineOfferFor,
  combinePairFor,
  type PrayerCombined,
} from "@/lib/prayer-combining";
import { PRAYER_COMBINED_ICON } from "@/lib/prayer-ui";

type PrayerCombinePickerProps = {
  prayerId: PrayerId;
  combined: PrayerCombined | null;
  onChange: (mode: PrayerCombineMode | null) => void;
};

function contextsHintKey(contexts: CombineContext[]): string {
  const travel = contexts.includes("travel");
  const rain = contexts.includes("rain");
  if (travel && rain) return "tracker.combined.allowedTravelRain";
  return travel ? "tracker.combined.allowedTravel" : "tracker.combined.allowedRain";
}

/**
 * "Combined with …" (jam') flag in the prayer status sheet (NF-3.0a). Shown
 * only for Dhuhr/Asr and Maghrib/Isha, and only when the user's school allows
 * combining (travel or rain); all-views mode offers it with a neutral note.
 * A flag recorded earlier is always shown (and can be cleared), so picking a
 * madhhab never hides or changes existing data. Separate from congregation.
 */
export function PrayerCombinePicker({ prayerId, combined, onChange }: PrayerCombinePickerProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const madhhab = useMadhhab();
  const [compareOpen, setCompareOpen] = useState(false);
  const tv = isTV();

  const offer = combineOfferFor(prayerId, {
    travel: madhhab.rules("travel"),
    rain: madhhab.rules("salah"),
  });
  const pair = combinePairFor(prayerId);
  if (!pair || (offer.kind === "none" && combined == null)) return null;

  const partner = pair[0] === prayerId ? pair[1] : pair[0];
  const partnerName = t(`prayers.${partner}`);
  const modes: readonly PrayerCombineMode[] =
    offer.kind === "none" && combined ? [combined.mode] : COMBINE_MODES;

  const hint =
    offer.kind === "allowed"
      ? t(contextsHintKey(offer.contexts))
      : offer.kind === "allViews"
        ? t("tracker.combined.allViewsHint")
        : t("tracker.combined.recordedHint");

  const options: { id: PrayerCombineMode | null; label: string }[] = [
    { id: null, label: t("tracker.combined.none") },
    ...modes.map((mode) => ({
      id: mode,
      label: t(`tracker.combined.${mode}`, {
        prayer: t(`prayers.${combineHostPrayer(pair, mode)}`),
      }),
    })),
  ];

  return (
    <View style={[styles.box, { backgroundColor: colors.muted, borderColor: colors.border }]}>
      <View style={styles.header}>
        <SymbolView name={PRAYER_COMBINED_ICON} size={18} tintColor={colors.accent} />
        <ThemedText type="smallBold" style={styles.title}>
          {t("tracker.combined.title", { prayer: partnerName })}
        </ThemedText>
      </View>
      <ThemedText type="caption" themeColor="mutedForeground">
        {hint}
      </ThemedText>
      <View style={styles.options} accessibilityRole="radiogroup">
        {options.map((option) => {
          const selected = (combined?.mode ?? null) === option.id;
          return (
            <PressableScale
              key={option.id ?? "none"}
              haptic="selection"
              accessibilityRole="radio"
              accessibilityLabel={option.label}
              accessibilityState={{ selected }}
              onPress={() => {
                if (!selected) onChange(option.id);
              }}
              style={[
                styles.option,
                tv ? styles.optionTv : null,
                {
                  backgroundColor: selected ? tokens.accentSoft : colors.card,
                  // TV: selected = soft fill + hairline; the thick ring is focus only.
                  borderColor: selected ? (tv ? tokens.hairline : colors.accent) : "transparent",
                },
              ]}
            >
              <ThemedText
                weight="semibold"
                type="caption"
                style={{
                  color: selected ? colors.accentText : colors.foreground,
                }}
              >
                {option.label}
              </ThemedText>
            </PressableScale>
          );
        })}
      </View>
      {offer.kind === "allViews" ? (
        <>
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityState={{ expanded: compareOpen }}
            onPress={() => setCompareOpen((open) => !open)}
            style={styles.compareToggle}
          >
            <ThemedText type="label" style={{ color: colors.accentText }}>
              {compareOpen ? t("tracker.combined.hideViews") : t("tracker.combined.compareViews")}
            </ThemedText>
          </PressableScale>
          {compareOpen ? (
            <View style={styles.notes}>
              <MadhhabNote id="jam.travel" />
              <MadhhabNote id="jam.rain" />
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
  },
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  title: { flex: 1 },
  options: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  option: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thick,
  },
  optionTv: { minHeight: TvLayout.minFocusTarget, justifyContent: "center" },
  compareToggle: { alignSelf: "flex-start", paddingVertical: Spacing.one },
  notes: { gap: Spacing.two },
});
