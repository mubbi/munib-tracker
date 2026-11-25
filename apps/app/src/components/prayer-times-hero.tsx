import type { WeatherEffectKind } from "@munib-tracker/shared/types";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  I18nManager,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
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
import { MosqueSilhouette } from "@/components/mosque-silhouette";
import { SkyGradientLayer } from "@/components/sky-gradient-layer";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { HeroWeatherEffects } from "@/components/weather/hero-weather-effects";
import { Durations } from "@/constants/motion";
import {
  BorderWidth,
  Brand,
  HeroSky,
  IconSize,
  Radius,
  Spacing,
  withAlpha,
} from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import type { DualCalendarDates } from "@/lib/calendar-format";
import { gradientBackground } from "@/lib/gradient";
import { tTv } from "@/lib/i18n/t-tv";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import type { CelestialPosition, SkyPalette } from "@/lib/sky";

import { heroMotionClasses } from "./prayer-times-hero-motion";

const MoonPhaseSheet = lazy(() =>
  import("@/components/moon-phase-sheet").then((mod) => ({ default: mod.MoonPhaseSheet })),
);

export type PrayerTime = {
  name: string;
  time: string;
  icon: SymbolViewProps["name"];
};

type PrayerTimesHeroProps = {
  location: string;
  displayDates: DualCalendarDates;
  currentTime: string;
  /** Pre-localized countdown line, e.g. "Maghrib is 27 min away". */
  countdown: string;
  /** Pre-localized home-masjid iqamah line (NF-3.11), e.g. "Dhuhr iqamah in 25 min"; null hides it. */
  iqamahCountdown?: string | null;
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
  /** Where the sun / moon sits in the sky right now (% of the hero). */
  celestial: CelestialPosition;
  /** Position (0..1) of "now" along the prayer row's day timeline. */
  dayProgress: number;
  notificationCount?: number;
  /** Localized weather line shown after the location label, e.g. "22° · Sunny". */
  weatherSummary?: string | null;
  weatherAccessibilityLabel?: string | null;
  weatherEffects?: WeatherEffectKind[];
  /** Unmount particle trees while home is covered by a stack screen. */
  weatherEffectsEnabled?: boolean;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
  /** Re-request / refresh the stored location (fires on tapping the location row). */
  onLocationPress?: () => void;
  /**
   * P5-04: index of the prayer cell that marks today's running Salah (the
   * active fard, or Fajr during the sunrise window). With `onMarkPress` it
   * becomes a button that opens the status sheet in place.
   */
  markIndex?: number;
  /** Localized current status of the markable Salah (e.g. "Pending"). */
  markStatusLabel?: string;
  /** Whether the markable Salah is already logged as prayed. */
  markCompleted?: boolean;
  onMarkPress?: () => void;
  /**
   * `banner` (default): full-bleed sky with rounded bottom corners that the
   * below-fold cards tuck into (phones / TV). `card`: fully rounded tile for the
   * wide-screen home dashboard, where the hero sits beside the schedule aside.
   */
  variant?: "banner" | "card";
};

/**
 * Inactive prayer names/times: a high-alpha cream rather than the muted
 * `heroSubtext` teal, so they keep ~4.5:1 contrast even on the brightest
 * (noon) sky while still reading as secondary next to the active marker.
 */
const INACTIVE_PRAYER_TEXT = withAlpha(Brand.heroText, 0.82);

/** Text scale at which the prayer strip wraps to rows instead of shrinking names (B-19). */
const LARGE_TEXT_SCALE = 1.3;
/**
 * Narrowest strip slot (dp at 1× text) that keeps names and times on one line. Below
 * it the strip wraps like large text does. The dashboard card (iPad / desktop home
 * column) needs more: its six ~57dp slots broke "Maghrib" and "17:37" mid-word.
 */
const MIN_PRAYER_SLOT_DP = { banner: 56, card: 64 } as const;

