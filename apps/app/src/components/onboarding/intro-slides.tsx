import { APP_NAME } from "@munib-tracker/shared/constants";
import { Image } from "expo-image";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScriptureMeaning } from "@/components/content/scripture-meaning";
import { ThemedText } from "@/components/themed-text";
import { Brand, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { tTv } from "@/lib/i18n/t-tv";

/**
 * The welcome carousel's slides (`app/(onboarding)/intro.tsx`): data plus the
 * brand, feature and call-to-action pages in their phone, TV and wide layouts.
 * The screen owns paging, the top bar and the footer actions.
 */

type SlideKind = "brand" | "feature" | "cta";

export type IntroSlide = {
  key: string;
  kind: SlideKind;
  icon?: SymbolViewProps["name"];
  highlightCount?: number;
};

export const INTRO_SLIDES: IntroSlide[] = [
  { key: "brand", kind: "brand" },
  {
    key: "slide1",
    kind: "feature",
    icon: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
    highlightCount: 3,
  },
  {
    key: "slide2",
    kind: "feature",
    icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
    highlightCount: 3,
  },
  {
    key: "slide3",
    kind: "feature",
    icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
    highlightCount: 3,
  },
  {
    key: "slide4",
    kind: "feature",
    icon: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
    highlightCount: 3,
  },
  {
    key: "cta",
    kind: "cta",
    icon: { ios: "lock.shield.fill", android: "shield", web: "shield" },
  },
];

const HIGHLIGHT_ICON: SymbolViewProps["name"] = {
  ios: "checkmark.circle.fill",
  android: "check_circle",
  web: "check_circle",
};

/** Phone column, TV landscape row (no scrolling) or wide-web split. */
export type SlideLayout = "phone" | "tv" | "wide";

/** One carousel page for `slide` in `layout`. */
export function IntroSlidePage({ slide, layout }: { slide: IntroSlide; layout: SlideLayout }) {
  if (slide.kind === "brand") return <BrandSlide layout={layout} />;
  if (slide.kind === "cta") return <CtaSlide icon={slide.icon} layout={layout} />;
  return <FeatureSlide slide={slide} layout={layout} />;
}

function BrandSlide({ layout }: { layout: SlideLayout }) {
  const { t } = useTranslation();
  const tv = layout === "tv";

  const brandBlock = (
    <>
      <ThemedText
        type={tv ? "header" : "display"}
        style={[styles.bismillah, tv ? null : styles.bismillahLarge, { color: Brand.heroAccent }]}
      >
        ﷽
      </ThemedText>

      <View style={[styles.logoWrap, tv ? styles.logoWrapTv : null]}>
        {/* Decorative: the app name is the heading right below (P9-06). */}
        <Image
          accessible={false}
          style={[styles.logoGlow, tv ? styles.logoGlowTv : null]}
          source={require("@/assets/images/logo-glow.png")}
          contentFit="contain"
          cachePolicy="memory"
          transition={0}
          priority="low"
        />
        <Image
          accessible={false}
          style={[styles.logo, tv ? styles.logoTv : null]}
          source={require("@/assets/images/munib-logo-gold.png")}
          contentFit="contain"
          cachePolicy="memory"
          transition={0}
          priority="high"
        />
      </View>

      <ThemedText type="header" style={[styles.brandTitle, { color: Brand.heroText }]}>
        {APP_NAME}
      </ThemedText>
      <ThemedText
        type="subtitle"
        style={[
          styles.brandTagline,
          tv ? styles.brandTaglineTv : null,
          { color: Brand.heroSubtext },
        ]}
      >
        {t("common.appTagline")}
      </ThemedText>
    </>
  );

  const duaCard = (
    <View
      style={[
        styles.duaCard,
        tv ? styles.duaCardTv : null,
        { backgroundColor: Brand.onHeroStrongSurface },
      ]}
    >
      <ThemedText type="label" style={[styles.duaLabel, { color: Brand.heroAccent }]}>
        {t("onboarding.brandDuaLabel")}
      </ThemedText>
      <ThemedText
        type="arabic"
        style={[styles.duaArabic, tv ? styles.duaArabicTv : null, { color: Brand.heroText }]}
      >
        {t("onboarding.brandDuaArabic")}
      </ThemedText>
      <ThemedText type="caption" style={[styles.duaTranslit, { color: Brand.heroSubtext }]}>
        {t("onboarding.brandDuaTransliteration")}
      </ThemedText>
      <ScriptureMeaning
        english={t("onboarding.brandDuaTranslation")}
        labelStyle={{ color: Brand.heroSubtext }}
      >
        {(text) => (
          <ThemedText type="small" style={[styles.duaTranslation, { color: Brand.heroSubtext }]}>
            {text}
          </ThemedText>
        )}
      </ScriptureMeaning>
    </View>
  );

  // TV (960×540 landscape, no scrolling) and wide web: brand beside the dua so
  // nothing clips and the canvas isn't a narrow centered strip.
  if (layout !== "phone") {
    return (
      <View style={[styles.slideTvRow, tv ? null : styles.slideWideRow]}>
        <View style={[styles.brandSlide, styles.slideTvCol]}>{brandBlock}</View>
        <View style={styles.slideTvCol}>{duaCard}</View>
      </View>
    );
  }

  return (
    <View style={styles.brandSlide}>
      {brandBlock}
      {duaCard}
    </View>
  );
}

/**
 * Landscape slide: icon well beside a start-aligned text column. Pages don't
 * scroll on TV (the pager is button-driven), so a landscape row keeps every line
 * on a 960×540 screen instead of clipping a tall phone column. Wide web reuses
 * the same split with larger art and a readable copy measure.
 */
function SlideRow({
  layout,
  icon,
  eyebrow,
  title,
  body,
  children,
}: {
  layout: "tv" | "wide";
  icon?: SymbolViewProps["name"];
  eyebrow: string;
  title: string;
  body: string;
  children?: ReactNode;
}) {
  const tv = layout === "tv";
  return (
    <View style={[styles.slideTvRow, tv ? null : styles.slideWideRow]}>
      <View
        style={[
          styles.icon,
          tv ? styles.iconTv : styles.iconWide,
          { backgroundColor: Brand.onHeroStrongSurface },
        ]}
      >
        {icon ? <SymbolView name={icon} size={tv ? 56 : 96} tintColor={Brand.heroAccent} /> : null}
      </View>
      <View style={[styles.slideTvCol, styles.slideTvText]}>
        <ThemedText
          type="label"
          style={[styles.eyebrow, styles.textStartTv, { color: Brand.heroAccent }]}
        >
          {eyebrow}
        </ThemedText>
        <ThemedText
          type="title"
          style={[
            styles.title,
            tv ? styles.titleTv : null,
            styles.textStartTv,
            { color: Brand.heroText },
          ]}
        >
          {title}
        </ThemedText>
        <ThemedText
          type="default"
          style={[
            styles.body,
            tv ? styles.bodyTv : styles.bodyWide,
            styles.textStartTv,
            { color: Brand.heroSubtext },
          ]}
        >
          {body}
        </ThemedText>
        {children}
      </View>
    </View>
  );
}

function FeatureSlide({ slide, layout }: { slide: IntroSlide; layout: SlideLayout }) {
  const { t } = useTranslation();
  const tv = layout === "tv";
  const highlights = Array.from({ length: slide.highlightCount ?? 0 }, (_, i) =>
    t(`onboarding.${slide.key}Highlight${i + 1}`),
  );

  const highlightList = (
    <View
      style={[
        styles.highlights,
        tv ? styles.highlightsTv : null,
        layout === "wide" ? styles.copyWide : null,
      ]}
    >
      {highlights.map((line) => (
        <View key={line} style={styles.highlightRow}>
          <SymbolView name={HIGHLIGHT_ICON} size={18} tintColor={Brand.heroAccent} />
          <ThemedText type="small" style={[styles.highlightText, { color: Brand.heroText }]}>
            {line}
          </ThemedText>
        </View>
      ))}
    </View>
  );

  if (layout !== "phone") {
    return (
      <SlideRow
        layout={layout}
        icon={slide.icon}
        eyebrow={t(`onboarding.${slide.key}Eyebrow`)}
        title={t(`onboarding.${slide.key}Title`)}
        body={t(`onboarding.${slide.key}Body`)}
      >
        {highlightList}
      </SlideRow>
    );
  }

  return (
    <View style={styles.featureSlide}>
      <View style={[styles.icon, { backgroundColor: Brand.onHeroStrongSurface }]}>
        {slide.icon ? (
          <SymbolView name={slide.icon} size={52} tintColor={Brand.heroAccent} />
        ) : null}
      </View>

      <ThemedText type="label" style={[styles.eyebrow, { color: Brand.heroAccent }]}>
        {t(`onboarding.${slide.key}Eyebrow`)}
      </ThemedText>
      <ThemedText type="title" style={[styles.title, { color: Brand.heroText }]}>
        {t(`onboarding.${slide.key}Title`)}
      </ThemedText>
      <ThemedText type="default" style={[styles.body, { color: Brand.heroSubtext }]}>
        {t(`onboarding.${slide.key}Body`)}
      </ThemedText>

      {highlightList}
    </View>
  );
}

function CtaSlide({ icon, layout }: { icon?: SymbolViewProps["name"]; layout: SlideLayout }) {
  const { t } = useTranslation();

  if (layout === "tv") {
    // No privacy card on TV: the guest / QR sign-in choice sits right below.
    return (
      <SlideRow
        layout="tv"
        icon={icon}
        eyebrow={t("onboarding.ctaEyebrow")}
        title={t("onboarding.ctaTitle")}
        body={tTv(t, "onboarding.ctaBody", "onboarding.ctaBodyTv")}
      />
    );
  }

  const privacyCard = (
    <View
      style={[
        styles.privacyCard,
        layout === "wide" ? styles.copyWide : null,
        { backgroundColor: Brand.onHeroMutedSurface },
      ]}
    >
      <ThemedText type="smallBold" style={{ color: Brand.heroText }}>
        {t("onboarding.ctaPrivacyTitle")}
      </ThemedText>
      <ThemedText type="small" style={{ color: Brand.heroSubtext }}>
        {t("onboarding.ctaPrivacyBody")}
      </ThemedText>
    </View>
  );

  if (layout === "wide") {
    return (
      <SlideRow
        layout="wide"
        icon={icon}
        eyebrow={t("onboarding.ctaEyebrow")}
        title={t("onboarding.ctaTitle")}
        body={t("onboarding.ctaBody")}
      >
        {privacyCard}
      </SlideRow>
    );
  }

  return (
    <View style={styles.ctaSlide}>
      <View style={[styles.icon, { backgroundColor: Brand.onHeroStrongSurface }]}>
        {icon ? <SymbolView name={icon} size={52} tintColor={Brand.heroAccent} /> : null}
      </View>

      <ThemedText type="label" style={[styles.eyebrow, { color: Brand.heroAccent }]}>
        {t("onboarding.ctaEyebrow")}
      </ThemedText>
      <ThemedText type="title" style={[styles.title, { color: Brand.heroText }]}>
        {t("onboarding.ctaTitle")}
      </ThemedText>
      <ThemedText type="default" style={[styles.body, { color: Brand.heroSubtext }]}>
        {t("onboarding.ctaBody")}
      </ThemedText>

      {privacyCard}
    </View>
  );
}

const styles = StyleSheet.create({
  brandSlide: {
    alignItems: "center",
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  bismillah: {
    textAlign: "center",
  },
  // ﷽ is a single ligature glyph, so it uses the `display` type size (phone /
  // web only — the TV column is height-bound) with a taller line so the
  // ligature's ascenders and descenders are not clipped.
  bismillahLarge: {
    lineHeight: 72,
    letterSpacing: 0,
  },
  logoWrap: {
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Spacing.one,
  },
  logoGlow: {
    position: "absolute",
    width: 228,
    height: 228,
    opacity: 0.85,
  },
  logo: {
    width: 156,
    height: 156,
    borderRadius: 32,
  },
  // TV slides don't scroll: keep the brand column (bismillah → logo → title →
  // tagline) inside the ~235dp band between the top bar and the dots.
  logoWrapTv: {
    width: tvDp(84),
    height: tvDp(84),
    marginVertical: 0,
  },
  logoGlowTv: {
    width: tvDp(108),
    height: tvDp(108),
  },
  logoTv: {
    width: tvDp(68),
    height: tvDp(68),
    borderRadius: tvDp(16),
  },
  // Wider card + tighter Arabic line so the full dua (incl. translation) fits
  // without clipping on the non-scrolling TV slide.
  duaCardTv: {
    maxWidth: tvDp(480),
    alignSelf: "center",
    paddingTop: Spacing.two,
    paddingBottom: Spacing.two,
    gap: Spacing.one,
    marginTop: 0,
  },
  duaArabicTv: {
    fontSize: 17,
    lineHeight: 28,
  },
  brandTitle: {
    textAlign: "center",
  },
  brandTagline: {
    textAlign: "center",
    maxWidth: 300,
  },
  /** TV: 300 is unscaled — at 2× text that wraps the tagline to 3+ lines. */
  brandTaglineTv: {
    maxWidth: tvDp(360),
  },
  duaCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three,
    gap: Spacing.oneHalf,
    marginTop: Spacing.one,
  },
  duaLabel: {
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  duaArabic: {
    textAlign: "center",
    color: Brand.heroText,
    fontSize: 20,
    lineHeight: 32,
  },
  // No fixed line heights on prose: they clip at large text sizes (P9-04).
  duaTranslit: {
    textAlign: "center",
    fontStyle: "italic",
  },
  duaTranslation: {
    textAlign: "center",
  },
  featureSlide: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  ctaSlide: {
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  /** TV landscape slide: visual column beside the copy column. */
  slideTvRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    width: "100%",
    maxWidth: tvDp(840),
    gap: Spacing.five,
  },
  /** Wide web: same split as TV with web-sized art and gutters. */
  slideWideRow: {
    maxWidth: 1040,
    gap: Spacing.six,
    paddingHorizontal: Spacing.four,
  },
  iconWide: {
    width: 220,
    height: 220,
    borderRadius: 64,
    marginBottom: 0,
  },
  bodyWide: {
    maxWidth: 520,
  },
  copyWide: {
    maxWidth: 520,
  },
  slideTvCol: {
    flex: 1,
    minWidth: 0,
  },
  slideTvText: {
    gap: Spacing.two,
    alignItems: "flex-start",
  },
  textStartTv: {
    textAlign: "auto",
  },
  icon: {
    width: 108,
    height: 108,
    borderRadius: 36,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  iconTv: {
    width: tvDp(144),
    height: tvDp(144),
    borderRadius: tvDp(40),
    marginBottom: 0,
  },
  eyebrow: {
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    textAlign: "center",
  },
  titleTv: {
    fontSize: TvLayout.titleFontSize,
    lineHeight: TvLayout.titleFontSize + 6,
  },
  body: {
    textAlign: "center",
    maxWidth: 320,
  },
  bodyTv: {
    maxWidth: tvDp(560),
    fontSize: TvLayout.bodyFontSize,
    lineHeight: TvLayout.bodyFontSize + 8,
    marginBottom: Spacing.two,
  },
  highlights: {
    width: "100%",
    maxWidth: 340,
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  highlightsTv: {
    maxWidth: tvDp(560),
    marginTop: Spacing.one,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  highlightText: {
    flex: 1,
  },
  privacyCard: {
    width: "100%",
    maxWidth: 340,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    padding: Spacing.three,
    gap: Spacing.oneHalf,
    marginTop: Spacing.three,
  },
});
