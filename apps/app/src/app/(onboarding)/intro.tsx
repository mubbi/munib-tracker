import { APP_NAME } from "@munib-tracker/shared/constants";
import type { AppLocale } from "@munib-tracker/shared/types";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  type ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LanguagePickerSheet } from "@/components/language-picker-sheet";
import { LocaleFlag } from "@/components/locale-flag";
import { MosqueSilhouette } from "@/components/mosque-silhouette";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Brand, Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useMarkColdStartReady } from "@/lib/boot/cold-start";
import { gradientBackground } from "@/lib/gradient";
import { triggerHaptic } from "@/lib/haptics";
import { APP_LOCALES } from "@/lib/locale-display";
import { isTV } from "@/lib/platform/is-tv";
import { useArrowForward, useIsRTL } from "@/lib/rtl";
import { usePreferences, usePreferencesActions } from "@/stores/preferences-store";

type SlideKind = "brand" | "feature" | "cta";

type Slide = {
  key: string;
  kind: SlideKind;
  icon?: SymbolViewProps["name"];
  highlightCount?: number;
};

const SLIDES: Slide[] = [
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

const PAGE_COUNT = SLIDES.length;

/** Pager page index (LTR content offset units) ↔ narrative slide index. */
function pageIndexForLogical(logical: number, rtl: boolean): number {
  return rtl ? PAGE_COUNT - 1 - logical : logical;
}

function logicalForPageIndex(page: number, rtl: boolean): number {
  return rtl ? PAGE_COUNT - 1 - page : page;
}

export default function OnboardingIntroScreen() {
  useMarkColdStartReady();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const arrowForward = useArrowForward();
  const isRtl = useIsRTL();
  const { width } = useWindowDimensions();
  const tv = isTV();
  /** Expo Dev Client gear sits top-right on TV; keep Skip clear of it. */
  const topBarPadX = tv ? TvLayout.contentPaddingX : Spacing.four;
  const skipClearance = tv ? 72 : 0;
  const footerMaxWidth = tv ? Math.min(520, width - topBarPadX * 2) : undefined;
  const slidePadBottom = tv ? Spacing.six : Spacing.two;
  const scrollRef = useRef<ScrollView>(null);
  const buttonDrivenScrollRef = useRef(false);
  const [index, setIndex] = useState(0);
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const prefs = usePreferences();
  const { setLocale, update } = usePreferencesActions();

  const slide = SLIDES[index];
  const isLast = index === PAGE_COUNT - 1;
  const isBrand = slide.kind === "brand";
  const localeName =
    APP_LOCALES.find((entry) => entry.code === prefs.locale)?.name ?? APP_LOCALES[0].name;

  // RTL: reverse children inside an LTR pager so "next" decreases offset (content moves right).
  const pagerSlides = useMemo(() => (isRtl ? [...SLIDES].reverse() : SLIDES), [isRtl]);

  const offsetForLogical = (logical: number) => pageIndexForLogical(logical, isRtl) * width;

  const scrollToLogical = (logical: number, animated: boolean) => {
    scrollRef.current?.scrollTo({ x: offsetForLogical(logical), animated });
  };

  /** Carousel complete → location permission step (onboarding finishes there). */
  const goToLocationStep = (destination: "/" | "/login") => {
    router.replace({
      pathname: "/intro-location",
      params: { next: destination },
    });
  };

  const onSelectLocale = (locale: AppLocale) => {
    void setLocale(locale);
    // Match scripture meaning language on first run so content aligns with the UI.
    void update({ translationLocale: locale });
  };

  const commitPageFromOffset = (offsetX: number) => {
    if (width <= 0) return;
    const page = Math.round(offsetX / width);
    const logical = logicalForPageIndex(Math.min(Math.max(page, 0), PAGE_COUNT - 1), isRtl);
    setIndex((current) => (current === logical ? current : logical));
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (buttonDrivenScrollRef.current) return;
    commitPageFromOffset(event.nativeEvent.contentOffset.x);
  };

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    buttonDrivenScrollRef.current = false;
    commitPageFromOffset(event.nativeEvent.contentOffset.x);
  };

  const goNext = () => {
    if (isLast) return;
    const next = index + 1;
    buttonDrivenScrollRef.current = true;
    setIndex(next);
    scrollToLogical(next, true);
  };

  // Re-snap after width / direction changes.
  const indexRef = useRef(index);
  indexRef.current = index;
  // biome-ignore lint/correctness/useExhaustiveDependencies: snap only when geometry/direction changes; scrollToLogical closes over width/isRtl
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      scrollToLogical(indexRef.current, false);
    });
    return () => cancelAnimationFrame(frame);
  }, [width, isRtl]);

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top },
        gradientBackground(
          `linear-gradient(180deg, ${Brand.heroTop} 0%, ${Brand.heroGlow} 48%, ${Brand.heroBottom} 100%)`,
        ),
      ]}
    >
      <Seo
        path="/intro"
        title={t("seo.intro.title")}
        description={t("seo.intro.description")}
        index={false}
      />
      <StatusBar style="light" />
      <MosqueSilhouette color={Brand.heroBottom} opacity={0.3} scale={1.6} />

      <View
        style={[
          styles.topBar,
          {
            paddingHorizontal: topBarPadX,
            paddingTop: tv ? Spacing.three : Spacing.two,
            minHeight: tv ? TvLayout.minFocusTarget : 44,
          },
        ]}
      >
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("onboarding.chooseLanguage")}
          accessibilityHint={t("onboarding.chooseLanguageHint")}
          hitSlop={8}
          style={[styles.languageChip, tv ? styles.languageChipTv : null]}
          onPress={() => {
            triggerHaptic("light");
            setLanguagePickerOpen(true);
          }}
        >
          <LocaleFlag
            locale={prefs.locale}
            size="sm"
            backgroundColor={Brand.onHeroMutedSurface}
            borderColor={withAlpha(Brand.heroText, 0.2)}
          />
          <ThemedText type="smallBold" style={styles.languageChipLabel} numberOfLines={1}>
            {localeName}
          </ThemedText>
          <SymbolView
            name={{ ios: "chevron.down", android: "arrow_drop_down", web: "arrow_drop_down" }}
            size={14}
            tintColor={Brand.heroSubtext}
          />
        </PressableScale>

        {!isBrand ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("common.skip")}
            hitSlop={12}
            style={[
              styles.skipButton,
              tv ? styles.skipButtonTv : null,
              skipClearance > 0 ? { marginEnd: skipClearance } : null,
            ]}
            onPress={() => {
              triggerHaptic("light");
              goToLocationStep("/");
            }}
          >
            <ThemedText type="smallBold" style={{ color: Brand.heroSubtext }}>
              {t("common.skip")}
            </ThemedText>
          </PressableScale>
        ) : (
          <View
            style={[styles.skipButton, skipClearance > 0 ? { marginEnd: skipClearance } : null]}
          />
        )}
      </View>

      <TvScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        // TV: pager steals D-pad / Select; advance only via Begin / Next.
        scrollEnabled={!tv}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScroll}
        onMomentumScrollEnd={onMomentumScrollEnd}
        // LTR pager geometry; RTL advances by reversing slide order (next → content moves right).
        style={[
          styles.slidePager,
          Platform.OS !== "web" ? ({ direction: "ltr" } satisfies ViewStyle) : null,
        ]}
        {...(Platform.OS === "web" ? ({ dir: "ltr" } as const) : null)}
      >
        {pagerSlides.map((item) => (
          <View
            key={item.key}
            style={[
              styles.slidePage,
              {
                width,
                paddingHorizontal: topBarPadX,
              },
            ]}
            {...(tv ? { focusable: false } : null)}
          >
            <TvScrollView
              style={styles.slideScroll}
              contentContainerStyle={[
                styles.slideScrollContent,
                {
                  paddingVertical: tv ? Spacing.four : Spacing.two,
                  paddingBottom: slidePadBottom,
                  justifyContent: tv ? "flex-start" : "center",
                  paddingTop: tv ? Spacing.five : Spacing.two,
                },
              ]}
              scrollEnabled={!tv}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {item.kind === "brand" ? (
                <BrandSlide />
              ) : item.kind === "cta" ? (
                <CtaSlide icon={item.icon} tv={tv} />
              ) : (
                <FeatureSlide slide={item} tv={tv} />
              )}
            </TvScrollView>
          </View>
        ))}
      </TvScrollView>

      <View
        style={[styles.dots, tv ? styles.dotsTv : null]}
        accessibilityRole="progressbar"
        accessibilityLabel={t("onboarding.pageOf", { page: index + 1, total: PAGE_COUNT })}
      >
        {SLIDES.map((item, i) => {
          const active = i === index;
          return (
            <View key={item.key} style={styles.dotSlot} accessibilityElementsHidden>
              <View
                style={[
                  styles.dot,
                  active ? styles.dotActive : styles.dotIdle,
                  {
                    backgroundColor: active ? Brand.heroAccent : Brand.onHeroStrongSurface,
                  },
                ]}
              />
            </View>
          );
        })}
      </View>

      <TvFocusGuide
        autoFocus={tv}
        style={[
          styles.footer,
          {
            paddingHorizontal: topBarPadX,
            paddingBottom: insets.bottom + (tv ? Spacing.five : Spacing.four),
            alignItems: footerMaxWidth ? "center" : undefined,
          },
        ]}
      >
        <View style={footerMaxWidth ? { width: "100%", maxWidth: footerMaxWidth } : undefined}>
          {isLast ? (
            <View style={styles.finalActions}>
              {tv ? (
                <>
                  <Button
                    label={t("common.continueAsGuest")}
                    fullWidth
                    preferredFocus
                    onPress={() => goToLocationStep("/")}
                  />
                  <Button
                    label={t("onboarding.signInToSync")}
                    variant="ghost"
                    fullWidth
                    labelColor={Brand.heroText}
                    onPress={() => goToLocationStep("/login")}
                    style={{
                      backgroundColor: Brand.onHeroStrongSurface,
                      borderColor: withAlpha(Brand.heroText, 0.32),
                    }}
                  />
                </>
              ) : (
                <>
                  <Button
                    label={t("onboarding.signInToSync")}
                    fullWidth
                    onPress={() => goToLocationStep("/login")}
                  />
                  <Button
                    label={t("common.continueAsGuest")}
                    variant="ghost"
                    fullWidth
                    labelColor={Brand.heroText}
                    onPress={() => goToLocationStep("/")}
                    style={{
                      backgroundColor: Brand.onHeroStrongSurface,
                      borderColor: withAlpha(Brand.heroText, 0.32),
                    }}
                  />
                </>
              )}
            </View>
          ) : (
            <Button
              label={isBrand ? t("onboarding.begin") : t("common.next")}
              fullWidth
              preferredFocus={tv}
              trailingIcon={arrowForward}
              onPress={goNext}
            />
          )}
        </View>
      </TvFocusGuide>

      <LanguagePickerSheet
        visible={languagePickerOpen}
        value={prefs.locale}
        onSelect={onSelectLocale}
        onClose={() => setLanguagePickerOpen(false)}
      />
    </View>
  );
}

