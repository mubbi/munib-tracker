import { APP_NAME } from "@munib-tracker/shared/constants";
import type { AppLocale } from "@munib-tracker/shared/types";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  type ScrollViewInstance,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import { ScriptureMeaning } from "@/components/content/scripture-meaning";
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
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useMarkColdStartReady } from "@/lib/boot/cold-start";
import { gradientBackground } from "@/lib/gradient";
import { triggerHaptic } from "@/lib/haptics";
import { tTv } from "@/lib/i18n/t-tv";
import { APP_LOCALES } from "@/lib/locale-display";
import { chooseSetupLanguage, readSetupProgress } from "@/lib/onboarding/setup-flow";
import { isTV } from "@/lib/platform/is-tv";
import { useArrowForward, useIsRTL } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { usePreferences } from "@/stores/preferences-store";

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

/** Desktop / tablet web: slides split into art + copy columns at this width. */
const WIDE_SPLIT_MIN_WIDTH = 900;
/** Wide web: footer CTA column (instead of full-bleed buttons across the canvas). */
const WIDE_FOOTER_MAX_WIDTH = 520;

type SlideLayout = "phone" | "tv" | "wide";

/** Current slide plus neighbors — keeps off-screen pages from mounting nested
 *  ScrollViews / SF Symbols during cold start (Sentry WatchdogTermination). */
