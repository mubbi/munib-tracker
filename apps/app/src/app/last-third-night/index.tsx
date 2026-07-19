import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { HadithExcerptCard } from "@/components/hadith/hadith-excerpt-card";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Stagger } from "@/components/ui/stagger";
import { WallClockPicker, type WallClockValue } from "@/components/ui/wall-clock-picker";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useNow } from "@/hooks/use-now";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useTimeFormat } from "@/hooks/use-time-format";
import { locationCalcExtras, type StoredLocation } from "@/lib/location";
import { goBackOrReplace } from "@/lib/navigation";
import {
  computeNightDividers,
  detectNightPrayerWallClock,
  formatDuration,
  formatPrayerTime,
  resolveNightBoundsForNow,
} from "@/lib/prayer-times";
import { arrowForward } from "@/lib/rtl";
import { formatDisplayHhMm } from "@/lib/time";
import { useLocation } from "@/stores/location-store";

/** Abu Huraira — Allah descends in the last third of the night (Sahih al-Bukhari 1145). */
const LAST_THIRD_HADITH_ID = "bukhari:1145";

type EditField = "maghrib" | "fajr";

function detectTimes(location: StoredLocation): { maghrib: WallClockValue; fajr: WallClockValue } {
  return detectNightPrayerWallClock(
    { latitude: location.latitude, longitude: location.longitude },
    new Date(),
    location.method,
    location.madhab,
    locationCalcExtras(location),
    location.timeZone,
  );
}

export default function LastThirdNightScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const timeFormat = useTimeFormat();
  const location = useLocation();
  const now = useNow();

  const [seed] = useState(() => detectTimes(location));
  const [maghrib, setMaghrib] = useState<WallClockValue>(seed.maghrib);
  const [fajr, setFajr] = useState<WallClockValue>(seed.fajr);
  const [editField, setEditField] = useState<EditField | null>(null);

  const autoDetect = useCallback(() => {
    const detected = detectTimes(location);
    setMaghrib(detected.maghrib);
    setFajr(detected.fajr);
  }, [location]);

  const result = useMemo(() => {
    const bounds = resolveNightBoundsForNow(maghrib, fajr, now, location.timeZone);
    if (!bounds) return undefined;
    return { ...computeNightDividers(bounds.maghribAt, bounds.fajrAt), fajrAt: bounds.fajrAt };
  }, [fajr, location.timeZone, maghrib, now]);

  const countdownLabel = useMemo(() => {
    if (!result) return undefined;
    const nowMs = now.getTime();
    if (nowMs < result.lastThird.getTime()) {
      const minutes = Math.max(0, Math.round((result.lastThird.getTime() - nowMs) / 60_000));
      return t("lastThirdNight.willStartIn", { time: formatDuration(minutes) });
    }
    if (nowMs < result.fajrAt.getTime()) {
      const minutes = Math.max(0, Math.round((result.fajrAt.getTime() - nowMs) / 60_000));
      return t("lastThirdNight.timeRemaining", { time: formatDuration(minutes) });
    }
    return undefined;
  }, [now, result, t]);

  const formatWall = (value: WallClockValue) =>
    formatDisplayHhMm(value.hour, value.minute, timeFormat);

  const editingValue = editField === "fajr" ? fajr : maghrib;
  const setEditingValue = editField === "fajr" ? setFajr : setMaghrib;

  return (
    <ScreenLayout
      eyebrow={t("lastThirdNight.eyebrow")}
      title={t("lastThirdNight.title")}
      subtitle={t("lastThirdNight.subtitle")}
      onBack={() => goBackOrReplace(router, "/tahajjud")}
    >
      <Seo path="/last-third-night" />
      <Stagger>
        <Card
          padding="four"
          style={{
            backgroundColor: tokens.status.info.soft,
            borderColor: withAlpha(tokens.status.info.color, tokens.isDark ? 0.45 : 0.28),
            borderWidth: StyleSheet.hairlineWidth,
          }}
        >
          {result ? (
            <View style={styles.hero}>
              <ThemedText type="caption" style={{ color: tokens.status.info.text }}>
                {t("lastThirdNight.lastThirdLabel")}
              </ThemedText>
              <ThemedText
                type="display"
                style={[styles.heroTime, { color: tokens.status.info.text }]}
              >
                {formatPrayerTime(result.lastThird, timeFormat, location.timeZone)}
              </ThemedText>
              {countdownLabel ? (
                <ThemedText
                  type="small"
                  style={[styles.countdown, { color: tokens.status.info.text }]}
                >
                  {countdownLabel}
                </ThemedText>
              ) : null}
              <View style={styles.heroMeta}>
                <View style={styles.metaItem}>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("lastThirdNight.midNightLabel")}
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {formatPrayerTime(result.midNight, timeFormat, location.timeZone)}
                  </ThemedText>
                </View>
                <View style={[styles.metaDivider, { backgroundColor: colors.border }]} />
                <View style={styles.metaItem}>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("lastThirdNight.nightLengthLabel")}
                  </ThemedText>
                  <ThemedText type="smallBold">
                    {formatDuration(result.nightDurationMinutes)}
                  </ThemedText>
                </View>
              </View>
            </View>
          ) : (
            <ThemedText type="small" themeColor="mutedForeground" style={styles.centered}>
              {t("lastThirdNight.invalidTimes")}
            </ThemedText>
          )}
        </Card>

        <Card padding="three">
          <View style={styles.timesHeader}>
            <ThemedText type="smallBold">{t("lastThirdNight.basedOn")}</ThemedText>
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t("lastThirdNight.autoDetect")}
              onPress={autoDetect}
              style={styles.refreshRow}
            >
              <SymbolView
                name={{ ios: "location.fill", android: "my_location", web: "my_location" }}
                size={14}
                tintColor={colors.accent}
              />
              <ThemedText type="caption" style={{ color: colors.accent }}>
                {t("lastThirdNight.autoDetect")}
              </ThemedText>
            </PressableScale>
          </View>

          <View style={styles.timeRow}>
            <TimeChip
              label={t("lastThirdNight.maghribLabel")}
              value={formatWall(maghrib)}
              onPress={() => setEditField("maghrib")}
              editLabel={t("lastThirdNight.editTime", { prayer: t("prayers.maghrib") })}
            />
            <SymbolView name={arrowForward()} size={16} tintColor={colors.mutedForeground} />
            <TimeChip
              label={t("lastThirdNight.fajrLabel")}
              value={formatWall(fajr)}
              onPress={() => setEditField("fajr")}
              editLabel={t("lastThirdNight.editTime", { prayer: t("prayers.fajr") })}
            />
          </View>

          <ThemedText type="caption" themeColor="mutedForeground" style={styles.locationHint}>
            {t("lastThirdNight.autoDetectHint", { location: location.label })}
          </ThemedText>
        </Card>

        <Card padding="three">
          <View style={styles.hadithHeader}>
            <SymbolView
              name={{ ios: "quote.opening", android: "format_quote", web: "format_quote" }}
              size={16}
              tintColor={colors.mutedForeground}
            />
            <ThemedText type="smallBold">{t("lastThirdNight.hadithTitle")}</ThemedText>
          </View>
          <HadithExcerptCard hadithId={LAST_THIRD_HADITH_ID} />
        </Card>
      </Stagger>

      <Sheet visible={editField != null} onClose={() => setEditField(null)} variant="bottom" solid>
        <View style={styles.sheetBody}>
          <ThemedText type="subtitle">
            {editField === "fajr"
              ? t("lastThirdNight.fajrLabel")
              : t("lastThirdNight.maghribLabel")}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("lastThirdNight.editHint")}
          </ThemedText>
          {editField ? <WallClockPicker value={editingValue} onChange={setEditingValue} /> : null}
          <Button
            label={t("common.done")}
            fullWidth
            onPress={() => setEditField(null)}
            style={styles.sheetDone}
          />
        </View>
      </Sheet>
    </ScreenLayout>
  );
}

