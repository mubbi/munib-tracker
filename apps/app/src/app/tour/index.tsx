import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView } from "expo-symbols";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  type ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { MaxContentWidth, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useTheme } from "@/hooks/use-theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { EXPLORE_TOUR, type FeatureTourStep, getFeatureTour } from "@/lib/feature-tours";
import { triggerHaptic } from "@/lib/haptics";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { arrowForward, chevronBack, chevronForward, useIsRTL } from "@/lib/rtl";
import { useToursActions } from "@/stores/tours-store";

/** Tablet / desktop web: cap toolbar + footer chrome to a centered column. */
const WIDE_MIN_WIDTH = 768;
const WIDE_CHROME_MAX_WIDTH = 720;
/** Wide enough to put the icon art beside the copy (mirrors the TV slide). */
const SPLIT_MIN_WIDTH = 900;

export default function TourScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { scheme } = useTheme();
  const { colors, tokens } = useThemeTokens();
  const { markSeen } = useToursActions();

  const { tour: tourParam } = useLocalSearchParams<{ tour?: string }>();
  const tour = getFeatureTour(tourParam ?? "explore") ?? EXPLORE_TOUR;
  const tourTitleKey = tour.id === "jannah" ? "jannah.title" : "tour.title";
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);
  const tv = isTV();
  /** Custom full-screen layout: TV needs the overscan inset ScreenLayout would add. */
  const padX = tv ? TvLayout.contentPaddingX : Spacing.four;
  const { width } = useWindowDimensions();
  const isRtl = useIsRTL();
  // Wide (non-TV) windows: keep the toolbar / progress / CTAs in a readable
  // column instead of spanning the canvas; split slides into art + copy.
  const wide = !tv && width >= WIDE_MIN_WIDTH;
  const split = !tv && width >= SPLIT_MIN_WIDTH;
  const chromeCap = wide ? styles.chromeWide : null;

  const step = tour.steps[index];
  const isLast = index === tour.steps.length - 1;
  const progress = (index + 1) / tour.steps.length;

  const finish = useCallback(async () => {
    await markSeen(tour.id);
    goBackOrReplace(router, "/");
  }, [markSeen, router, tour.id]);

  const goThere = useCallback(async () => {
    if (!step?.route) return;
    await markSeen(tour.id);
    router.push(step.route);
  }, [markSeen, router, step?.route, tour.id]);

  const goToStep = useCallback(
    (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= tour.steps.length) return;
      triggerHaptic("light");
      setIndex(nextIndex);
      if (pageWidth > 0) {
        scrollRef.current?.scrollTo({ x: nextIndex * pageWidth, animated: true });
      }
    },
    [pageWidth, tour.steps.length],
  );

  const onCarouselScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (pageWidth <= 0) return;
      const nextIndex = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
      if (nextIndex !== index && nextIndex >= 0 && nextIndex < tour.steps.length) {
        setIndex(nextIndex);
      }
    },
    [index, pageWidth, tour.steps.length],
  );

  // Web: Left/Right arrows page the tour (mouse users can't swipe). Direction
  // follows reading order; never hijack keys while typing in a field.
  const keyNavRef = useRef({ goToStep, index, isRtl });
  keyNavRef.current = { goToStep, index, isRtl };
  useEffect(() => {
    if (Platform.OS !== "web" || tv || typeof window === "undefined") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) {
        return;
      }
      const nav = keyNavRef.current;
      const forward = (event.key === "ArrowRight") !== nav.isRtl;
      event.preventDefault();
      nav.goToStep(nav.index + (forward ? 1 : -1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tv]);

  if (!step) return null;

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Seo path="/tour" />
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />

      <View style={[styles.toolbar, { paddingHorizontal: padX }, chromeCap]}>
        {/* TV: the remote Back closes the tour; Skip stays as the explicit exit. */}
        {tv ? (
          <View style={styles.iconButtonSpacer} />
        ) : (
          <IconButton
            accessibilityLabel={t("common.goBack")}
            onPress={() => {
              triggerHaptic("light");
              void finish();
            }}
            haptic={false}
            name={chevronBack()}
            size={18}
            tintColor={colors.accent}
            background={tokens.accentSoft}
            style={styles.iconButton}
          />
        )}

        <View style={styles.toolbarCenter}>
          <ThemedText type="smallBold">{t(tourTitleKey)}</ThemedText>
          <Pill
            compact
            label={t("tour.stepCounter", { current: index + 1, total: tour.steps.length })}
          />
        </View>

        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("common.skip")}
          hitSlop={8}
          onPress={() => {
            triggerHaptic("light");
            void finish();
          }}
          style={[styles.skipButton, tv && styles.skipButtonTv]}
        >
          <ThemedText type="smallBold" style={{ color: colors.accentText }}>
            {t("common.skip")}
          </ThemedText>
        </PressableScale>
      </View>

      <ProgressBar
        value={progress}
        height={3}
        style={[
          styles.progressTrack,
          { marginHorizontal: padX },
          wide ? styles.progressWide : null,
        ]}
      />

      <View
        // TV: 540dp tall — let the stage shrink instead of forcing 320dp.
        style={[styles.stage, tv && styles.stageTv]}
        onLayout={(event) => setPageWidth(event.nativeEvent.layout.width)}
      >
        {pageWidth > 0 ? (
          <TvScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            // TV: no swipe — Next / previous buttons drive the pager.
            scrollEnabled={!tv}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={onCarouselScroll}
            onMomentumScrollEnd={onCarouselScroll}
            style={styles.carousel}
          >
            {tour.steps.map((s) => (
              <View
                key={s.id}
                style={[styles.slide, { width: pageWidth, paddingHorizontal: padX }]}
              >
                <TourSlide step={s} tv={tv} split={split} />
              </View>
            ))}
          </TvScrollView>
        ) : null}
      </View>

      <TourPagination
        steps={tour.steps}
        index={index}
        tv={tv}
        onSelect={goToStep}
        accessibilityLabel={t("tour.stepCounter", {
          current: index + 1,
          total: tour.steps.length,
        })}
      />

      <View
        style={[
          styles.footer,
          { paddingBottom: insets.bottom + Spacing.four, paddingHorizontal: padX },
          tv && styles.footerTv,
          chromeCap,
        ]}
      >
        {step.route ? (
          <PressableScale
            accessibilityRole="button"
            accessibilityLabel={t("tour.goThere")}
            onPress={() => void goThere()}
            haptic="light"
            style={[styles.openLink, tv && styles.openLinkTv]}
          >
            <ThemedText type="linkPrimary">{t("tour.goThere")}</ThemedText>
            <SymbolView name={chevronForward()} size={14} tintColor={colors.accent} />
          </PressableScale>
        ) : null}

        <View style={styles.footerActions}>
          {index > 0 || tv ? (
            // TV keeps the control mounted (dimmed on step 1) so D-pad focus is not
            // dropped when it would otherwise unmount; goToStep ignores -1.
            <IconButton
              accessibilityLabel={t("tour.back")}
              accessibilityState={tv ? { disabled: index === 0 } : undefined}
              onPress={() => goToStep(index - 1)}
              haptic={false}
              name={chevronBack()}
              size={18}
              tintColor={colors.foreground}
              background={colors.muted}
              // TV: IconButton sizes itself to the TV minimum target (56dp); the
              // fixed 44dp phone style would shrink it.
              style={tv ? (index === 0 ? styles.dimmedTv : undefined) : styles.iconButton}
            />
          ) : (
            <View style={styles.iconButtonSpacer} />
          )}

          <Button
            label={isLast ? t("tour.done") : t("tour.next")}
            preferredFocus={tv}
            trailingIcon={isLast ? undefined : arrowForward()}
            onPress={() => (isLast ? void finish() : goToStep(index + 1))}
            style={styles.primaryAction}
          />
        </View>
      </View>
    </View>
  );
}