/** Fixed positions for the faint night starfield (left %, top px, size, opacity). */
const STARS = [
  { left: "6%", top: 96, size: 1.5, opacity: 0.5 },
  { left: "14%", top: 40, size: 2, opacity: 0.7 },
  { left: "21%", top: 132, size: 1.5, opacity: 0.4 },
  { left: "27%", top: 74, size: 1.5, opacity: 0.5 },
  { left: "35%", top: 24, size: 1.5, opacity: 0.55 },
  { left: "42%", top: 52, size: 2, opacity: 0.8 },
  { left: "51%", top: 118, size: 1.5, opacity: 0.35 },
  { left: "58%", top: 88, size: 1.5, opacity: 0.55 },
  { left: "64%", top: 18, size: 1.5, opacity: 0.6 },
  { left: "69%", top: 46, size: 2.5, opacity: 0.85 },
  { left: "76%", top: 140, size: 1.5, opacity: 0.4 },
  { left: "83%", top: 70, size: 1.5, opacity: 0.6 },
  { left: "90%", top: 100, size: 2, opacity: 0.7 },
  { left: "95%", top: 34, size: 1.5, opacity: 0.5 },
] as const;

/** Mirrors `GRADIENT_OVERSCAN` in `SkyGradientLayer`: sky layers are drawn 1.4× the hero. */
const SKY_OVERSCAN = 1.4;

/** Maps a hero-relative % to the matching % inside an overscanned sky layer. */
function toSkyLayerPercent(heroPercent: number): number {
  return (heroPercent + ((SKY_OVERSCAN - 1) / 2) * 100) / SKY_OVERSCAN;
}

/**
 * How strongly the current weather greys out the sky (0 = open sky). Heavy
 * cloud hides the sun / moon disc and the stars, and mutes the palette so a
 * rainy noon no longer looks identical to a clear one.
 */
function overcastStrength(effects: WeatherEffectKind[]): number {
  if (effects.includes("thunderstorm")) return 0.46;
  if (effects.includes("rain")) return 0.38;
  if (effects.includes("snow")) return 0.3;
  if (effects.includes("cloudy") || effects.includes("fog")) return 0.28;
  return 0;
}

