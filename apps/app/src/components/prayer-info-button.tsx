import { SymbolView } from "expo-symbols";
import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { PrayerInfoId } from "@/lib/prayer-info";

const PrayerInfoSheet = lazy(() =>
  import("@/components/prayer-info-sheet").then((mod) => ({ default: mod.PrayerInfoSheet })),
);

type PrayerInfoButtonProps = {
  prayerId: PrayerInfoId;
  /** Glyph tint; defaults to muted foreground. */
  tintColor?: string;
  /** Smaller tap target for dense rows (defaults to 44). */
  hitTarget?: number;
  /** When true, shows a compact "Learn more" label beside the icon. */
  showLabel?: boolean;
  /** Underline the label so it reads as an info link (tracker cards). */
  underlined?: boolean;
};

export function PrayerInfoButton({
  prayerId,
  tintColor,
  hitTarget = 44,
  showLabel = false,
  underlined = false,
}: PrayerInfoButtonProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const [open, setOpen] = useState(false);
  const prayerName = t(`prayers.${prayerId}`);
  const color = tintColor ?? (underlined ? colors.accent : colors.mutedForeground);

  return (
    <>
      {showLabel ? (
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("prayerInfo.infoA11y", { prayer: prayerName })}
          accessibilityHint={t("prayerInfo.infoHint")}
          onPress={() => setOpen(true)}
          haptic="light"
          // Expand the tap area without inflating row height (dense schedule/tracker cards).
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          style={styles.learnMore}
        >
          <SymbolView
            name={{ ios: "info.circle", android: "info", web: "info" }}
            size={13}
            tintColor={color}
          />
          <ThemedText
            type="caption"
            style={[{ color }, underlined ? styles.learnMoreUnderlined : null]}
          >
            {t("prayerInfo.learnMore")}
          </ThemedText>
        </PressableScale>
      ) : (
        <IconButton
          name={{ ios: "info.circle", android: "info", web: "info" }}
          size={16}
          hitTarget={hitTarget}
          tintColor={color}
          accessibilityLabel={t("prayerInfo.infoA11y", { prayer: prayerName })}
          accessibilityHint={t("prayerInfo.infoHint")}
          onPress={() => setOpen(true)}
        />
      )}
      {open ? (
        <Suspense fallback={null}>
          <PrayerInfoSheet visible={open} prayerId={prayerId} onClose={() => setOpen(false)} />
        </Suspense>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  learnMore: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
    gap: Spacing.half + 2,
    paddingVertical: 0,
  },
  learnMoreUnderlined: {
    textDecorationLine: "underline",
  },
});
