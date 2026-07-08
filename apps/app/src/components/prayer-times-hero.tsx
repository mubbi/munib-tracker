import type { WeatherEffectKind } from "@munib-tracker/shared/types";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { MoonPhaseIcon } from "@/components/moon-phase";
import { MoonPhaseSheet } from "@/components/moon-phase-sheet";
import { MosqueSilhouette } from "@/components/mosque-silhouette";
import { SkyGradientLayer } from "@/components/sky-gradient-layer";
import { ThemedText } from "@/components/themed-text";
import { GlassControl, hasLiquidGlass } from "@/components/ui/glass-surface";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { HeroWeatherEffects } from "@/components/weather/hero-weather-effects";
import { Durations } from "@/constants/motion";
import { Brand, Radius, Spacing, StatusPalette, withAlpha } from "@/constants/theme";
import type { DualCalendarDates } from "@/lib/calendar-format";
import { gradientBackground } from "@/lib/gradient";
import { chevronForward } from "@/lib/rtl";
import type { SkyPalette } from "@/lib/sky";

import { heroMotionClasses } from "./prayer-times-hero-motion";

export type PrayerTime = {
  name: string;
  time: string;
  icon: SymbolViewProps["name"];
};

type PrayerTimesHeroProps = {
  location: string;
  displayDates?: DualCalendarDates;
  /** @deprecated Legacy single-line prop — kept for hot-reload safety. */
  displayDate?: string;
  currentTime: string;
  /** Pre-localized countdown line, e.g. "Maghrib is 27 min away". */
  countdown: string;
  prayers: PrayerTime[];
  /** Index of the prayer whose window is currently running (the highlighted card). */
  activeIndex: number;
  /** Safe-area top inset so the hero can sit under the status bar. */
  topInset: number;
  /** Time-of-day palette driving the background, glow, and accent. */
  sky: SkyPalette;
  /** Instant used to draw the current moon phase. */
  now: Date;
  /** Localized accessibility label for the moon phase glyph. */
  moonLabel: string;
  /** Mirror moon lit side for observers south of the equator. */
  southernHemisphere?: boolean;
  /** Fraction (0..1) of the current prayer window that has elapsed. */
  windowProgress: number;
  notificationCount?: number;
  /** Localized weather line shown after the location label, e.g. "22° · Sunny". */
  weatherSummary?: string | null;
  weatherAccessibilityLabel?: string | null;
  weatherEffects?: WeatherEffectKind[];
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  /** Re-request / refresh the stored location (fires on tapping the location row). */
  onLocationPress?: () => void;
};

/**
 * Inactive prayer names/times: a high-alpha cream rather than the muted
 * `heroSubtext` teal, so they keep ~4.5:1 contrast even on the brightest
 * (noon) sky while still reading as secondary next to the active marker.
 */
const INACTIVE_PRAYER_TEXT = withAlpha(Brand.heroText, 0.82);

/** Fixed positions for the faint night starfield (left %, top px, size, opacity). */
const STARS = [
  { left: "14%", top: 40, size: 2, opacity: 0.7 },
  { left: "27%", top: 74, size: 1.5, opacity: 0.5 },
  { left: "42%", top: 52, size: 2, opacity: 0.8 },
  { left: "58%", top: 88, size: 1.5, opacity: 0.55 },
  { left: "69%", top: 46, size: 2.5, opacity: 0.85 },
  { left: "83%", top: 70, size: 1.5, opacity: 0.6 },
  { left: "90%", top: 100, size: 2, opacity: 0.7 },
] as const;

/**
 * The full-bleed home header and emotional centrepiece. A layered gradient sky
 * (native, no SVG) shifts with the time of day, the layers drift on a very slow
 * loop for a live-wallpaper feel, a soft celestial glow breathes overhead (sun
 * by day, moon by night), and a mosque silhouette rises from the base. The
 * current moon phase sits beside the lunar (Hijri) date; the sky's accent marks
 * the live prayer and location.
 */