function TourSlide({
  step,
  tv = false,
  split = false,
}: {
  step: FeatureTourStep;
  tv?: boolean;
  /** Wide web: icon beside the copy (same landscape row as TV). */
  split?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  if (tv || split) {
    // Landscape TV: icon beside the copy so the slide fits 540dp without scrolling.
    return (
      <View style={[styles.slideInner, tv ? styles.slideInnerTv : styles.slideInnerWide]}>
        <View style={styles.iconStage}>
          <View style={[styles.iconGlow, { backgroundColor: tokens.accentSoft }]} />
          <IconWell
            icon={step.icon}
            tint={colors.accent}
            background={tokens.surfaceRaised}
            well={112}
            size={48}
            radius={Radius.xl}
            style={[styles.iconWell, { borderColor: tokens.accentBorder }]}
          />
        </View>
        <View style={styles.slideTextTv}>
          <ThemedText type="header" style={styles.textStartTv}>
            {t(`tour.steps.${step.id}.title`)}
          </ThemedText>
          <ThemedText
            type="default"
            themeColor="mutedForeground"
            style={[styles.slideBody, styles.textStartTv, styles.slideBodyTv]}
          >
            {t(`tour.steps.${step.id}.body`)}
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.slideInner}>
      <View style={styles.iconStage}>
        <View style={[styles.iconGlow, { backgroundColor: tokens.accentSoft }]} />
        <IconWell
          icon={step.icon}
          tint={colors.accent}
          background={tokens.surfaceRaised}
          well={112}
          size={48}
          radius={Radius.xl}
          style={[styles.iconWell, { borderColor: tokens.accentBorder }]}
        />
      </View>

      <ThemedText type="header" style={styles.slideTitle}>
        {t(`tour.steps.${step.id}.title`)}
      </ThemedText>
      <ThemedText type="default" themeColor="mutedForeground" style={styles.slideBody}>
        {t(`tour.steps.${step.id}.body`)}
      </ThemedText>
    </View>
  );
}

function TourPagination({
  steps,
  index,
  onSelect,
  accessibilityLabel,
  tv = false,
}: {
  steps: FeatureTourStep[];
  index: number;
  tv?: boolean;
  onSelect: (nextIndex: number) => void;
  accessibilityLabel: string;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <View
      style={styles.pagination}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 1, max: steps.length, now: index + 1 }}
    >
      {steps.map((s, i) => {
        const active = i === index;
        if (tv) {
          // 8dp dots are not usable D-pad targets — show progress only on TV.
          return (
            <View
              key={s.id}
              style={[
                styles.pageDot,
                {
                  width: active ? tvDp(28) : tvDp(8),
                  height: tvDp(8),
                  backgroundColor: active ? colors.accent : tokens.track,
                },
              ]}
            />
          );
        }
        return (
          <PressableScale
            key={s.id}
            accessibilityRole="button"
            accessibilityLabel={t(`tour.steps.${s.id}.title`)}
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(i)}
            haptic="light"
            scaleTo={0.9}
            style={[
              styles.pageDot,
              {
                width: active ? 28 : 8,
                backgroundColor: active ? colors.accent : tokens.track,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const ICON_BUTTON = 44;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  toolbarCenter: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.one + 2,
  },
  iconButton: {
    width: ICON_BUTTON,
    height: ICON_BUTTON,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonSpacer: {
    width: ICON_BUTTON,
  },
  stageTv: {
    minHeight: 0,
  },
  dimmedTv: {
    opacity: 0.35,
  },
  skipButtonTv: {
    minHeight: TvLayout.chipMinHeight,
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.pill,
  },
  slideInnerTv: {
    flexDirection: "row",
    maxWidth: tvDp(840),
    gap: Spacing.five,
  },
  /** Wide web: centered chrome column (toolbar, progress, footer). */
  chromeWide: {
    width: "100%",
    maxWidth: WIDE_CHROME_MAX_WIDTH,
    alignSelf: "center",
  },
  progressWide: {
    width: WIDE_CHROME_MAX_WIDTH - Spacing.four * 2,
    maxWidth: "100%",
    alignSelf: "center",
  },
  slideInnerWide: {
    flexDirection: "row",
    maxWidth: 840,
    gap: Spacing.six,
  },
  slideTextTv: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.three,
  },
  textStartTv: {
    textAlign: "auto",
  },
  slideBodyTv: {
    maxWidth: tvDp(560),
  },
  footerTv: {
    width: "100%",
    maxWidth: tvDp(640) + TvLayout.contentPaddingX * 2,
    alignSelf: "center",
  },
  openLinkTv: {
    minHeight: TvLayout.chipMinHeight,
    alignSelf: "center",
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
  },
  skipButton: {
    minWidth: ICON_BUTTON,
    minHeight: ICON_BUTTON,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: Spacing.one,
  },
  progressTrack: {
    marginHorizontal: Spacing.four,
  },
  stage: {
    flex: 1,
    minHeight: 320,
  },
  carousel: {
    flex: 1,
  },
  slide: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
  },
  slideInner: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.two,
  },
  iconStage: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  iconGlow: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    opacity: 0.55,
  },
  iconWell: {
    borderWidth: 1,
  },
  slideTitle: {
    textAlign: "center",
    maxWidth: 360,
  },
  slideBody: {
    textAlign: "center",
    maxWidth: 340,
    lineHeight: 24,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one + 2,
    paddingVertical: Spacing.three,
  },
  pageDot: {
    height: 8,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  footer: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  openLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.one,
    minHeight: 36,
  },
  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  primaryAction: {
    flex: 1,
  },
});
