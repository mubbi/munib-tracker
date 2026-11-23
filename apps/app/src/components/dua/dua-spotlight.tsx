import type { DuaItem } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import type { CategoryHue } from "@/components/ui/use-category-hue";
import { Radius, Shadows, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { formatDuaHeading } from "@/lib/dua-browse";
import { gradientBackground } from "@/lib/gradient";
import type { AppIcon as AppIconName } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";

type DuaOfTheDayCardProps = {
  item: DuaItem;
  translation: string;
  onPress: () => void;
  preferredFocus?: boolean;
};

/** Brand-green hero with today's rotating dua (Arabic + meaning). */
export function DuaOfTheDayCard({
  item,
  translation,
  onPress,
  preferredFocus,
}: DuaOfTheDayCardProps) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const hero = tokens.hero;
  const chevron = useChevronForward();
  const tv = isTV();
  const heading = formatDuaHeading(item.title);

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`${t("dua.ofTheDay")}: ${heading}. ${translation}`}
      onPress={onPress}
      {...(tv && preferredFocus ? { hasTVPreferredFocus: true } : {})}
      style={[
        styles.hero,
        tv && styles.heroTv,
        Shadows.md,
        { backgroundColor: hero.heroBottom, borderColor: hero.heroBorder },
        gradientBackground(`linear-gradient(150deg, ${hero.heroTop} 0%, ${hero.heroBottom} 100%)`),
      ]}
    >
      <View style={styles.heroHeader}>
        <View style={[styles.heroBadge, { backgroundColor: hero.onHeroStrongSurface }]}>
          <AppIcon
            icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
            size={13}
            tintColor={hero.heroAccent}
          />
          <ThemedText type="caption" style={[styles.heroEyebrow, { color: hero.heroAccent }]}>
            {t("dua.ofTheDay")}
          </ThemedText>
        </View>
        <SymbolView name={chevron} size={14} tintColor={hero.heroSubtext} />
      </View>
      <ThemedText
        type="arabic"
        numberOfLines={2}
        style={[styles.heroArabic, { color: hero.heroText }]}
      >
        {item.arabic}
      </ThemedText>
      <ThemedText type="small" numberOfLines={2} style={{ color: hero.heroText }}>
        {translation}
      </ThemedText>
      <ThemedText type="caption" numberOfLines={1} style={{ color: hero.heroSubtext }}>
        {heading}
      </ThemedText>
    </PressableScale>
  );
}

type DuaMomentCardProps = {
  icon: AppIconName;
  /** "Suggested now" style eyebrow. */
  eyebrow: string;
  title: string;
  subtitle: string;
  hue: CategoryHue;
  onPress: () => void;
};

/** Compact time-of-day shortcut into the most relevant category. */
export function DuaMomentCard({
  icon,
  eyebrow,
  title,
  subtitle,
  hue,
  onPress,
}: DuaMomentCardProps) {
  const { colors } = useThemeTokens();
  const chevron = useChevronForward();
  const tv = isTV();

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`${eyebrow}: ${title}, ${subtitle}`}
      onPress={onPress}
      style={[
        styles.moment,
        tv && styles.momentTv,
        { backgroundColor: colors.card, borderColor: hue.border },
      ]}
    >
      <IconWell
        icon={icon}
        tint={hue.icon}
        background={hue.soft}
        well={tv ? 56 : 48}
        size={tv ? 26 : 22}
      />
      <View style={styles.momentText}>
        <ThemedText type="caption" style={[styles.momentEyebrow, { color: hue.text }]}>
          {eyebrow}
        </ThemedText>
        <ThemedText type="smallBold" numberOfLines={2}>
          {title}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
          {subtitle}
        </ThemedText>
      </View>
      <SymbolView name={chevron} size={14} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexGrow: 1,
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Radius.xl,
    borderCurve: "continuous",
    borderWidth: 1,
    overflow: "hidden",
  },
  heroTv: { padding: Spacing.five, minHeight: tvDp(200) },
  heroHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  heroEyebrow: { fontWeight: "700", letterSpacing: 0.4, textTransform: "uppercase" },
  // Arabic skips ThemedText's TV ramp — scale it here for 10-ft viewing.
  heroArabic: {
    fontSize: isTV() ? tvDp(32) : 24,
    writingDirection: "rtl",
    marginTop: Spacing.one,
  },
  moment: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    minHeight: tvDp(84),
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  momentTv: { minHeight: TvLayout.minFocusTarget + tvDp(24), padding: Spacing.four },
  momentText: { flex: 1, minWidth: 0, gap: 2 },
  momentEyebrow: { fontWeight: "700", letterSpacing: 0.4, textTransform: "uppercase" },
});
