import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Durations } from "@/constants/motion";
import { Brand, Radius, Spacing, StatusPalette, withAlpha } from "@/constants/theme";

export type PrayerTime = {
  name: string;
  time: string;
  icon: SymbolViewProps["name"];
};

type PrayerTimesHeroProps = {
  location: string;
  hijriDate: string;
  currentTime: string;
  nextPrayer: string;
  minutesToNext: number;
  prayers: PrayerTime[];
  /** Index of the currently active / upcoming prayer to highlight. */
  activeIndex: number;
  /** Safe-area top inset so the hero can sit under the status bar. */
  topInset: number;
  notificationCount?: number;
  onSearchPress?: () => void;
  onNotificationsPress?: () => void;
};

/**
 * The full-bleed home header and emotional centrepiece. A real layered gradient
 * (native, no SVG) plus a slow breathing glow give it depth and calm life. The
 * deep-green "prayer" palette stays constant across light/dark for a premium,
 * serene feel; brand-gold marks the live prayer and countdown.
 */
export function PrayerTimesHero({
  location,
  hijriDate,
  currentTime,
  nextPrayer,
  minutesToNext,
  prayers,
  activeIndex,
  topInset,
  notificationCount = 0,
  onSearchPress,
  onNotificationsPress,
}: PrayerTimesHeroProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const breath = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) return;
    breath.value = withRepeat(
      withTiming(1, { duration: Durations.ambient, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [reducedMotion, breath]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(breath.value, [0, 1], [0.5, 0.9]),
    transform: [{ scale: interpolate(breath.value, [0, 1], [1, 1.14]) }],
  }));

  return (
    <View style={[styles.hero, { paddingTop: topInset + Spacing.two }]}>
      {/* Base vertical gradient. */}
      <View style={styles.gradientBase} />
      {/* Breathing accent glow, top-right. */}
      <Animated.View style={[styles.glow, styles.glowTop, glowStyle]} />
      {/* Static depth glow, bottom-left. */}
      <View style={[styles.glow, styles.glowBottom]} />

      {/* Top bar: location + actions. */}
      <View style={styles.topBar}>
        <View style={styles.locationRow}>
          <SymbolView
            name={{ ios: "location.fill", android: "location_on", web: "location_on" }}
            size={14}
            tintColor={Brand.heroAccent}
          />
          <ThemedText type="smallBold" style={{ color: Brand.heroText }}>
            {location}
          </ThemedText>
        </View>
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
        <ThemedText type="caption" style={{ color: Brand.heroSubtext }}>
          {hijriDate}
        </ThemedText>
        <ThemedText type="display" style={[styles.clock, { color: Brand.heroText }]}>
          {currentTime}
        </ThemedText>
        <ThemedText type="small" style={{ color: Brand.heroSubtext }}>
          {t("hero.nextPrayerAway", { prayer: nextPrayer, min: minutesToNext })}
        </ThemedText>
      </View>

      {/* Prayer row. */}
      <View style={styles.prayerRow}>
        {prayers.map((prayer, index) => {
          const active = index === activeIndex;
          return (
            <View
              key={prayer.name}
              style={[
                styles.prayerItem,
                active && {
                  backgroundColor: Brand.onHeroStrongSurface,
                  borderColor: withAlpha(Brand.heroAccent, 0.5),
                },
              ]}
            >
              <ThemedText
                type="caption"
                style={{ color: active ? Brand.heroText : Brand.heroSubtext }}
              >
                {prayer.name}
              </ThemedText>
              <SymbolView
                name={prayer.icon}
                size={19}
                tintColor={active ? Brand.heroAccent : Brand.heroSubtext}
              />
              <ThemedText
                type="caption"
                style={{ color: active ? Brand.heroText : Brand.heroSubtext, fontWeight: "700" }}
              >
                {prayer.time}
              </ThemedText>
            </View>
          );
        })}
      </View>
    </View>
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
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      haptic="light"
      scaleTo={0.9}
      style={[styles.iconButton, { backgroundColor: Brand.onHeroMutedSurface }]}
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
  );
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
    backgroundColor: Brand.heroBottom,
  },
  gradientBase: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    experimental_backgroundImage: `linear-gradient(160deg, ${Brand.heroTop} 0%, ${Brand.heroBottom} 100%)`,
  },
  glow: {
    position: "absolute",
    borderRadius: 220,
  },
  glowTop: {
    width: 260,
    height: 260,
    top: -110,
    right: -70,
    experimental_backgroundImage: `radial-gradient(circle, ${Brand.heroGlow} 0%, ${withAlpha(Brand.heroGlow, 0)} 70%)`,
  },
  glowBottom: {
    width: 320,
    height: 320,
    bottom: -190,
    left: -90,
    opacity: 0.55,
    experimental_backgroundImage: `radial-gradient(circle, ${Brand.heroTop} 0%, ${withAlpha(Brand.heroTop, 0)} 72%)`,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    flexShrink: 1,
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
  clock: {
    fontVariant: ["tabular-nums"],
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
