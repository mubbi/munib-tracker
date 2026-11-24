import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { SeasonalArt } from "@/components/seasonal/seasonal-art";
import { ThemedText } from "@/components/themed-text";
import { IconButton } from "@/components/ui/icon-button";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Brand, Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { gradientBackground } from "@/lib/gradient";
import { isTV } from "@/lib/platform/is-tv";
import { useArrowForward, useIsRTL } from "@/lib/rtl";
import {
  type ActiveSeasonalBanner,
  type SeasonalThemeId,
  seasonalBannerHref,
} from "@/lib/seasonal-themes";

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

const CLOSE = { ios: "xmark", android: "close", web: "close" } as const;

/**
 * Copy on the banner sits on an always-dark seasonal gradient (in light and dark
 * mode alike), so it uses the brand hero ink rather than the page's text tokens.
 */
const INK = Brand.heroText;
const INK_SOFT = withAlpha(Brand.heroText, 0.84);
/** Fine print: ≥ 4.5:1 on every season's mid stop (was 0.45 — too faint). */
const INK_FAINT = withAlpha(Brand.heroText, 0.68);

type SeasonalThemeBannerProps = {
  banner: ActiveSeasonalBanner;
  /** "Hide for this season" — omitted on TV (Customize home turns banners off). */
  onDismiss?: () => void;
};

/**
 * Seasonal home banner (NF-2.23) — chosen from the Hijri calendar by
 * `useSeasonalBanner`. Hierarchy: eyebrow → title → one-line why → explicit CTA
 * naming the destination → date disclaimer. A start-side scrim keeps the copy
 * legible over the art; the art mirrors with the layout in RTL. Does not alter
 * accent colours.
 */
export function SeasonalThemeBanner({ banner, onDismiss }: SeasonalThemeBannerProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const arrowForward = useArrowForward();
  const rtl = useIsRTL();
  const tv = isTV();
  const { season } = banner;
  const { visual } = season;
  const title = t(`seasonalTheme.${season.id}BannerTitle`);
  const description = t(`seasonalTheme.${season.id}BannerDesc`);
  const cta = t(season.ctaKey);
  const canDismiss = onDismiss != null && !tv;

  const body = (
    <>
      <SeasonalArt id={season.id} visual={visual} />
      {/* Start-side scrim: the copy column never competes with the artwork. */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          gradientBackground(
            `linear-gradient(to ${rtl ? "left" : "right"}, ${withAlpha(visual.gradientBottom, 0.72)} 0%, ${withAlpha(visual.gradientBottom, 0.4)} 55%, ${withAlpha(visual.gradientBottom, 0)} 82%)`,
          ),
        ]}
      />

      <View style={[styles.content, canDismiss ? styles.contentWithClose : null]}>
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
          {title}
        </ThemedText>
        <ThemedText
          type="caption"
          style={[styles.subtitle, tv ? styles.subtitleTv : null]}
          numberOfLines={tv ? undefined : 3}
        >
          {description}
        </ThemedText>
        <View style={styles.ctaRow}>
          <ThemedText type="smallBold" style={{ color: visual.accent }}>
            {cta}
          </ThemedText>
          <SymbolView name={arrowForward} size={14} tintColor={visual.accent} />
        </View>
        <ThemedText type="caption" style={[styles.disclaimer, tv ? styles.disclaimerTv : null]}>
          {t("seasonalTheme.dateDisclaimer")}
        </ThemedText>
      </View>
    </>
  );

  const press = (
    <PressableScale
      onPress={() => router.push(seasonalBannerHref(season))}
      haptic="light"
      scaleTo={0.98}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${description}`}
      accessibilityHint={cta}
      style={[
        styles.banner,
        { borderColor: withAlpha(visual.accent, 0.22) },
        gradientBackground(
          `linear-gradient(135deg, ${visual.gradientTop} 0%, ${visual.gradientMid} 52%, ${visual.gradientBottom} 100%)`,
        ),
      ]}
    >
      {/* TV: PressableScale un-clips its host so the focus ring can grow; clip the
        art in an inner rounded shell instead so it never spills past the banner. */}
      {tv ? <View style={styles.clipTv}>{body}</View> : body}
    </PressableScale>
  );

  if (!canDismiss) return press;

  // The close control is a sibling (never nested inside the banner's button) so
  // screen readers and web keyboards reach it as its own target.
  return (
    <View>
      {press}
      <IconButton
        name={CLOSE}
        size={14}
        tintColor={INK_SOFT}
        background={withAlpha(visual.gradientBottom, 0.55)}
        wellRadius={Radius.pill}
        accessibilityLabel={t("seasonalTheme.dismiss")}
        onPress={onDismiss}
        style={styles.close}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    overflow: "hidden",
    minHeight: 132,
    borderWidth: StyleSheet.hairlineWidth,
  },
  clipTv: {
    flexGrow: 1,
    minHeight: 132,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  content: {
    padding: Spacing.four,
    gap: Spacing.one,
    // The art lives on the end side; keep the copy in the start ~two-thirds.
    maxWidth: "68%",
  },
  contentWithClose: {
    paddingEnd: Spacing.two,
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
    color: INK,
  },
  subtitle: {
    color: INK_SOFT,
    lineHeight: 18,
  },
  subtitleTv: {
    fontSize: TvLayout.bodyFontSize - 2,
    lineHeight: TvLayout.bodyFontSize + 4,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.one,
  },
  disclaimer: {
    color: INK_FAINT,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  /** 11pt fine print is unreadable at 3m on Android TV. */
  disclaimerTv: {
    fontSize: 13,
    lineHeight: 18,
  },
  close: {
    position: "absolute",
    top: Spacing.one,
    end: Spacing.one,
  },
});