function BrandSlide() {
  const { t } = useTranslation();

  return (
    <View style={styles.brandSlide}>
      <ThemedText type="header" style={[styles.bismillah, { color: Brand.heroAccent }]}>
        ﷽
      </ThemedText>

      <View style={styles.logoWrap}>
        <Image style={styles.logoGlow} source={require("@/assets/images/logo-glow.png")} />
        <Image style={styles.logo} source={require("@/assets/images/munib-logo.png")} />
      </View>

      <ThemedText type="header" style={[styles.brandTitle, { color: Brand.heroText }]}>
        {APP_NAME}
      </ThemedText>
      <ThemedText type="subtitle" style={[styles.brandTagline, { color: Brand.heroSubtext }]}>
        {t("common.appTagline")}
      </ThemedText>

      <View style={[styles.duaCard, { backgroundColor: Brand.onHeroStrongSurface }]}>
        <ThemedText type="label" style={[styles.duaLabel, { color: Brand.heroAccent }]}>
          {t("onboarding.brandDuaLabel")}
        </ThemedText>
        <ThemedText type="arabic" style={[styles.duaArabic, { color: Brand.heroText }]}>
          {t("onboarding.brandDuaArabic")}
        </ThemedText>
        <ThemedText type="caption" style={[styles.duaTranslit, { color: Brand.heroSubtext }]}>
          {t("onboarding.brandDuaTransliteration")}
        </ThemedText>
        <ThemedText type="small" style={[styles.duaTranslation, { color: Brand.heroSubtext }]}>
          {t("onboarding.brandDuaTranslation")}
        </ThemedText>
      </View>
    </View>
  );
}