function isNearbySlide(logicalIndex: number, currentIndex: number): boolean {
  return Math.abs(logicalIndex - currentIndex) <= 1;
}

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
  const insets = useAppSafeAreaInsets();
  const arrowForward = useArrowForward();
  const isRtl = useIsRTL();
  const { width } = useWindowDimensions();
  const tv = isTV();
  /** Expo Dev Client gear sits top-right on TV; keep Skip clear of it. */
  const topBarPadX = tv ? TvLayout.contentPaddingX : Spacing.four;
  const skipClearance = tv ? tvDp(72) : 0;
  // Wide (non-TV) windows: split slides into art + copy columns and cap the
  // footer CTAs instead of stretching a phone column across the canvas.
  const wide = !tv && width >= WIDE_SPLIT_MIN_WIDTH;
  const layout: SlideLayout = tv ? "tv" : wide ? "wide" : "phone";
  // TV: last slide lays its two CTAs side by side, so give the footer room.
  const footerMaxWidth = tv
    ? Math.min(tvDp(640), width - topBarPadX * 2)
    : wide
      ? WIDE_FOOTER_MAX_WIDTH
      : undefined;
  const slidePadBottom = tv ? Spacing.three : Spacing.two;
  const scrollRef = useRef<ScrollViewInstance>(null);
  const buttonDrivenScrollRef = useRef(false);
  // `?at=end`: Back from the first setup step returns to the guest / sign-in page.
  const { at } = useLocalSearchParams<{ at?: string }>();
  const [index, setIndex] = useState(at === "end" ? PAGE_COUNT - 1 : 0);
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);
  const prefs = usePreferences();

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

  /** Welcome done → the setup wizard (language, location, madhhab, reminders…). */
  const goToSetup = (destination: "/" | "/login") => {
    router.replace({
      pathname: "/setup",
      params: destination === "/login" ? { next: destination } : {},
    });
  };

  // A first run interrupted mid-setup (app closed, or an RTL language switch
  // reloaded it) resumes at the saved step instead of replaying the welcome.
  // biome-ignore lint/correctness/useExhaustiveDependencies: mount-only resume check
  useEffect(() => {
    if (at === "end" || prefs.hasCompletedOnboarding) return;
    const saved = readSetupProgress();
    if (!saved) return;
    router.replace({
      pathname: "/setup",
      params:
        saved.next === "/login" ? { step: saved.step, next: saved.next } : { step: saved.step },
    });
  }, []);

  // Same write path as the setup wizard's language step (translation follows the UI).
  const onSelectLocale = (locale: AppLocale) => {
    void chooseSetupLanguage(locale);
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

  const goPrev = () => {
    if (index === 0) return;
    const prev = index - 1;
    buttonDrivenScrollRef.current = true;
    setIndex(prev);
    scrollToLogical(prev, true);
  };

  // Web: Left/Right arrows page the carousel (mouse users can't swipe). The
  // direction follows reading order, so in RTL the left arrow advances. Never
  // hijack keys while typing or while the language sheet is open.
  const keyNavRef = useRef({ goNext, goPrev, isRtl, blocked: languagePickerOpen });
  keyNavRef.current = { goNext, goPrev, isRtl, blocked: languagePickerOpen };
  useEffect(() => {
    if (Platform.OS !== "web" || tv || typeof window === "undefined") return;
    const onKeyDown = (event: KeyboardEvent) => {
      const nav = keyNavRef.current;
      if (nav.blocked || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) {
        return;
      }
      const forward = (event.key === "ArrowRight") !== nav.isRtl;
      event.preventDefault();
      if (forward) nav.goNext();
      else nav.goPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tv]);

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
              goToSetup("/");
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
        {pagerSlides.map((item) => {
          const logicalIndex = SLIDES.findIndex((slide) => slide.key === item.key);
          const mounted = isNearbySlide(logicalIndex, index);
          return (
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
              {mounted ? (
                <TvScrollView
                  style={styles.slideScroll}
                  contentContainerStyle={[
                    styles.slideScrollContent,
                    {
                      paddingVertical: tv ? Spacing.three : Spacing.two,
                      paddingBottom: slidePadBottom,
                      // TV (scrollEnabled=false): top-align so any overflow clips at the
                      // bottom rather than hiding the title.
                      justifyContent: tv ? "flex-start" : "center",
                      paddingTop: tv ? Spacing.three : Spacing.two,
                    },
                  ]}
                  scrollEnabled={!tv}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {item.kind === "brand" ? (
                    <BrandSlide layout={layout} />
                  ) : item.kind === "cta" ? (
                    <CtaSlide icon={item.icon} layout={layout} />
                  ) : (
                    <FeatureSlide slide={item} layout={layout} />
                  )}
                </TvScrollView>
              ) : null}
            </View>
          );
        })}
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
            <View style={[styles.finalActions, tv || wide ? styles.finalActionsTv : null]}>
              {tv ? (
                <>
                  {/* Side by side on a 960×540 landscape screen; D-pad Left/Right. */}
                  <Button
                    label={t("common.continueAsGuest")}
                    fullWidth
                    preferredFocus
                    onPress={() => goToSetup("/")}
                    style={styles.finalActionTv}
                  />
                  <Button
                    label={t("onboarding.signInToSync")}
                    variant="ghost"
                    fullWidth
                    labelColor={Brand.heroText}
                    onPress={() => goToSetup("/login")}
                    style={[
                      styles.finalActionTv,
                      {
                        backgroundColor: Brand.onHeroStrongSurface,
                        borderColor: withAlpha(Brand.heroText, 0.32),
                      },
                    ]}
                  />
                </>
              ) : (
                <>
                  <Button
                    label={t("onboarding.signInToSync")}
                    fullWidth
                    onPress={() => goToSetup("/login")}
                    style={wide ? styles.finalActionTv : undefined}
                  />
                  <Button
                    label={t("common.continueAsGuest")}
                    variant="ghost"
                    fullWidth
                    labelColor={Brand.heroText}
                    onPress={() => goToSetup("/")}
                    style={[
                      wide ? styles.finalActionTv : null,
                      {
                        backgroundColor: Brand.onHeroStrongSurface,
                        borderColor: withAlpha(Brand.heroText, 0.32),
                      },
                    ]}
                  />
                </>
              )}
            </View>
          ) : wide && index > 0 ? (
            // Wide web: a visible Back beside Next (no swiping with a mouse).
            <View style={styles.finalActionsTv}>
              <Button
                label={t("common.back")}
                variant="ghost"
                fullWidth
                labelColor={Brand.heroText}
                onPress={goPrev}
                style={[
                  styles.finalActionTv,
                  {
                    backgroundColor: Brand.onHeroStrongSurface,
                    borderColor: withAlpha(Brand.heroText, 0.32),
                  },
                ]}
              />
              <Button
                label={t("common.next")}
                fullWidth
                trailingIcon={arrowForward}
                onPress={goNext}
                style={styles.finalActionTv}
              />
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

function BrandSlide({ layout }: { layout: SlideLayout }) {
  const { t } = useTranslation();
  const tv = layout === "tv";

  const brandBlock = (
    <>
      <ThemedText type="header" style={[styles.bismillah, { color: Brand.heroAccent }]}>
        ﷽
      </ThemedText>

      <View style={[styles.logoWrap, tv ? styles.logoWrapTv : null]}>
        <Image
          style={[styles.logoGlow, tv ? styles.logoGlowTv : null]}
          source={require("@/assets/images/logo-glow.png")}
          contentFit="contain"
          cachePolicy="memory"
          transition={0}
          priority="low"
        />
        <Image
          style={[styles.logo, tv ? styles.logoTv : null]}
          source={require("@/assets/images/munib-logo.png")}
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

function FeatureSlide({ slide, layout }: { slide: Slide; layout: SlideLayout }) {
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
      <ThemedText type="small" style={[styles.privacyBody, { color: Brand.heroSubtext }]}>
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
    paddingTop: Spacing.two,
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
  finalActionsTv: {
    flexDirection: "row",
    gap: Spacing.three,
  },
  finalActionTv: {
    flex: 1,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(onboarding)/intro");
