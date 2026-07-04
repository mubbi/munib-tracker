import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MosqueSilhouette } from "@/components/mosque-silhouette";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Brand, Spacing } from "@/constants/theme";
import { gradientBackground } from "@/lib/gradient";
import { triggerHaptic } from "@/lib/haptics";
import { arrowForward } from "@/lib/rtl";
import { usePreferencesActions } from "@/stores/preferences-store";

type Slide = { icon: SymbolViewProps["name"]; key: string };

const SLIDES: Slide[] = [
  { icon: { ios: "moon.stars.fill", android: "mosque", web: "mosque" }, key: "slide1" },
  { icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" }, key: "slide2" },
  { icon: { ios: "heart.fill", android: "favorite", web: "favorite" }, key: "slide3" },
  {
    icon: { ios: "bell.badge.fill", android: "notifications_active", web: "notifications_active" },
    key: "slide4",
  },
];

export default function OnboardingIntroScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { update } = usePreferencesActions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  const finish = async (destination: "/" | "/login") => {
    await update({ hasCompletedOnboarding: true });
    router.replace(destination);
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const goNext = () => {
    if (isLast) return;
    scrollRef.current?.scrollTo({ x: (index + 1) * width, animated: true });
  };

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
      <StatusBar style="light" />
      {/* Branded splash backdrop: a quiet mosque skyline behind the slides. */}
      <MosqueSilhouette color={Brand.heroBottom} opacity={0.35} scale={1.6} />

      <View style={styles.skipRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.skip")}
          hitSlop={12}
          style={styles.skipButton}
          onPress={() => {
            triggerHaptic("light");
            finish("/");
          }}
        >
          <ThemedText type="smallBold" style={{ color: Brand.heroSubtext }}>
            {t("common.skip")}
          </ThemedText>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onMomentumScrollEnd={onScroll}
      >
        {SLIDES.map((slide) => (
          <View key={slide.key} style={[styles.slide, { width }]}>
            <View style={[styles.icon, { backgroundColor: Brand.onHeroStrongSurface }]}>
              <SymbolView name={slide.icon} size={56} tintColor={Brand.heroAccent} />
            </View>
            <ThemedText type="title" style={[styles.title, { color: Brand.heroText }]}>
              {t(`onboarding.${slide.key}Title`)}
            </ThemedText>
            <ThemedText type="default" style={[styles.body, { color: Brand.heroSubtext }]}>
              {t(`onboarding.${slide.key}Body`)}
            </ThemedText>
          </View>
        ))}
      </ScrollView>

      <View
        style={styles.dots}
        accessibilityRole="progressbar"
        accessibilityLabel={t("onboarding.pageOf", { page: index + 1, total: SLIDES.length })}
      >
        {SLIDES.map((slide, i) => (
          <View
            key={slide.key}
            style={[
              styles.dot,
              {
                backgroundColor: i === index ? Brand.heroAccent : Brand.onHeroStrongSurface,
                width: i === index ? 22 : 8,
              },
            ]}
          />
        ))}
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.four }]}>
        {isLast ? (
          <View style={styles.finalActions}>
            <Button
              label={t("onboarding.signInToSync")}
              fullWidth
              onPress={() => finish("/login")}
            />
            <Button
              label={t("common.continueAsGuest")}
              variant="ghost"
              fullWidth
              onPress={() => finish("/")}
            />
          </View>
        ) : (
          <Button label={t("common.next")} fullWidth trailingIcon={arrowForward} onPress={goNext} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  skipRow: {
    alignItems: "flex-end",
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
  },
  skipButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: Spacing.two,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.five,
    gap: Spacing.four,
  },
  icon: {
    width: 120,
    height: 120,
    borderRadius: 40,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
  body: {
    textAlign: "center",
    maxWidth: 320,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: Spacing.one + 2,
    paddingVertical: Spacing.four,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: Spacing.four,
  },
  finalActions: {
    gap: Spacing.two,
  },
});