function FeatureSlide({ slide, tv = false }: { slide: Slide; tv?: boolean }) {
  const { t } = useTranslation();
  const highlights = Array.from({ length: slide.highlightCount ?? 0 }, (_, i) =>
    t(`onboarding.${slide.key}Highlight${i + 1}`),
  );

  return (
    <View style={[styles.featureSlide, tv ? styles.slideTv : null]}>
      <View
        style={[
          styles.icon,
          tv ? styles.iconTv : null,
          { backgroundColor: Brand.onHeroStrongSurface },
        ]}
      >
        {slide.icon ? (
          <SymbolView name={slide.icon} size={tv ? 44 : 52} tintColor={Brand.heroAccent} />
        ) : null}
      </View>

      <ThemedText type="label" style={[styles.eyebrow, { color: Brand.heroAccent }]}>
        {t(`onboarding.${slide.key}Eyebrow`)}
      </ThemedText>
      <ThemedText
        type="title"
        style={[styles.title, tv ? styles.titleTv : null, { color: Brand.heroText }]}
      >
        {t(`onboarding.${slide.key}Title`)}
      </ThemedText>
      <ThemedText
        type="default"
        style={[styles.body, tv ? styles.bodyTv : null, { color: Brand.heroSubtext }]}
      >
        {t(`onboarding.${slide.key}Body`)}
      </ThemedText>

      <View style={[styles.highlights, tv ? styles.highlightsTv : null]}>
        {highlights.map((line) => (
          <View key={line} style={styles.highlightRow}>
            <SymbolView name={HIGHLIGHT_ICON} size={18} tintColor={Brand.heroAccent} />
            <ThemedText type="small" style={[styles.highlightText, { color: Brand.heroText }]}>
              {line}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

function CtaSlide({ icon, tv = false }: { icon?: SymbolViewProps["name"]; tv?: boolean }) {
  const { t } = useTranslation();

  return (
    <View style={[styles.ctaSlide, tv ? styles.slideTv : null]}>
      <View
        style={[
          styles.icon,
          tv ? styles.iconTv : null,
          { backgroundColor: Brand.onHeroStrongSurface },
        ]}
      >
        {icon ? <SymbolView name={icon} size={tv ? 44 : 52} tintColor={Brand.heroAccent} /> : null}
      </View>

      <ThemedText type="label" style={[styles.eyebrow, { color: Brand.heroAccent }]}>
        {t("onboarding.ctaEyebrow")}
      </ThemedText>
      <ThemedText
        type="title"
        style={[styles.title, tv ? styles.titleTv : null, { color: Brand.heroText }]}
      >
        {t("onboarding.ctaTitle")}
      </ThemedText>
      <ThemedText
        type="default"
        style={[styles.body, tv ? styles.bodyTv : null, { color: Brand.heroSubtext }]}
      >
        {tv ? t("common.tvOauthHint") : t("onboarding.ctaBody")}
      </ThemedText>

      {!tv ? (
        <View style={[styles.privacyCard, { backgroundColor: Brand.onHeroMutedSurface }]}>
          <ThemedText type="smallBold" style={{ color: Brand.heroText }}>
            {t("onboarding.ctaPrivacyTitle")}
          </ThemedText>
          <ThemedText type="small" style={[styles.privacyBody, { color: Brand.heroSubtext }]}>
            {t("onboarding.ctaPrivacyBody")}
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    minHeight: 44,
  },
  languageChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.one + 2,
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    backgroundColor: Brand.onHeroMutedSurface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(Brand.heroText, 0.22),
  },
  languageChipLabel: {
    color: Brand.heroText,
    // Cap long locale names without collapsing short ones (flexShrink was ellipsizing "English").
    maxWidth: 180,
    flexShrink: 0,
  },
  languageChipTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.four,
  },
  skipButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: Spacing.two,
  },
  skipButtonTv: {
    minHeight: TvLayout.minFocusTarget,
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    backgroundColor: Brand.onHeroMutedSurface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(Brand.heroText, 0.22),
  },
  slidePager: {
    flex: 1,
  },
  slidePage: {
    flex: 1,
    paddingHorizontal: Spacing.four,
  },
  slideScroll: {
    flex: 1,
  },
  slideScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: Spacing.two,
  },
  brandSlide: {
    alignItems: "center",
    gap: Spacing.two,
    paddingBottom: Spacing.two,
  },
  bismillah: {
    textAlign: "center",
  },
  logoWrap: {
    width: 132,
    height: 132,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Spacing.one,
  },
  logoGlow: {
    position: "absolute",
    width: 168,
    height: 168,
    opacity: 0.85,
  },
  logo: {
    width: 108,
    height: 108,
    borderRadius: 24,
  },
  brandTitle: {
    textAlign: "center",
  },
  brandTagline: {
    textAlign: "center",
    maxWidth: 300,
  },
  duaCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.three + 2,
    gap: Spacing.one + 2,
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
  duaTranslit: {
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 18,
  },
  duaTranslation: {
    textAlign: "center",
    lineHeight: 20,
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
  slideTv: {
    gap: Spacing.three,
    alignSelf: "center",
    width: "100%",
    maxWidth: 640,
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
    width: 88,
    height: 88,
    borderRadius: 28,
    marginBottom: Spacing.one,
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
    maxWidth: 560,
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
    maxWidth: 560,
    marginTop: Spacing.two,
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
    gap: Spacing.one + 2,
    marginTop: Spacing.three,
  },
  privacyBody: {
    lineHeight: 20,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.one,
    paddingVertical: Spacing.three,
  },
  dotsTv: {
    paddingTop: Spacing.four,
    paddingBottom: Spacing.three,
    minHeight: 28,
  },
  /** Fixed-width slot so active pill ↔ idle circle never shifts neighbors. */
  dotSlot: {
    width: 22,
    height: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    height: 8,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  dotIdle: {
    width: 8,
  },
  dotActive: {
    width: 22,
  },
  footer: {
    paddingHorizontal: Spacing.four,
  },
  finalActions: {
    gap: Spacing.two,
  },
});
