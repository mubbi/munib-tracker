import { APP_NAME } from "@munib-tracker/shared/constants";
import { Image } from "expo-image";
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
import { MosqueSilhouette } from "@/components/mosque-silhouette";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Brand, Radius, Spacing } from "@/constants/theme";
import { gradientBackground } from "@/lib/gradient";
import { triggerHaptic } from "@/lib/haptics";
import { arrowForward } from "@/lib/rtl";
import { usePreferencesActions } from "@/stores/preferences-store";

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

export default function OnboardingIntroScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { update } = usePreferencesActions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;
  const isBrand = slide.kind === "brand";

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
      <Seo
        path="/intro"
        title="Welcome"
        description="Get started with your offline-first Islamic companion."
        index={false}
      />
      <StatusBar style="light" />
      <MosqueSilhouette color={Brand.heroBottom} opacity={0.3} scale={1.6} />

      <View style={styles.skipRow}>
        {!isBrand ? (
          <PressableScale
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
          </PressableScale>
        ) : (
          <View style={styles.skipButton} />
        )}
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
        {SLIDES.map((item) => (
          <View key={item.key} style={[styles.slidePage, { width }]}>
            {item.kind === "brand" ? (
              <BrandSlide />
            ) : item.kind === "cta" ? (
              <CtaSlide icon={item.icon} />
            ) : (
              <FeatureSlide slide={item} />
            )}
          </View>
        ))}
      </ScrollView>

      <View
        style={styles.dots}
        accessibilityRole="progressbar"
        accessibilityLabel={t("onboarding.pageOf", { page: index + 1, total: SLIDES.length })}
      >
        {SLIDES.map((item, i) => (
          <View
            key={item.key}
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
          <Button
            label={isBrand ? t("onboarding.begin") : t("common.next")}
            fullWidth
            trailingIcon={arrowForward}
            onPress={goNext}
          />
        )}
      </View>
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

      <ThemedText type="display" style={[styles.brandTitle, { color: Brand.heroText }]}>
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

function FeatureSlide({ slide }: { slide: Slide }) {
  const { t } = useTranslation();
  const highlights = Array.from({ length: slide.highlightCount ?? 0 }, (_, i) =>
    t(`onboarding.${slide.key}Highlight${i + 1}`),
  );

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

      <View style={styles.highlights}>
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

function CtaSlide({ icon }: { icon?: SymbolViewProps["name"] }) {
  const { t } = useTranslation();

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

      <View style={[styles.privacyCard, { backgroundColor: Brand.onHeroMutedSurface }]}>
        <ThemedText type="smallBold" style={{ color: Brand.heroText }}>
          {t("onboarding.ctaPrivacyTitle")}
        </ThemedText>
        <ThemedText type="small" style={[styles.privacyBody, { color: Brand.heroSubtext }]}>
          {t("onboarding.ctaPrivacyBody")}
        </ThemedText>
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
    minHeight: 44,
  },
  skipButton: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingHorizontal: Spacing.two,
  },
  slidePage: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.four,
  },
  brandSlide: {
    alignItems: "center",
    gap: Spacing.three,
    paddingBottom: Spacing.two,
  },
  bismillah: {
    textAlign: "center",
  },
  logoWrap: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: Spacing.two,
  },
  logoGlow: {
    position: "absolute",
    width: 200,
    height: 200,
    opacity: 0.85,
  },
  logo: {
    width: 128,
    height: 128,
    borderRadius: 28,
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
    padding: Spacing.three,
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  duaLabel: {
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  duaArabic: {
    textAlign: "center",
    color: Brand.heroText,
    fontSize: 22,
  },
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
  icon: {
    width: 108,
    height: 108,
    borderRadius: 36,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.two,
  },
  eyebrow: {
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  title: {
    textAlign: "center",
  },
  body: {
    textAlign: "center",
    maxWidth: 320,
  },
  highlights: {
    width: "100%",
    maxWidth: 340,
    gap: Spacing.two,
    marginTop: Spacing.three,
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
    gap: Spacing.one + 2,
    paddingVertical: Spacing.three,
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