function TimeChip({
  label,
  value,
  onPress,
  editLabel,
}: {
  label: string;
  value: string;
  onPress: () => void;
  editLabel: string;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={editLabel}
      onPress={onPress}
      style={[styles.chip, { backgroundColor: colors.muted }]}
    >
      <View style={styles.chipHeader}>
        <ThemedText type="caption" themeColor="mutedForeground">
          {label}
        </ThemedText>
        <IconWell
          icon={{ ios: "pencil", android: "edit", web: "edit" }}
          size={13}
          well={28}
          radius={Radius.pill}
          tint={colors.accent}
          background={withAlpha(colors.accent, tokens.isDark ? 0.22 : 0.14)}
        />
      </View>
      <ThemedText
        type="title"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.55}
        style={{ color: colors.accent }}
      >
        {value}
      </ThemedText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    gap: Spacing.one,
  },
  heroTime: {
    fontSize: 48,
    lineHeight: 56,
    letterSpacing: -1,
  },
  countdown: {
    opacity: 0.85,
    textAlign: "center",
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    marginTop: Spacing.three,
    width: "100%",
    justifyContent: "center",
  },
  metaItem: {
    alignItems: "center",
    gap: 2,
    flex: 1,
  },
  metaDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: "stretch",
  },
  centered: {
    textAlign: "center",
  },
  timesHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  refreshRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.two,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  chip: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  chipHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  locationHint: {
    marginTop: Spacing.three,
    textAlign: "center",
  },
  hadithHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  sheetBody: {
    gap: Spacing.three,
    alignItems: "center",
  },
  sheetDone: {
    marginTop: Spacing.two,
    alignSelf: "stretch",
  },
});
