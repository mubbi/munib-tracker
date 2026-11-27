import type { AppLocale } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { LanguagePickerSheet } from "@/components/language-picker-sheet";
import { LocaleFlag } from "@/components/locale-flag";
import { MosqueSilhouette } from "@/components/mosque-silhouette";
import {
  IntroSlidePage,
  INTRO_SLIDES as SLIDES,
  type SlideLayout,
} from "@/components/onboarding/intro-slides";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { BorderWidth, Brand, Radius, Spacing, withAlpha } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useMarkColdStartReady } from "@/lib/boot/cold-start";
import { gradientBackground } from "@/lib/gradient";
import { triggerHaptic } from "@/lib/haptics";
import { APP_LOCALES } from "@/lib/locale-display";
import { isNearbySlide, logicalForOffset, pageIndexForLogical } from "@/lib/onboarding/intro-pager";
import { chooseSetupLanguage, readSetupProgress } from "@/lib/onboarding/setup-flow";
import { isTV } from "@/lib/platform/is-tv";
import { useArrowForward, useChevronBack, useIsRTL } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { usePreferences } from "@/stores/preferences-store";

const PAGE_COUNT = SLIDES.length;

/** Desktop / tablet web: slides split into art + copy columns at this width. */
const WIDE_SPLIT_MIN_WIDTH = 900;
/** Wide web: footer CTA column (instead of full-bleed buttons across the canvas). */
const WIDE_FOOTER_MAX_WIDTH = 520;

export default function OnboardingIntroScreen() {
  useMarkColdStartReady();
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useAppSafeAreaInsets();
  const arrowForward = useArrowForward();
  const chevronBack = useChevronBack();
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
  // G-97: phones page by swipe only — give switch-access / screen-reader users
  // a visible Back from the second page on (wide web has one in the footer).
  const phoneBack = layout === "phone" && index > 0;
  // G-97: on the last page "Skip" would do exactly what "Continue as guest" does.
  const isBrand = slide.kind === "brand";
  const showSkip = !isBrand && !isLast;
  const localeName =
    APP_LOCALES.find((entry) => entry.code === prefs.locale)?.name ?? APP_LOCALES[0].name;

  // RTL: reverse children inside an LTR pager so "next" decreases offset (content moves right).
  const pagerSlides = useMemo(() => (isRtl ? [...SLIDES].reverse() : SLIDES), [isRtl]);

  const offsetForLogical = (logical: number) =>
    pageIndexForLogical(logical, PAGE_COUNT, isRtl) * width;

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
    const logical = logicalForOffset(offsetX, width, PAGE_COUNT, isRtl);
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
        <View style={styles.topBarStart}>
          {phoneBack ? (
            <IconButton
              name={chevronBack}
              accessibilityLabel={t("common.back")}
              tintColor={Brand.heroText}
              background={Brand.onHeroMutedSurface}
              onPress={goPrev}
            />
          ) : null}
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
        </View>

        {showSkip ? (
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
                  <IntroSlidePage slide={item} layout={layout} />
                </TvScrollView>
              ) : null}
            </View>
          );
        })}
      </TvScrollView>

      <View
        style={[styles.dots, tv ? styles.dotsTv : null]}
        // Dots are decorative; the page position is the progress value (F-50).
        accessibilityRole="progressbar"
        accessibilityLabel={t("onboarding.pageOf", { page: index + 1, total: PAGE_COUNT })}
        accessibilityValue={{ min: 1, max: PAGE_COUNT, now: index + 1 }}
      >
        {SLIDES.map((item, i) => {
          const active = i === index;
          return (
            <View
              key={item.key}
              style={styles.dotSlot}
              accessible={false}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
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
                    style={[styles.finalActionTv, styles.heroGhost]}
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
                    style={[wide ? styles.finalActionTv : null, styles.heroGhost]}
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
                style={[styles.finalActionTv, styles.heroGhost]}
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
  topBarStart: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    flexShrink: 1,
  },
  languageChip: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.oneHalf,
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    backgroundColor: Brand.onHeroMutedSurface,
    borderWidth: BorderWidth.hairline,
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
    borderWidth: BorderWidth.hairline,
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
    minHeight: tvDp(28),
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
  /** Ghost button legible on the hero gradient. */
  heroGhost: {
    backgroundColor: Brand.onHeroStrongSurface,
    borderColor: withAlpha(Brand.heroText, 0.32),
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/(onboarding)/intro");
