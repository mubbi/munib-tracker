import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { SeasonalArt } from "@/components/seasonal/seasonal-art";
import { ThemedText } from "@/components/themed-text";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { gradientBackground } from "@/lib/gradient";
import { chevronForward } from "@/lib/rtl";
import {
  currentSeasonalTheme,
  type SeasonalThemeId,
  seasonalBannerHref,
} from "@/lib/seasonal-themes";
import { useLocation } from "@/stores/location-store";

const SEASON_ICONS: Record<SeasonalThemeId, SymbolViewProps["name"]> = {
  newYear: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
  ashura: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
  ramadan: { ios: "moon.stars.fill", android: "nights_stay", web: "nights_stay" },
  lastTen: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
  laylatQadr: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  eidFitr: { ios: "moon.stars.fill", android: "celebration", web: "celebration" },
  hajj: { ios: "building.columns.fill", android: "account_balance", web: "account_balance" },
  arafah: { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
  eidAdha: { ios: "gift.fill", android: "redeem", web: "redeem" },
};

/**
 * Seasonal home banner — shown automatically from the Hijri calendar. Uses the
 * stored location timezone; does not alter accent colours.
 */
export function SeasonalThemeBanner() {
  const router = useRouter();
  const { t } = useTranslation();
  const location = useLocation();
  const season = currentSeasonalTheme(new Date(), location.timeZone);

  if (!season) return null;

  const { visual } = season;

  return (
    <PressableScale
      onPress={() => router.push(seasonalBannerHref(season))}
      haptic="light"
      scaleTo={0.98}
      accessibilityRole="button"
      accessibilityLabel={t(`seasonalTheme.${season.id}BannerTitle`)}
      style={[
        styles.banner,
        gradientBackground(
          `linear-gradient(135deg, ${visual.gradientTop} 0%, ${visual.gradientMid} 52%, ${visual.gradientBottom} 100%)`,
        ),
      ]}
    >
      <SeasonalArt id={season.id} visual={visual} />

      <View style={styles.content}>
        <View style={styles.copy}>
          <View style={styles.eyebrowRow}>
            <View style={[styles.iconWell, { backgroundColor: withAlpha(visual.accent, 0.2) }]}>
              <SymbolView name={SEASON_ICONS[season.id]} size={14} tintColor={visual.accent} />
            </View>
            <Pill
              label={t(`seasonalTheme.${season.id}Eyebrow`)}
              compact
              color={visual.accent}
              background={withAlpha(visual.accent, 0.16)}
            />
          </View>
          <ThemedText type="subtitle" style={styles.title}>
            {t(`seasonalTheme.${season.id}BannerTitle`)}
          </ThemedText>
          <ThemedText type="caption" style={styles.subtitle} numberOfLines={3}>
            {t(`seasonalTheme.${season.id}BannerDesc`)}
          </ThemedText>
          <ThemedText type="caption" style={styles.disclaimer}>
            {t("seasonalTheme.dateDisclaimer")}
          </ThemedText>
        </View>
        <SymbolView name={chevronForward} size={16} tintColor={withAlpha("#FFFFFF", 0.7)} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    overflow: "hidden",
    minHeight: 124,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha("#FFFFFF", 0.12),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.four,
    paddingEnd: Spacing.three,
    gap: Spacing.two,
    maxWidth: "64%",
  },
  copy: {
    flex: 1,
    gap: Spacing.one,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    marginBottom: 2,
  },
  iconWell: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#F5F0E6",
  },
  subtitle: {
    color: withAlpha("#F5F0E6", 0.78),
    lineHeight: 18,
  },
  disclaimer: {
    color: withAlpha("#F5F0E6", 0.45),
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
  },
});
