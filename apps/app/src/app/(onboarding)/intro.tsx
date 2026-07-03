import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
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
  const { colors, tokens } = useThemeTokens();
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
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <StatusBar style={tokens.isDark ? "light" : "dark"} />
      <View style={styles.skipRow}>
        <ThemedText
          type="smallBold"
          style={{ color: colors.mutedForeground }}
          onPress={() => finish("/")}
        >
          {t("common.skip")}
        </ThemedText>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
      >
        {SLIDES.map((slide) => (
          <View key={slide.key} style={[styles.slide, { width }]}>
            <View style={[styles.icon, { backgroundColor: tokens.accentSoft }]}>
              <SymbolView name={slide.icon} size={56} tintColor={colors.accent} />
            </View>
            <ThemedText type="title" style={styles.title}>
              {t(`onboarding.${slide.key}Title`)}
            </ThemedText>
            <ThemedText type="default" themeColor="mutedForeground" style={styles.body}>
              {t(`onboarding.${slide.key}Body`)}
            </ThemedText>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots}>
        {SLIDES.map((slide, i) => (
          <View
            key={slide.key}
            style={[
              styles.dot,
              {
                backgroundColor: i === index ? colors.accent : tokens.track,
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
          <Button
            label={t("common.next")}
            fullWidth
            trailingIcon={{ ios: "arrow.right", android: "arrow_forward", web: "arrow_forward" }}
            onPress={goNext}
          />
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
