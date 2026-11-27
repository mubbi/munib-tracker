import type { AppLocale } from "@munib-tracker/shared/types";
import { Image, type ImageSource } from "expo-image";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";

import { APP_ICON_PREVIEWS } from "@/components/app-icon/app-icon-previews";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  APP_ICON_PREFERENCES,
  type AppIconPreference,
  appIconAppliesInBackground,
  appIconPreferenceLabelKey,
  nextSeasonalAppIcon,
  resolveAppIcon,
} from "@/lib/app-icon";
import { formatCalendarDate } from "@/lib/calendar-format";
import { useSetting } from "@/lib/settings/use-setting";
import { useLocation } from "@/stores/location-store";

/** The registry setting this editor writes (`lib/settings/defs/appearance.ts`). */
export const APP_ICON_SETTING_ID = "appearance.appIcon";

const THUMB = 64;
const CARD_MIN = 96;
const NEXT_DATE: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" };

function cardWidth(rowWidth: number): number {
  const columns = Math.max(1, Math.floor((rowWidth + Spacing.two) / (CARD_MIN + Spacing.two)));
  return Math.floor((rowWidth - Spacing.two * (columns - 1)) / columns);
}

/**
 * Appearance › App icon (NF-2.23b): "Seasonal" follows the Islamic calendar,
 * "Classic" keeps the brand icon, or pick one seasonal icon to keep all year.
 * The root `AppIconHost` applies the choice — this editor only writes the setting.
 */
export function AppIconEditor() {
  const { t, i18n } = useTranslation();
  const { value, setValue } = useSetting<AppIconPreference>(APP_ICON_SETTING_ID);
  const location = useLocation();
  const [rowWidth, setRowWidth] = useState(0);
  const width = rowWidth ? cardWidth(rowWidth) : CARD_MIN;

  // Recomputed per render on purpose: cheap, and the day may roll over while open.
  const today = resolveAppIcon("seasonal", new Date(), location.timeZone);
  const upcoming = useMemo(
    () => (value === "seasonal" ? nextSeasonalAppIcon(new Date(), location.timeZone) : null),
    [value, location.timeZone],
  );

  const status =
    value !== "seasonal"
      ? null
      : today
        ? t("appIcon.showingNow", { name: t(appIconPreferenceLabelKey(today)) })
        : upcoming
          ? t("appIcon.next", {
              name: t(appIconPreferenceLabelKey(upcoming.id)),
              date: formatCalendarDate(
                upcoming.date,
                "gregorian",
                i18n.language as AppLocale,
                NEXT_DATE,
              ),
            })
          : null;

  const platformNote = appIconAppliesInBackground()
    ? t("appIcon.noteAndroid")
    : Platform.OS === "ios"
      ? t("appIcon.noteIos")
      : null;

  return (
    <View style={styles.root}>
      <View style={styles.grid} onLayout={(e) => setRowWidth(e.nativeEvent.layout.width)}>
        {APP_ICON_PREFERENCES.map((pref) => (
          <View key={pref} style={{ width }}>
            <IconCard
              preference={pref}
              preview={APP_ICON_PREVIEWS[pref === "seasonal" ? (today ?? "classic") : pref]}
              selected={pref === value}
              onSelect={() => void setValue(pref)}
            />
          </View>
        ))}
      </View>
      {status ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
          {status}
        </ThemedText>
      ) : null}
      {value === "seasonal" ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
          {t("seasonalTheme.dateDisclaimer")}
        </ThemedText>
      ) : null}
      {platformNote ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
          {platformNote}
        </ThemedText>
      ) : null}
    </View>
  );
}

function IconCard({
  preference,
  preview,
  selected,
  onSelect,
}: {
  preference: AppIconPreference;
  preview: ImageSource;
  selected: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const label = t(appIconPreferenceLabelKey(preference));
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={preference === "seasonal" ? t("appIcon.mode.seasonalHint") : undefined}
      accessibilityState={{ selected }}
      onPress={onSelect}
      style={[
        styles.card,
        {
          backgroundColor: selected ? tokens.accentSoft : colors.muted,
          borderColor: selected ? colors.accent : "transparent",
        },
      ]}
    >
      <View style={styles.thumbWrap} pointerEvents="none">
        <Image source={preview} style={styles.thumb} contentFit="cover" accessible={false} />
        {preference === "seasonal" ? (
          <View style={[styles.autoBadge, { backgroundColor: colors.accent }]}>
            <SymbolView
              name={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
              size={12}
              tintColor={colors.accentForeground}
            />
          </View>
        ) : null}
      </View>
      <View style={styles.nameRow}>
        {selected ? (
          <SymbolView
            name={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
            size={14}
            tintColor={colors.accent}
          />
        ) : null}
        <ThemedText
          type="smallBold"
          numberOfLines={2}
          style={[styles.cardName, selected && { color: colors.accentText }]}
        >
          {label}
        </ThemedText>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.two,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  card: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thick,
  },
  thumbWrap: {
    width: THUMB,
    height: THUMB,
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    // iOS-style squircle-ish corner (≈22.5% of the side).
    borderRadius: THUMB * 0.225,
    borderCurve: "continuous",
  },
  autoBadge: {
    position: "absolute",
    bottom: -4,
    end: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.half,
  },
  cardName: {
    textAlign: "center",
    flexShrink: 1,
  },
  note: {
    textAlign: "center",
  },
});