export function PrayerTimesHero({
  location,
  displayDates: displayDatesProp,
  displayDate,
  currentTime,
  countdown,
  prayers,
  activeIndex,
  topInset,
  sky,
  now,
  moonLabel,
  southernHemisphere = false,
  windowProgress,
  notificationCount = 0,
  weatherSummary = null,
  weatherAccessibilityLabel = null,
  weatherEffects = [],
  onSearchPress,
  onNotificationsPress,
  onLocationPress,
}: PrayerTimesHeroProps) {
  const { t } = useTranslation();
  const displayDates = displayDatesProp ?? {
    primary: displayDate ?? "",
    secondary: "",
  };
  const { primary: primaryDate, secondary: secondaryDate } = displayDates;
  const reducedMotion = useReducedMotion();
  const breath = useSharedValue(0);
  const drift = useSharedValue(0);
  const [moonOpen, setMoonOpen] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web" || reducedMotion) return;
    const easing = Easing.inOut(Easing.sin);
    breath.value = withRepeat(withTiming(1, { duration: Durations.ambient, easing }), -1, true);
    drift.value = withRepeat(withTiming(1, { duration: Durations.wallpaper, easing }), -1, true);
  }, [reducedMotion, breath, drift]);

  const baseSkyStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(drift.value, [0, 1], [1, 1.1]) },
      { translateX: interpolate(drift.value, [0, 1], [-22, 22]) },
      { translateY: interpolate(drift.value, [0, 1], [-26, 26]) },
    ],
  }));

  const horizonStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: interpolate(drift.value, [0, 1], [1.04, 1.14]) },
      { translateX: interpolate(drift.value, [0, 1], [22, -22]) },
      { translateY: interpolate(drift.value, [0, 1], [-20, 20]) },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breath.value, [0, 1], [0.5, 0.92]),
    transform: [
      { scale: interpolate(breath.value, [0, 1], [1, 1.14]) },
      { translateX: interpolate(drift.value, [0, 1], [-14, 14]) },
      { translateY: interpolate(drift.value, [0, 1], [-12, 12]) },
    ],
  }));

  return (
    <>
      <View
        style={[styles.hero, { paddingTop: topInset + Spacing.two, backgroundColor: sky.bottom }]}
      >
        {/* Base vertical gradient sky — slow drift for a live-wallpaper feel. */}
        <SkyGradientLayer
          webMotionClass={heroMotionClasses.baseDrift}
          motionStyle={baseSkyStyle}
          gradient={gradientBackground(
            `linear-gradient(165deg, ${sky.top} 0%, ${sky.mid} 42%, ${sky.bottom} 100%)`,
          )}
        />
        {/* Warm/cool wash along the horizon — counter-drifts for depth. */}
        <SkyGradientLayer
          webMotionClass={heroMotionClasses.horizonDrift}
          motionStyle={horizonStyle}
          gradient={gradientBackground(
            `linear-gradient(195deg, ${withAlpha(sky.bottom, 0)} 38%, ${sky.horizon} 100%)`,
          )}
        />
        {/* Breathing celestial glow (sun by day, moon by night). */}
        <SkyGradientLayer
          webMotionClass={heroMotionClasses.glowDrift}
          webMotionClassInner={heroMotionClasses.glowBreath}
          motionStyle={glowStyle}
          gradient={gradientBackground(
            `radial-gradient(circle at ${sky.glowX}% ${sky.glowY}%, ${sky.glow} 0%, ${withAlpha(toHex(sky.glow), 0)} 72%)`,
          )}
        />
        {/* Faint starfield at night. */}
        {sky.stars
          ? STARS.map((star) => (
              <View
                key={`${star.left}-${star.top}`}
                style={[
                  styles.star,
                  {
                    left: star.left,
                    top: topInset + star.top,
                    width: star.size,
                    height: star.size,
                    borderRadius: star.size,
                    opacity: star.opacity,
                  },
                ]}
              />
            ))
          : null}
        {/* Mosque skyline rising from the base. */}
        <MosqueSilhouette color={sky.silhouette} />
        {/* Readability scrim: darkens the top (location) and bottom (prayer row)
          for legible text on any sky, while leaving the mid glow mostly clear. */}
        <View
          style={[
            styles.fill,
            styles.scrimLayer,
            gradientBackground(
              "linear-gradient(180deg, rgba(0,0,0,0.30) 0%, rgba(0,0,0,0.06) 24%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.30) 78%, rgba(0,0,0,0.52) 100%)",
            ),
          ]}
        />
        <HeroWeatherEffects effects={weatherEffects} />

        {/* Top bar: location + actions. */}
        <View style={styles.heroForeground}>
          <View style={styles.topBar}>
            <PressableScale
              onPress={onLocationPress}
              haptic="light"
              scaleTo={0.96}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={
                weatherAccessibilityLabel
                  ? t("hero.locationWeatherA11y", {
                      location,
                      weather: weatherAccessibilityLabel,
                    })
                  : t("hero.changeLocation")
              }
              style={styles.locationRow}
            >
              <SymbolView
                name={{ ios: "location.fill", android: "location_on", web: "location_on" }}
                size={14}
                tintColor={sky.accent}
              />
              <ThemedText
                type="smallBold"
                numberOfLines={1}
                style={[styles.softShadow, styles.locationText, { color: Brand.heroText }]}
              >
                {location}
              </ThemedText>
              {weatherSummary ? (
                <>
                  <ThemedText
                    type="smallBold"
                    style={[styles.softShadow, { color: Brand.heroSubtext }]}
                  >
                    ·
                  </ThemedText>
                  <ThemedText
                    type="smallBold"
                    numberOfLines={1}
                    style={[styles.softShadow, styles.weatherText, { color: Brand.heroText }]}
                  >
                    {weatherSummary}
                  </ThemedText>
                </>
              ) : null}
              <SymbolView name={chevronForward()} size={11} tintColor={Brand.heroText} />
            </PressableScale>
            <View style={styles.actions}>
              <HeroIconButton
                icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
                label={t("common.search")}
                onPress={onSearchPress}
              />
              <HeroIconButton
                icon={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
                label={t("common.notifications")}
                onPress={onNotificationsPress}
                badgeCount={notificationCount}
              />
            </View>
          </View>

          {/* Centre clock block. */}
          <View style={styles.clockBlock}>
            <PressableScale
              onPress={() => setMoonOpen(true)}
              haptic="light"
              scaleTo={0.94}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={t("hero.dateRowA11y", {
                phase: moonLabel,
                dates: secondaryDate ? `${primaryDate}. ${secondaryDate}` : primaryDate,
              })}
              style={styles.dateRow}
            >
              <MoonPhaseIcon date={now} size={22} southernHemisphere={southernHemisphere} />
              <View style={styles.dateLines}>
                <ThemedText
                  style={[styles.dateTextPrimary, styles.softShadow, { color: Brand.heroText }]}
                  numberOfLines={1}
                >
                  {primaryDate}
                </ThemedText>
                {secondaryDate ? (
                  <ThemedText
                    style={[styles.dateTextSecondary, styles.softShadow, { color: Brand.heroText }]}
                    numberOfLines={1}
                  >
                    {secondaryDate}
                  </ThemedText>
                ) : null}
              </View>
              <View style={styles.dateChevron}>
                <SymbolView name={chevronForward()} size={12} tintColor={Brand.heroText} />
              </View>
            </PressableScale>
            <View
              accessible
              accessibilityLiveRegion="polite"
              accessibilityLabel={t("hero.clockLabel", { time: currentTime, countdown })}
              style={styles.clockGroup}
            >
              <ThemedText type="display" style={[styles.clock, { color: Brand.heroText }]}>
                {currentTime}
              </ThemedText>
              <ThemedText style={[styles.countdown, styles.softShadow, { color: Brand.heroText }]}>
                {countdown}
              </ThemedText>
            </View>
            {/* Thin progress through the current prayer window, tinted with the sky accent. */}
            <ProgressBar
              value={windowProgress}
              height={4}
              color={sky.accent}
              trackColor={Brand.onHeroStrongSurface}
              style={styles.windowProgress}
            />
          </View>

          {/* Prayer row. */}
          <View style={styles.prayerRow}>
            {prayers.map((prayer, index) => {
              const active = index === activeIndex;
              // Inactive names/times use a high-alpha cream (not the low-contrast
              // subtext) so they still clear ~4.5:1 on the brightest daytime skies.
              const textColor = active ? Brand.heroText : INACTIVE_PRAYER_TEXT;
              return (
                <View
                  key={prayer.name}
                  accessible
                  accessibilityRole="text"
                  accessibilityLabel={t(active ? "hero.prayerItemActive" : "hero.prayerItem", {
                    name: prayer.name,
                    time: prayer.time,
                  })}
                  style={[
                    styles.prayerItem,
                    active && {
                      backgroundColor: withAlpha(toHex(sky.accent), 0.22),
                      borderColor: withAlpha(toHex(sky.accent), 0.55),
                    },
                  ]}
                >
                  <ThemedText type="caption" style={[styles.softShadow, { color: textColor }]}>
                    {prayer.name}
                  </ThemedText>
                  <SymbolView
                    name={prayer.icon}
                    size={19}
                    tintColor={active ? sky.accent : INACTIVE_PRAYER_TEXT}
                  />
                  <ThemedText
                    type="caption"
                    style={[styles.softShadow, { color: textColor, fontWeight: "700" }]}
                  >
                    {prayer.time}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </View>
      </View>
      <MoonPhaseSheet visible={moonOpen} date={now} onClose={() => setMoonOpen(false)} />
    </>
  );
}

function HeroIconButton({
  icon,
  label,
  onPress,
  badgeCount = 0,
}: {
  icon: SymbolViewProps["name"];
  label: string;
  onPress?: () => void;
  badgeCount?: number;
}) {
  return (
    // Floating chrome over the hero art — a natural home for Liquid Glass on
    // iOS 26+; elsewhere it keeps the translucent on-hero surface.
    // Dark glass over the gradient sky so cream hero glyphs stay legible in
    // light mode (light glass + heroText was nearly invisible).
    <GlassControl radius={Radius.md} colorScheme="dark">
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        haptic="light"
        scaleTo={0.9}
        style={[
          styles.iconButton,
          !hasLiquidGlass && { backgroundColor: Brand.onHeroMutedSurface },
        ]}
      >
        <SymbolView name={icon} size={18} tintColor={Brand.heroText} />
        {badgeCount > 0 ? (
          <View style={styles.badge}>
            <ThemedText type="caption" style={styles.badgeText}>
              {badgeCount > 9 ? "9+" : String(badgeCount)}
            </ThemedText>
          </View>
        ) : null}
      </PressableScale>
    </GlassControl>
  );
}

/** Strips an alpha suffix from an 8-digit hex so `withAlpha` gets a clean 6-digit base. */
function toHex(color: string): string {
  return color.length === 9 && color.startsWith("#") ? color.slice(0, 7) : color;
}

const styles = StyleSheet.create({
  hero: {
    overflow: "hidden",
    borderBottomLeftRadius: Radius.xl + 4,
    borderBottomRightRadius: Radius.xl + 4,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  scrimLayer: {
    zIndex: 1,
  },
  heroForeground: {
    zIndex: 3,
    gap: Spacing.four,
  },
  star: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  locationRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    flexShrink: 1,
    minWidth: 0,
  },
  locationText: {
    flexShrink: 1,
  },
  weatherText: {
    flexShrink: 0,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: StatusPalette.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 9,
    lineHeight: 11,
    color: Brand.heroText,
  },
  clockBlock: {
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  clockGroup: {
    alignItems: "center",
    gap: Spacing.one,
  },
  windowProgress: {
    width: "56%",
    marginTop: Spacing.two,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 3,
    maxWidth: "100%",
    paddingHorizontal: Spacing.two,
  },
  dateLines: {
    flexShrink: 1,
    alignItems: "center",
    gap: 2,
  },
  dateChevron: {
    alignSelf: "stretch",
    justifyContent: "center",
  },
  dateTextPrimary: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  dateTextSecondary: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "500",
    letterSpacing: 0.15,
  },
  clock: {
    fontVariant: ["tabular-nums"],
    // `textShadow` shorthand on web (avoids the deprecated `textShadow*` props);
    // native still uses the longhand props, which remain the supported form.
    ...Platform.select({
      web: { textShadow: "0px 1px 12px rgba(0, 0, 0, 0.42)" },
      default: {
        textShadowColor: "rgba(0, 0, 0, 0.42)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 12,
      },
    }),
  },
  countdown: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "600",
  },
  /** Soft dark shadow that lifts light text off any sky. */
  softShadow: {
    ...Platform.select({
      web: { textShadow: "0px 1px 5px rgba(0, 0, 0, 0.45)" },
      default: {
        textShadowColor: "rgba(0, 0, 0, 0.45)",
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 5,
      },
    }),
  },
  prayerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.one,
  },
  prayerItem: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.one + 1,
    paddingVertical: Spacing.two,
    paddingHorizontal: 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "transparent",
  },
});