/** TV: half-width (% of hero) of the band the centred date chip covers, plus the disc radius. */
const TV_DATE_CHIP_HALF_SPAN_PCT = 26;
/** Widest the prayer row + timeline grow on tablets / desktop before centring. */
const DAY_SECTION_MAX_WIDTH = 720;

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
  displayDates,
  currentTime,
  countdown,
  iqamahCountdown = null,
  prayers,
  activeIndex,
  topInset,
  sky,
  now,
  moonLabel,
  southernHemisphere = false,
  celestial,
  dayProgress,
  notificationCount = 0,
  weatherSummary = null,
  weatherAccessibilityLabel = null,
  weatherEffects = [],
  weatherEffectsEnabled = true,
  onSearchPress,
  onNotificationsPress,
  onLocationPress,
  markIndex = -1,
  markStatusLabel,
  markCompleted = false,
  onMarkPress,
  variant = "banner",
}: PrayerTimesHeroProps) {
  const { t } = useTranslation();
  const { fontScale } = useWindowDimensions();
  // Large Dynamic Type: wrap the strip to rows (names keep their size) instead
  // of shrinking text toward 9pt.
  const largeText = fontScale >= LARGE_TEXT_SCALE;
  const [prayerRowWidth, setPrayerRowWidth] = useState(0);
  // Too narrow for one row of full-size names / times (e.g. the iPad home column).
  const narrowStrip =
    prayerRowWidth > 0 &&
    prayers.length > 0 &&
    prayerRowWidth / prayers.length < MIN_PRAYER_SLOT_DP[variant] * Math.max(1, fontScale);
  const wrapPrayers = largeText || narrowStrip;
  const { primary: primaryDate, secondary: secondaryDate } = displayDates;
  const reducedMotion = useReducedMotion();
  const breath = useSharedValue(0);
  const drift = useSharedValue(0);
  const [moonOpen, setMoonOpen] = useState(false);
  const chevronForward = useChevronForward();
  const tv = isTV();

  const overcast = overcastStrength(weatherEffects);
  // The disc needs open sky above the date chip: on the short phone banner its
  // arc runs behind the chip / clock (and the moon would repeat the chip's own
  // moon glyph), so phones show the moving glow alone.
  const roomyLayout = variant === "card" || tv;
  // TV: the centred date chip spans roughly the middle half of the hero, so a
  // disc in that band sits half-hidden behind it (and the moon doubles the
  // chip's own moon glyph). Show it only while it rides the open sky either side.
  const clearOfTvDateChip = !tv || Math.abs(celestial.x - 50) > TV_DATE_CHIP_HALF_SPAN_PCT;
  const bodyVisible = roomyLayout && clearOfTvDateChip && celestial.body != null && overcast === 0;
  // "Clear" draws sun rays — only meaningful while the sun is actually up.
  const skyEffects = useMemo(
    () => (celestial.body === "sun" ? weatherEffects : weatherEffects.filter((e) => e !== "clear")),
    [weatherEffects, celestial.body],
  );
  // The sky is a fixed scene (sun rises on the left in every locale). Native
  // swaps `left`/`right` under RTL, so undo that for the celestial disc; the
  // gradient glow underneath is never mirrored.
  const mirrorsLeft =
    Platform.OS !== "web" && I18nManager.isRTL && I18nManager.doLeftAndRightSwapInRTL;
  const bodySize = tv ? tvDp(40) : celestial.body === "moon" ? 26 : 30;
  const nextIndex = prayers.length > 0 ? (activeIndex + 1) % prayers.length : -1;

  useEffect(() => {
    // TV: static sky — three infinite full-bleed transform loops are too costly
    // for low-end Fire TV / Android TV sticks and add little from the sofa.
    if (Platform.OS === "web" || reducedMotion || tv) return;
    const easing = Easing.inOut(Easing.sin);
    breath.value = withRepeat(withTiming(1, { duration: Durations.ambient, easing }), -1, true);
    drift.value = withRepeat(withTiming(1, { duration: Durations.wallpaper, easing }), -1, true);
  }, [reducedMotion, tv, breath, drift]);

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
        style={[
          styles.hero,
          tv ? styles.heroTv : null,
          variant === "card" ? styles.heroCard : null,
          {
            paddingTop: tv ? TvLayout.contentPaddingY : topInset + Spacing.two,
            backgroundColor: sky.bottom,
          },
          // Web: the theme focus ring (accent) disappears on the sky — use the
          // brand gold inside the hero region.
          Platform.OS === "web" ? HERO_FOCUS_RING : null,
        ]}
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
            // A tight core with a long soft falloff: lights the sky around the
            // sun / moon without washing the whole banner into one flat tint.
            `radial-gradient(circle at ${toSkyLayerPercent(celestial.x).toFixed(1)}% ${toSkyLayerPercent(celestial.y).toFixed(1)}%, ${withAlpha(toHex(sky.glow), 0.9)} 0%, ${withAlpha(toHex(sky.glow), 0.38)} 13%, ${withAlpha(toHex(sky.glow), 0.12)} 30%, ${withAlpha(toHex(sky.glow), 0)} 52%)`,
          )}
        />
        {/* Faint starfield at night. */}
        {sky.stars && overcast === 0
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
        {/* The sun / moon itself, riding its arc through the day or night. */}
        {bodyVisible ? (
          <View
            style={[
              styles.celestialBody,
              {
                left: `${mirrorsLeft ? 100 - celestial.x : celestial.x}%`,
                top: `${celestial.y}%`,
                width: bodySize,
                height: bodySize,
                borderRadius: bodySize / 2,
                marginLeft: -bodySize / 2,
                marginTop: -bodySize / 2,
                boxShadow: `0px 0px ${bodySize}px ${bodySize / 4}px ${withAlpha(toHex(sky.glow), 0.55)}`,
              },
              celestial.body === "sun" ? { backgroundColor: HeroSky.sunCore } : null,
            ]}
          >
            {celestial.body === "moon" ? (
              <MoonPhaseIcon date={now} size={bodySize} southernHemisphere={southernHemisphere} />
            ) : null}
          </View>
        ) : null}
        {/* Heavy cloud greys the sky so the weather reads even between particles. */}
        {overcast > 0 ? (
          <View
            style={[
              styles.fill,
              {
                backgroundColor: withAlpha(HeroSky.overcastTint, overcast),
                pointerEvents: "none",
              },
            ]}
          />
        ) : null}
        {/* Mosque skyline rising from the base. */}
        <MosqueSilhouette color={sky.silhouette} opacity={0.38} scale={1.2} />
        {/* Readability scrim: darkens the top (location) and bottom (prayer row)
          for legible text on any sky, while leaving the mid glow mostly clear. */}
        <View style={[styles.fill, styles.scrimLayer, gradientBackground(HeroSky.scrim)]} />
        <HeroWeatherEffects effects={skyEffects} enabled={weatherEffectsEnabled} />

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
              style={[styles.locationRow, tv ? styles.locationRowTv : null]}
            >
              <SymbolView
                name={{ ios: "location.fill", android: "location_on", web: "location_on" }}
                size={tv ? 20 : 14}
                tintColor={sky.accent}
              />
              <ThemedText
                type="smallBold"
                numberOfLines={1}
                style={[
                  styles.softShadow,
                  styles.locationText,
                  tv ? styles.topBarTextTv : null,
                  { color: Brand.heroText },
                ]}
              >
                {location}
              </ThemedText>
              {weatherSummary ? (
                <>
                  <ThemedText
                    type="smallBold"
                    style={[
                      styles.softShadow,
                      tv ? styles.topBarTextTv : null,
                      { color: Brand.heroSubtext },
                    ]}
                  >
                    ·
                  </ThemedText>
                  <ThemedText
                    type="smallBold"
                    numberOfLines={1}
                    style={[
                      styles.softShadow,
                      styles.weatherText,
                      tv ? styles.topBarTextTv : null,
                      { color: Brand.heroText },
                    ]}
                  >
                    {weatherSummary}
                  </ThemedText>
                </>
              ) : null}
              <SymbolView name={chevronForward} size={tv ? 14 : 11} tintColor={Brand.heroText} />
            </PressableScale>
            <View style={styles.actions}>
              <IconButton
                name={{ ios: "magnifyingglass", android: "search", web: "search" }}
                accessibilityLabel={t("common.search")}
                onPress={onSearchPress}
                haptic="light"
                size={tv ? IconSize.xl : IconSize.lg - 2}
                tintColor={Brand.heroText}
                background={Brand.onHeroMutedSurface}
                glass
                wellRadius={Radius.md}
              />
              <IconButton
                name={{ ios: "bell.fill", android: "notifications", web: "notifications" }}
                accessibilityLabel={t("common.notifications")}
                onPress={onNotificationsPress}
                haptic="light"
                size={tv ? IconSize.xl : IconSize.lg - 2}
                tintColor={Brand.heroText}
                background={Brand.onHeroMutedSurface}
                glass
                wellRadius={Radius.md}
                badge={notificationCount}
                badgeBorderColor={sky.top}
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
              accessibilityLabel={tTv(t, "hero.dateRowA11y", "hero.dateRowA11yTv", {
                phase: moonLabel,
                dates: secondaryDate ? `${primaryDate}. ${secondaryDate}` : primaryDate,
              })}
              style={[styles.dateRow, tv ? styles.dateRowTv : null]}
            >
              <MoonPhaseIcon
                date={now}
                size={tv ? tvDp(30) : 22}
                southernHemisphere={southernHemisphere}
              />
              <View style={styles.dateLines}>
                <ThemedText
                  style={[
                    styles.dateTextPrimary,
                    tv ? styles.dateTextPrimaryTv : null,
                    styles.softShadow,
                    { color: Brand.heroText },
                  ]}
                  numberOfLines={1}
                >
                  {primaryDate}
                </ThemedText>
                {secondaryDate ? (
                  <ThemedText
                    style={[
                      styles.dateTextSecondary,
                      tv ? styles.dateTextSecondaryTv : null,
                      styles.softShadow,
                      { color: Brand.heroText },
                    ]}
                    numberOfLines={1}
                  >
                    {secondaryDate}
                  </ThemedText>
                ) : null}
              </View>
              <View style={styles.dateChevron}>
                <SymbolView name={chevronForward} size={tv ? 16 : 12} tintColor={Brand.heroText} />
              </View>
            </PressableScale>
            <View
              accessible
              accessibilityLiveRegion="polite"
              accessibilityLabel={
                iqamahCountdown
                  ? `${t("hero.clockLabel", { time: currentTime, countdown })}. ${iqamahCountdown}`
                  : t("hero.clockLabel", { time: currentTime, countdown })
              }
              style={styles.clockGroup}
            >
              <ThemedText type="display" style={[styles.clock, { color: Brand.heroText }]}>
                {currentTime}
              </ThemedText>
              <ThemedText
                style={[
                  styles.countdown,
                  tv ? styles.countdownTv : null,
                  styles.softShadow,
                  { color: Brand.heroText },
                ]}
              >
                {countdown}
              </ThemedText>
              {iqamahCountdown ? (
                <ThemedText
                  style={[
                    styles.iqamahLine,
                    tv ? styles.iqamahLineTv : null,
                    styles.softShadow,
                    { color: Brand.heroText },
                  ]}
                >
                  {iqamahCountdown}
                </ThemedText>
              ) : null}
            </View>
          </View>

          {/* Day timeline + prayer row: one unit, so "where are we in the day"
            is read straight off the times it refers to. */}
          <View style={[styles.daySection, tv ? null : styles.daySectionCapped]}>
            <DayTimeline
              count={prayers.length}
              position={dayProgress}
              accent={sky.accent}
              large={tv}
            />
            <View
              style={[styles.prayerRow, wrapPrayers ? styles.prayerRowWrap : null]}
              onLayout={(event) => setPrayerRowWidth(event.nativeEvent.layout.width)}
            >
              {prayers.map((prayer, index) => {
                const active = index === activeIndex;
                const markable = index === markIndex && onMarkPress != null;
                // Inactive names/times use a high-alpha cream (not the low-contrast
                // subtext) so they still clear ~4.5:1 on the brightest daytime skies.
                const textColor = active ? Brand.heroText : INACTIVE_PRAYER_TEXT;
                const cellStyle = [
                  styles.prayerItem,
                  wrapPrayers ? styles.prayerItemWrap : null,
                  active && {
                    backgroundColor: HeroSky.activePrayerSurface,
                    borderColor: withAlpha(toHex(sky.accent), 0.7),
                  },
                ];
                const content = (
                  <>
                    <ThemedText
                      type="caption"
                      style={[
                        styles.softShadow,
                        styles.prayerLabel,
                        tv ? styles.prayerLabelTv : null,
                        { color: textColor },
                      ]}
                    >
                      {prayer.name}
                    </ThemedText>
                    <SymbolView
                      name={prayer.icon}
                      size={tv ? 26 : 19}
                      tintColor={active ? sky.accent : INACTIVE_PRAYER_TEXT}
                    />
                    <ThemedText
                      type="caption"
                      weight="bold"
                      style={[
                        styles.softShadow,
                        styles.prayerTime,
                        tv ? styles.prayerTimeTv : null,
                        // The upcoming prayer's time picks up the accent, tying it to
                        // the countdown line above without competing with the live card.
                        { color: index === nextIndex ? sky.accent : textColor },
                      ]}
                    >
                      {prayer.time}
                    </ThemedText>
                    {markable ? (
                      // Status glyph: says the cell is the place to log this Salah.
                      <SymbolView
                        name={
                          markCompleted
                            ? {
                                ios: "checkmark.circle.fill",
                                android: "check_circle",
                                web: "check_circle",
                              }
                            : {
                                ios: "circle",
                                android: "radio_button_unchecked",
                                web: "radio_button_unchecked",
                              }
                        }
                        size={tv ? IconSize.lg : IconSize.md}
                        tintColor={markCompleted ? sky.accent : Brand.heroText}
                      />
                    ) : null}
                  </>
                );
                if (markable) {
                  return (
                    <PressableScale
                      key={prayer.name}
                      onPress={onMarkPress}
                      haptic="light"
                      scaleTo={0.96}
                      accessibilityRole="button"
                      accessibilityLabel={t("hero.markA11y", {
                        name: prayer.name,
                        time: prayer.time,
                        status: markStatusLabel ?? "",
                      })}
                      accessibilityHint={t("hero.markHint")}
                      testID="hero-mark-cell"
                      style={[cellStyle, !active && { borderColor: Brand.onHeroStrongSurface }]}
                    >
                      {content}
                    </PressableScale>
                  );
                }
                return (
                  <View
                    key={prayer.name}
                    accessible
                    accessibilityRole="text"
                    accessibilityLabel={t(active ? "hero.prayerItemActive" : "hero.prayerItem", {
                      name: prayer.name,
                      time: prayer.time,
                    })}
                    style={cellStyle}
                  >
                    {content}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
      {moonOpen ? (
        <Suspense fallback={null}>
          <MoonPhaseSheet visible={moonOpen} date={now} onClose={() => setMoonOpen(false)} />
        </Suspense>
      ) : null}
    </>
  );
}

/**
 * A thin track across the prayer row. One tick sits above each prayer column,
 * the accent fill shows how much of the day has gone, and the dot is "now" —
 * so it sits visibly between the current prayer and the next one. Built from
 * flex children only, so it follows the row's direction in RTL for free.
 */
function DayTimeline({
  count,
  position,
  accent,
  large,
}: {
  count: number;
  position: number;
  accent: string;
  large: boolean;
}) {
  const p = Math.min(1, Math.max(0, position));
  const line = large ? tvDp(4) : 2;
  const tick = large ? tvDp(8) : 5;
  const dot = large ? tvDp(16) : 11;
  const columns = Array.from({ length: count }, (_, index) => index);

  return (
    <View
      aria-hidden
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.timeline, { height: dot + 2, pointerEvents: "none" }]}
    >
      <View style={[styles.timelineLayer, styles.timelineRow]}>
        <View style={{ flex: p, height: line, borderRadius: line, backgroundColor: accent }} />
        <View
          style={{
            flex: 1 - p,
            height: line,
            borderRadius: line,
            backgroundColor: HeroSky.timelineTrack,
          }}
        />
      </View>
      <View style={[styles.timelineLayer, styles.prayerRow]}>
        {columns.map((index) => (
          <View key={index} style={styles.timelineColumn}>
            <View
              style={{
                width: tick,
                height: tick,
                borderRadius: tick / 2,
                backgroundColor: (index + 0.5) / count <= p ? accent : HeroSky.timelineTick,
              }}
            />
          </View>
        ))}
      </View>
      <View style={[styles.timelineLayer, styles.timelineRow]}>
        <View style={{ flex: p }} />
        <View
          style={{
            width: dot,
            height: dot,
            borderRadius: dot / 2,
            marginHorizontal: -dot / 2,
            backgroundColor: accent,
            borderWidth: BorderWidth.thick,
            borderColor: Brand.heroText,
            boxShadow: `0px 0px ${dot}px ${withAlpha(toHex(accent), 0.75)}`,
          }}
        />
        <View style={{ flex: 1 - p }} />
      </View>
    </View>
  );
}

/** Strips an alpha suffix from an 8-digit hex so `withAlpha` gets a clean 6-digit base. */
function toHex(color: string): string {
  return color.length === 9 && color.startsWith("#") ? color.slice(0, 7) : color;
}

/** Web-only CSS custom property: the hero's focus ring uses the brand gold. */
const HERO_FOCUS_RING = { "--munib-focus": Brand.heroAccent } as unknown as ViewStyle;

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
  /** Wide-screen dashboard tile: all corners rounded, no tuck-under padding. */
  heroCard: {
    borderRadius: Radius.xl + 4,
    paddingBottom: Spacing.four,
  },
  /** TV: overscan-safe sides (ScreenLayout padding does not wrap the home hero). */
  heroTv: {
    paddingHorizontal: TvLayout.contentPaddingX,
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
    backgroundColor: HeroSky.star,
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
    gap: Spacing.oneHalf,
    flexShrink: 1,
    minWidth: 0,
  },
  /** TV: hug content so the focus ring frames the label, not the whole bar. */
  locationRowTv: {
    flex: 0,
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.three,
    gap: Spacing.two,
    borderRadius: Radius.md,
  },
  locationText: {
    flexShrink: 1,
  },
  topBarTextTv: {
    fontSize: TvLayout.bodyFontSize,
    lineHeight: TvLayout.bodyFontSize + 6,
  },
  weatherText: {
    flexShrink: 0,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
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
  celestialBody: {
    position: "absolute",
    overflow: "visible",
  },
  daySection: {
    width: "100%",
    gap: Spacing.two,
  },
  daySectionCapped: {
    maxWidth: DAY_SECTION_MAX_WIDTH,
    alignSelf: "center",
  },
  timeline: {
    justifyContent: "center",
  },
  timelineLayer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  timelineRow: {
    flexDirection: "row",
  },
  timelineColumn: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Spacing.half,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    maxWidth: "100%",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.oneHalf,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
    borderColor: Brand.onHeroStrongSurface,
    backgroundColor: HeroSky.dateChipSurface,
  },
  dateRowTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.three,
    gap: Spacing.twoHalf,
    borderRadius: Radius.md,
  },
  dateLines: {
    flexShrink: 1,
    alignItems: "center",
    gap: Spacing.half,
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
  dateTextPrimaryTv: {
    fontSize: 22,
    lineHeight: 28,
  },
  dateTextSecondaryTv: {
    fontSize: 18,
    lineHeight: 24,
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
      web: { textShadow: `0px 1px 12px ${HeroSky.clockShadow}` },
      default: {
        textShadowColor: HeroSky.clockShadow,
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
  countdownTv: {
    fontSize: 24,
    lineHeight: 30,
  },
  iqamahLine: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    opacity: 0.92,
  },
  iqamahLineTv: {
    fontSize: 20,
    lineHeight: 26,
  },
  /** Soft dark shadow that lifts light text off any sky. */
  softShadow: {
    ...Platform.select({
      web: { textShadow: `0px 1px 5px ${HeroSky.textShadow}` },
      default: {
        textShadowColor: HeroSky.textShadow,
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
  /** Large text: three cells per row so names keep their size (B-19). */
  prayerRowWrap: {
    flexWrap: "wrap",
    rowGap: Spacing.two,
  },
  prayerItemWrap: {
    flexGrow: 1,
    // `flex: 1` on the cell also sets flexShrink 1, which squeezed all six cells
    // onto one row (names and times broke mid-word) instead of wrapping three per row.
    flexShrink: 0,
    flexBasis: "30%",
  },
  prayerItem: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.oneHalf,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.half,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: BorderWidth.thin,
    borderColor: "transparent",
    // Long names / times (e.g. "12:39 PM") wrap inside the cell instead of
    // shrinking (no `adjustsFontSizeToFit` on UI text).
    minWidth: 0,
  },
  prayerLabel: {
    width: "100%",
    textAlign: "center",
  },
  prayerTime: {
    width: "100%",
    textAlign: "center",
    fontVariant: ["tabular-nums"],
  },
  /** TV: prayer names / times readable from the sofa (~3m). */
  prayerLabelTv: {
    fontSize: 18,
    lineHeight: 24,
  },
  prayerTimeTv: {
    fontSize: 22,
    lineHeight: 28,
  },
});
